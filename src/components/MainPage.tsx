import { useEffect, useState, useCallback, useRef, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CodeEditor from "./Editor";
import Question from "./Question";
import { useEnforceFullscreen, usePreventReload, useTabSwitchCounter } from "./tabSwitch";
import { endTest } from "../api/runCode";
import {
  fetchQuestionsFromFirebase,
  fetchUserCodesFromFirebase,
  saveUserCodeToFirebase,
  saveTestState,
  fetchTestState,
} from "../api/firebaseFunctions";
import { toast } from "react-toastify";

interface Question {
  id: string;
  starterCode: {
    [language: string]: string;
  };
  createdAt: string;
  timeLimit: number;
  sampleInput: string;
  testCases: Array<{ input: string; output: string; points: number }>;
  title: string;
  memoryLimit: number;
  sampleOutput: string;
  difficulty: string;
  createdBy: string;
}

function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const MainPage = () => {
  const [searchParams] = useSearchParams();
  const testId = searchParams.get("testId") || "";
  const { email } = useContext(AuthContext) ?? {};
  const { tabSwitchCount } = useTabSwitchCounter();
  const MAX_TAB_SWITCHES = 5;

  const [isDisqualified, setIsDisqualified] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [codeMap, setCodeMap] = useState<{ [questionId: string]: { [lang: string]: string } }>({});
  const [currentCode, setCurrentCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const lastSavedCodeRef = useRef<{ [questionId: string]: { [lang: string]: string } }>({});
  const [testStarted, setTestStarted] = useState(false);
  const [testStartTime, setTestStartTime] = useState<string | null>(null);
  const [testEndTime, setTestEndTime] = useState<string | null>(null);
  const [testDuration, setTestDuration] = useState(3600);
  const [points, setPoints] = useState<{ [questionId: string]: { score: number; passed: number } }>({});

  const {isFullscreen , enterFullscreen} = useEnforceFullscreen();
  const changeQuestion = (question: Question) => {
    setSelectedQuestion(question);
    const savedCode = codeMap[question.id]?.[language] || question.starterCode?.[language] || "";
    setCurrentCode(savedCode);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (selectedQuestion) {
      const savedCode = codeMap[selectedQuestion.id]?.[lang] || selectedQuestion.starterCode?.[lang] || "";
      setCurrentCode(savedCode);
    }
  };

  const updatePoints = (questionId: string, result: { score: number; passed: number }) => {
    setPoints((prev) => ({
      ...prev,
      [questionId]: result,
    }));
  };

  const saveTestStateSafely = useCallback(() => {
    if (!email || !testId || !testStarted) return;
    saveTestState({
      email,
      testId,
      testStarted,
      testStartTime: testStartTime || null,
      testEndTime: testEndTime || null,
      testDuration,
      isDisqualified,
      tabSwitchCount,
      points,
    });
  }, [email, testId, testStarted, testStartTime, testEndTime, testDuration, isDisqualified, tabSwitchCount, points]);

  const questionButtons = useMemo(
    () =>
      questions.map((q, idx) => (
        <button
          key={q.id}
          className={`block w-full text-left p-2 rounded transition font-semibold ${
            selectedQuestion?.id === q.id
              ? "bg-blue-500 text-white"
              : "hover:bg-gray-600 text-gray-300"
          }`}
          onClick={() => changeQuestion(q)}
        >
          Question {idx + 1}
        </button>
      )),
    [questions, selectedQuestion]
  );

  useEffect(() => {
    if (!testId || !email) return;
    const loadTestState = async () => {
      const state = await fetchTestState(testId, email);
      if (state) {
        setTestStarted(state.testStarted);
        setTestStartTime(state.testStartTime || null);
        setTestEndTime(state.testEndTime || null);
        setTestDuration(state.testDuration);
        setIsDisqualified(state.isDisqualified);
        setPoints(state.points || {});
      }
    };
    loadTestState();
  }, [testId, email]);

  useEffect(() => {
    if (!testId || !testStarted || !email) return;
    const loadQuestions = async () => {
      const fetchedQuestions = await fetchQuestionsFromFirebase(testId);
      setQuestions(fetchedQuestions);
      if (fetchedQuestions.length > 0) {
        setSelectedQuestion(fetchedQuestions[0]);
      } else {
        setSelectedQuestion(null);
      }
    };
    loadQuestions();
  }, [testId, testStarted, email]);

  useEffect(() => {
    if (!testId || !email || !testStarted) return;
    const fetchUserCodes = async () => {
      const codes = await fetchUserCodesFromFirebase(testId, email);
      setCodeMap(codes);
      lastSavedCodeRef.current = codes;
      if (selectedQuestion) {
        setCurrentCode(codes[selectedQuestion.id]?.[language] || selectedQuestion.starterCode?.[language] || "");
      }
    };
    fetchUserCodes();
  }, [testId, email, testStarted, selectedQuestion, language]);

  useEffect(() => {
    if (tabSwitchCount >= MAX_TAB_SWITCHES && !isDisqualified) {
      setIsDisqualified(true);
      setTestEndTime(new Date().toISOString());
      saveTestStateSafely();
    }
  }, [tabSwitchCount, isDisqualified, saveTestStateSafely]);

  useEffect(() => {
    if (!testStarted || !email || !testId) return;
    saveTestStateSafely();
  }, [testStarted, testStartTime, testEndTime, testDuration, isDisqualified, tabSwitchCount, points, email, testId, saveTestStateSafely]);

  const saveCodeToDB = useCallback(
    debounce(async (questionId: string, code: string, lang: string) => {
      if (!email || !testId || !questionId) return;
      if (lastSavedCodeRef.current[questionId]?.[lang] === code) return;
      try {
        await saveUserCodeToFirebase({ questionId, code, testId, email, language: lang });
        lastSavedCodeRef.current[questionId] = {
          ...lastSavedCodeRef.current[questionId],
          [lang]: code,
        };
        toast.success("Code saved successfully");
      } catch (err) {
        toast.error("Error saving code");
      }
    }, 1500),
    [email, testId]
  );

  const handleCodeChange = (code: string) => {
    if (!selectedQuestion) return;
    setCurrentCode(code);
    setCodeMap((prev) => ({
      ...prev,
      [selectedQuestion.id]: {
        ...prev[selectedQuestion.id],
        [language]: code,
      },
    }));
    saveCodeToDB(selectedQuestion.id, code, language);
  };

  useEffect(() => {
    if (!testStarted || testDuration <= 0) return;
    const timer = setInterval(() => {
      setTestDuration((prev) => {
        const newDuration = prev - 1;
        if (newDuration <= 0 && email) {
          setTestEndTime(new Date().toISOString());
          saveTestStateSafely();
          endTest(0, email);
        }
        return newDuration;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [testStarted, testDuration, email, saveTestStateSafely]);

  usePreventReload();

  // if (isDisqualified) {
  //   return (
  //     <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center">
  //       <h1 className="text-3xl font-bold mb-4">Disqualified</h1>
  //       <p className="text-lg">Tab switch limit exceeded ({MAX_TAB_SWITCHES} switches).</p>
  //     </div>
  //   );
  // }

  if (!testStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center">
        <h1 className="text-3xl font-bold mb-6">Ready to Start Your Test?</h1>
        <button
          className="px-8 py-4 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
          onClick={() => {
            setTestStarted(true);
            setTestStartTime(new Date().toISOString());
            setTestDuration(3600);
            if (testId && email) {
              saveTestState({
                email,
                testId,
                testStarted: true,
                testStartTime: new Date().toISOString(),
                testEndTime: null,
                testDuration: 3600,
                isDisqualified: false,
                tabSwitchCount,
                points: {},
              });
            }
          }}
        >
          Start Test
        </button>
      </div>
    );
  }

  if (testDuration <= 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6">Time is up!</h1>
        <p className="text-lg mb-6">You have exceeded the maximum time limit.</p>
      </div>
    );
  }
  if(!isFullscreen) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Please Enter FullScreen</h1>
        <button
          className="px-8 py-4 text-xl font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
          onClick={enterFullscreen}
        >
          Enter FullScreen
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen">
      <div className="flex flex-col justify-between w-1/8 bg-gray-800">
        <div className="w-full text-white p-4 space-y-4">
          <h2 className="text-xl font-bold">Questions</h2>
          {questions.length === 0 && (
            <div className="text-gray-400">No questions found for this test.</div>
          )}
          {questionButtons}
        </div>
        <div className="p-6 font-sans text-white">
          <h1 className="text-2xl font-bold mb-4">Tab Switch: {tabSwitchCount}</h1>
        </div>
      </div>
      <div className="flex-1 flex">
        <div className="p-6 border-b bg-white w-1/4">
          {selectedQuestion ? (
            <Question question={selectedQuestion} />
          ) : (
            <div className="text-gray-500">Select a question to view details.</div>
          )}
        </div>
        <div className="flex-1 bg-white">
          <CodeEditor
            question={selectedQuestion}
            onChange={handleCodeChange}
            language={language}
            setLanguage={handleLanguageChange}
            value={currentCode}
            updatePoints={updatePoints}
            testId={testId}
            testDuration={testDuration}
            setTestDuration={setTestDuration}
          />
        </div>
      </div>
    </div>
  );
};

export default MainPage;