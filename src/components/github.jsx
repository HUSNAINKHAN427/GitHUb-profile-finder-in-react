import { useEffect, useState } from "react";

function GitHub() {
  const [inputValue, setInputValue] = useState("");
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  async function getData() {
  if (!username) {
    setUserData(null);
    return;
  }

  setIsLoading(true);
  setError(null);

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();

    if (response.ok) {
      setUserData(data);
    } else {
      throw new Error(data.message || "Something went wrong");
    }
  } catch (error) {
    console.error("Error fetching GitHub user data:", error);
    setError(error.message);
    setUserData(null);
  } finally {
    setIsLoading(false);
  }
}


  useEffect(() => {
    getData();
  }, [username]);



  const handleSearch = () => {
    setUsername(inputValue);
    setInputValue("");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 p-4">

      <div className="flex items-center bg-gray-800 p-2 rounded-lg shadow-xl mb-8 w-full max-w-md">
        <input
          type="text"
          className="flex-grow p-3 bg-gray-700 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 text-lg"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          placeholder="Enter GitHub username..."
        />
        <button
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
          onClick={handleSearch}
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            "Search"
          )}
        </button>
      </div>


      {error && (
        <div className="bg-red-500 text-white p-3 rounded-lg shadow-md mb-4 max-w-md w-full text-center">
          <p>{error}</p>
        </div>
      )}


      {isLoading && (

        <div className="p-6 rounded-xl bg-gray-800 shadow-2xl flex flex-col gap-4 items-center justify-center w-full max-w-md animate-pulse">
          <div className="w-32 h-32 rounded-full bg-gray-700 mx-auto"></div>
          <div className="h-6 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="flex gap-6 mt-4">
            <div className="flex flex-col items-center">
              <div className="h-5 bg-gray-700 rounded w-16"></div>
              <div className="h-4 bg-gray-700 rounded w-20 mt-1"></div>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-5 bg-gray-700 rounded w-16"></div>
              <div className="h-4 bg-gray-700 rounded w-20 mt-1"></div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && userData && (

        <div className="p-6 rounded-xl bg-gray-800 shadow-2xl flex flex-col gap-4 items-center justify-center w-full max-w-md transition-all duration-500 ease-in-out transform hover:scale-105">
          <img
            src={userData.avatar_url}
            alt={`${userData.login}'s avatar`}
            className="w-36 h-36 rounded-full mx-auto border-4 border-blue-500 shadow-lg object-cover"
          />
          <h2 className="text-3xl font-bold text-white mt-2">{userData.name || userData.login}</h2>
          {userData.bio && <p className="text-gray-300 text-center italic">{userData.bio}</p>}
          {userData.html_url && (
            <a
              href={userData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-lg"
            >
              @{userData.login}
            </a>
          )}

          <div className="flex gap-8 mt-4">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-blue-400">{userData.followers}</span>
              <span className="text-gray-300 text-sm">Followers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-blue-400">{userData.following}</span>
              <span className="text-gray-300 text-sm">Following</span>
            </div>
          </div>

          {userData.public_repos !== undefined && (
            <div className="mt-4 text-gray-300">
              Public Repos: <span className="font-bold text-blue-400">{userData.public_repos}</span>
            </div>
          )}
          {userData.location && (
            <div className="text-gray-300 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {userData.location}
            </div>
          )}
        </div>
      )}

      {!isLoading && !userData && !error && username && (
        <p className="text-gray-400 text-lg mt-8">No user data to display. Try searching for a valid GitHub username.</p>
      )}
    </div>
  );
}
export default GitHub;
