import React from "react";
import Link from "next/link";
import {
  Shield,
  PhoneCall,
  AlertTriangle,
  LifeBuoy,
  HeartHandshake,
  CheckCircle2,
  SquareParking,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function SafetyPage() {
  const helplines = [
    { title: "National Emergency Helpline", number: "112", desc: "Police, Fire & Ambulance response" },
    { title: "Varanasi Tourist Police Cell", number: "0542-2508000", desc: "Special assistance for domestic & international travelers" },
    { title: "Varanasi Police Control Room", number: "0542-2508011", desc: "Direct city surveillance & police post dispatcher" },
    { title: "Women Helpline (Uttar Pradesh)", number: "1090", desc: "24/7 Dedicated women safety and support cell" },
    { title: "Sir Sunderlal Hospital (BHU)", number: "0542-2307500", desc: "Primary super-specialty trauma & emergency hospital" },
    { title: "Railway Inquiries & Assistance", number: "139", desc: "Cantt & Banaras railway station assistance" },
  ];

  return (
    <AuthGuard
      title="Traveler Safety & Local Guidance"
      description="Sign in or create an account to view official emergency contacts, river safety guidelines, scam prevention advisories, and police assistance booths."
    >
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-700 mb-1">
          <Shield className="w-3.5 h-3.5" />
          <span>Responsible & Safe Tourism</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 font-serif">
          Traveler Safety & Local Guidance
        </h1>
        <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed">
          Varanasi is one of the warmest and safest spiritual destinations in India. Following these
          authentic safety practices, official helplines, and cultural guidelines ensures an unforgettable journey.
        </p>
      </div>

      {/* Emergency Helplines Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 font-serif flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-amber-600" />
          <span>Official Emergency Numbers in Varanasi</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {helplines.map((item) => (
            <GlassCard key={item.title} className="p-5 space-y-2 bg-white/90 border border-amber-500/20 shadow-sm" hoverEffect={false}>
              <p className="text-xs text-slate-600 font-semibold">{item.title}</p>
              <p className="text-2xl font-bold text-emerald-700 font-mono tracking-wider">
                {item.number}
              </p>
              <p className="text-[11px] text-slate-600 font-medium">{item.desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Crucial Safety Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* River & Ghat Safety */}
        <GlassCard className="p-6 space-y-4 bg-white/90 border border-amber-500/20 shadow-sm" hoverEffect={false}>
          <div className="flex items-center gap-2.5 text-sky-800 font-serif text-lg font-bold">
            <LifeBuoy className="w-5 h-5 text-sky-600" />
            <span>River & Boating Safety</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Life Jackets:</strong> Insist on wearing standard life vests before boarding any hand boat or motor bajra on the Ganga.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Slippery Steps:</strong> The lowest stone ghat steps submerge during monsoon and high water, leaving thin algae. Avoid stepping onto wet green steps.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">River Currents:</strong> Ganga river currents can be unexpectedly swift near deep channel drops. Only bathe in designated shallow areas with chain handrails.
              </span>
            </li>
          </ul>
        </GlassCard>

        {/* Scam Awareness & Touts */}
        <GlassCard className="p-6 space-y-4 bg-white/90 border border-amber-500/20 shadow-sm" hoverEffect={false}>
          <div className="flex items-center gap-2.5 text-amber-800 font-serif text-lg font-bold">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Scam Awareness & Fare Guidelines</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Cremation Wood &quot;Donation&quot; Scams:</strong> At Manikarnika Ghat, unscrupulous touts may approach claiming to collect money for cremation wood for poor families. The official temple and police repeatedly caution travelers to politely decline.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Unsolicited &quot;Silk Guides&quot;:</strong> Auto drivers or strangers offering free rides to &quot;government silk factories&quot; usually receive 30–50% showroom commissions. For authentic handloom silk, visit registered weaver colonies like Sarai Mohana directly.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Fair Boat Rates:</strong> Shared bajra seats for Ganga Aarti are capped at ₹150–200. Negotiate upfront and pay only upon safe return to the ghat.
              </span>
            </li>
          </ul>
        </GlassCard>

        {/* Sacred Etiquette */}
        <GlassCard className="p-6 space-y-4 bg-white/90 border border-amber-500/20 shadow-sm" hoverEffect={false}>
          <div className="flex items-center gap-2.5 text-orange-800 font-serif text-lg font-bold">
            <HeartHandshake className="w-5 h-5 text-orange-600" />
            <span>Temple & Cultural Etiquette</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Footwear:</strong> Always remove shoes before stepping onto temple precincts. Free footwear holding counters exist at every major entrance.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Dress Conservatively:</strong> When entering sanctums or attending rituals, wear clothing covering shoulders and knees out of respect for religious tradition.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Resident Monkeys:</strong> Near Sankat Mochan and Durga Kund, keep food prasad packets enclosed in opaque bags and avoid aggressive direct eye contact.
              </span>
            </li>
          </ul>
        </GlassCard>

        {/* Night Travel & Valuables */}
        <GlassCard className="p-6 space-y-4 bg-white/90 border border-amber-500/20 shadow-sm" hoverEffect={false}>
          <div className="flex items-center gap-2.5 text-emerald-800 font-serif text-lg font-bold">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Valuables & Night Travel</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Crowded Corridors:</strong> Keep wallets and phones secured in zippered pockets or crossbody bags, particularly in dense corridors near Godowlia and Dashashwamedh Aarti.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Late Night Strolls:</strong> Main illuminated ghats (Assi, Dashashwamedh, Rajendra Prasad) remain vibrant and peaceful until 11:00 PM. Avoid unlit, deserted ghat stretches late at night.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Drinking Water:</strong> Stick to bottled or filtered RO water, especially while enjoying spicy street chaat.
              </span>
            </li>
          </ul>
        </GlassCard>

        {/* Vehicle Towing, No-Vehicle Zones & Parking Safety */}
        <GlassCard className="p-6 space-y-4 bg-white/90 border border-sky-500/30 shadow-sm" hoverEffect={false}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-sky-900 font-serif text-lg font-bold">
              <SquareParking className="w-5 h-5 text-sky-600" />
              <span>Vehicle Entry Restrictions & Parking Safety</span>
            </div>
            <Link
              href="/parking"
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 underline flex items-center gap-1"
            >
              <span>View 4 Verified Stands</span>
              <span>↗</span>
            </Link>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Old City No-Vehicle Corridors:</strong> Private four-wheelers are prohibited between Godowlia and Dashashwamedh, as well as Maidagin towards Chowk, between 07:00 AM and 10:00 PM.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">Wheel Clamping & Towing:</strong> Parking on road shoulders or lane corners will result in prompt wheel clamping by traffic police. Always utilize the designated multi-level facilities at Godowlia or Maidagin.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900">E-Rickshaws for the Last Mile:</strong> Park at the official municipal stands and take shared or private e-rickshaws (₹10–₹30) directly to temple gates.
              </span>
            </li>
          </ul>
        </GlassCard>
      </div>
    </div>
    </AuthGuard>
  );
}
