import { createContext, ReactNode, useEffect, useState } from "react";

// Context type
interface AuthContextType {
  email: string | null;
  setEmail: (email: string) => void;
  clearEmail: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleSetEmail = (email: string) => {
    setEmail(email);
    sessionStorage.setItem("email", email);
  };

  const clearEmail = () => {
    setEmail(null);
    sessionStorage.removeItem("email");
  };

  return (
    <AuthContext.Provider
      value={{ email, setEmail: handleSetEmail, clearEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
