import { doc, setDoc } from "firebase/firestore"
import { db } from "../config/firebase"

const createQuiz = async ({title , description , questions , createdBy} : {title: string, description: string, questions: any[], createdBy: string}) => {
    // API call to create a quiz
    const ref = doc(db, "quizzes", `quiz_${Date.now()}`);
    try {
        await setDoc(ref, {
            title,
            description,
            questions: [...questions],
            createdBy,
            createdAt: new Date().toISOString(),
        });
        console.log("Quiz created successfully:", ref.id);
    } catch (error) {
        throw new Error(`Failed to create quiz: ${error}`);
    }
}

export {createQuiz}