"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CountdownTimer({ endTime, title, description }: { endTime: string; title?: string; description?: string }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [finished, setFinished] = useState(false);

  function getTimeLeft() {
    const end = new Date(endTime).getTime();
    const now = Date.now();
    const diff = Math.max(0, end - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds, total: diff };
  }

  useEffect(() => {
    if (timeLeft.total <= 0) {
      setFinished(true);
      return;
    }
    const interval = setInterval(() => {
      const t = getTimeLeft();
      setTimeLeft(t);
      if (t.total <= 0) {
        setFinished(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [endTime]);

  return (
    <div className="w-full max-w-xl mx-auto bg-white/80 rounded-2xl shadow-lg p-8 flex flex-col items-center luxury-timer">
      {title && <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{title}</h2>}
      {description && <p className="text-gray-600 mb-4 text-center">{description}</p>}
      <AnimatePresence mode="wait">
        {!finished ? (
          <motion.div
            key="timer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex gap-4 text-center"
          >
            <TimeBox label="Days" value={timeLeft.days} />
            <span className="text-3xl font-bold text-amber-500">:</span>
            <TimeBox label="Hours" value={timeLeft.hours} />
            <span className="text-3xl font-bold text-amber-500">:</span>
            <TimeBox label="Minutes" value={timeLeft.minutes} />
            <span className="text-3xl font-bold text-amber-500">:</span>
            <TimeBox label="Seconds" value={timeLeft.seconds} />
          </motion.div>
        ) : (
          <motion.div
            key="finished"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-green-600 mt-4"
          >
            Sale Ended!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TimeBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-4xl font-mono font-bold text-gray-900 bg-gradient-to-r from-amber-200 to-orange-200 px-4 py-2 rounded-xl shadow-inner">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs text-gray-500 mt-1">{label}</span>
    </div>
  );
} 