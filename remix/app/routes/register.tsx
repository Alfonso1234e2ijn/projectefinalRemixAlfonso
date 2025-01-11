import { Form, useActionData, json } from "@remix-run/react";
import { ActionFunction } from "@remix-run/node";
import { useNavigate } from "react-router-dom";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = formData.get("name");
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");
  const passwordConfirmation = formData.get("password_confirmation");

  const response = await fetch("http://localhost/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, username, password, password_confirmation: passwordConfirmation }),
  });

  if (!response.ok) {
    const error = await response.json();
    return json({ error: error.message }, { status: response.status });
  }

  return json({ success: true });
};

export default function Register() {
  const actionData = useActionData();
  const navigate = useNavigate();

  if (actionData?.success) {
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-blue-700 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Register</h1>
        <Form method="post">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
            <input type="text" name="name" id="name" required className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
            <input type="email" name="email" id="email" required className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username:</label>
            <input type="text" name="username" id="username" required className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
            <input type="password" name="password" id="password" required className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="mb-6">
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirm Password:</label>
            <input type="password" name="password_confirmation" id="password_confirmation" required className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">Register</button>
        </Form>
        {actionData?.error && <p className="mt-4 text-red-600">{actionData.error}</p>}
        {actionData?.success && <p className="mt-4 text-green-600">Registration successful! Redirecting to login...</p>}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            If you don't get redirected, <a href="/login" className="text-blue-500 hover:text-blue-700">click here</a> to go to Login.
          </p>
        </div>
      </div>
    </div>
  );
}
