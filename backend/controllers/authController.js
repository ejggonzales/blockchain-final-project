const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/userModel');

exports.register = async (req, res) => {

  try {
    const { name, email, password, confirmPassword } = req.body;

    //CONFIRMING PASSWORD ARE THE SAME
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    //PASSWORD CONDITION 
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, and a number",
      });
    }
    

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: "user"
    };

    await createUser(newUser);

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
      console.error(error.response?.data); 
      alert(error.response?.data?.message || "Registration failed");
    }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
      id: user.id
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }

};