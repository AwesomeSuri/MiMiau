import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());

const db = mysql.createPool({
  host: "db",
  user: "root",
  password: "miaupassword",
  database: "mimiau",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.post("/api/register", async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO users (email, password, username) VALUES (?, ?, ?)",
      [email, hashedPassword, username],
    );
    res.status(201).json({ message: "Cat parent registered!" });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0)
      return res.status(401).json({ error: "Invalid credentials." });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials." });

    const newSessionId = uuidv4();
    await db.query("UPDATE users SET current_session_id = ? WHERE id = ?", [
      newSessionId,
      user.id,
    ]);

    res.status(200).json({
      message: "Welcome to MiMiau!",
      sessionId: newSessionId,
      userId: user.id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const verifySession = async (req, res, next) => {
  const { userid, sessionid } = req.headers;
  const [rows] = await db.query(
    "SELECT current_session_id FROM users WHERE id = ?",
    [userid],
  );

  if (rows.length === 0 || rows[0].current_session_id !== sessionid) {
    return res
      .status(401)
      .json({ error: "Session expired or logged in from another device." });
  }
  next();
};

app.delete("/api/account", verifySession, async (req, res) => {
  const { userid } = req.headers;
  try {
    await db.query("DELETE from users WHERE id = ?", [userid]);
    res.status(200).json({
      message: "Account deleted successfully. Thank you for playing!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("MiMiau Server running on port 3000."));
