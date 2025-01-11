import { Link, useNavigate } from "@remix-run/react";
import { useState } from "react";

export default function CreateThread() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const response = await fetch("http://localhost/api/threads", {
            method: "POST",
            body: JSON.stringify({ title, content }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        setIsSubmitting(false);

        if (response.ok) {
            alert("Thread created successfully!");
            navigate("/my-threads");
        } else {
            alert("Failed to create thread");
            console.error("Failed to create thread");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-gray-900 dark:text-gray-100">
            {/* Encabezado de la página */}
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Create New Thread
                    </h2>
                    <div className="mb-4">
                        <Link
                            to="/my-threads"
                            className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium"
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
                            Back to My Threads
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="content"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Content
                            </label>
                            <textarea
                                id="content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                rows="6"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`bg-blue-500 text-white py-2 px-4 rounded-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create Thread'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
