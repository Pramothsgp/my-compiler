import { createContext, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainPage from "./components/MainPage";
import questions from "./data/sampleQuestion";
import Login from "./pages/auth/Login";
import PreTestPage from "./pages/PreTestPage";
import AuthProvider from "./context/AuthContext";
export const AppContext = createContext<any>(undefined);

function App() {
  const [user, setUser] = useState<any>(null);
  const [question, setQuestion] = useState<any>(questions[0]);

  return (
    <>
    <AuthProvider>

      <AppContext.Provider value={{ user, setUser, question, setQuestion }}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/start-test" element={<PreTestPage />} />
          <Route path="/test" element={<MainPage />} />
        </Routes>
      </AppContext.Provider>
    </AuthProvider>
    </>
  );
}

export default App;
