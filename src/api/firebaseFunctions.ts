import { db } from "../config/firebase";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";

interface Question {
  id: string;
  starterCode: {
    [language: string]: string;
  };
  createdAt: string;
  timeLimit: number;
  sampleInput: string;
  testCases: Array<{ input: string; output: string; points: number }>;
  title: string;
  memoryLimit: number;
  sampleOutput: string;
  difficulty: string;
  createdBy: string;
}

export async function fetchQuestionsFromFirebase(testId: string): Promise<Question[]> {
  if (!db) return [];
  try {
    const testDocRef = doc(db, "tests", testId);
    const docSnap = await getDoc(testDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const questionIds: string[] = data.questions || [];
      const questionPromises = questionIds.map(async (qid) => {
        const questionDoc = await getDoc(doc(db, "questions", qid));
        if (questionDoc.exists()) {
          return {
            id: questionDoc.id,
            ...questionDoc.data(),
          } as Question;
        }
        console.warn(`Question not found: ${qid}`);
        return null;
      });
      const questions = (await Promise.all(questionPromises)).filter((q): q is Question => q !== null);
      return questions;
    } else {
      console.warn("No such test document:", testId);
      return [];
    }
  } catch (err) {
    console.error("Error fetching questions:", err);
    return [];
  }
}

export async function fetchUserCodesFromFirebase(testId: string, email: string) {
  if (!db) return {};
  try {
    const userCodesRef = collection(db, "userCodes");
    const q = query(
      userCodesRef,
      where("testId", "==", testId),
      where("email", "==", email)
    );
    const snapshot = await getDocs(q);
    const codes: { [questionId: string]: { [lang: string]: string } } = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.questionId && data.code) {
        codes[data.questionId] = data.code;
      }
    });
    return codes;
  } catch (err) {
    console.error("Error fetching user codes:", err);
    return {};
  }
}

export async function saveUserCodeToFirebase({
  questionId,
  code,
  testId,
  email,
  language,
}: {
  questionId: string;
  code: string;
  testId: string;
  email: string;
  language: string;
}) {
  if (!db || !email || !testId || !questionId) return;
  try {
    const ref = doc(db, "userCodes", `${email}_${testId}_${questionId}`);
    const docSnap = await getDoc(ref);
    let existingCodes = docSnap.exists() ? docSnap.data().code : {};
    existingCodes = {
      ...existingCodes,
      [language]: code,
    };
    await setDoc(
      ref,
      {
        email,
        testId,
        questionId,
        code: existingCodes,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.error("Error saving user code:", err);
    throw err;
  }
}

export async function saveTestState({
  email,
  testId,
  testStarted,
  testStartTime,
  testEndTime,
  testDuration,
  isDisqualified,
  tabSwitchCount,
  points,
}: {
  email: string;
  testId: string;
  testStarted: boolean;
  testStartTime: string | null;
  testEndTime: string | null;
  testDuration: number;
  isDisqualified: boolean;
  tabSwitchCount: number;
  points: { [questionId: string]: { score: number; passed: number } };
}) {
  if (!db || !email || !testId) return;
  try {
    const ref = doc(db, "testStates", `${email}_${testId}`);
    const data: any = {
      email,
      testId,
      testStarted,
      testDuration,
      isDisqualified,
      tabSwitchCount,
      points,
      lastUpdated: new Date().toISOString(),
    };
    if (testStartTime !== undefined) {
      data.testStartTime = testStartTime;
    }
    if (testEndTime !== undefined) {
      data.testEndTime = testEndTime;
    }
    await setDoc(ref, data, { merge: true });
  } catch (err) {
    console.error("Error saving test state:", err);
    throw err;
  }
}

export async function fetchTestState(testId: string, email: string) {
  if (!db || !email || !testId) return null;
  try {
    const ref = doc(db, "testStates", `${email}_${testId}`);
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    console.error("Error fetching test state:", err);
    return null;
  }
}

export async function getLeaderboard(testId: string) {
  if (!db || !testId) return [];
  try {
    const leaderboardRef = collection(db, "testStates");
    const q = query(leaderboardRef, where("testId", "==", testId));
    const snapshot = await getDocs(q);
    const leaderboard: { email: string; totalPoints: number }[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      const email = data.email;
      let totalPoints = 0;
      for (const questionId in data.points) {
        if (data.points[questionId]) {
          totalPoints += data.points[questionId].score || 0;
        }
      }
      leaderboard.push({ email, totalPoints });
    });

    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
    return leaderboard;
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    return [];
  }
}

export const getTests = async () =>{
  if (!db) return [];
  try {
    const testsRef = collection(db, "tests");
    const snapshot = await getDocs(testsRef);
    const tests: { id: string; data: any }[] = [];
    snapshot.forEach((doc) => {
      tests.push({ id: doc.id, data: doc.data() });
    });
    return tests;
  } catch (err) {
    console.error("Error fetching tests:", err);
    return [];
  }
}