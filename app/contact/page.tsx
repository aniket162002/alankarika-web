'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import Header from '@/components/ui/Header';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header />
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4 font-playfair">
            Contact <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Us</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            We’d love to hear from you! Reach out to us anytime.
          </p>
        </motion.div>
        <motion.div
          className="w-full max-w-xl grid grid-cols-1 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center gap-4 bg-white rounded-lg shadow p-6">
            <Phone className="w-8 h-8 text-green-600" />
            <div>
              <div className="text-lg font-semibold text-gray-900">Phone</div>
              <div className="text-gray-700">+91 9769432565</div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white rounded-lg shadow p-6">
            <Mail className="w-8 h-8 text-blue-600" />
            <div>
              <div className="text-lg font-semibold text-gray-900">Email</div>
              <div className="text-gray-700">akrutiutekar@gmail.com</div>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white rounded-lg shadow p-6">
            <MapPin className="w-8 h-8 text-red-600" />
            <div>
              <div className="text-lg font-semibold text-gray-900">Store Address</div>
              <div className="text-gray-700">Kharegoan, Thane, Mumbai</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}