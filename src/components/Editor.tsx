
import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import { runCode } from "../api/runCode";

const CodeEditor = () => {
  const cppTemplate = `#include <iostream>\nusing namespace std;\nint main() {\n  cout << "Hello, World!" << endl;\n  return 0;\n}`;
  const javaTemplate = `public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}`;

  const [code, setCode] = useState(cppTemplate);
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCode(language === "cpp" ? cppTemplate : javaTemplate);
  }, [language]);

  const executeCode = async () => {
    setLoading(true);
    try {
      const res = await runCode(language, code);
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
        <button className={`px-4 py-2 rounded ${language === "cpp" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setLanguage("cpp")}>
          C++
        </button>
        <button className={`px-4 py-2 rounded ${language === "java" ? "bg-blue-500 text-white" : "bg-gray-200"}`} onClick={() => setLanguage("java")}>
          Java
        </button>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Editor height="60vh" defaultLanguage={language} value={code} onChange={(value) => setCode(value || "")} theme="vs-dark" />
      </div>
      <div className="mt-4 flex gap-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={executeCode} disabled={loading}>
          {loading ? "Running..." : "Run Code"}
        </button>
      </div>
      <div className="mt-4 p-3 bg-gray-100 border rounded-lg overrflow-auto">
        <h3 className="font-bold">Output:</h3>
        <pre className="whitespace-pre-wrap text-sm overflow-auto">{output || "No output yet."}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
