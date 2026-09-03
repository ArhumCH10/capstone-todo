const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "todos",
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

async function initDb() {
  const createTable = `CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    done BOOLEAN DEFAULT FALSE
  )`;

  for (let attempt = 1; attempt <= 10; attempt += 1) {
    try {
      await pool.query(createTable);
      return;
    } catch (error) {
      if (attempt === 10) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

// Used by the load balancer / container orchestrator health checks from Lecture 6 onward.
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.get("/api/todos", async (req, res) => {
  const result = await pool.query("SELECT * FROM todos ORDER BY id");
  res.json(result.rows);
});

app.post("/api/todos", async (req, res) => {
  const text = (req.body.text || "").trim();
  if (!text) return res.status(400).json({ error: "text is required" });
  const result = await pool.query(
    `INSERT INTO todos (text) VALUES ($1) RETURNING *`,
    [text],
  );
  res.status(201).json(result.rows[0]);
});

app.patch("/api/todos/:id", async (req, res) => {
  if (typeof req.body.done !== "boolean") {
    return res.status(400).json({ error: "done must be a boolean" });
  }
  const result = await pool.query(
    "UPDATE todos SET done = $1 WHERE id = $2 RETURNING *",
    [req.body.done, Number(req.params.id)],
  );
  if (result.rowCount === 0)
    return res.status(404).json({ error: "not found" });
  res.json(result.rows[0]);
});

app.delete("/api/todos/:id", async (req, res) => {
  await pool.query("DELETE FROM todos WHERE id = $1", [Number(req.params.id)]);
  res.status(204).end();
});

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Capstone to-do app listening on port ${PORT}`);
  });
});
