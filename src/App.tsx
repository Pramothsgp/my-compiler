import { createContext, useState } from "react";
import "./App.css";
import MainPage from "./components/MainPage";
import questions from "./data/sampleQuestion";
export const AppContext = createContext<any>(undefined);

function App() {
  const [user, setUser] = useState<any>(null);
  const [question, setQuestion] = useState<any>(questions[0]);
  return (
    <>
      <AppContext.Provider value={{ user, setUser, question, setQuestion }}>
        <MainPage />
      </AppContext.Provider>
    </>
  );
}

export default App;
