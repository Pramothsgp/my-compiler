import Editor from "@monaco-editor/react";
import { useContext, useEffect, useState } from "react";
import { runCode } from "../api/runCode";
import { AppContext } from "../App";

const CodeEditor = () => {
  const { question } = useContext(AppContext);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(question.code[language] || "");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [customInput, setCustomInput] = useState("");
  const [useCustomInput, setUseCustomInput] = useState(false);

  useEffect(() => {
    setCode(question.code[language] || "");
  }, [language, question]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const executeCode = async () => {
    if (cooldown > 0) return;
    setLoading(true);
    setCooldown(30);
    try {
      const res = await runCode(language, code, useCustomInput ? customInput : question.input);
      setOutput(res);
    } catch (error : any) {
      setOutput(`Error executing code: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 w-full h-full overflow-y-auto">
      <div className="flex gap-2 mb-4">
        <button
          className={`px-4 py-2 rounded ${language === "cpp" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setLanguage("cpp")}
        >
          C++
        </button>
        <button
          className={`px-4 py-2 rounded ${language === "java" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
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
          className={`px-4 py-2 rounded ${cooldown > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"}`} 
          onClick={executeCode} 
          disabled={loading || cooldown > 0}
        >
          {loading ? "Running..." : cooldown > 0 ? `Wait ${cooldown}s` : "Run Code"}
        </button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Submit
        </button>
      </div>
      <div className="mt-4 p-3 bg-gray-100 border rounded-lg overflow-auto">
        <h3 className="font-bold">Output:</h3>
        <pre className="whitespace-pre-wrap text-sm overflow-auto">{loading ? "Compiling ...." : output || "No output yet."}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
