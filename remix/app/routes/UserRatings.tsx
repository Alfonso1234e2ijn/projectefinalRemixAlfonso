import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  rating: number | null;
}

export default function UserRatings() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [hoveredRatings, setHoveredRatings] = useState<{ [key: number]: number | null }>({});

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://localhost/api/users/getAll");

        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
          setFilteredUsers(data.users);
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to fetch users");
        }
      } catch (error) {
        setError("Error fetching users");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(query) || user.username.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered);
  };

  const handleRating = async (userId: number, rating: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost/api/uratings/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, rating }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUsers = users.map((user) =>
          user.id === userId ? { ...user, rating: data.rating.rating } : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to submit rating");
      }
    } catch (error) {
      setError("Error submitting rating");
      console.error(error);
    }
  };

  const handleHover = (userId: number, star: number) => {
    setHoveredRatings((prev) => ({ ...prev, [userId]: star }));
  };

  const handleMouseLeave = (userId: number) => {
    setHoveredRatings((prev) => ({ ...prev, [userId]: null }));
  };

  return (
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 min-h-screen flex items-center justify-center p-6">
      <div className="absolute top-4 left-4">
        <Link
          to="/dashboard"
          className="text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl">
        <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-8">
          🌟 User Ratings
        </h1>

        <input
          type="text"
          placeholder="Search by name or username..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-4 mb-6 border border-gray-300 rounded-xl focus:ring-4 focus:ring-purple-500 focus:outline-none"
        />

        {loading ? (
          <p className="text-center text-gray-600 animate-pulse">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600 font-semibold">{error}</p>
        ) : filteredUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-md transform hover:scale-105 transition-transform"
              >
                <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-600">@{user.username}</p>
                <div className="mt-4 flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`cursor-pointer text-2xl ${
                        (hoveredRatings[user.id] || user.rating || 0) >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      onClick={() => handleRating(user.id, star)}
                      onMouseEnter={() => handleHover(user.id, star)}
                      onMouseLeave={() => handleMouseLeave(user.id)}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {user.rating ? `Current rating: ${user.rating}` : "No ratings yet"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No users found</p>
        )}
      </div>
    </div>
  );
}
