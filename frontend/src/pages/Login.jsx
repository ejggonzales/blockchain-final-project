import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login-image.png"

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://laufticks-backend.onrender.com/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.id);

      if (res.data.role === "organizer") {
        navigate("/my-events");
      } else {
        navigate("/events");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE LOGO */}
      <div className="hidden md:flex w-1/2 bg-emerald-500 items-center justify-center">
        <img
          src={loginImage}
          alt="event"
          className="object-cover w-full h-full"
        />
      </div>

      {/* RIGHT SIDE LOGIN */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-[#C7D8D2] px-6">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">

          <h2 className="text-3xl font-bold text-emerald-600 mb-2 text-center">
            Sign In
          </h2>

          <p className="text-center text-gray-500 mb-6">
            Login to your account
          </p>

          <form onSubmit={handleLogin} className="space-y-5">

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              />
            </div>

            <button className="w-full cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition">
              Login
            </button>

            <p className="text-sm text-center text-gray-500">
              Don't have an account?{" "}
              <span
                className="text-emerald-600 cursor-pointer hover:underline"
                onClick={() => navigate("/register")}
              >
                Register here
              </span>
            </p>

          </form>
        </div>
      </div>

    </div>
  );
}

export default Login;