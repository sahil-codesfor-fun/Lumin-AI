
import notesRoutes from './routes/notes.routes.js';
import summariesRoutes from './routes/summaries.routes.js';
import quizzesRoutes from './routes/quizzes.routes.js';
import quiz_questionsRoutes from './routes/quiz_questions.routes.js';
import chat_messagesRoutes from './routes/chat_messages.routes.js';
import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
const app = express();
app.use(cors());
app.use(express.json());
app.get("/health", async (req, res) => {
  res.json({ ok: true });
});
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/ai", aiRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/summaries', summariesRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/quiz_questions', quiz_questionsRoutes);
app.use('/api/chat_messages', chat_messagesRoutes);

const port = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("✅ Bytewise Backend is Running!");
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
