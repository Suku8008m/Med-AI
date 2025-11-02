import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";

const systemPrompt = fs.readFileSync("./system_prompt.txt", "utf8");

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://med-ai-913y.onrender.com",
  })
);

// OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/", async (req, res) => {
  try {
    const { userMessage, context } = req.body;
    const prompt = context
      ? `${context}\nUser: ${userMessage}\nAI:`
      : userMessage;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });

    res.json({
      status: true,
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ status: false, error: "Something went wrong." });
  }
});

app.post("/tip", async (req, res) => {
  const { language } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Your task is to generate **one short, evidence-based daily wellness tip**.

- First, detect the user's language: ${language}.  
- Then write the wellness tip entirely in that same detected language.  
- The tone should be friendly, motivational, and medically accurate.  
- Keep it short (one or two sentences maximum).  
- Avoid transliteration — always use the correct native script (e.g., Telugu, Hindi, Tamil).  
- Do not include emojis or markdown formatting.`,
        },
        {
          role: "user",
          content: "Generate today's daily wellness tip.",
        },
      ],
    });

    res.json({
      status: true,
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Tip error:", error);
    res.status(500).json({ status: false, error: "Something went wrong." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
