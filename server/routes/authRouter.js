import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import pool from '../db/pool.js';

const authRouter = express.Router();
const JWT_SECRET = 'JWT_KEY'

authRouter.post('/signup', async (req, res) => {
    const { email, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = await pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hashedPassword]);
        res.status(201).json({message: 'User created succesfully'});
    } catch(error){
        res.status(400).json({error: 'User already exists'})
    }
});

authRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  console.log("Received signin request");

  try {
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    console.log("Query executed");

    const user = userResult.rows[0];

    if (!user) {
      console.log("User not found");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    console.log("Password compared");

    if (!validPassword) {
      console.log("Invalid password");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("Token generated");

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default authRouter;
