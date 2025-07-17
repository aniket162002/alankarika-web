'use client';
import Header from '@/components/ui/Header';
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-amber-700">Privacy Policy</h1>
        <div className="prose bg-white rounded-xl shadow p-6">
          <p>Your privacy is important to us. We only use your information to process orders and improve your experience. We do not share your data with third parties except as required to fulfill your order or by law.</p>
        </div>
      </div>
    </div>
  );
} 