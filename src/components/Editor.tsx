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

  useEffect(() => {
    setCode(question.code[language] || "");
  }, [language, question]);

  const executeCode = async () => {
    setLoading(true);
    try {
      const res = await runCode(language, code, question.input);
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
      <div className="mt-4 flex gap-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={executeCode} disabled={loading}>
          {loading ? "Running..." : "Run Code"}
        </button>
      </div>
      <div className="mt-4 p-3 bg-gray-100 border rounded-lg overflow-auto">
        <h3 className="font-bold">Output:</h3>
        <pre className="whitespace-pre-wrap text-sm overflow-auto">{loading ? "Compiling ...." :output || "No output yet."}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
