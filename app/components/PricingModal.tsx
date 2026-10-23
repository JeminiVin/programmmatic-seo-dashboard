"use client";

import { useState, useEffect } from "react";

export default function PricingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  // Load Razorpay checkout script dynamically
  useEffect(() => {
    if (isOpen) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRazorpayPayment = async (planName: string, amount: number) => {
    setLoading(true);
    try {
      // Step 1: Call backend API to create Razorpay order
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, planName }),
      });

      const order = await res.json();

      if (order.error) {
        alert(order.error);
        setLoading(false);
        return;
      }

      // Step 2: Open Razorpay Checkout Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "pSEO SaaS Engine",
        description: `Subscription for ${planName}`,
        order_id: order.id,
        handler: function (response: any) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
          setLoading(false);
          onClose();
          // Yahan aap success hone par user ka plan database me update kar sakte hain
        },
        prefill: {
          name: "Vinayak Jaimini",
          email: "vinayak@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const paymentWindow = new (window as any).Razorpay(options);
      paymentWindow.open();
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Something went wrong during payment initialization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl border border-slate-200 relative">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">Upgrade Your pSEO Engine</h3>
            <p className="text-xs text-slate-500 mt-1">Choose a plan to generate unlimited pages and scale your SEO traffic.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-xl">✕</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Starter Tier */}
          <div className="border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-indigo-500 transition">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Starter Tier</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">₹2,499 <span className="text-xs font-normal text-slate-500">/month</span></div>
              <p className="text-xs text-slate-500 mt-2">Perfect for freelancers and small local service providers.</p>
              <ul className="text-xs text-slate-600 space-y-2 mt-4">
                <li>✓ Up to 1,000 pSEO Pages</li>
                <li>✓ CSV to Supabase Sync</li>
                <li>✓ XML Sitemap Auto-Index</li>
              </ul>
            </div>
            <button
              onClick={() => handleRazorpayPayment("Starter Tier", 2499)}
              disabled={loading}
              className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition shadow-md disabled:opacity-50"
            >
              {loading ? "Processing..." : "Get Started (₹2,499/mo)"}
            </button>
          </div>

          {/* Growth Tier */}
          <div className="border-2 border-indigo-600 bg-indigo-50/30 rounded-xl p-6 flex flex-col justify-between shadow-sm">
            <div>
              <span className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px] font-bold uppercase">Most Popular</span>
              <div className="text-3xl font-extrabold text-slate-900 mt-2">₹6,499 <span className="text-xs font-normal text-slate-500">/month</span></div>
              <p className="text-xs text-slate-500 mt-2">Designed for growing digital marketing agencies.</p>
              <ul className="text-xs text-slate-600 space-y-2 mt-4">
                <li>✓ Unlimited pSEO Pages</li>
                <li>✓ Advanced JSON-LD Schemas</li>
                <li>✓ Priority Google Indexing</li>
                <li>✓ Custom Domain Support</li>
              </ul>
            </div>
            <button
              onClick={() => handleRazorpayPayment("Growth Tier", 6499)}
              disabled={loading}
              className="mt-6 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition shadow-md disabled:opacity-50"
            >
              {loading ? "Processing..." : "Upgrade to Growth (₹6,499/mo)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}