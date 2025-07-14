"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/cart/CartProvider";
import { supabase } from "@/lib/supabase";
import Link from 'next/link';

const baseTypes = [
  { label: "Ring", value: "ring" },
  { label: "Necklace", value: "necklace" },
  { label: "Bangle", value: "bangle" },
  { label: "Earring", value: "earring" },
  { label: "Pendant", value: "pendant" },
];
const stones = [
  { label: "Diamond", value: "diamond" },
  { label: "Ruby", value: "ruby" },
  { label: "Emerald", value: "emerald" },
  { label: "Sapphire", value: "sapphire" },
  { label: "Pearl", value: "pearl" },
];

export default function CustomBuilderPage() {
  const [materials, setMaterials] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    baseType: "",
    material: "",
    stone: "",
    engraving: "",
  });
  const { addToCart } = useCart();
  const [preview, setPreview] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchMaterials = async () => {
      const { data, error } = await supabase.from("materials").select("name, slug");
      if (!error && data) {
        setMaterials(data.map((m: any) => ({ label: m.name, value: m.slug })));
      }
      setLoading(false);
    };
    fetchMaterials();
  }, []);

  // Simple preview (could be replaced with SVG or image generation)
  useEffect(() => {
    setPreview(
      `Custom ${form.baseType || "Jewelry"} in ${form.material || "[Material]"} with ${form.stone || "[Stone]"}${form.engraving ? ", Engraving: '" + form.engraving + "'" : ""}`
    );
  }, [form]);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setShowPreview(true);
  };

  const handleStartOver = () => {
    setForm({ baseType: "", material: "", stone: "", engraving: "" });
    setStep(0);
    setShowPreview(false);
  };

  const whatsappNumber = "9167261572";
  const whatsappMessage = encodeURIComponent(
    `Hello! I'm interested in a custom ${form.baseType}.
Material: ${form.material}
Stone: ${form.stone}${form.engraving ? `\nEngraving: ${form.engraving}` : ""}\nCould you please provide pricing and options?`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  if (loading) return <div className="p-8 text-center">Loading options...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex flex-col items-center justify-center py-12">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle>Custom Jewelry Builder</CardTitle>
        </CardHeader>
        <CardContent>
          {showPreview ? (
            <div className="flex flex-col items-center gap-6 py-8">
              <div className="text-2xl font-semibold text-amber-700 mb-2">Your Custom Design</div>
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg p-6 w-full text-center shadow-inner">
                <div className="text-lg font-bold mb-2">{`Custom ${form.baseType}`}</div>
                <div className="text-gray-700 mb-1">Material: <span className="font-medium">{form.material}</span></div>
                <div className="text-gray-700 mb-1">Stone: <span className="font-medium">{form.stone}</span></div>
                {form.engraving && <div className="text-gray-700 mb-1">Engraving: <span className="font-medium">{form.engraving}</span></div>}
                <div className="mt-4 text-sm text-gray-500 italic">Contact us for pricing and customization options!</div>
              </div>
              <Button asChild className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-semibold shadow-lg hover:from-green-600 hover:to-green-700">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  Contact on WhatsApp
                </a>
              </Button>
              <Button variant="outline" className="w-full" onClick={handleStartOver}>
                Start Over
              </Button>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center text-lg font-medium">{preview}</div>
              <div className="space-y-6">
                {step === 0 && (
                  <div>
                    <label className="block mb-2 font-medium">Choose Base Type</label>
                    <div className="flex flex-wrap gap-2">
                      {baseTypes.map((b) => (
                        <Button key={b.value} variant={form.baseType === b.value ? "default" : "outline"} onClick={() => handleChange("baseType", b.value)}>
                          {b.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                {step === 1 && (
                  <div>
                    <label className="block mb-2 font-medium">Choose Material</label>
                    <div className="flex flex-wrap gap-2">
                      {materials.map((m) => (
                        <Button key={m.value} variant={form.material === m.value ? "default" : "outline"} onClick={() => handleChange("material", m.value)}>
                          {m.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                {step === 2 && (
                  <div>
                    <label className="block mb-2 font-medium">Choose Stone</label>
                    <div className="flex flex-wrap gap-2">
                      {stones.map((s) => (
                        <Button key={s.value} variant={form.stone === s.value ? "default" : "outline"} onClick={() => handleChange("stone", s.value)}>
                          {s.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                {step === 3 && (
                  <div>
                    <label className="block mb-2 font-medium">Engraving (optional)</label>
                    <Input
                      placeholder="Enter engraving text"
                      value={form.engraving}
                      onChange={(e) => handleChange("engraving", e.target.value)}
                      maxLength={32}
                    />
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2 mt-8">
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack} disabled={step === 0}>Back</Button>
                  {step < 3 ? (
                    <Button onClick={handleNext} disabled={
                      (step === 0 && !form.baseType) ||
                      (step === 1 && !form.material) ||
                      (step === 2 && !form.stone)
                    }>Next</Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={!form.baseType || !form.material || !form.stone}>Preview & Contact</Button>
                  )}
                </div>
                <Button asChild variant="secondary" className="w-full mt-2">
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 