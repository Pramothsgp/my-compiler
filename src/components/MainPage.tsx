import { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { AuthContext } from "../context/AuthContext";
import questions from "../data/sampleQuestion";
import CodeEditor from "./Editor";
import Question from "./Question";
import {
  useEnforceFullscreen,
  usePreventReload,
  useTabSwitchCounter,
} from "./tabSwitch";

const MainPage = () => {
  const { question, setQuestion, testDuration } = useContext(AppContext);
  const { email } = useContext(AuthContext) ?? {};
  const { tabSwitchCount , resetTabSwitchCount} = useTabSwitchCounter();
  const { isFullscreen, enterFullscreen } = useEnforceFullscreen();

  const [isDisqualified, setIsDisqualified] = useState(false);

  useEffect(() => {
    const disqualified =
      localStorage.getItem(`disqualified_${email}`) === "true";
    setIsDisqualified(disqualified);
  }, [email]);

  useEffect(() => {
    if (tabSwitchCount > 2) {
      localStorage.setItem(`disqualified_${email}`, "true");
      setIsDisqualified(true);
    } else {
      localStorage.setItem(
        `tabSwitchCount_${email}`,
        tabSwitchCount.toString()
      );
    }
  }, [tabSwitchCount, email]);

  useEffect(() => {
    if (isDisqualified) {
      localStorage.setItem(`disqualified_${email}`, "true");
    }
  }, [isDisqualified, email]);

  usePreventReload();

  if (isDisqualified) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6">
          You have exceeded the maximum number of tab switches.
        </h1>
        <p className="text-lg mb-6">You are disqualified.</p>
      </div>
    );
  }

  if (testDuration <= 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6">Time is up!</h1>
        <p className="text-lg mb-6">
          You have exceeded the maximum time limit.
        </p>
      </div>
    );
  }

  if (!isFullscreen) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6">
          Enter Full Screen to continue the test
        </h1>
        <button
          onClick={() => {
            enterFullscreen();
            setTimeout(() => document.body.focus(), 300); // Ensures focus
            resetTabSwitchCount(); // Reset count when entering fullscreen again
          }}
          className="px-6 py-3 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
        >
          Enter Full Screen
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen">
      <div className="flex flex-col justify-between w-1/8 bg-gray-800">
        <div className="w-full bg-gray-800 text-white p-4 space-y-4">
          <h2 className="text-xl font-bold">Questions</h2>
          {questions.map((q, index) => (
            <button
              key={index}
              className={`block w-full text-left p-2 rounded transition font-semibold ${
                q.id === question.id
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-600 text-gray-300"
              }`}
              onClick={() => setQuestion(q)}
            >
              Question {q.id}
            </button>
          ))}
        </div>
        <div className="p-6 font-sans">
          <h1 className="text-2xl font-bold mb-4">
            Tab Switch : {tabSwitchCount}
          </h1>
        </div>
      </div>
      <div className="flex flex-col md:flex-row flex-1">
        <Question />
        <CodeEditor />
      </div>
    </div>
  );
};

export default MainPage;
