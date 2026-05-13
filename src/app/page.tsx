"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [mode, setMode] = useState<"random" | "ai">("random");
  const [revealed, setRevealed] = useState(false);

  async function drawCards() {
    setLoading(true);
    setResult(null);
    setRevealed(false);

    const res = await fetch("/api/reading", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, mode }),
    });

    const data = await res.json();

    setResult(data);
    setLoading(false);

    setTimeout(() => {
      setRevealed(true);
    }, 800);
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-black text-white flex items-center justify-center px-6">

      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-700/20 blur-3xl rounded-full top-10 left-10 animate-pulse" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-600/20 blur-3xl rounded-full bottom-10 right-10 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-light tracking-[0.25em] uppercase">
            Tarot Arcana
          </h1>
          <p className="text-zinc-400 text-sm tracking-wide">
            Seek clarity. Reveal patterns. Consult the unseen.
          </p>
        </div>

        {/* Toggle */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setMode("random")}
            className={`py-3 rounded-xl transition ${
              mode === "random"
                ? "bg-purple-600 shadow-lg"
                : "bg-zinc-900 hover:bg-zinc-800"
            }`}
          >
            Random Cards
          </button>
          <button
            onClick={() => setMode("ai")}
            className={`py-3 rounded-xl transition ${
              mode === "ai"
                ? "bg-purple-600 shadow-lg"
                : "bg-zinc-900 hover:bg-zinc-800"
            }`}
          >
            AI Reader <br></br>
            (Coming Soon...)
          </button>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <textarea
            rows={3}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What guidance do you seek?"
            className="w-full rounded-2xl bg-black/40 border border-white/10 p-4 resize-none outline-none focus:border-purple-500"
          />
          <button
            onClick={drawCards}
            disabled={!question || loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition disabled:opacity-40 font-medium tracking-wide"
          >
            {loading ? "Consulting the cards..." : "Draw Cards"}
          </button>
        </div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-white/10 bg-black/40 p-6 space-y-6"
          >
            <h2 className="text-xl tracking-wide text-purple-300">
              Your Reading
            </h2>

            {/* Animated Cards */}
            <div className="grid grid-cols-3 gap-3">
              {result.cards.map((card: string, index: number) => (
                <div
                  key={index}
                  style={{ perspective: 1000 }}
                  className="h-40"
                >
                  <motion.div
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: revealed ? 0 : 180 }}
                    transition={{ delay: index * 0.4, duration: 0.8 }}
                    style={{
                      transformStyle: "preserve-3d",
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {/* Back face (✦) — starts facing user, rotates away */}
                    <div
                      style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                      className="absolute inset-0 rounded-2xl bg-gradient-to-b from-zinc-800 to-black border border-purple-500/30 flex items-center justify-center"
                    >
                      <span className="text-purple-300 text-xl">✦</span>
                    </div>

                    {/* Front face (card name) — hidden until flipped */}
                    <div
                      style={{ backfaceVisibility: "hidden" }}
                      className="absolute inset-0 rounded-2xl bg-gradient-to-b from-zinc-800 to-black border border-purple-500/30 flex items-center justify-center text-center p-3"
                    >
                      <span className="text-sm tracking-wide text-purple-200">
                        {card}
                      </span>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Reading Text */}
            <div className="text-zinc-300 whitespace-pre-line leading-relaxed">
              {result.interpretation}
            </div>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}