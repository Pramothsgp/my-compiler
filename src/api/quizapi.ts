import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
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

const fetchQuizzes = async () => {
    const ref = collection(db, "quizzes");
    try {
        const querySnapshot = await getDocs(ref);
        const quizzes: any[] = [];
        querySnapshot.forEach((doc) => {
            quizzes.push({ id: doc.id, ...doc.data() });
        });
        return quizzes;
    } catch (error) {
        throw new Error(`Failed to fetch quizzes: ${error}`);
    }
}

const getQuiz = async (quizId: string) => {
    try {
        const ref = doc(db, "quizzes", quizId);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            throw new Error("Quiz not found");
        }
    } catch (error) {
        throw new Error(`Failed to fetch quiz: ${error}`);
    }
}

interface QuizResult {
  email: string;
  quizId: string;
  questions: {
    [key: number]: {
      ans: string;
      point: number;
    };
  };
  tabSwitchCount: number;
  testEnded: boolean;
  submittedAt: string;
}

const saveQuizResult = async (result: QuizResult) => {
  const docId = `${result.email}_${result.quizId}`;
  const ref = doc(db, 'quizresult', docId);
  await setDoc(ref, result);
};

const getQuizResult = async (email: string, quizId: string) => {
    const docId = `${email}_${quizId}`;
    const docRef = doc(db, 'quizresult', docId);
    const snap = await getDoc(docRef);
    if (snap.exists()) return snap.data();
    return null;
};
export {createQuiz, fetchQuizzes, getQuiz, saveQuizResult , getQuizResult};