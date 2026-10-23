import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import CityLeadForm from "@/app/components/CityLeadForm";
import { unstable_noStore as noStore } from "next/cache";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  noStore(); // Prerender caching conflict ko rokne ke liye
  const resolvedParams = await params;
  const { data: city } = await supabase
    .from("rowdata")
    .select("*")
    .eq("slug", resolvedParams.slug.toLowerCase())
    .single();

  if (!city) return { title: "Page Not Found" };

  const cityName = city.city_name;
  const serviceName = city.service_name || "Software Development Agency";

  return {
    title: city.custom_title || `Best ${serviceName} in ${cityName} | Top Rated Agency`,
    description: city.custom_description || `Looking for top-tier ${serviceName} in ${cityName}? We build scalable, high-performance digital solutions tailored for local businesses. Get a free quote today!`,
  };
}

export default async function CityLandingPage({ params }: Props) {
  noStore(); // Prerender caching conflict ko rokne ke liye
  const resolvedParams = await params;
  
  const { data: city, error } = await supabase
    .from("rowdata")
    .select("*")
    .eq("slug", resolvedParams.slug.toLowerCase())
    .single();

  if (error || !city) {
    notFound();
  }

  const cityName = city.city_name;
  const serviceName = city.service_name || "Software Development Agency";

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `${serviceName} in ${cityName}`,
    "description": `Leading ${serviceName} providing scalable web and software engineering services in ${cityName}.`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": cityName,
      "addressCountry": "IN"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "142"
    },
    "priceRange": "₹₹₹"
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <main className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
        
        <div className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 py-24 px-6 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto space-y-6 relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
              #1 Rated {serviceName} in {cityName}
            </span>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Scale Your Business with Top {serviceName} in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200">{cityName}</span>
            </h1>

            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
              Empowering enterprises and startups in {cityName} with ultra-fast web development, custom software architectures, and automated growth engines.
            </p>

            <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
              <CityLeadForm cityName={cityName} serviceName={serviceName} />
              
              <a
                href="#features"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl border border-slate-700 transition"
              >
                Explore Capabilities ↓
              </a>
            </div>
          </div>
        </div>

        <section className="bg-slate-950/60 border-b border-slate-800/80 py-8 px-6">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">99.9%</div>
              <div className="text-xs text-slate-400 mt-0.5">Uptime SLA</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">4.9 ★</div>
              <div className="text-xs text-slate-400 mt-0.5">Customer Rating in {cityName}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">150+</div>
              <div className="text-xs text-slate-400 mt-0.5">Projects Delivered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">&lt; 24 hrs</div>
              <div className="text-xs text-slate-400 mt-0.5">Rapid Onboarding</div>
            </div>
          </div>
        </section>

        <section id="features" className="max-w-5xl mx-auto py-20 px-6 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Why Businesses in {cityName} Choose Us</h2>
            <p className="text-slate-400 text-sm">Tailored digital engineering built specifically for local market dominance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4">⚡</div>
              <h3 className="text-lg font-bold text-white mb-2">High-Speed Performance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Lightning-fast Next.js architecture ensuring Core Web Vitals optimization and instant page loading.</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg mb-4">🛡️</div>
              <h3 className="text-lg font-bold text-white mb-2">Enterprise Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Bank-grade data protection and Supabase PostgreSQL encryption to keep your client records safe.</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">📈</div>
              <h3 className="text-lg font-bold text-white mb-2">pSEO Dominance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Automated programmatic indexability engineered to capture high-intent local search traffic in {cityName}.</p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-indigo-900/40 via-slate-900 to-purple-900/40 border-t border-slate-800 py-16 px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to transform your {cityName} presence?</h2>
            <p className="text-xs sm:text-sm text-slate-400">Get a custom quote within 2 hours. No obligation required.</p>
            <div className="pt-2">
              <CityLeadForm cityName={cityName} serviceName={serviceName} />
            </div>
          </div>
        </section>

        <footer className="border-t border-slate-800/60 py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {serviceName} • Operating in {cityName} & Nationwide
        </footer>

      </main>
    </>
  );
}