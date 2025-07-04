import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

const Dashboard = () => {
  //@ts-ignore
  const { email, displayName } = useContext(AuthContext) ?? {};
  const [tests, setTests] = useState<any[]>([]);
  const [userQuestions, setUserQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) return;
    // Fetch tests assigned to the user (or all tests)
    const fetchTestsAndQuestions = async () => {
      setLoading(true);
      // Fetch tests
      let q = query(collection(db, "tests"));
      const snapshot = await getDocs(q);
      const testList: any[] = [];
      snapshot.forEach((doc) => {
        testList.push({ id: doc.id, ...doc.data() });
      });
      setTests(testList);

      // Fetch questions created by the user
      const questionsQuery = query(collection(db, "questions"), where("createdBy", "==", email));
      const questionsSnapshot = await getDocs(questionsQuery);
      const userQuestionsList: any[] = [];
      questionsSnapshot.forEach((doc) => {
        userQuestionsList.push({ id: doc.id, ...doc.data() });
      });
      setUserQuestions(userQuestionsList);
      setLoading(false);
    };
    fetchTestsAndQuestions();
  }, [email]);

  if (!email) {
    return <div className="p-8 text-center text-xl">Please log in to view your dashboard.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome, {displayName || email}!</h1>
        <p className="text-gray-600">Your Dashboard</p>
      </div>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Created Questions</h2>
        {loading ? (
          <div>Loading questions...</div>
        ) : userQuestions.length === 0 ? (
          <div>No questions created by you.</div>
        ) : (
          <ul className="space-y-4">
            {userQuestions.map((q) => (
              <li key={q.id} className="p-4 border rounded-lg">
                <div className="font-bold text-lg">{q.title || q.name || `Question ${q.id}`}</div>
                <div className="text-gray-500 text-sm">{q.description || q.question}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Available Tests</h2>
        {loading ? (
          <div>Loading tests...</div>
        ) : tests.length === 0 ? (
          <div>No tests available.</div>
        ) : (
          <ul className="space-y-4">
            {tests.map((test) => (
              <li key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-bold text-lg">{test.name}</div>
                  <div className="text-gray-500 text-sm">{test.description}</div>
                </div>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => navigate(`/test/${test.id}`)}
                >
                  Start Test
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
