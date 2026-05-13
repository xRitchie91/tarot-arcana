"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ReadingResult = {
  cards: string[];
  interpretation: string;
};

type Star = { x: number; y: number; size: number; duration: number };

const loadingMessages = [
  "Shuffling fate...",
  "Consulting the unseen...",
  "Reading symbols...",
  "Interpreting patterns...",
];

export default function Home() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"random" | "ai">("random");
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 6 + 3,
    }));
    setStars(generated);
  }, []);

  const loadingText = useMemo(() => {
    return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  }, [loading]);

  async function drawCards() {
    try {
      setLoading(true);
      setError("");
      setResult(null);
      setRevealed(false);

      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, mode }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setResult(data);

      setTimeout(() => setRevealed(true), 700);
    } catch {
      setError("The cards are quiet right now. Try again soon.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#05030a] text-white relative overflow-hidden px-4 py-10 md:px-8 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,.18),transparent_35%),radial-gradient(circle_at_center,rgba(251,191,36,.08),transparent_25%)]" />

      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: star.duration, delay: i * 0.08 }}
        />
      ))}

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="relative z-10 w-full max-w-5xl rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-3xl shadow-[0_0_80px_rgba(168,85,247,0.15)] p-5 md:p-10"
      >
        <header className="text-center space-y-4 mb-10">
          <div className="text-xs tracking-[0.4em] uppercase text-purple-300">✦ Portfolio Experience ✦</div>
          <h1 className="text-4xl md:text-6xl font-extralight tracking-[0.32em] bg-gradient-to-r from-white via-purple-200 to-amber-200 bg-clip-text text-transparent">
            TAROT ARCANA
          </h1>
          <div className="h-px w-40 bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto" />
          <p className="text-zinc-400 max-w-xl mx-auto">
            Immersive tarot reading experience built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and dynamic API responses.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode("random")}
                className={`rounded-2xl py-3 transition ${mode === "random" ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 shadow-[0_0_30px_rgba(168,85,247,.45)]" : "bg-zinc-900 hover:bg-zinc-800"}`}
              >
                Random Reading
              </button>
              <button disabled className="rounded-2xl py-3 bg-zinc-900 opacity-50 cursor-not-allowed">
                AI Reader Soon
              </button>
            </div>

            <textarea
              rows={5}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What guidance do you seek?"
              className="w-full rounded-2xl bg-black/40 border border-white/10 p-4 resize-none outline-none focus:border-purple-500"
            />

            <button
              onClick={drawCards}
              disabled={!question || loading}
              className="w-full rounded-2xl py-4 font-medium bg-gradient-to-r from-purple-600 via-fuchsia-500 to-amber-400 hover:scale-[1.02] transition disabled:opacity-50 shadow-[0_0_35px_rgba(217,70,239,.35)]"
            >
              {loading ? loadingText : "Draw Cards"}
            </button>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                ⚠️ {error}
              </div>
            )}

            {!result && !loading && (
              <div className="rounded-2xl border border-white/10 bg-black/25 p-5 text-zinc-300 backdrop-blur-xl">
                Ask a question to begin your reading. Three cards will reveal the energy surrounding your situation.
              </div>
            )}
          </div>

          <div>
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-3xl border border-white/10 bg-black/25 p-8 text-center space-y-4 backdrop-blur-xl"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="text-4xl"
                  >
                    ✨
                  </motion.div>
                  <p className="text-zinc-300">{loadingText}</p>
                </motion.div>
              ) : result ? (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                  <div className="grid grid-cols-3 gap-3">
                    {result.cards.map((card, index) => (
                      <motion.div
                        key={card + index}
                        whileHover={{ y: -6, scale: 1.03, rotateZ: index % 2 === 0 ? 1 : -1 }}
                        className="h-44"
                        style={{ perspective: 1000 }}
                      >
                        <motion.div
                          initial={{ rotateY: 180 }}
                          animate={{ rotateY: revealed ? 0 : 180 }}
                          transition={{ delay: index * 0.35, duration: 0.8 }}
                          style={{ transformStyle: "preserve-3d", width: "100%", height: "100%", position: "relative" }}
                        >
                          <div
                            className="absolute inset-0 rounded-2xl border border-amber-300/30 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black flex items-center justify-center"
                            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                          >
                            ✦
                          </div>
                          <div
                            className="absolute inset-0 rounded-2xl border border-amber-300/30 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-3 flex items-end"
                            style={{ backfaceVisibility: "hidden" }}
                          >
                            <span className="text-sm text-purple-200 tracking-wide">{card}</span>
                          </div>
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 10 }}
                    transition={{ delay: 1.2 }}
                    className="rounded-2xl border border-white/10 bg-black/25 p-5 text-zinc-200 leading-relaxed whitespace-pre-line backdrop-blur-xl"
                  >
                    {result.interpretation}
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>

        <footer className="mt-10 pt-6 border-t border-white/10 text-center text-xs tracking-[0.25em] text-zinc-500 uppercase">
          Next.js • TypeScript • Tailwind • Framer Motion
        </footer>
      </motion.section>
    </main>
  );
}
