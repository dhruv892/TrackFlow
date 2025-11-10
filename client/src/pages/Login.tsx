import React, { useEffect, useState } from "react";
import { getCurrentUser, login } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setAuth = useAuthStore((state) => state.setAuthenticated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  // Check if user is already auth'ed on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await getCurrentUser(); // backend validates HTTP-only cookie
        setAuth(true);
        navigate("/dashboard");
      } catch {
        setAuth(false);
      }
    };
    checkAuth();
  }, [navigate, setAuth]);

  // Also redirect immediately if Zustand indicates logged in (in case of fast state updates)
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      await login({ email, password });
      setAuth(true);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="border-2 rounded-md border-gray-700 p-8 shadow-lg w-full max-w-sm space-y-6"
      >
        <h2 className="text-2xl font-semibold text-white text-center">Login</h2>
        {error && <div className="text-red-400 text-center">{error}</div>}
        <div>
          <label className="block text-gray-300 mb-1" htmlFor="username">
            Email
          </label>
          <input
            id="email"
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          Login
        </button>
        <p className="text-gray-400 text-center">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:underline"
          >
            Register here
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
