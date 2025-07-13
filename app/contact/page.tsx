'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Instagram, Facebook } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import Image from 'next/image';
import { CartIcon } from '@/components/ui/CartIcon';
import Header from '@/components/ui/Header';

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Our Store",
    details: [
      "123 Jewelry Street, Karol Bagh",
      "New Delhi - 110005, India"
    ],
    color: "text-red-600"
  },
  {
    icon: Phone,
    title: "Call Us",
    details: [
      "+91 97694 32565",
      "+91 11 2345 6789"
    ],
    color: "text-green-600"
  },
  {
    icon: Mail,
    title: "Email Us",
    details: [
      "info@alankaarika.com",
      "support@alankaarika.com"
    ],
    color: "text-blue-600"
  },
  {
    icon: Clock,
    title: "Store Hours",
    details: [
      "Mon - Sat: 10:00 AM - 8:00 PM",
      "Sunday: 11:00 AM - 6:00 PM"
    ],
    color: "text-purple-600"
  }
];

const faqs = [
  {
    question: "Do you provide certificates for gold jewelry?",
    answer: "Yes, all our gold jewelry comes with proper hallmark certification and quality assurance certificates."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 7-day return policy for unused items in original condition. Custom-made pieces are non-returnable."
  },
  {
    question: "Do you offer jewelry repair services?",
    answer: "Yes, we provide comprehensive jewelry repair and maintenance services by our skilled craftsmen."
  },
  {
    question: "Can I customize jewelry designs?",
    answer: "Absolutely! We specialize in custom jewelry design. Share your ideas and we'll create something unique for you."
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const openWhatsApp = () => {
    const phoneNumber = "9769432565";
    const message = encodeURIComponent("Hello! I&apos;d like to know more about your jewelry collections.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header />

      <div className="container mx-auto px-2 sm:px-4 py-8">
        {/* Header Section */}
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
            We&apos;re here to help you find the perfect jewelry piece
          </p>
        </motion.div>

        {/* Contact Info Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {contactInfo.map((info, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${info.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                  <info.icon className={`w-8 h-8 ${info.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                ))}
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Card className="p-4 sm:p-8 w-full">
              <CardHeader className="p-0 mb-6">
                <CardTitle className="text-2xl font-bold text-gray-900">Send us a Message</CardTitle>
                <p className="text-gray-600">Fill out the form below and we&apos;ll get back to you within 24 hours.</p>
              </CardHeader>
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData({...formData, subject: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="custom">Custom Design</SelectItem>
                        <SelectItem value="repair">Jewelry Repair</SelectItem>
                        <SelectItem value="order">Order Status</SelectItem>
                        <SelectItem value="return">Return/Exchange</SelectItem>
                        <SelectItem value="wholesale">Wholesale Inquiry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help you..."
                      className="min-h-32"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Map and Additional Info */}
          <motion.div
            className="w-full space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Map Placeholder */}
            <Card className="p-4 sm:p-6 w-full">
              <CardHeader className="p-0 mb-4">
                <CardTitle>Find Our Store</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2" />
                    <p>Interactive Map</p>
                    <p className="text-sm">123 Jewelry Street, Karol Bagh, New Delhi</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" className="flex-1 w-full sm:w-auto">
                    Get Directions
                  </Button>
                  <Button 
                    className="flex-1 w-full sm:w-auto bg-green-500 hover:bg-green-600"
                    onClick={openWhatsApp}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="p-4 sm:p-6 w-full">
              <CardHeader className="p-0 mb-4">
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-gray-600 mb-4">Stay connected for latest collections and offers</p>
                <div className="flex gap-4">
                  <Button variant="outline" size="icon" className="hover:bg-pink-50">
                    <Instagram className="w-5 h-5 text-pink-600" />
                  </Button>
                  <Button variant="outline" size="icon" className="hover:bg-blue-50">
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </Button>
                  <Button variant="outline" size="icon" className="hover:bg-red-50">
                    <span className="text-red-600 font-bold">P</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="p-4 sm:p-6 w-full">
              <CardHeader className="p-0 mb-4">
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}