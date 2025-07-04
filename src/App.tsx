import { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./components/MainPage";
import DashboardHome from "./pages/DashboardHome";
import AuthProvider from "./context/AuthContext";
import Login from "./pages/auth/Login";
import PreTestPage from "./pages/PreTestPage";
import { ToastContainer } from "react-toastify";
import Leaderboard from "./components/Leaderboard";
import AdminPanel from "./pages/admin/AdminPanel";
import CreateQuestion from "./pages/admin/questions/CreateQuestion";

import QuestionBank from "./pages/admin/questions/QuestionBank";
import TestBank from "./pages/admin/tests/TestBank";
import CreateTest from "./pages/admin/tests/CreateTest";
import LeaderBoardDashBoard from "./pages/admin/LeaderBoardDashBoard";
import ProtectedRoute from "./context/ProtectedRoute";
import FallBack from "./pages/auth/FallBack";
import CreateQuiz from "./pages/admin/quiz/CreateQuiz";
import QuizMainPage from "./pages/quiz/QuizMainPage";

export const AppContext = createContext<any>(undefined);


function App() {
  const [user, setUser] = useState<any>(null);
  // Start with no question; MainPage will fetch from DB
  const [question, setQuestion] = useState<any>(null);
  const [testDuration, setTestDuration] = useState(3600);

  return (
    <>
      <AuthProvider>
        <AppContext.Provider
          value={{
            user,
            setUser,
            question,
            setQuestion,
            testDuration,
            setTestDuration,
          }}
        >
          <Routes>
            <Route path="/auth/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/start-test" element={<PreTestPage />} />
            {/* Use a fallback testId if question is null */}
            <Route path="/test" element={<MainPage />} />
            <Route path="/quiz" element={<QuizMainPage />} />
            {/* Admin Routes */}
            <Route path="/admin/leaderboard/details" element={<Leaderboard />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/create-question" element={<CreateQuestion />} />
            <Route path="/admin/create-test" element={<CreateTest />} />
            <Route path="/admin/questions" element={<QuestionBank />} />
            <Route path="/admin/tests" element={<TestBank />} />
            <Route path="/admin/leaderboard" element={<LeaderBoardDashBoard />} />
            <Route path="/admin/create-quiz" element={<CreateQuiz />} />
            </Route>
            {/* Fallback route */}
            <Route path="*" element={<FallBack />} />
          </Routes>
        </AppContext.Provider>
        <ToastContainer />
      </AuthProvider>
    </>
  );
}

export default App;
