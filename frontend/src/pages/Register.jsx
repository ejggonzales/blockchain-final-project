
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#C7D8D2] px-4">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8">

        <h2 className="text-3xl font-bold text-center text-emerald-600 mb-2">
          Sign Up
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Create your account
        </p>

        <form onSubmit={handleRegister} className="space-y-5">

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
          </div>

          <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg transition">
            Register
          </button>

          <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-emerald-600 cursor-pointer hover:underline"
            >
              Login here
            </span>
          </p>

        </form>

      </div>
    </div>
  );
}

export default Register;
