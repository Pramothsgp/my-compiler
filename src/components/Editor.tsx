import Editor from "@monaco-editor/react";
import { doc, setDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { runCode } from "../api/runCode";
import { AppContext } from "../App";
import { db } from "../config/firebase";
import { AuthContext } from "../context/AuthContext";

const CodeEditor = () => {
  const { question, testDuration, setTestDuration } = useContext(AppContext);

  const { email } = useContext(AuthContext) ?? {};
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(question?.code?.[language] || "");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [customInput, setCustomInput] = useState("");
  const [useCustomInput, setUseCustomInput] = useState(false);

  useEffect(() => {
    setCode(question?.code?.[language] || "");
  }, [language, question]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    if (testDuration > 0) {
      const timer = setInterval(() => {
        setTestDuration((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [testDuration, setTestDuration]);

  const executeCode = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    setCooldown(30);
    try {
      const res = await runCode(
        language,
        code,
        useCustomInput ? customInput : question.input
      );
      setOutput(res);
    } catch (error) {
      setOutput(
        `Error executing code: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!email) {
      alert("User not logged in");
      return;
    }

    const questionNumber = `code${question?.id}`;
    const userCodeData = {
      [questionNumber]: {
        "c++": language === "cpp" ? code : "",
        java: language === "java" ? code : "",
      },
    };

    try {
      await setDoc(
        doc(db, "code", email),
        { code: userCodeData },
        { merge: true }
      );
      alert(`Code for Question ${question?.id} submitted successfully!`);
    } catch (error) {
      console.error("Error saving code: ", error);
      alert("Failed to submit code. Please try again.");
    }
  };

  return (
    <div className="p-4 w-full h-full overflow-y-auto">
      <div className="mb-4 text-lg font-bold">
        Time Left: {Math.floor(testDuration / 60)}:
        {(testDuration % 60).toString().padStart(2, "0")}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            language === "cpp" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setLanguage("cpp")}
        >
          C++
        </button>
        <button
          className={`px-4 py-2 rounded ${
            language === "java" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setLanguage("java")}
        >
          Java
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Editor
          height="60vh"
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
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
          className={`px-4 py-2 rounded ${
            cooldown > 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          onClick={executeCode}
          disabled={loading || cooldown > 0}
        >
          {loading
            ? "Running..."
            : cooldown > 0
            ? `Wait ${cooldown}s`
            : "Run Code"}
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      <div className="mt-4 p-3 bg-gray-100 border rounded-lg overflow-auto">
        <h3 className="font-bold">Output:</h3>
        <pre className="whitespace-pre-wrap text-sm overflow-auto">
          {loading ? "Compiling ...." : output || "No output yet."}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;
