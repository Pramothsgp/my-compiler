import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { fetchQuizzes } from "../api/quizapi";

interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
}

const DashboardHome = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<any[]>([]); // Adjust type as needed
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "tests"));
        const testList: Test[] = [];
        querySnapshot.forEach((doc) => {
          testList.push({ id: doc.id, ...doc.data() } as Test);
        });
        setTests(testList);
      } catch (error) {
        console.error("Error fetching tests:", error);
      }
      setLoading(false);
    };
    fetchTests();
  }, []);

  useEffect(() => {
    setLoadingQuizzes(true);
    fetchQuizzes()
      .then((res) => setQuizzes([...res]))
      .catch((err) => console.error("Error fetching quizzes:", err))
      .finally(() => setLoadingQuizzes(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome{user ? `, ${user.displayName || user.email}` : ""}!
      </h1>
      <div className="flex">
        <div className="max-w-3xl mx-auto flex-1">
          <h2 className="text-xl font-semibold mb-4">Available Tests</h2>
          {loading ? (
            <div>Loading tests...</div>
          ) : tests.length === 0 ? (
            <div>No tests available.</div>
          ) : (
            <div className="grid gap-4">
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="text-lg font-bold">{test.title}</div>
                    <div className="text-gray-600 mb-2">{test.description}</div>
                    <div className="text-sm text-gray-500">
                      Duration: {test.duration} min
                    </div>
                  </div>
                  <button
                    className="mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    onClick={() => navigate(`/test?testId=${test.id}`)}
                  >
                    Start Test
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="max-w-3xl mx-auto flex-1">
          <h2 className="text-xl font-semibold mb-4">Available Quizzes</h2>
          {loadingQuizzes ? (
            <div>Loading quizzes...</div>
          ) : quizzes.length === 0 ? (
            <div>No quizzes available.</div>
          ) : (
            <div className="grid gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <div className="text-lg font-bold">{quiz.title}</div>
                    <div className="text-gray-600 mb-2">{quiz.description}</div>
                  </div>
                  <button
                    className="mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    onClick={() => navigate(`/quiz?quizId=${quiz.id}`)}
                  >
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
