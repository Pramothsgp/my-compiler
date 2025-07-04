import Editor from "@monaco-editor/react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { endTest, runCode, submitCode } from "../api/runCode";

import { AuthContext } from "../context/AuthContext";
import { getQuestionsFromFirebase } from "../api/getQuestionsFromFirebase";

interface CodeEditorProps {
  question: any;
  onChange: (value: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  value: string;
  updatePoints: (questionId: string, result: { score: number; passed: number }) => void;
  testId: string; // Required testId prop
  testDuration: number;
  setTestDuration: (duration: number) => void;
}

const CodeEditor = ({ question, onChange, language, setLanguage, value, updatePoints, testId, testDuration, setTestDuration }: CodeEditorProps) => {
  const { email } = useContext(AuthContext) ?? {};
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [customInput, setCustomInput] = useState("");
  const [useCustomInput, setUseCustomInput] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState({ score: 0, passed: 0 });
  const navigate = useNavigate();
  const [questionData, setQuestionData] = useState<any>(null);

  useEffect(() => {
    if (!question) return;
    getQuestionsFromFirebase(question.id).then((data) => {
      setQuestionData(data);
    }).catch((error) => {
      console.error("Error fetching question data:", error);
    });
  }, [question]);

  useEffect(() => {
    setOutput("");
    setHasSubmitted(false);
    setIsSubmitting(false);
  }, [language, question]);

  useEffect(() => {
    if (testDuration > 0) {
      const timer = setInterval(() => {
        setTestDuration(Math.max(testDuration - 1, 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testDuration, setTestDuration]);

  useEffect(() => {
    if (cooldown > 0) {
      const cdTimer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(cdTimer);
    }
  }, [cooldown]);

  const executeCode = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    try {
      const res = await runCode(
        language,
        value,
        useCustomInput ? customInput : questionData?.sampleInput
      );
      setOutput(res);
    } catch (error: any) {
      setOutput(
        `Error executing code: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEndTest = async () => {
    if (!email) {
      toast.error("Please login to end the test");
      return;
    }
    endTest(testDuration, email)
      .then(() => toast.success("Test Ended"))
      .then(() => navigate("/"))
      .catch(() => toast.error("Error ending test. Please try again"));
  };

  const handleSubmit = async () => {
    if (hasSubmitted) {
      toast.error("You have already submitted this code");
      return;
    }

    if (!email) {
      toast.error("Please login to submit your code");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await submitCode(language, value, questionData, email, testId);
      setResult(res);
      setHasSubmitted(true);
      updatePoints(questionData.id, res); // Update points in MainPage
      toast.success("Code submitted successfully");
    } catch (error) {
      console.error("Error submitting code: ", error);
      toast.error("Error submitting code");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 w-full h-full overflow-y-auto">
      <div className="mb-4 text-lg font-bold">
        Time Left: {Math.floor(testDuration / 60)}:{(testDuration % 60).toString().padStart(2, "0")}
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2 mb-4">
          {["cpp", "java", "python"].map((lang) => (
            <button
              key={lang}
              className={`px-4 py-2 rounded ${language === lang ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => setLanguage(lang)}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded bg-yellow-500 text-white"
            onClick={() => {
              onChange(questionData?.starterCode?.[language] || "");
            }}
          >
            Reset
          </button>
          <button
            className="px-4 py-2 rounded bg-red-500 text-white"
            onClick={handleEndTest}
          >
            End Test
          </button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Editor
          height="60vh"
          language={language}
          value={value}
          onChange={(val) => {
            onChange(val || "");
            setHasSubmitted(false);
          }}
          theme="vs-dark"
        />
      </div>

      <div className="mt-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={useCustomInput}
            onChange={() => setUseCustomInput(!useCustomInput)}
          />
          Use Custom Input
        </label>
        {useCustomInput && (
          <textarea
            className="w-full mt-2 p-2 border rounded-lg"
            rows={4}
            placeholder="Enter custom input..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          ></textarea>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        <button
          className={`px-4 py-2 rounded ${cooldown > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
          onClick={executeCode}
          disabled={loading || cooldown > 0}
        >
          {loading ? "Running..." : cooldown > 0 ? `Wait ${cooldown}s` : "Run Code"}
        </button>

        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={handleSubmit}
        >
          {isSubmitting ? "Loading ..." : "Submit"}
        </button>
      </div>

      {/* { hasSubmitted && (
        <div className="mt-4">
          <p>Score: {result.score}</p>
          <p>Test Cases Passed: {result.passed}</p>
        </div>
      )} */}

      <div className="mt-4 p-3 bg-gray-100 border rounded-lg">
        <h3 className="font-bold">Output:</h3>
        <pre>{loading ? "Compiling ...." : output || "No output yet."}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
