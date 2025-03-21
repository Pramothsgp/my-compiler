import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";

// Define types for our data structure
interface CodeItem {
  "c++": string;
  java: string;
  points: number;
}

interface UserData {
  code: {
    code1: CodeItem;
    code2: CodeItem;
    code3: CodeItem;
    code4: CodeItem;
    [key: string]: CodeItem;
  };
}

interface LeaderboardItem {
  email: string;
  totalPoints: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const codeCollection = collection(db, "code");
        const querySnapshot = await getDocs(codeCollection);

        const leaderboardData: LeaderboardItem[] = [];

        querySnapshot.forEach((doc) => {
          const userData = doc.data() as UserData;
          const email = doc.id; // Document ID is the user's email

          // Calculate total points for this user
          let totalPoints = 0;

          // Loop through all code entries in the user's document
          for (const codeKey in userData.code) {
            if (Object.prototype.hasOwnProperty.call(userData.code, codeKey)) {
              const codeItem = userData.code[codeKey];
              // Handle NaN points by defaulting to 0
              const points = isNaN(codeItem.points) ? 0 : codeItem.points;
              totalPoints += points;
            }
          }

          leaderboardData.push({ email, totalPoints });
        });

        // Sort leaderboard by total points in descending order
        leaderboardData.sort((a, b) => b.totalPoints - a.totalPoints);

        setLeaderboard(leaderboardData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
        setError("Failed to load leaderboard data");
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  // Trophy SVG for top 3 positions
  const renderTrophy = (position: number) => {
    if (position === 0) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="gold"
          strokeWidth="2"
          className="w-6 h-6"
        >
          <path d="M8 21V16.8C8 16.8 8 16 9 16C10 16 10 16.8 10 16.8V21M16 21V16.8C16 16.8 16 16 15 16C14 16 14 16.8 14 16.8V21M12 21V16.8C12 16.8 12 16 11 16M12 21V16.8C12 16.8 12 16 13 16M4 11H3C2.4 11 2 10.6 2 10V4C2 3.4 2.4 3 3 3H7.5" />
          <path d="M20 11H21C21.6 11 22 10.6 22 10V4C22 3.4 21.6 3 21 3H16.5" />
          <path d="M12 12C15.3137 12 18 9.31371 18 6V3H6V6C6 9.31371 8.68629 12 12 12Z" />
          <path d="M19 21H5C4.4 21 4 20.6 4 20V19C4 18.4 4.4 18 5 18H19C19.6 18 20 18.4 20 19V20C20 20.6 19.6 21 19 21Z" />
        </svg>
      );
    } else if (position === 1) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="silver"
          strokeWidth="2"
          className="w-6 h-6"
        >
          <path d="M8 21V16.8C8 16.8 8 16 9 16C10 16 10 16.8 10 16.8V21M16 21V16.8C16 16.8 16 16 15 16C14 16 14 16.8 14 16.8V21M12 21V16.8C12 16.8 12 16 11 16M12 21V16.8C12 16.8 12 16 13 16M4 11H3C2.4 11 2 10.6 2 10V4C2 3.4 2.4 3 3 3H7.5" />
          <path d="M20 11H21C21.6 11 22 10.6 22 10V4C22 3.4 21.6 3 21 3H16.5" />
          <path d="M12 12C15.3137 12 18 9.31371 18 6V3H6V6C6 9.31371 8.68629 12 12 12Z" />
          <path d="M19 21H5C4.4 21 4 20.6 4 20V19C4 18.4 4.4 18 5 18H19C19.6 18 20 18.4 20 19V20C20 20.6 19.6 21 19 21Z" />
        </svg>
      );
    } else if (position === 2) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#CD7F32"
          strokeWidth="2"
          className="w-6 h-6"
        >
          <path d="M8 21V16.8C8 16.8 8 16 9 16C10 16 10 16.8 10 16.8V21M16 21V16.8C16 16.8 16 16 15 16C14 16 14 16.8 14 16.8V21M12 21V16.8C12 16.8 12 16 11 16M12 21V16.8C12 16.8 12 16 13 16M4 11H3C2.4 11 2 10.6 2 10V4C2 3.4 2.4 3 3 3H7.5" />
          <path d="M20 11H21C21.6 11 22 10.6 22 10V4C22 3.4 21.6 3 21 3H16.5" />
          <path d="M12 12C15.3137 12 18 9.31371 18 6V3H6V6C6 9.31371 8.68629 12 12 12Z" />
          <path d="M19 21H5C4.4 21 4 20.6 4 20V19C4 18.4 4.4 18 5 18H19C19.6 18 20 18.4 20 19V20C20 20.6 19.6 21 19 21Z" />
        </svg>
      );
    }
    return null;
  };

  // Get a color for the badge based on points
  const getBadgeColor = (points: number) => {
    if (points >= 50) return "bg-purple-600";
    if (points >= 40) return "bg-indigo-600";
    if (points >= 30) return "bg-blue-600";
    if (points >= 20) return "bg-green-600";
    if (points >= 10) return "bg-yellow-600";
    return "bg-gray-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-xl shadow-lg">
          <svg
            className="animate-spin h-10 w-10 text-indigo-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-lg font-medium text-gray-700">
            Loading leaderboard...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we fetch the latest rankings
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-center text-gray-900">
            Error Loading Leaderboard
          </h3>
          <p className="mt-2 text-center text-sm text-gray-500">{error}</p>
          <button className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2">
            Coding Challenge Leaderboard
          </h1>
          <p className="text-xl text-indigo-200">
            See who's leading the pack in our coding challenges
          </p>
        </div>

        {leaderboard.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className="text-xl font-medium text-gray-700">
              No users found yet
            </p>
            <p className="text-gray-500 mt-2">
              Complete challenges to see your name on the leaderboard!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 bg-indigo-700">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Top Coders</h2>
                <div className="flex space-x-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-800 text-indigo-100">
                    {leaderboard.length} Participants
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-800 text-purple-100">
                    Latest Rankings
                  </span>
                </div>
              </div>
            </div>

            {/* Top 3 winners section */}
            {leaderboard.length >= 3 && (
              <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                <div className="flex justify-around items-end">
                  {/* 2nd place */}
                  <div className="text-center mb-4">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2 mx-auto shadow-md">
                        <span className="text-xl font-bold text-gray-700">
                          {leaderboard[1].email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1">
                        {renderTrophy(1)}
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-700 truncate max-w-xs">
                      {leaderboard[1].email}
                    </h3>
                    <span className="text-sm font-semibold text-indigo-700">
                      {leaderboard[1].totalPoints} pts
                    </span>
                  </div>

                  {/* 1st place */}
                  <div className="text-center z-10 transform -translate-y-4">
                    <div className="relative inline-block">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-300 flex items-center justify-center mb-2 mx-auto border-4 border-white shadow-lg">
                        <span className="text-2xl font-bold text-yellow-900">
                          {leaderboard[0].email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1">
                        {renderTrophy(0)}
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-700 truncate max-w-xs">
                      {leaderboard[0].email}
                    </h3>
                    <span className="text-lg font-bold text-indigo-700">
                      {leaderboard[0].totalPoints} pts
                    </span>
                  </div>

                  {/* 3rd place */}
                  <div className="text-center mb-4">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-2 mx-auto shadow-md">
                        <span className="text-xl font-bold text-gray-700">
                          {leaderboard[2].email.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1">
                        {renderTrophy(2)}
                      </div>
                    </div>
                    <h3 className="font-medium text-gray-700 truncate max-w-xs">
                      {leaderboard[2].email}
                    </h3>
                    <span className="text-sm font-semibold text-indigo-700">
                      {leaderboard[2].totalPoints} pts
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Rest of the leaderboard */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Rank
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Points
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaderboard.map((item, index) => (
                    <tr
                      key={item.email}
                      className={`hover:bg-gray-50 ${
                        index < 3 ? "bg-indigo-50 bg-opacity-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            {index < 3 ? (
                              renderTrophy(index)
                            ) : (
                              <span className="text-sm font-medium text-gray-700">
                                {index + 1}
                              </span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-lg font-medium text-indigo-800">
                              {item.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span
                          className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full text-white ${getBadgeColor(
                            item.totalPoints
                          )}`}
                        >
                          {item.totalPoints} points
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                <span className="font-medium">Last updated:</span>{" "}
                {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
