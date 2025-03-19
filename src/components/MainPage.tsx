import { useState } from "react";
import CodeEditor from "./Editor";
import Question from "./Question";

const questions = [
  "Write a program that prints 'Hello, World!' to the console.",
  "Write a function to check if a number is prime.",
  "Implement a Fibonacci sequence generator.",
];

const MainPage = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
  
    return (
      <div className="flex w-full h-screen">
        {/* Sidebar */}
        <div className="w-1/8 bg-gray-800 text-white p-4 space-y-4">
          <h2 className="text-xl font-bold">Questions</h2>
          {questions.map((_, index) => (
            <button
              key={index}
              className={`block w-full text-left p-2 rounded hover:bg-gray-600 transition ${
                index === currentQuestion ? "bg-blue-500" : ""
              }`}
              onClick={() => setCurrentQuestion(index)}
            >
              Question {index + 1}
            </button>
          ))}
        </div>
  
        {/* Main Content */}
        <div className="flex flex-col md:flex-row flex-1">
          <Question question={questions[currentQuestion]} />
          <CodeEditor />
        </div>
      </div>
    );
  };
  
  export default MainPage;