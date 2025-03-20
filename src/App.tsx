import { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./components/MainPage";
import AuthProvider from "./context/AuthContext";
import questions from "./data/sampleQuestion";
import Login from "./pages/auth/Login";
import PreTestPage from "./pages/PreTestPage";
import { ToastContainer } from "react-toastify";
export const AppContext = createContext<any>(undefined);

function App() {
  const [user, setUser] = useState<any>(null);
  const [question, setQuestion] = useState<any>(questions[0]);
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
            <Route path="/" element={<Login />} />
            <Route path="/start-test" element={<PreTestPage />} />
            <Route path="/test" element={<MainPage />} />
          </Routes>
        </AppContext.Provider>
        <ToastContainer />
      </AuthProvider>
    </>
  );
}

export default App;
