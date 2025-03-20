import { useContext } from "react";
import CodeEditor from "./Editor";
import Question from "./Question";
import questions from "../data/sampleQuestion";
import { AppContext } from "../App";
import { useEnforceFullscreen, usePreventReload, useTabSwitchCounter } from "./tabSwitch";

const MainPage = () => {
  const { question, setQuestion } = useContext(AppContext);
  const {tabSwitchCount} = useTabSwitchCounter();
  usePreventReload();
  const { isFullscreen, enterFullscreen } = useEnforceFullscreen();
  
  if(!isFullscreen){
    return(
      <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6">
          Enter Full Screen to continue the test
        </h1>
        <button
          onClick={enterFullscreen}
          className="px-6 py-3 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
        >
          Enter Full Screen
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex w-full h-screen ">
      <div className="flex flex-col justify-between w-1/8 bg-gray-800">
        <div className="w-full bg-gray-800 text-white p-4 space-y-4">
          <h2 className="text-xl font-bold">Questions</h2>
          {questions.map((q, index) => (
            <button
              key={index}
              className={`block w-full text-left p-2 rounded transition font-semibold ${
                q.id === question.id ? "bg-blue-500 text-white" : "hover:bg-gray-600 text-gray-300"
              }`}
              onClick={() => setQuestion(q)}
            >
              Question {q.id}
            </button>
          ))}
        </div>
        <div className="p-6 font-sans">
          <h1 className="text-2xl font-bold mb-4">Tab Switch : {tabSwitchCount}</h1>
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
