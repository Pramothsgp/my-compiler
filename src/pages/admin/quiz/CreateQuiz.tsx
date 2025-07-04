import React, { useContext, useState } from "react";
import { createQuiz } from "../../../api/quizapi";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const CreateQuiz = () => {

    const { email } : any = useContext(AuthContext);
    const [quizTitle, setQuizTitle] = useState("");
    const [quizDescription, setQuizDescription] = useState("");
    const [questions, setQuestions] = useState([
        {
            question: "",
            choices: ["", ""],
            correctAnswer: 0,
        },
    ]);
    const navigate = useNavigate();
    const handleQuestionChange = (idx: number, value: string) => {
        const updated = [...questions];
        updated[idx].question = value;
        setQuestions(updated);
    };

    const handleChoiceChange = (qIdx: number, cIdx: number, value: string) => {
        const updated = [...questions];
        updated[qIdx].choices[cIdx] = value;
        setQuestions(updated);
    };

    const handleCorrectAnswerChange = (qIdx: number, value: number) => {
        const updated = [...questions];
        updated[qIdx].correctAnswer = value;
        setQuestions(updated);
    };

    const addChoice = (qIdx: number) => {
        const updated = [...questions];
        updated[qIdx].choices.push("");
        setQuestions(updated);
    };

    const removeChoice = (qIdx: number, cIdx: number) => {
        const updated = [...questions];
        if (updated[qIdx].choices.length > 2) {
            updated[qIdx].choices.splice(cIdx, 1);
            setQuestions(updated);
        }
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            { question: "", choices: ["", ""], correctAnswer: 0 },
        ]);
    };

    const removeQuestion = (idx: number) => {
        if (questions.length > 1) {
            const updated = [...questions];
            updated.splice(idx, 1);
            setQuestions(updated);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createQuiz({
            title: quizTitle,
            description: quizDescription,
            questions: questions.map(q => ({
                question: q.question,
                choices: q.choices,
                correctAnswer: q.choices[q.correctAnswer],
            })),
            createdBy: email,
        }).then(() => {
            setQuizTitle("");
            setQuizDescription("");
            setQuestions([
                {
                    question: "",
                    choices: ["", ""],
                    correctAnswer: 0,
                },
            ]);
        }).then(() => {
            toast.success("Quiz created successfully!");
            navigate("/admin");
        });
    };

    return (
        <div style={{ maxWidth: 700, margin: "2rem auto", padding: 24, background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #eee" }}>
            <h1 style={{ textAlign: "center" }}>Create Quiz</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                    <label htmlFor="quizTitle" style={{ display: "block", fontWeight: 600 }}>Quiz Title:</label>
                    <input
                        type="text"
                        id="quizTitle"
                        value={quizTitle}
                        onChange={e => setQuizTitle(e.target.value)}
                        style={{ width: "100%", padding: 8, marginTop: 4, borderRadius: 4, border: "1px solid #ccc" }}
                        required
                    />
                </div>
                <div style={{ marginBottom: 24 }}>
                    <label htmlFor="quizDescription" style={{ display: "block", fontWeight: 600 }}>Description:</label>
                    <textarea
                        id="quizDescription"
                        value={quizDescription}
                        onChange={e => setQuizDescription(e.target.value)}
                        style={{ width: "100%", padding: 8, marginTop: 4, borderRadius: 4, border: "1px solid #ccc" }}
                        rows={3}
                        required
                    />
                </div>
                {questions.map((q, qIdx) => (
                    <div key={qIdx} style={{ marginBottom: 32, padding: 16, border: "1px solid #eee", borderRadius: 6, background: "#fafbfc" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <label style={{ fontWeight: 600 }}>Question {qIdx + 1}:</label>
                            <button
                                type="button"
                                onClick={() => removeQuestion(qIdx)}
                                disabled={questions.length === 1}
                                style={{ background: "#f44336", color: "#fff", border: "none", borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontSize: 14 }}
                            >
                                Remove
                            </button>
                        </div>
                        <input
                            type="text"
                            value={q.question}
                            onChange={e => handleQuestionChange(qIdx, e.target.value)}
                            style={{ width: "100%", padding: 8, margin: "8px 0 16px 0", borderRadius: 4, border: "1px solid #ccc" }}
                            placeholder="Enter question"
                            required
                        />
                        <div>
                            <label style={{ fontWeight: 500 }}>Choices:</label>
                            {q.choices.map((choice, cIdx) => (
                                <div key={cIdx} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                                    <input
                                        type="radio"
                                        name={`correct-${qIdx}`}
                                        checked={q.correctAnswer === cIdx}
                                        onChange={() => handleCorrectAnswerChange(qIdx, cIdx)}
                                        style={{ marginRight: 8 }}
                                    />
                                    <input
                                        type="text"
                                        value={choice}
                                        onChange={e => handleChoiceChange(qIdx, cIdx, e.target.value)}
                                        style={{ flex: 1, padding: 6, borderRadius: 4, border: "1px solid #ccc", marginRight: 8 }}
                                        placeholder={`Choice ${cIdx + 1}`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeChoice(qIdx, cIdx)}
                                        disabled={q.choices.length <= 2}
                                        style={{ background: "#e0e0e0", border: "none", borderRadius: 4, padding: "2px 8px", cursor: "pointer" }}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addChoice(qIdx)}
                                style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 4, padding: "4px 12px", cursor: "pointer", fontSize: 14, marginTop: 4 }}
                            >
                                Add Choice
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addQuestion}
                    style={{ background: "#388e3c", color: "#fff", border: "none", borderRadius: 4, padding: "8px 18px", cursor: "pointer", fontSize: 16, marginBottom: 24 }}
                >
                    Add Question
                </button>
                <div style={{ textAlign: "center" }}>
                    <button
                        type="submit"
                        style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 4, padding: "10px 32px", fontSize: 18, cursor: "pointer" }}
                    >
                        Create Quiz
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateQuiz;
