import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
const router = express.Router();

// GET /api/quiz_questions?select=*&filter_id=...&order=createdAt&orderDir=desc
router.get("/", protect, async (req,res)=>{
  const where = { userId: req.user.id };
  // simple filters from query params
  for (const k in req.query) { 
    if (k.startsWith('filter_')) { where[k.replace('filter_','')] = req.query[k]; }
  }
  const order = req.query.order || 'createdAt';
  const orderDir = req.query.orderDir === 'asc' ? 'asc' : 'desc';
  const items = await prisma.quiz_questions.findMany({ where, orderBy: { [order]: orderDir } });
  res.json(items);
});

router.post("/", protect, async (req,res)=>{
  const data = req.body;
  data.userId = req.user.id;
  const item = await prisma.quiz_questions.create({ data });
  res.json(item);
});

router.get("/:id", protect, async (req,res)=>{
  const id = req.params.id;
  const item = await prisma.quiz_questions.findUnique({ where: { id } });
  if (!item || item.userId !== req.user.id) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

router.put("/:id", protect, async (req,res)=>{
  const id = req.params.id;
  const item = await prisma.quiz_questions.updateMany({ where: { id, userId: req.user.id }, data: req.body });
  res.json({ success: true });
});

router.delete("/:id", protect, async (req,res)=>{
  await prisma.quiz_questions.deleteMany({ where: { id: req.params.id, userId: req.user.id } });
  res.json({ success: true });
});

export default router;
