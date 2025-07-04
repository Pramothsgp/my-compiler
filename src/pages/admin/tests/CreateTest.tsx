import { useState, useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { collection, query, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';

interface Question {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  testCases: Array<{ input: string; output: string; points: number }>;
}

const CreateTest = () => {
  const { email } = useContext(AuthContext)!;
  const [test, setTest] = useState({
    title: '',
    description: '',
    duration: 60,
    questions: [] as string[],
    isActive: false,
    startDate: '',
    endDate: '',
  });

  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch available questions from the database
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'questions'));
      const querySnapshot = await getDocs(q);
      const questions: Question[] = [];
      querySnapshot.forEach((doc) => {
        questions.push({ id: doc.id, ...doc.data() } as Question);
      });
      setAvailableQuestions(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Failed to fetch questions');
    }
    setLoading(false);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Save test to Firebase
      const testRef = doc(db, 'tests', `test_${Date.now()}`);
      await setDoc(testRef, {
        ...test,
        createdAt: new Date().toISOString(),
        createdBy: email,
      });
      alert('Test created successfully!');
      setTest({
        title: '',
        description: '',
        duration: 60,
        questions: [],
        isActive: false,
        startDate: '',
        endDate: '',
      });
    } catch (error) {
      console.error('Error creating test:', error);
      alert('Failed to create test');
    }
  };

  // Toggle question selection
  const toggleQuestion = (questionId: string) => {
    setTest(prev => {
      const questions = prev.questions.includes(questionId)
        ? prev.questions.filter(id => id !== questionId)
        : [...prev.questions, questionId];
      return { ...prev, questions };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Test</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Test Title</label>
            <input
              type="text"
              value={test.title}
              onChange={(e) => setTest({ ...test, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={test.description}
              onChange={(e) => setTest({ ...test, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <input
                type="number"
                value={test.duration}
                onChange={(e) => setTest({ ...test, duration: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Test Period</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                <input
                  type="datetime-local"
                  value={test.startDate}
                  onChange={(e) => setTest({ ...test, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">End Date</label>
                <input
                  type="datetime-local"
                  value={test.endDate}
                  onChange={(e) => setTest({ ...test, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">Select Questions</label>
              <button
                type="button"
                onClick={fetchQuestions}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh Questions'}
              </button>
            </div>

            <div className="space-y-4">
              {availableQuestions.map((question) => (
                <div
                  key={question.id}
                  className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleQuestion(question.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">{question.title}</h3>
                      <p className="text-sm text-gray-600">{question.description.substring(0, 100)}...</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={test.questions.includes(question.id)}
                      onChange={() => toggleQuestion(question.id)}
                      className="h-5 w-5 text-blue-600"
                    />
                  </div>
                  <div className="mt-2">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                      question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {question.difficulty}
                    </span>
                    <span className="ml-2 text-sm text-gray-600">
                      {question.testCases.reduce((sum, tc) => sum + tc.points, 0)} points
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={test.isActive}
                onChange={(e) => setTest({ ...test, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-700">Activate test immediately</span>
            </label>

            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Create Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTest;
