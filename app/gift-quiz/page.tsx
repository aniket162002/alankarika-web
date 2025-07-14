"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from 'next/link';

const QUESTIONS = [
  {
    question: "Who is the gift for?",
    options: ["Wife", "Mother", "Sister", "Friend", "Myself"],
  },
  {
    question: "What is the occasion?",
    options: ["Birthday", "Anniversary", "Wedding", "Festive", "Just Because"],
  },
  {
    question: "Preferred jewelry type?",
    options: ["Necklace", "Earrings", "Ring", "Bangle", "Pendant"],
  },
  {
    question: "Preferred style?",
    options: ["Traditional", "Modern", "Minimalist", "Statement", "Classic"],
  },
];

const RECOMMENDATIONS = [
  {
    type: "Necklace",
    title: "Elegant Kundan Necklace",
    description: "A timeless piece perfect for special occasions.",
    image: "/collections/Necklace/ChatGPT Image Jul 12, 2025, 03_42_52 PM.png",
    link: "/shop?category=Necklace",
  },
  {
    type: "Earrings",
    title: "Meenakari Jhumka Earrings",
    description: "Vibrant and festive, ideal for celebrations.",
    image: "/collections/earrings/Copilot_20250712_155902.png",
    link: "/shop?category=Earrings",
  },
  {
    type: "Ring",
    title: "Diamond Solitaire Ring",
    description: "A classic choice for anniversaries and milestones.",
    image: "/collections/rings/solitaire.png",
    link: "/shop?category=Ring",
  },
  {
    type: "Bangle",
    title: "Gold Plated Bangles",
    description: "Traditional bangles for a touch of elegance.",
    image: "/collections/Bangles/Copilot_20250712_161807.png",
    link: "/shop?category=Bangle",
  },
  {
    type: "Pendant",
    title: "Minimalist Gemstone Pendant",
    description: "A modern piece for everyday wear.",
    image: "/collections/Necklace/ChatGPT Image Jul 12, 2025, 10_27_07 PM.png",
    link: "/shop?category=Pendant",
  },
];

export default function GiftQuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const router = useRouter();

  const handleOption = (option: string) => {
    setAnswers((prev) => [...prev, option]);
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers([]);
    setShowResult(false);
  };

  // Simple recommendation logic based on preferred jewelry type
  const recommended = RECOMMENDATIONS.find(
    (rec) => rec.type === answers[2]
  ) || RECOMMENDATIONS[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex flex-col items-center justify-center py-12">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle>Gift Finder Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="text-xl font-semibold text-center mb-4">
                  {QUESTIONS[step].question}
                </div>
                <div className="flex flex-col gap-4">
                  {QUESTIONS[step].options.map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      className="w-full text-lg"
                      onClick={() => handleOption(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={handleRestart} disabled={step === 0}>Restart</Button>
                  <Button variant="outline" onClick={() => router.push("/shop")}>Skip</Button>
                </div>
                <Button asChild variant="secondary" className="w-full mt-2">
                  <Link href="/">Back to Home</Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.5 }}
                className="space-y-8 text-center"
              >
                <div className="text-2xl font-bold mb-2">Recommended Gift</div>
                <img src={recommended.image} alt={recommended.title} className="mx-auto w-40 h-40 object-cover rounded-lg shadow-lg mb-4" />
                <div className="text-xl font-semibold">{recommended.title}</div>
                <div className="text-gray-600 mb-4">{recommended.description}</div>
                <Button className="w-full" onClick={() => router.push(recommended.link)}>View in Shop</Button>
                <Button variant="outline" className="w-full mt-2" onClick={handleRestart}>Take Again</Button>
                <Button asChild variant="secondary" className="w-full mt-2">
                  <Link href="/">Back to Home</Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
} 