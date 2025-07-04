import axios from "axios";
import { saveUserCodeToFirebase } from "./firebaseFunctions";

interface Question {
  id: string;
  starterCode: {
    [language: string]: string;
  };
  createdAt: string;
  timeLimit: number;
  sampleInput: string;
  testCases: Array<{ input: string; output: string; points: number }>;
  title: string;
  memoryLimit: number;
  sampleOutput: string;
  difficulty: string;
  createdBy: string;
}

const getLanguageConfig = (language: string) => {
  switch (language) {
    case "cpp":
      return { language: "cpp", version: "10.2.0", filename: "main.cpp" };
    case "java":
      return { language: "java", version: "15.0.2", filename: "Main.java" };
    case "python":
      return { language: "python", version: "3.10.0", filename: "main.py" };
    default:
      throw new Error("Unsupported language");
  }
};

const runCode = async (language: string, code: string, stdin: string = "") => {
  try {
    const config = getLanguageConfig(language);
    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: config.language,
        version: config.version,
        files: [
          {
            name: config.filename,
            content: code,
          },
        ],
        stdin: stdin,
      }
    );
    return response.data.run.output || response.data.run.stderr;
  } catch (err: any) {
    console.error(err);
    return err;
  }
};

const submitCode = async (
  language: string,
  code: string,
  question: Question,
  email: string,
  testId: string
) => {
  let score = 0,
    passed = 0;
  const testCases = question.testCases || [];
  for (const testCase of testCases) {
    const result = await runCode(language, code, testCase.input);
    if (result.trim() === testCase.output.trim()) {
      score += testCase.points;
      passed++;
    }
  }

  await saveUserCodeToFirebase({
    questionId: question.id,
    code,
    testId,
    email,
    language,
  });

  return { score, passed };
};

const endTest = async (testDuration: number, email: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(testDuration, email);
      resolve("Test ended");
    }, 1000);
  });
};

export { endTest, runCode, submitCode };