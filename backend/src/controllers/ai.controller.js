import OpenAI from "openai";


const client = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export const generateQuiz = async (req, res) => {
  try {
    const { noteContent } = req.body;
    if (!noteContent) return res.status(400).json({ error: "noteContent required" });
    const prompt = `Create a short multiple-choice quiz (4 questions) from the following content:\n\n${noteContent}`;
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 800
    });
    const text = completion.choices?.[0]?.message?.content || "";
    res.json({ quiz: text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
};

export const summarize = async (req, res) => {
  try {
    const { noteContent } = req.body;
    if (!noteContent) return res.status(400).json({ error: "noteContent required" });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `Summarize the following content:\n\n${noteContent}` }],
      max_tokens: 400
    });
    res.json({ summary: completion.choices?.[0]?.message?.content || "" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
};
