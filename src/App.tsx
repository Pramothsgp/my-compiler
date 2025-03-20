import { createContext, useState } from "react";
import "./App.css";
import MainPage from "./components/MainPage";
import questions from "./data/sampleQuestion";
import { useEnforceFullscreen } from "./components/tabSwitch";
export const AppContext = createContext<any>(undefined);

function App() {
  const [user, setUser] = useState<any>(null);
  const [question, setQuestion] = useState<any>(questions[0]);

  useEnforceFullscreen();
  return (
    <>
      <AppContext.Provider value={{ user, setUser, question, setQuestion }}>
        <MainPage />
      </AppContext.Provider>
    </>
  );
}

export default App;
