import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";
import { FaArrowUp } from "react-icons/fa";

// Define the User interface with the required fields
interface User {
  id: number;
  name: string;
  username: string;
  role: number;
}

export default function UserRoles() {
  const [users, setUsers] = useState<User[]>([]); // Store the list of users
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]); // Store filtered users based on search
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [searchQuery, setSearchQuery] = useState<string>(""); // Store the search query

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Set loading to true when fetching
      setError(null); // Clear any previous errors

      try {
        // Fetch the list of users from the API
        const response = await fetch("http://localhost/api/users/getAll");

        if (response.ok) {
          const data = await response.json();
          setUsers(data.users); // Set the list of users
          setFilteredUsers(data.users); // Set filtered users initially as all users
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch users"); // Set error if request fails
        }
      } catch (error) {
        setError("Error fetching users"); // Set error if the fetch fails
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false once done
      }
    };

    fetchUsers(); // Call the function to fetch users on component mount
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase(); // Get search query and convert to lowercase
    setSearchQuery(query); // Update search query state

    // Filter users based on search query (matches name or username)
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered); // Set the filtered users based on search
  };

  const handleRoleChange = async (userId: number, currentRole: number) => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) {
      setError("No token found. Please log in."); // Error if no token is found
      return;
    }

    // Toggle role: If current role is 0 (user), make it 1 (admin), and vice versa
    const newRole = currentRole === 0 ? 1 : 0;

    try {
      const response = await fetch("http://localhost/api/users/updateRole", {
        method: "PUT", // PUT request to update the role
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token in authorization header
        },
        body: JSON.stringify({ user_id: userId, role: newRole }), // Send user ID and new role
      });

      // Check if the response is successful
      if (response.ok) {
        const data = await response.json();
        const updatedUsers = users.map((user) =>
          user.id === userId ? { ...user, role: data.role } : user
        );
        setUsers(updatedUsers); // Update the users with the new role
        setFilteredUsers(updatedUsers); // Update the filtered users as well
        setError(null); // Clear any previous error
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update role"); // Set error if update fails
      }
    } catch (error) {
      setError("Error updating user role"); // Set error if there's an issue with the request
      console.error(error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 min-h-screen flex items-center justify-center p-6">
      {/* Link to navigate back to the dashboard */}
      <div className="absolute top-4 left-4">
        <Link
          to="/dashboard"
          className="text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Main content area for displaying users */}
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-8">
          🛠️ User Roles
        </h1>

        {/* Search input to filter users by name or username */}
        <input
          type="text"
          placeholder="Search by name or username..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-4 mb-6 border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500 focus:outline-none"
        />

        {/* Loading state */}
        {loading ? (
          <p className="text-center text-gray-600 animate-pulse">Loading...</p>
        ) : error ? (
          // Display error if there's an issue
          <p className="text-center text-red-600 font-semibold">{error}</p>
        ) : filteredUsers.length > 0 ? (
          // Display users if found
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-md transform hover:scale-105 transition-transform"
              >
                <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-600">@{user.username}</p>
                <div className="mt-4 flex justify-between items-center">
                  {user.role === 0 ? (
                    // If user is not admin, show promote button
                    <button
                      onClick={() => handleRoleChange(user.id, user.role)}
                      className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <FaArrowUp />
                      <span>Promote to Admin</span>
                    </button>
                  ) : (
                    // If user is admin, display "Admin" text
                    <span className="text-green-500">Admin</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Display message if no users found
          <p className="text-center text-gray-600">No users found</p>
        )}
      </div>
    </div>
  );
}
