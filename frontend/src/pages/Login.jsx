import React from 'react'
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password }
    );

    localStorage.setItem("token", res.data.token);

    if (res.data.role === "organizer") {
      navigate("/organizer-dashboard");
    } else {
      navigate("/user-dashboard");
    }
  };

  return (
    <div className="flex h-screen justify-center items-center">

      <form onSubmit={handleLogin} className="space-y-4">

        <input
          type="email"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
          className="border p-2"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
          className="border p-2"
        />

        <button className="bg-blue-500 text-white px-4 py-2 cursor-pointer">
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;