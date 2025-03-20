import { doc, setDoc } from "firebase/firestore";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../config/firebase";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const { setEmail: setAuthEmail } = useContext(AuthContext)!;

  const navigate = useNavigate();

  const initialFormData = {
    code: {
      code1: { "c++": "", java: "" },
      code2: { "c++": "", java: "" },
      code3: { "c++": "", java: "" },
      code4: { "c++": "", java: "" },
    },
    points : {
      code1 : 0,
      code2 : 0,
      code3 : 0,
      code4 : 0
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter a valid email.");
      return;
    }

    try {
      await setDoc(doc(db, "code", email), initialFormData);
      setAuthEmail(email);
      navigate("/start-test");
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to submit data. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Enter your details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email (official college mail)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
