import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Chat endpoint
app.post("/api/gpt-chat", async (req, res) => {
  const { message, conversation } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: `
              You are Birdie Buddy — Brad Elzie’s friendly PGA assistant.
              Speak naturally, like a golf coach chatting with a student.
              Offer encouragement, explain Brad’s lesson philosophy,
              and guide players toward booking lessons with Brad Elzie Golf.
              Use plain, positive language — confident but never pushy.
            `
          },
          ...conversation,
          { role: "user", content: message }
        ],
        temperature: 0.8,
        max_tokens: 400
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn’t generate a response.";
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error contacting AI service." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Birdie Buddy running on port ${PORT}`));
