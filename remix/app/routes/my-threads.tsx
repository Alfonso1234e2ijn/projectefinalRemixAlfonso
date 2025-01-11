import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function MyThreads() {
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchThreads = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch("http://localhost/api/my-threads", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setThreads(data.threads);
                } else if (response.status === 401) {
                    setError("Unauthorized. Please log in again.");
                } else {
                    setError("Failed to fetch threads. Please try again later.");
                }
            } catch (error) {
                setError("An error occurred while fetching threads.");
                console.error("Error fetching threads:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchThreads();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this thread?")) {
            try {
                const response = await fetch(`http://localhost/api/threads/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (response.ok) {
                    setThreads((prevThreads) => prevThreads.filter((thread) => thread.id !== id));
                    alert("Thread deleted successfully.");
                } else {
                    const data = await response.json();
                    alert(data.message || "Failed to delete thread.");
                }
            } catch (error) {
                alert("Error deleting thread.");
                console.error("Error deleting thread:", error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-gray-900 dark:text-gray-100">
            
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        My Threads
                    </h2>
                    <div className="mb-4">
                        <Link
                            to="/dashboard"
                            className="flex items-center text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 text-sm font-medium"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                className="w-5 h-5 mr-2"
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
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Your Threads</h3>

                    {loading ? (
                        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <ul>
                            {threads.length > 0 ? (
                                threads.map((thread) => (
                                    <li
                                        key={thread.id}
                                        className="border-b border-gray-300 dark:border-gray-600 py-2 flex justify-between items-center"
                                    >
                                        <div className="flex items-center">
                                            <button
                                                onClick={() => handleDelete(thread.id)}
                                                className="text-red-500 hover:text-red-700 mr-4"
                                                aria-label="Delete Thread"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="2"
                                                    stroke="currentColor"
                                                    className="w-5 h-5"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                            <p className="text-blue-500 hover:text-blue-700">
                                                {thread.title}
                                            </p>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <li className="px-4 py-2 text-gray-600 dark:text-gray-400">
                                    No threads found.
                                </li>
                            )}
                        </ul>
                    )}

                    <div className="mt-4">
                        <Link
                            to="/create-thread"
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
                        >
                            Create New Thread
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
