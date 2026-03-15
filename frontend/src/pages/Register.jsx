
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  // TO VALIDATE EMAIL
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  // VALIDATE PASSWORD: AT LEAST 8 CHAR WITH UPPERCASE, LOWERCASE, AND NUMBER
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;
    if (!regex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters and include uppercase, lowercase, and a number."
      );
      return false;
    }
    setPasswordError("");
    return true;
  };

  //CONFIRM PASSWORD
  const handleConfirmPassword = (value) => {
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmError("Passwords do not match");
    } else {
      setConfirmError("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // VALIDATE BEFORE REGISTERING
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) return;

    try {
      await axios.post("https://laufticks-backend.onrender.com/api/auth/register", {
        name,
        email,
        password,
        confirmPassword
      });

      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  // VALIDATING THE FORM BEFORE SUBMITTING
  const isFormValid =
    name.trim() !== "" &&
    email !== "" &&
    password !== "" &&
    confirmPassword !== "" &&
    !emailError &&
    !passwordError &&
    !confirmError;

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
              Name:
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
              Email:
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
            {emailError && (
              <p className="text-red-500 text-sm my-2 bg-red-500/25 p-3 border border-red-500">{emailError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Password:
            </label>
            <input
              type="password"
              placeholder="Create a password"
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            />
              {passwordError && (
                <p className="text-red-500 text-sm my-2 bg-red-500/25 p-3 border border-red-500">{passwordError}</p>
              )}
          </div>

          <div>
          <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
          <input
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => handleConfirmPassword(e.target.value)}
            required
            className={`w-full border rounded-lg p-3 focus:ring-2 focus:outline-none ${
              confirmError ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-emerald-400"
            }`}
          />
          {confirmError && <p className="text-red-500 text-sm my-2 bg-red-500/25 p-3 border border-red-500">{confirmError}</p>}
        </div>

          <button 
            disabled={!isFormValid} 
            className={`w-full text-white font-semibold py-3 rounded-lg transition ${
              isFormValid
                ? "bg-emerald-500 hover:bg-emerald-600 cursor-pointer"
                : "bg-gray-400"
            }`}
          >
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
