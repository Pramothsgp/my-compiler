import { useContext } from "react";
import CodeEditor from "./Editor";
import Question from "./Question";
import questions from "../data/sampleQuestion";
import { AppContext } from "../App";

const MainPage = () => {
  const { question, setQuestion } = useContext(AppContext);
  return (
    <div className="flex w-full h-screen">
      <div className="w-1/8 bg-gray-800 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold">Questions</h2>
        {questions.map((_, index) => (
          <button
            key={index}
            className={`block w-full text-left p-2 rounded hover:bg-gray-600 transition ${
              index === question.id - 1 ? "bg-blue-500" : ""
            }`}
            onClick={() => setQuestion(questions[index])}
          >
            Question {index + 1}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        <Question />
        <CodeEditor />
      </div>
    </div>
  );
};

export default MainPage;
