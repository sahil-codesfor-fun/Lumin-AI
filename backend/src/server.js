import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";

import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import summariesRoutes from "./routes/summaries.routes.js";
import quizzesRoutes from "./routes/quizzes.routes.js";
import quiz_questionsRoutes from "./routes/quiz_questions.routes.js";
import chat_messagesRoutes from "./routes/chat_messages.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

// Health Check Route
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/summaries", summariesRoutes);
app.use("/api/quizzes", quizzesRoutes);
app.use("/api/quiz_questions", quiz_questionsRoutes);
app.use("/api/chat_messages", chat_messagesRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Default Route
const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Bytewise Backend is Running!");
});

// Start Server

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));