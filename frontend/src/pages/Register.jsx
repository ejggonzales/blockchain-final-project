import { useState } from "react";
import axios from "axios";

function Register() {

  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/api/auth/register",
      {
        name,
        email,
        password
      }
    );

    alert("Registration successful!");
  };

  return (

    <div className="flex justify-center items-center h-screen">

      <form onSubmit={handleRegister} className="space-y-4">

        <input
          type="text"
          placeholder="Name"
          onChange={(e)=>setName(e.target.value)}
          className="border p-2"
        />

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

        <button className="bg-green-500 text-white px-4 py-2">
          Register
        </button>

      </form>

    </div>

  );
}

export default Register;