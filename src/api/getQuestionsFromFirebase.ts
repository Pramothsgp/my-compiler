// api/getQuestionsFromFirebase.ts
import { db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getQuestionsFromFirebase(questionId: string) {
  if (!db || !questionId) return null;
  try {
    const questionDoc = await getDoc(doc(db, "questions", questionId));
    if (questionDoc.exists()) {
      return {
        id: questionDoc.id,
        ...questionDoc.data(),
      };
    }
    console.warn(`Question not found: ${questionId}`);
    return null;
  } catch (error) {
    console.error("Error fetching question data:", error);
    return null;
  }
}