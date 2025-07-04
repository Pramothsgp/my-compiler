
const Question = ({ question }: { question: any }) => {

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">{question.title || "Question"}</h1>

      <p className="text-lg mb-6">{question.description || "No description provided."}</p>

      <div className="mb-4">
        <span className="text-sm font-semibold px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
          Difficulty: {question.difficulty || "N/A"}
        </span>
      </div>

      <h2 className="text-xl font-semibold mb-2">Sample Input</h2>
      <pre className="bg-gray-100 p-4 border border-gray-300 rounded mb-6">
        {question.sampleInput || "N/A"}
      </pre>

      <h2 className="text-xl font-semibold mb-2">Sample Output</h2>
      <pre className="bg-gray-100 p-4 border border-gray-300 rounded mb-6">
        {question.sampleOutput || "N/A"}
      </pre>

      {question.testCases?.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">Test Cases</h2>
          <ul className="space-y-4">
            {question.testCases.map((tc: any, index: number) => (
              <li key={index} className="border p-4 rounded bg-gray-50">
                <p><strong>Input:</strong> {tc.input}</p>
                <p><strong>Output:</strong> {tc.output}</p>
                <p><strong>Points:</strong> {tc.points}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Question;
