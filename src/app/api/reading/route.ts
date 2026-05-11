import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const deck = [
  "The Fool",
  "The Magician",
  "The High Priestess",
  "The Empress",
  "The Emperor",
  "The Lovers",
  "The Chariot",
  "Strength",
  "The Hermit",
  "Wheel of Fortune",
  "Justice",
  "The Star",
];

function drawCards() {
  return [...deck].sort(() => Math.random() - 0.5).slice(0, 3);
}

export async function POST(req: Request) {
  const { question, mode } = await req.json();

  const cards = drawCards();

  // 🎴 RANDOM MODE
  if (mode === "random") {
    return NextResponse.json({
      cards,
      interpretation: `🔮 Random Reading:\n\nThe cards drawn are ${cards.join(
        ", "
      )}. Trust your intuition — meaning comes from reflection, not prediction.`,
    });
  }

  // 🤖 AI MODE
  if (mode === "ai") {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a mystical but grounded tarot reader. Provide insightful, emotionally intelligent, non-generic interpretations based on tarot cards. Avoid vague fortune-cookie language.",
        },
        {
          role: "user",
          content: `
Question: ${question}

Cards drawn:
1. ${cards[0]}
2. ${cards[1]}
3. ${cards[2]}

Give a structured tarot reading:
- Situation
- Influences
- Outcome
- Advice
          `,
        },
      ],
    });

    return NextResponse.json({
      cards,
      interpretation: completion.choices[0].message.content,
    });
  }

  return NextResponse.json({
    cards,
    interpretation: "Invalid mode selected.",
  });
}