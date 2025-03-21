import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";

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
    console.error(err);
    return err;
  }
};

const submitCode = async (
  language: string,
  code: string,
  question: any,
  email: string
) => {
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

  const questionNumber = `code${question?.id}`;
  const userCodeData = {
    [questionNumber]: {
      "c++": language === "cpp" ? code : "",
      java: language === "java" ? code : "",
      points: score,
    },
    
  };

  await setDoc(
    doc(db, "code", email),
    { code: userCodeData },
    { merge: true }
  );

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

