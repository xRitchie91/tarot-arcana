"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function drawCards() {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-zinc-900 to-black text-white px-6">
      
      <div className="w-full max-w-2xl text-center space-y-8">
        
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-light tracking-wide"
        >
          Tarot Arcana
        </motion.h1>

        <p className="text-zinc-400">
          Ask a question and let the cards reflect your path.
        </p>

        {/* Input */}
        <div className="space-y-4">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What do you want clarity on?"
            className="w-full p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 outline-none"
          />

          <button
            onClick={drawCards}
            disabled={!question || loading}
            className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition disabled:opacity-40"
          >
            {loading ? "Consulting the cards..." : "Draw Cards"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-10 space-y-4 text-left bg-zinc-900/60 p-6 rounded-xl border border-zinc-800"
          >
            <h2 className="text-xl font-medium">Your Reading</h2>

            <div className="text-sm text-zinc-300">
              {result.interpretation}
            </div>

            <div className="text-xs text-zinc-500 mt-4">
              Cards drawn:
              <pre className="mt-2">{JSON.stringify(result.cards, null, 2)}</pre>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}