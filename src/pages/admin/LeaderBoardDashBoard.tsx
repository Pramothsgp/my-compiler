import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTests } from "../../api/firebaseFunctions";

const LeaderBoardDashBoard = () => {
    const [tests, setTests] = useState<{ id: string; data: any }[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTests = async () => {
            setLoading(true);
            const fetchedTests = await getTests();
            setTests(fetchedTests);
            setLoading(false);
        };

        fetchTests();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
                    LeaderBoard Dashboard
                </h1>
                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    </div>
                ) : (
                    <ul className="space-y-6">
                        {tests.length === 0 ? (
                            <li className="text-gray-500 text-center">No tests found.</li>
                        ) : (
                            tests.map((test) => (
                                <li
                                    key={test.id}
                                    className="flex items-center justify-between bg-blue-50 rounded-lg p-5 shadow hover:shadow-md transition"
                                >
                                    <div>
                                        <div className="text-lg font-semibold text-blue-800">{test.data.title}</div>
                                        {test.data.description && (
                                            <div className="text-gray-500 text-sm mt-1">{test.data.description}</div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => navigate(`/admin/leaderboard/details?testId=${test.id}`)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow transition"
                                    >
                                        View Leaderboard
                                    </button>
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default LeaderBoardDashBoard;