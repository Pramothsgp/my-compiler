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

export { runCode };
