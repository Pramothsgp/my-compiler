import { useContext, useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { AuthContext } from '../../../context/AuthContext';

const QuestionBank = () => {
  const { email } = useContext(AuthContext)!;
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'questions'), where('createdBy', '==', email));
        const querySnapshot = await getDocs(q);
        const data: any[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
      setLoading(false);
    };
    if (email) fetchQuestions();
  }, [email]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await deleteDoc(doc(db, 'questions', id));
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (error) {
      alert('Failed to delete question.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Questions</h1>
        {loading ? (
          <div>Loading...</div>
        ) : questions.length === 0 ? (
          <div>No questions found.</div>
        ) : (
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="p-4 border border-gray-200 rounded-lg flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg">{q.title}</h2>
                  <p className="text-sm text-gray-600">{q.description?.substring(0, 100)}...</p>
                  <span className="text-xs text-gray-500">Difficulty: {q.difficulty}</span>
                </div>
                <div className="flex gap-2">
                  {/* Add edit logic as needed */}
                  <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => handleDelete(q.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;
