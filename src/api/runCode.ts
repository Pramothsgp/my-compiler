import axios from "axios";

const runCode = async (language: string, code: string, stdin: string = "") => {
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
        stdin: stdin,
      }
    );
    return response.data.run.output || response.data.run.stderr;
  } catch (err: any) {
    console.log(err);
    return err;
  }
};

const submitCode = async (language: string, code: string, question: any) => {
  let score = 0,
    passed = 0;
  const testCases = question.hiddenTestCases ?? [];
  for (const testCase of testCases) {
    const result = await runCode(language, code, testCase.input);
    if (result.trim() === testCase.output.trim()) {
      score += testCase.points;
      passed++;
    }
  }
  return { score, passed };
};

export { runCode, submitCode };
