import { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

const CreateQuestion = () => {
  const { email } = useContext(AuthContext)!;
  const [question, setQuestion] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    sampleInput: '',
    sampleOutput: '',
    timeLimit: 1,
    memoryLimit: 256,
    testCases: [{ input: '', output: '', points: 0 }],
    starterCode: {
      'cpp': '',
      'java': '',
      'python': ''
    }
  });

  const handleTestCaseChange = (index: number, field: string, value: string | number) => {
    const newTestCases = [...question.testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setQuestion({ ...question, testCases: newTestCases });
  };

  const addTestCase = () => {
    setQuestion({
      ...question,
      testCases: [...question.testCases, { input: '', output: '', points: 0 }]
    });
  };

  const removeTestCase = (index: number) => {
    const newTestCases = question.testCases.filter((_, i) => i !== index);
    setQuestion({ ...question, testCases: newTestCases });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const questionRef = doc(db, 'questions', `question_${Date.now()}`);
      await setDoc(questionRef, {
        ...question,
        createdAt: new Date().toISOString(),
        createdBy: email,
      });
      alert('Question created successfully!');
      setQuestion({
        title: '',
        description: '',
        difficulty: 'easy',
        sampleInput: '',
        sampleOutput: '',
        timeLimit: 1,
        memoryLimit: 256,
        testCases: [{ input: '', output: '', points: 0 }],
        starterCode: {
          'cpp': '',
          'java': '',
          'python': ''
        }
      });
    } catch (error) {
      console.error('Error creating question:', error);
      alert('Failed to create question. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Question</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Title</label>
            <input
              type="text"
              value={question.title}
              onChange={(e) => setQuestion({ ...question, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={question.description}
              onChange={(e) => setQuestion({ ...question, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={question.difficulty}
                onChange={(e) => setQuestion({ ...question, difficulty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sample Input</label>
            <textarea
              value={question.sampleInput}
              onChange={(e) => setQuestion({ ...question, sampleInput: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sample Output</label>
            <textarea
              value={question.sampleOutput}
              onChange={(e) => setQuestion({ ...question, sampleOutput: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Test Cases</label>
            {question.testCases.map((testCase, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Input</label>
                    <textarea
                      value={testCase.input}
                      onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Output</label>
                    <textarea
                      value={testCase.output}
                      onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Points</label>
                    <input
                      type="number"
                      value={testCase.points}
                      onChange={(e) => handleTestCaseChange(index, 'points', parseInt(e.target.value))}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                      min="0"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTestCase(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addTestCase}
              className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Add Test Case
            </button>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Starter Code</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">C++</label>
                <textarea
                  value={question.starterCode['cpp']}
                  onChange={(e) => setQuestion({
                    ...question,
                    starterCode: { ...question.starterCode, 'cpp': e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Java</label>
                <textarea
                  value={question.starterCode.java}
                  onChange={(e) => setQuestion({
                    ...question,
                    starterCode: { ...question.starterCode, java: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Python</label>
                <textarea
                  value={question.starterCode.python}
                  onChange={(e) => setQuestion({
                    ...question,
                    starterCode: { ...question.starterCode, python: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestion;
