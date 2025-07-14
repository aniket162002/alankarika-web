"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Mail, Phone } from "lucide-react";

const WHATSAPP_NUMBER = "9769432565";
const EMAIL = "akrutiutekar@gmail.com";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed z-[99999] bottom-6 right-6 md:bottom-8 md:right-8 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="bg-white/95 shadow-xl rounded-2xl p-4 mb-2 w-64 flex flex-col gap-3 border border-amber-100"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg text-amber-700">Support</span>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="hover:bg-amber-100 rounded-full p-1">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition"
              onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Hi! I need support.`, '_blank')}
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp Chat
            </button>
            <a
              href={`mailto:${EMAIL}?subject=Support%20Request`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition"
            >
              <Mail className="w-5 h-5" /> Email Support
            </a>
            <div className="text-xs text-gray-400 mt-2">We usually respond within a few minutes!</div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        key="chat-bubble"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg rounded-full p-4 flex items-center justify-center hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400"
        aria-label="Open chat support"
        onClick={() => setOpen((v) => !v)}
        style={{ boxShadow: "0 4px 24px 0 rgba(251,191,36,0.15)" }}
      >
        <MessageCircle className="w-7 h-7 text-white" />
      </motion.button>
    </div>
  );
} 