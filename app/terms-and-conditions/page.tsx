'use client';
import Header from '@/components/ui/Header';
export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-amber-700">Terms & Conditions</h1>
        <div className="prose bg-white rounded-xl shadow p-6">
          <p>By using our website and making a purchase, you agree to our policies. All sales are final. Please review product details before ordering. For questions, contact us at alankarikaa@gmail.com.</p>
        </div>
      </div>
    </div>
  );
} 