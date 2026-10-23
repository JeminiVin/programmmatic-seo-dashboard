"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import CsvUploader from "./components/CsvUploader";
import PricingModal from "./components/PricingModal";

type CityRow = {
  slug: string;
  city_name: string;
  service_name?: string;
  custom_title?: string;
  custom_description?: string;
};

type LeadRow = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  city: string;
  service: string;
};

export default function Dashboard() {
  const [cities, setCities] = useState<CityRow[]>([]);
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

  // Supabase se city data aur leads fetch karne ka function
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch City Landing Pages
      const { data: cityData, error: cityError } = await supabase
        .from("rowdata")
        .select("*")
        .order("created_at", { ascending: false });

      if (cityError) console.error("Error fetching cities:", cityError.message);
      else if (cityData) setCities(cityData);

      // 2. Fetch Captured Leads
      const { data: leadData, error: leadError } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (leadError) console.error("Error fetching leads:", leadError.message);
      else if (leadData) setLeads(leadData);

    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPages = cities.length;
  const maxFreeLimit = 100;
  const usagePercentage = Math.min(Math.round((totalPages / maxFreeLimit) * 100), 100);

  const handleDataLoaded = () => {
    fetchData();
  };

  return (
    <div className="flex min-h-screen bg-[#EAEFF5] text-slate-800 font-sans">
      
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-64 bg-[#2C2B38] text-slate-300 flex flex-col shrink-0 shadow-2xl">
        <div className="p-6 flex flex-col items-center border-b border-slate-700/50">
          <div className="w-20 h-20 rounded-full bg-slate-100 border-4 border-indigo-500 flex items-center justify-center text-2xl font-bold text-slate-800 shadow-md mb-3">
            VJ
          </div>
          <h2 className="font-bold text-white text-base tracking-wide">Vinayak Jaimini</h2>
          <span className="text-xs text-indigo-400 font-medium mt-0.5">Free Tier Plan</span>
          
          <button
            onClick={() => setIsPricingOpen(true)}
            className="mt-3 w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg text-xs font-bold shadow-md transition transform active:scale-95"
          >
            ⚡ Upgrade Plan
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 text-sm font-medium">
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold shadow-md">
            <span>🏠</span> Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700/50 text-slate-300 transition">
            <span>📊</span> Dynamic Routes
          </a>
          <a href="/sitemap.xml" target="_blank" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700/50 text-slate-300 transition">
            <span>🗺️</span> XML Sitemap
          </a>
          <a href="#leads-section" className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-slate-700/50 text-slate-300 transition">
            <span>📥</span> Leads Captured ({leads.length})
          </a>
        </nav>

        <div className="p-4 border-t border-slate-700/50 text-xs text-slate-400 text-center">
          Programmatic SEO Engine v2.0
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-[#BAC4D0] px-8 py-4 flex justify-between items-center border-b border-slate-300/80 shadow-sm">
          <div>
            <div className="text-sm font-bold text-slate-700">
              Programmatic SEO / <span className="text-slate-900">Dashboard</span>
            </div>
            <p className="text-[11px] text-slate-600">Automated page generation & lead monetization pipeline</p>
          </div>
          
          <div className="flex items-center gap-3">
            <CsvUploader onDataLoaded={handleDataLoaded} />
            <a href="/sitemap.xml" target="_blank" className="px-3.5 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-900 transition flex items-center gap-1.5 shadow-sm">
              <span>Sitemap XML</span> →
            </a>
          </div>
        </header>

        {/* Dashboard Grid Container */}
        <main className="p-8 space-y-6">
          
          {/* TOP ROW: 4 KEY METRICS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase">Pages Generated</span>
                <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md text-xs">📄</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-800 mt-3">{loading ? "..." : totalPages}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">● Supabase Live Sync Active</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase">Est. Monthly Traffic</span>
                <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md text-xs">📈</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-800 mt-3">{totalPages * 450}+</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">Based on ~450 visits/page avg.</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase">Leads Captured</span>
                <span className="p-1.5 bg-purple-50 text-purple-600 rounded-md text-xs">🎯</span>
              </div>
              <div className="text-3xl font-extrabold text-indigo-600 mt-3">{leads.length}</div>
              <div className="text-[11px] text-emerald-600 font-medium mt-1">Monetization Ready</div>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400 uppercase">Sitemap Status</span>
                <span className="p-1.5 bg-blue-50 text-blue-600 rounded-md text-xs">🗺️</span>
              </div>
              <div className="text-3xl font-extrabold text-slate-800 mt-3">Synced</div>
              <div className="text-[11px] text-slate-500 font-medium mt-1">Auto-indexing ready</div>
            </div>
          </div>

          {/* NEW SECTION: CAPTURED LEADS VIEWER TABLE */}
          <div id="leads-section" className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Recent Customer Leads (Monetization Pipeline)</h3>
                <p className="text-xs text-slate-400">Captured directly from dynamic city landing page quote forms</p>
              </div>
              <span className="text-xs bg-purple-50 text-purple-600 font-semibold px-2.5 py-1 rounded-full border border-purple-100">
                {leads.length} Total Leads
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-sm text-slate-400">Loading leads from Supabase...</div>
            ) : leads.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">No leads captured yet. Test your city landing page quote form!</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">Client Name</th>
                      <th className="py-3 px-4">Phone Number</th>
                      <th className="py-3 px-4">Target City</th>
                      <th className="py-3 px-4">Service Required</th>
                      <th className="py-3 px-4 text-right">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-semibold text-slate-800">{lead.name}</td>
                        <td className="py-3 px-4 font-mono text-indigo-600 font-medium">{lead.phone}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">{lead.city}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{lead.service}</td>
                        <td className="py-3 px-4 text-right text-slate-400">
                          {new Date(lead.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ACTIVE DYNAMIC CITY ROUTES TABLE */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Generated City Landing Pages</h3>
                <p className="text-xs text-slate-400">Live pSEO routes dynamically served from Supabase</p>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-600 font-semibold px-2.5 py-1 rounded-full border border-indigo-100">
                {cities.length} Active Pages
              </span>
            </div>

            {loading ? (
              <div className="py-8 text-center text-sm text-slate-400">Loading routes from Supabase...</div>
            ) : cities.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">No pages generated yet. Upload a CSV above!</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                    <tr>
                      <th className="py-3 px-4">City / Service</th>
                      <th className="py-3 px-4">Dynamic Route</th>
                      <th className="py-3 px-4">Indexing Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cities.map((city, idx) => (
                      <tr key={`${city.slug}-${idx}`} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {city.city_name}
                          <span className="block text-[10px] text-slate-400 font-normal">{city.service_name || "Software Agency"}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-indigo-600">/cities/{city.slug}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Ready for Indexing
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/cities/${city.slug}`}
                            target="_blank"
                            className="px-3 py-1 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded text-xs font-semibold text-indigo-600 transition inline-block"
                          >
                            Visit Page ↗
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
    </div>
  );
}