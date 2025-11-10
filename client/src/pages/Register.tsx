import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/authApi";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      await register({ name, email, password });
      // After successful registration, redirect to login page
      navigate("/login");
    } catch (err: unknown) {
      // Extract error message from backend response or fallback
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to register. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="border-2 rounded-md border-gray-700 p-8 shadow-lg w-full max-w-sm space-y-6"
      >
        <h2 className="text-2xl font-semibold text-white text-center">
          Register
        </h2>
        {error && <div className="text-red-400 text-center">{error}</div>}
        <div>
          <label htmlFor="username" className="block text-gray-300 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="username"
            required
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-300 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Register
        </button>
        <p className="text-gray-400 text-center">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:underline"
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;
