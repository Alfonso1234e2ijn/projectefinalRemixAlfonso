import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function Threads() {
  const [threads, setThreads] = useState([]); // Original list of threads
  const [filteredThreads, setFilteredThreads] = useState([]); // Filtered list of threads
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchThreads = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost/api/threads", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setThreads(data.threads); // Save the full list of threads
          setFilteredThreads(data.threads); // Initialize the filtered list
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch threads");
        }
      } catch (error) {
        setError("Error fetching threads");
        console.error("Error fetching threads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter the original list of threads
    const filtered = threads.filter((thread) =>
      thread.title.toLowerCase().includes(query)
    );

    setFilteredThreads(filtered);
  };

  return (
    <div className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 flex items-center justify-center min-h-screen">
      {/* Back to Dashboard Button */}
      <div className="absolute top-4 left-4">
        <Link
          to="/dashboard"
          className="flex items-center text-white font-medium text-lg bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-6 h-6 mr-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md relative">
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-center text-gray-700 mb-6">
          Discussions
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Explore and select a discussion group.
        </p>

        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            id="searchInput"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={handleSearch} // Filter as the user types
            className="w-full border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* List of threads */}
        <div id="threadsContainer" className="space-y-5">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : filteredThreads.length > 0 ? (
            filteredThreads.map((thread) => (
              <Link
                key={thread.id}
                to="/group"
                state={{ threadTitle: thread.title, threadId: thread.id }}
                className="thread-item flex items-center justify-center bg-blue-200 text-blue-800 text-lg font-medium py-4 rounded-lg shadow-md hover:bg-blue-300 transition-transform transform hover:scale-105"
              >
                <div>
                  <h3 className="text-xl font-bold">{thread.title}</h3>
                  <p className="text-sm text-gray-600">{thread.content}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No discussions found</p>
          )}
        </div>
      </div>
    </div>
  );
}
