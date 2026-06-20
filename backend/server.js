import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());
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
    await db.execute(
      "INSERT INTO users (email, password, username) VALUES (?, ?, ?)",
      [email, hashedPassword, username],
    );
    res.status(201).json({ message: "Cat parent registered!" });
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password, forceLogin } = req.body;

  try {
    const [users] = await db.execute(
      `
      SELECT 
        u.id, 
        u.username, 
        u.password, 
        COUNT(uc.id) AS cat_count
      FROM users u
      LEFT JOIN user_cats uc ON u.id = uc.user_id
      WHERE u.email = ?
      GROUP BY u.id
    `,
      [email],
    );
    if (users.length === 0)
      return res.status(401).json({ error: "Invalid credentials." });

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials." });

    if (user.current_session_id && !forceLogin) {
      return res.status(409).json({
        conflict: true,
        message:
          "This account is already logged in on another device. Kick them out?",
      });
    }

    const newSessionId = uuidv4();
    await db.execute("UPDATE users SET current_session_id = ? WHERE id = ?", [
      newSessionId,
      user.id,
    ]);

    res.status(200).json({
      message: "Welcome to MiMiau!",
      sessionId: newSessionId,
      userId: user.id,
      catCount: user.catCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/my-cats", async (req, res) => {
  const sessionId = req.headers["sessionId"];
  if (!sessionId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const [users] = await db.execute(
      "SELECT id FROM users WHERE current_session_id = ?",
      [sessionId],
    );
    if (users.length === 0)
      return res.status(401).json({ error: "Invalid session" });
    const userId = users[0].id;

    const [cats] = await db.execute(
      `
        SELECT 
          uc.id as instance_id, 
          c.name, 
          c.image, 
          c.sprite_sheet, 
          c.facts, 
          uc.level
        FROM user_cats uc
        JOIN cats_catalog c ON uc.id = c.id
        WHERE uc.user_id = ?
      `,
      [userId],
    );

    const precessedCats = cats.map((cat) => {
      let facts = [];
      try {
        facts = JSON.parse(cat.facts);
      } catch (e) {
        console.error(
          "Failed to parse meme facts for the cat slot: ",
          cat.instance_id,
        );
      }

      return {
        instanceId: cat.instance_id,
        name: cat.name,
        image: cat.image,
        spriteSheet: cat.sprite_sheet,
        maxStarLevel: facts ? infoArray.length : 1,
        facts: facts || [],
      };
    });

    res.json(precessedCats);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

const verifySession = async (req, res, next) => {
  const { userid, sessionid } = req.headers;
  const [rows] = await db.execute(
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

app.post("/api/logout", verifySession, async (req, res) => {
  const userid = parseInt(req.headers["userid"], 10);

  try {
    await db.execute(
      "UPDATE users SET current_session_id = NULL WHERE id = ?",
      [userid],
    );
    res.status(200).json({ message: "Logged out successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Database error during logout." });
  }
});

app.delete("/api/account", verifySession, async (req, res) => {
  const { userid } = req.headers;
  try {
    await db.execute("DELETE from users WHERE id = ?", [userid]);
    res.status(200).json({
      message: "Account deleted successfully. Thank you for playing!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("MiMiau Server running on port 3000."));
