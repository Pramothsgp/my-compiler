import { useContext, useEffect, useState } from 'react';
import { getQuiz, getQuizResult, saveQuizResult } from '../../api/quizapi';
import { useTabSwitchCounter } from '../../components/tabSwitch';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

interface Question {
    question: string;
    choices: string[];
    correctAnswer: string;
}

interface Quiz {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    createdBy: string;
    questions: Question[];
}

const QuizMainPage = () => {
    const { email }: any = useContext(AuthContext);
    const quizId = new URLSearchParams(window.location.search).get('quizId') || '';
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
    const [_, setScore] = useState<number | null>(null);
    const { tabSwitchCount , resetTabSwitchCount } = useTabSwitchCounter();
    const [testEnded, setTestEnded] = useState(false);

    useEffect(() => {
    const fetchQuizAndProgress = async () => {
        setLoading(true);
        try {
            const quizData = await getQuiz(quizId);
            //@ts-ignore
            setQuiz(quizData);

            const existingResult = await getQuizResult(email, quizId);

            if (existingResult) {
                const restoredAnswers: { [key: number]: string } = {};
                let lastAnswered = 0;

                Object.entries(existingResult.questions || {}).forEach(([key, value]: any) => {
                    const qNum = parseInt(key);
                    const ans = value.ans;
                    if (ans) {
                        restoredAnswers[qNum - 1] = ans;
                        lastAnswered = qNum;
                    }
                });

                setSelectedAnswers(restoredAnswers);
                //@ts-ignore
                setCurrentIndex(Math.min(lastAnswered, quizData?.questions.length - 1));
                setTestEnded(existingResult.testEnded || false);
                resetTabSwitchCount(existingResult.tabSwitchCount);
                if (existingResult.testEnded) {
                    let correct = Object.values(existingResult.questions).reduce(
                        (acc: number, q: any) => acc + (q.point || 0),
                        0
                    );
                    setScore(correct);
                }
            }
        } catch (error) {
            console.error("Error fetching quiz or progress:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchQuizAndProgress();
}, [quizId, email]);


    const savePartialResult = async (answers: { [key: number]: string }) => {
        if (!quiz) return;

        const questionResults: { [key: number]: { ans: string; point: number } } = {};

        quiz.questions.forEach((q, idx) => {
            const selected = answers[idx];
            const isCorrect = selected === q.correctAnswer;
            questionResults[idx + 1] = {
                ans: selected || '',
                point: isCorrect ? 1 : 0
            };
        });

        const result = {
            email,
            quizId,
            questions: questionResults,
            tabSwitchCount,
            testEnded: false,
            submittedAt: "", // Not submitted yet
            lastUpdatedAt: new Date().toISOString()
        };

        try {
            await saveQuizResult(result);
        } catch (error) {
            console.error("Partial save failed:", error);
        }
    };

    const handleOptionChange = async (choice: string) => {
        const updatedAnswers = { ...selectedAnswers, [currentIndex]: choice };
        setSelectedAnswers(updatedAnswers);
        await savePartialResult(updatedAnswers);
    };

    const handleSubmit = async () => {
        if (!quiz) return;

        let correct = 0;
        const questionResults: { [key: number]: { ans: string; point: number } } = {};

        quiz.questions.forEach((q, idx) => {
            const selected = selectedAnswers[idx];
            const isCorrect = selected === q.correctAnswer;
            if (isCorrect) correct++;
            questionResults[idx + 1] = {
                ans: selected || '',
                point: isCorrect ? 1 : 0
            };
        });

        const result = {
            email,
            quizId,
            questions: questionResults,
            tabSwitchCount,
            testEnded: true,
            submittedAt: new Date().toISOString()
        };

        try {
            await saveQuizResult(result);
            setScore(correct);
            setTestEnded(true);
            toast.success("Quiz submitted successfully!");
        } catch (error) {
            console.error("Error saving final quiz result:", error);
            toast.error("Failed to submit quiz. Please try again.");
        }
    };

    if (loading) return <div className="p-4">Loading...</div>;
    if (!quiz) return <div className="p-4">Quiz not found</div>;

    const currentQuestion = quiz.questions[currentIndex];

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-1/5 bg-gray-100 p-4 overflow-y-auto border-r">
                <h2 className="font-bold mb-4">Questions</h2>
                <ul>
                    {quiz.questions.map((_, idx) => (
                        <li
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`cursor-pointer px-2 py-1 rounded mb-1 ${
                                currentIndex === idx
                                    ? 'bg-blue-500 text-white'
                                    : 'hover:bg-blue-100'
                            }`}
                        >
                            Question {idx + 1}
                        </li>
                    ))}
                </ul>
                <p className="mt-4 text-sm text-gray-500">Tab Switches: {tabSwitchCount}</p>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 flex flex-col justify-between">
                <div>
                    <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
                    <p className="text-gray-600 mb-6">{quiz.description}</p>

                    <div className="mb-4">
                        <h2 className="text-lg font-semibold">
                            Q{currentIndex + 1}. {currentQuestion.question}
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {currentQuestion.choices.map((choice, idx) => (
                            <label key={idx} className="block">
                                <input
                                    type="radio"
                                    name={`question-${currentIndex}`}
                                    value={choice}
                                    checked={selectedAnswers[currentIndex] === choice}
                                    onChange={() => handleOptionChange(choice)}
                                    className="mr-2"
                                    disabled={testEnded}
                                />
                                {choice}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentIndex((prev) => Math.max(prev - 1, 0))}
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            disabled={currentIndex === 0}
                        >
                            Previous
                        </button>
                        <button
                            onClick={() =>
                                setCurrentIndex((prev) =>
                                    Math.min(prev + 1, quiz.questions.length - 1)
                                )
                            }
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                            disabled={currentIndex === quiz.questions.length - 1}
                        >
                            Next
                        </button>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        disabled={testEnded}
                    >
                        Submit
                    </button>
                </div>
            </main>
        </div>
    );
};

export default QuizMainPage;
