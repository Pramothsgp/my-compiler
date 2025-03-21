import Editor from "@monaco-editor/react";
import { useContext, useEffect, useState } from "react";
import { endTest, runCode, submitCode } from "../api/runCode";
import { AppContext } from "../App";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
  const [hasSubmitted, setHasSubmitted] = useState(question.isSubmitted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState({ score: 0, passed: 0 });

  const navigate = useNavigate();

  useEffect(() => {
    setCode(question?.code?.[language] || "");
    setOutput("");
    setHasSubmitted(question.isSubmitted);
    setIsSubmitting(false);
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
        setTestDuration((prev: number) => Math.max(prev - 1, 0));
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
      const res = await submitCode(language, code, question, email);
      setResult(res);
      setHasSubmitted(true);
      question.isSubmitted = true;
      toast.success("Code submitted successfully");
    } catch (error) {
      console.error("Error saving code: ", error);
      toast.error("Error submitting code");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 w-full h-full overflow-y-auto">
      <div className="mb-4 text-lg font-bold">
        Time Left: {Math.floor(testDuration / 60)}:
        {(testDuration % 60).toString().padStart(2, "0")}
      </div>
      <div className="flex justify-between">
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
        <div>
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
          value={code}
          onChange={(value) => {
            setCode(value || "");
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
          {isSubmitting ? "Loading ..." : "Submit"}
        </button>
      </div>

      {hasSubmitted && (
        <div className="mt-4">
          <p>Score: {result.score}</p>
          <p>Test Cases Passed: {result.passed}</p>
        </div>
      )}

      <div className="mt-4 p-3 bg-gray-100 border rounded-lg">
        <h3 className="font-bold">Output:</h3>
        <pre>{loading ? "Compiling ...." : output || "No output yet."}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;