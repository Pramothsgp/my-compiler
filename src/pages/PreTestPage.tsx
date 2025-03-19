import { useState } from "react";

const PreTestPage = () => {
  const [isReady, setIsReady] = useState(false);
  const [testDuration, setTestDuration] = useState(60); // Test duration in minutes

  const handleStartTest = () => {
    setIsReady(true);
  };

  if (isReady) {
    return (
      <div className="text-center text-xl font-bold mt-20">
        Test Started! Good Luck!
        <br />
        Duration: {testDuration} minutes
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md p-6 bg-white rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to the Test
        </h1>
        <p className="text-gray-600 mb-6">
          Please read the instructions carefully before starting the test.
        </p>
        <div className="text-lg font-semibold text-gray-800 mb-4">
          Test Duration: {testDuration} minutes
        </div>
        <div className="text-left text-gray-700 mb-6">
          <h2 className="text-lg font-bold mb-2">Instructions:</h2>
          <ul className="list-disc list-inside">
            <li>Each problem will provide:</li>
            <ul className="list-circle pl-6">
              <li>What the algorithm does</li>
              <li>Total points for the question</li>
              <li>Sample test cases</li>
              <li>Shuffled code</li>
            </ul>
            <li>Hidden test cases are not shown.</li>
            <li>
              Each hidden test case carries different marks based on its
              complexity.
            </li>
          </ul>
        </div>
        <button
          onClick={handleStartTest}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-all"
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default PreTestPage;
