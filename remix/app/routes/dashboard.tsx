import axios from "axios";
import { useEffect, useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadVotes, setUnreadVotes] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [userRole, setUserRole] = useState(null);
    const [userUsername, setUserUsername] = useState("");
    const [editing, setEditing] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isNotificationCircleVisible, setIsNotificationCircleVisible] =
        useState(true);
    const [originalUser, setOriginalUser] = useState({
        name: "",
        email: "",
        username: "",
    });

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch("http://localhost/api/user", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserName(data.name);
                    setUserEmail(data.email);
                    setUserRole(data.role); 
                    setUserUsername(data.username);
                    setOriginalUser({
                        name: data.name,
                        email: data.email,
                        username: data.username,
                    });
                } else {
                    console.error("Error fetching user details");
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchUserDetails();

        const fetchNotifications = async () => {
            const response = await fetch("http://localhost/api/notifications");
            if (response.ok) {
                const data = await response.json();
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            }
        };

        fetchNotifications();

        // Fetch unread votes
        const fetchUnreadVotes = async () => {
            try {
                const response = await axios.get(
                    "http://localhost/api/unread-votes",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem(
                                "token"
                            )}`,
                        },
                    }
                );
                if (response.data) {
                    setUnreadVotes(response.data.unreadVotes);
                }
            } catch (error) {
                console.error("Error fetching unread votes:", error);
            }
        };

        fetchUnreadVotes();
    }, []);

    const toggleNotifications = () => {
        setIsNotificationsOpen((prev) => !prev);
        setIsNotificationCircleVisible(false);
    };

    const clearVotes = () => {
        setUnreadVotes([]);
    };

    const toggleDropdown = () => setDropdownOpen((prev) => !prev);
    const toggleMenu = () => setMenuOpen((prev) => !prev);

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost/api/logout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                localStorage.removeItem("token");
                console.log("User logged out successfully");
                navigate("/login");
            } else {
                console.error("Error during logout");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleSaveChanges = async () => {
        const updatedUser = {
            name: userName,
            email: userEmail,
            username: userUsername,
        };

        try {
            const response = await fetch("http://localhost/api/user/update", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUser),
            });

            if (response.ok) {
                alert("User details updated successfully!");
                setEditing(false);
            } else {
                const errorData = await response.json();
                console.error("Error updating user details:", errorData);
                alert(
                    `Failed to update user details: ${
                        errorData.message || "Unknown error"
                    }`
                );
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An unexpected error occurred while updating user details.");
        }
    };

    const handleCancel = () => {
        setUserName(originalUser.name);
        setUserEmail(originalUser.email);
        setUserUsername(originalUser.username);
        setEditing(false);
        window.location.href = "/dashboard";
    };

    const handleDeleteAccount = async () => {
        try {
            // Llamada a la API
            const response = await fetch("http://localhost/api/user/delete", {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Token de autenticación
                    "Content-Type": "application/json",
                },
            });
    
            // Verificación de la respuesta
            if (!response.ok) {
                const data = await response.json(); // Obtener el mensaje de error de la respuesta
                throw new Error(data.message || "Error during account deletion.");
            }
    
            // Eliminar el token del almacenamiento local y redirigir
            localStorage.removeItem("token");
            window.location.href = "/welcome"; // Redirigir al usuario después de eliminar la cuenta
    
        } catch (error) {
            console.error("Error during account deletion request:", error);
            alert(`An error occurred: ${error.message}`); // Mostrar mensaje de error
        }
    };
    

    return (
        <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-gray-900 dark:text-gray-100">
            <header className="bg-white dark:bg-gray-800 shadow">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Dashboard
                    </h2>
                    <button onClick={toggleNotifications} className="relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-800 dark:text-gray-200"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M18 8a6 6 0 00-12 0v4a6 6 0 00-4 5.197V18h20v-1.803A6 6 0 0018 12V8z"
                            />
                        </svg>
                        {/* Only if isNotificationCircleVisible is true the circle goes color red */}
                        {isNotificationCircleVisible &&
                            unreadVotes.length > 0 && (
                                <span className="absolute top-0 right-0 inline-block h-2.5 w-2.5 bg-red-600 rounded-full"></span>
                            )}
                    </button>
                    <div className="relative">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-800 dark:text-gray-200 focus:outline-none"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        </button>
                        {menuOpen && (
                            <div
                                className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg overflow-hidden"
                                onClick={() => setMenuOpen(false)}
                            >
                                <ul className="divide-y divide-gray-200 dark:divide-gray-600">
                                    {/* Admin-only option */}
                                    {userRole === 1 && (
                                        <li className="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                                            <Link to="/admin-panel">
                                                Admin Panel
                                            </Link>
                                        </li>
                                    )}
                                    <li
                                        onClick={handleLogout}
                                        className="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5.121 17.804A3 3 0 004 15V7a3 3 0 013-3h10a3 3 0 013 3v8a3 3 0 01-1.121 2.804M9 13h6M10 17h4"
                                            />
                                        </svg>
                                        Logout
                                    </li>
                                    <li
                                        onClick={() => setEditing(true)}
                                        className="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 4v16m8-8H4"
                                            />
                                        </svg>
                                        Manage User
                                    </li>
                                    <li
                                        onClick={handleDeleteAccount}
                                        className="px-4 py-2 flex items-center cursor-pointer hover:bg-red-600 dark:hover:bg-red-600 text-black dark:text-red-400"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 7l-7 7-7-7"
                                            />
                                        </svg>
                                        Delete Account
                                    </li>
                                    <li className="px-4 py-2 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                                        <Link
                                            to="/my-threads"
                                            className="flex items-center"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 6h16M4 12h16m-7 6h7"
                                                />
                                            </svg>
                                            My Threads
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-12">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    {editing ? (
                        <>
                            <h3 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                                Edit User Details
                            </h3>
                            <div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="userName"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Name
                                    </label>
                                    <input
                                        id="userName"
                                        type="text"
                                        value={userName}
                                        onChange={(e) =>
                                            setUserName(e.target.value)
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="userEmail"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </label>
                                    <input
                                        id="userEmail"
                                        type="email"
                                        value={userEmail}
                                        onChange={(e) =>
                                            setUserEmail(e.target.value)
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="userUsername"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Username
                                    </label>
                                    <input
                                        id="userUsername"
                                        type="text"
                                        value={userUsername}
                                        onChange={(e) =>
                                            setUserUsername(e.target.value)
                                        }
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="flex items-center justify-end gap-4">
                                    <button
                                        onClick={handleSaveChanges}
                                        className="bg-blue-500 text-white py-2 px-4 rounded-md"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="bg-gray-500 text-white py-2 px-4 rounded-md"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                                Welcome, {userName || "Loading..."}!
                            </h3>
                            <p className="text-lg text-gray-700 dark:text-gray-300">
                                You're logged in! Enjoy exploring your
                                dashboard.
                            </p>
                            {isNotificationsOpen && (
                                <div className="mt-6 bg-gray-100 p-4 rounded-md">
                                    <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 cursor-pointer">
                                        You have reacted to
                                    </h4>
                                    <ul className="mt-4">
                                        {unreadVotes.length > 0 ? (
                                            unreadVotes.map((vote) => (
                                                <li
                                                    key={vote.id}
                                                    className="bg-gray-200 p-4 rounded-md mb-2"
                                                >
                                                    {vote.type === 1
                                                        ? `You liked the message: "${vote.response.content}"`
                                                        : `You disliked the message: "${vote.response.content}"`}
                                                </li>
                                            ))
                                        ) : (
                                            <p>No unread votes.</p>
                                        )}
                                    </ul>
                                    <button
                                        onClick={clearVotes}
                                        className="mt-4 py-2 px-4 bg-red-600 text-white rounded-md"
                                    >
                                        Clear Votes
                                    </button>
                                </div>
                            )}

                            <Link to="/threads">
                                <button className="mt-6 bg-blue-500 text-white py-2 px-4 rounded-md">
                                    Go to Threads
                                </button>
                            </Link>
                            <Link to="/userRatings">
                                <button className="mt-6 bg-green-500 text-white py-2 px-4 rounded-md flex items-center space-x-2">
                                    <FaUserPlus size={20} />
                                    <span>Go to User Ratings</span>
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
