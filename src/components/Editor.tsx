import Editor from "@monaco-editor/react";
import axios from "axios";
import { useEffect, useState } from "react";

const cppTemplate = `// Write your code here
#include <iostream>
using namespace std;
int main() {
  cout << "Hello World!" << endl;
  return 0;
}`;

const javaTemplate = `// Write your code here
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello World!");
  }
}`;

const CodeEditor = () => {
  const [code, setCode] = useState(cppTemplate);
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCode(language === "cpp" ? cppTemplate : javaTemplate);
  }, [language]);

  const runCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://emkc.org/api/v2/piston/execute",
        {
          language: language === "cpp" ? "cpp" : "java",
          version: language === "cpp" ? "10.2.0" : "15.0.2",
          files: [
            {
              name: language === "java" ? "Main.java" : "main.cpp",
              content: code,
            },
          ],
          stdin: "", // Required by Piston API even if empty
        }
      );
      setOutput(response.data.run.output || response.data.run.stderr);
    } catch (error : any) {
      setOutput(
        `Error executing code: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
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
          height="300px"
          defaultLanguage={language === "cpp" ? "cpp" : "java"}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme="vs-dark"
        />
      </div>
      <div className="mt-4 flex gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={runCode}
          disabled={loading}
        >
          {loading ? "Running..." : "Run Code"}
        </button>
      </div>
      <div className="mt-4 p-3 bg-gray-100 border rounded-lg">
        <h3 className="font-bold">Output:</h3>
        <pre className="whitespace-pre-wrap text-sm">
          {output || "No output yet."}
        </pre>
      </div>
    </div>
  );
};

export default CodeEditor;