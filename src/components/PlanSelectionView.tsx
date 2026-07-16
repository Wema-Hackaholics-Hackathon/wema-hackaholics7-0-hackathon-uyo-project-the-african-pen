/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Check, X, CreditCard, ShieldCheck, HelpCircle, Loader2, 
  Smartphone, ArrowRight, Share2, Sparkles, CheckCircle2, Copy, Globe, Info, Lock,
  AlertTriangle, RefreshCw, Mail, Headphones, MessageSquare, Target, Users, ChevronDown, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PlanSelectionViewProps {
  onSelectFreeTrial: () => void;
  onSelectPremiumSuccess: () => void;
  userFullName?: string;
}

type Currency = "NGN" | "XOF" | "USD";

interface PriceDetail {
  currencySymbol: string;
  freePrice: string;
  premiumPrice: string;
  premiumLabel: string;
  suffix: string;
}

const PRICING_DATA: Record<Currency, PriceDetail> = {
  NGN: {
    currencySymbol: "₦",
    freePrice: "0",
    premiumPrice: "5,000",
    premiumLabel: "₦5,000",
    suffix: "par cohorte"
  },
  XOF: {
    currencySymbol: "FCFA",
    freePrice: "0",
    premiumPrice: "3 500",
    premiumLabel: "3 500 FCFA",
    suffix: "par cohorte"
  },
  USD: {
    currencySymbol: "$",
    freePrice: "0",
    premiumPrice: "6",
    premiumLabel: "$6",
    suffix: "per cohort"
  }
};

const COUNTRIES = [
  { code: "NG", name: "Nigeria 🇳🇬", currency: "NGN", methods: ["ALAT by Wema Bank", "Card (Visa/Mastercard)", "Bank Transfer"] },
  { code: "SN", name: "Sénégal 🇸🇳", currency: "XOF", methods: ["Wave", "Orange Money", "Card (Visa/Mastercard)"] },
  { code: "CI", name: "Côte d'Ivoire 🇨🇮", currency: "XOF", methods: ["Wave", "Orange Money", "MTN MoMo"] },
  { code: "CM", name: "Cameroun 🇨🇲", currency: "XOF", methods: ["MTN MoMo", "Orange Money"] },
  { code: "INT", name: "International (Other)", currency: "USD", methods: ["Credit/Debit Card", "PayPal"] }
];

export default function PlanSelectionView({ 
  onSelectFreeTrial, 
  onSelectPremiumSuccess,
  userFullName = "Amara" 
}: PlanSelectionViewProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("NGN");
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<number>(1); // 1: Country & Method, 2: Info form, 3: Processing, 4: OTP Verification, 5: Success, 6: Failure
  const [checkoutCountry, setCheckoutCountry] = useState(COUNTRIES[0]);
  const [checkoutMethod, setCheckoutMethod] = useState(COUNTRIES[0].methods[0]);
  const [showDetailedComparison, setShowDetailedComparison] = useState(false);
  
  // Checkout Form States
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Success Checklist States
  const [checkedList, setCheckedList] = useState({
    verifyEmail: false,
    completeProfile: false,
    readyAug1st: false
  });

  // Simulated Processing Status Lines
  const [processingStatus, setProcessingStatus] = useState("Connexion au serveur bancaire sécurisé...");
  const [countdown, setCountdown] = useState(6);

  // Sync pricing selectedCurrency with country selection in checkout
  const handleCountryChange = (countryName: string) => {
    const country = COUNTRIES.find(c => c.name === countryName);
    if (country) {
      setCheckoutCountry(country);
      setCheckoutMethod(country.methods[0]);
      setSelectedCurrency(country.currency as Currency);
    }
  };

  // Run countdown when success page (step 5) is reached
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showCheckout && checkoutStep === 5 && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [showCheckout, checkoutStep, countdown]);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep(3); // Go to loading processing state

    // Simulating loading step milestones
    setTimeout(() => {
      setProcessingStatus("Demande d'autorisation de débit envoyée aux serveurs...");
    }, 1200);

    setTimeout(() => {
      setProcessingStatus("En attente de l'approbation sécurisée OTP...");
    }, 2400);

    setTimeout(() => {
      setCheckoutStep(4); // Go to OTP verification step
    }, 3600);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setOtpError(true);
      return;
    }
    setOtpError(false);
    setCheckoutStep(5); // Go to absolute Success Screen!
    setCountdown(6); // Reset redirect countdown
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText("https://laplume.africa/cohort-1");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const currentPrice = PRICING_DATA[selectedCurrency];

  // FAQ Expanded State
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const faqs = [
    {
      q: "Comment fonctionne le remboursement ?",
      a: "Si vous n'êtes pas satisfait après 14 jours d'utilisation du Pass Premium, nous vous remboursons intégralement, sans poser de questions."
    },
    {
      q: "Puis-je payer en plusieurs fois ?",
      a: "Pour cette Cohorte 1, le paiement se fait en une seule fois pour garantir le prix réduit exceptionnel de ₦5,000."
    },
    {
      q: "Le certificat est-il reconnu ?",
      a: "Oui, notre certificat atteste de votre préparation rigoureuse et de votre maîtrise des modules pédagogiques validés par nos experts."
    }
  ];

  return (
    <div className="w-full bg-[#fcfcfd] py-12 md:py-20 relative overflow-hidden" id="plan-selection">
      {/* Background Accent Gradients (French Tricolor subtle vibe) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-red-100/15 rounded-full blur-3xl translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 relative z-10 flex flex-col items-center">
        
        {/* Cohort 1 Badge */}
        <div className="inline-flex items-center gap-2 bg-[#002B5B] text-white text-[10px] md:text-xs font-bold px-4 py-2 rounded-full shadow-md mb-4 font-mono uppercase tracking-wider animate-bounce">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          Cohorte 1 — Commence le 1 Août 2025
        </div>

        {/* Title */}
        <div className="text-center max-w-2xl mb-12">
          <h1 className="font-display text-3xl md:text-5xl font-black text-[#002B5B] tracking-tight mb-3">
            Choisissez votre plan
          </h1>
          <p className="text-slate-500 text-xs md:text-sm font-semibold max-w-lg mx-auto leading-relaxed">
            Que vous souhaitiez tester l'expérience ou garantir votre réussite au WAEC, nous avons le parcours idéal pour vous.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mb-12">
          
          {/* Card 1: Cohorte d'Essai */}
          <div className="bg-white border border-slate-150 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between hover:border-slate-200 transition-all relative">
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-black text-[#002B5B]">Cohorte d'Essai</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-black text-slate-800 font-mono">₦0</span>
                  <span className="text-slate-400 text-xs font-semibold">/ 7 jours</span>
                </div>
              </div>

              <div className="h-px bg-slate-100 my-4" />

              <ul className="space-y-3.5 mb-8">
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[3] mt-0.5" />
                  <span>Accès aux 3 premières leçons</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[3] mt-0.5" />
                  <span>Quiz d'auto-évaluation basiques</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[3] mt-0.5" />
                  <span>Support communautaire</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-350">
                  <X className="w-4 h-4 text-rose-400 shrink-0 stroke-[2.5] mt-0.5" />
                  <span className="line-through">Accès illimité au 'Blitz'</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-350">
                  <X className="w-4 h-4 text-rose-400 shrink-0 stroke-[2.5] mt-0.5" />
                  <span className="line-through">Certificat officiel de réussite</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-350">
                  <X className="w-4 h-4 text-rose-400 shrink-0 stroke-[2.5] mt-0.5" />
                  <span className="line-through">Session de mentorat hebdomadaire</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onSelectFreeTrial}
              className="w-full bg-white hover:bg-slate-50 text-brand-blue font-bold text-xs py-3.5 rounded-xl border-2 border-brand-blue transition-all text-center cursor-pointer font-sans uppercase tracking-wide"
            >
              Commencer l'Essai Gratuit
            </button>
          </div>

          {/* Card 2: Le Pass Premium */}
          <div className="bg-white border-2 border-[#FFD214] rounded-3xl p-6 md:p-8 shadow-md flex flex-col justify-between relative transform hover:scale-[1.01] transition-all">
            
            {/* Populaire Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#FFD214] text-[#002B5B] text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full border-2 border-[#FFD214] shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-[#002B5B]" />
              PLUS POPULAIRE
            </div>

            <div>
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-[#002B5B]">Le Pass Premium</h3>
                  <span className="bg-blue-50 text-brand-blue text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Économisez 37%
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-slate-400 line-through text-xs font-bold font-mono">₦8,000</span>
                  <span className="text-2xl font-black text-brand-blue font-mono">₦5,000</span>
                  <span className="text-slate-400 text-[10px] font-bold">/ accès complet</span>
                </div>
              </div>

              <div className="h-px bg-slate-100 my-4" />

              <ul className="space-y-3.5 mb-8">
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                  </span>
                  <span>Accès complet à la Cohorte 1</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                  </span>
                  <span>Accès illimité au mode 'Le Blitz'</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                  </span>
                  <span>Certificat officiel La Plume Africa</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                  </span>
                  <span>Simulations d'examens illimitées</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                  </span>
                  <span>Priorité au mentorat direct</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-800">
                  <span className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                  </span>
                  <span>Support premium 24/7</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setShowCheckout(true);
                setCheckoutStep(1);
              }}
              className="w-full bg-[#002B5B] hover:bg-brand-blue-light text-white font-black text-xs py-3.5 rounded-xl transition-all text-center cursor-pointer font-sans uppercase tracking-wide flex items-center justify-center gap-1.5 shadow-md"
            >
              Passer à Premium — ₦5,000 <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Security / Info Badges Row */}
        <div className="flex flex-wrap justify-center gap-3.5 max-w-2xl mb-12 w-full">
          <div className="bg-blue-50/50 border border-blue-100/50 text-slate-600 font-semibold px-4.5 py-2.5 rounded-full text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Paiement sécurisé via ALAT</span>
          </div>
          <div className="bg-blue-50/50 border border-blue-100/50 text-slate-600 font-semibold px-4.5 py-2.5 rounded-full text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-500 stroke-[3]" />
            <span>Satisfait ou remboursé</span>
          </div>
          <div className="bg-blue-50/50 border border-blue-100/50 text-slate-600 font-semibold px-4.5 py-2.5 rounded-full text-xs flex items-center gap-2">
            <Users className="w-4 h-4 text-brand-blue" />
            <span>4,200+ étudiants inscrits</span>
          </div>
        </div>

        {/* Trigger for Detailed Comparison */}
        <button
          onClick={() => setShowDetailedComparison(!showDetailedComparison)}
          className="text-xs font-extrabold text-[#002B5B] hover:underline flex items-center gap-1 mb-8 cursor-pointer uppercase tracking-wider"
        >
          <span>Comparaison détaillée</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showDetailedComparison ? "rotate-180" : ""}`} />
        </button>

        {/* Detailed Comparison Table (Collapsible) */}
        <AnimatePresence>
          {showDetailedComparison && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-3xl overflow-hidden mb-16 border border-slate-100 rounded-2xl bg-white shadow-xs"
            >
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-slate-100 text-[#002B5B] font-bold">
                      <th className="p-4">Fonctionnalité</th>
                      <th className="p-4">Essai</th>
                      <th className="p-4">Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
                    <tr>
                      <td className="p-4 font-bold text-slate-800">Durée d'accès</td>
                      <td className="p-4">7 Jours</td>
                      <td className="p-4 text-[#002B5B] font-black">À vie (Cohorte 1)</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-slate-800">Mode 'Le Blitz'</td>
                      <td className="p-4">Limité (5 min/jour)</td>
                      <td className="p-4 text-[#002B5B] font-black">Illimité</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-slate-800">Certificat officiel</td>
                      <td className="p-4 text-rose-500 font-bold">❌</td>
                      <td className="p-4 text-emerald-500 font-bold">✅</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-slate-800">Corrections IA</td>
                      <td className="p-4">Basique</td>
                      <td className="p-4 text-[#002B5B] font-black">Analyse profonde</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-slate-800">Sujets d'examens réels</td>
                      <td className="p-4">Dernière année</td>
                      <td className="p-4 text-[#002B5B] font-black">10 dernières années</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAQ Section */}
        <div className="w-full max-w-3xl border-t border-slate-150 pt-16">
          <h2 className="font-display text-2xl md:text-3xl font-black text-[#002B5B] text-center mb-8">
            Questions Fréquentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-white border border-slate-150 rounded-2xl overflow-hidden transition-all hover:border-slate-200"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-[#002B5B] text-sm md:text-base cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${expandedFAQ === idx ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {expandedFAQ === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-5 pt-0 border-t border-slate-50 text-xs md:text-sm text-slate-500 leading-relaxed font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Checkout Modal (Steps 1-6 fully interactive) */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 overflow-y-auto">
            
            {/* Dark background blur overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => checkoutStep !== 3 && checkoutStep !== 4 && setShowCheckout(false)}
              className="fixed inset-0 bg-slate-900/45 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg border border-slate-100 shadow-2xl relative overflow-hidden my-auto"
            >
              {/* Close Button (Hidden during processing and OTP to prevent bugs) */}
              {checkoutStep !== 3 && checkoutStep !== 4 && (
                <button 
                  onClick={() => setShowCheckout(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all cursor-pointer z-10"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Step 1: Country & Payment Method Selection */}
              {checkoutStep === 1 && (
                <div className="p-6 md:p-8">
                  <div className="mb-6">
                    <span className="text-[10px] font-mono tracking-widest text-[#FFD214] font-black uppercase bg-[#002B5B] px-3 py-1 rounded-md">
                      Paiement Sécurisé
                    </span>
                    <h3 className="font-display font-black text-xl text-[#002B5B] mt-2.5">Sélectionnez votre moyen de paiement</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Tarifs adaptés à votre pays pour la Cohorte 1.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                        Votre Pays de Résidence
                      </label>
                      <select
                        value={checkoutCountry.name}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all cursor-pointer"
                      >
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-2 font-mono">
                        Méthode de Paiement locale
                      </label>
                      <div className="grid grid-cols-1 gap-2.5">
                        {checkoutCountry.methods.map((method) => (
                          <button
                            key={method}
                            type="button"
                            onClick={() => setCheckoutMethod(method)}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                              checkoutMethod === method
                                ? "border-brand-blue bg-blue-50/15"
                                : "border-slate-100 hover:border-slate-200 bg-white"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${
                                checkoutMethod === method ? "bg-brand-blue/5 text-brand-blue" : "bg-slate-50 text-slate-500"
                              }`}>
                                {method.toLowerCase().includes("money") || method.toLowerCase().includes("wave") || method.toLowerCase().includes("momo") ? (
                                  <Smartphone className="w-5 h-5" />
                                ) : (
                                  <CreditCard className="w-5 h-5" />
                                )}
                              </div>
                              <div>
                                <p className="text-xs font-extrabold text-[#002B5B]">{method}</p>
                                <p className="text-[10px] text-slate-400 font-medium">Traitement instantané sécurisé</p>
                              </div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              checkoutMethod === method ? "border-brand-blue bg-brand-blue" : "border-slate-300"
                            }`}>
                              {checkoutMethod === method && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setPhoneOrEmail("");
                      setCardNumber("");
                      setCvv("");
                      setCheckoutStep(2);
                    }}
                    className="w-full bg-brand-blue hover:bg-[#001f42] text-white font-bold py-3.5 px-6 rounded-xl mt-6 transition-all flex items-center justify-center gap-2 text-xs md:text-sm uppercase tracking-wide cursor-pointer"
                  >
                    Continuer vers les détails
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step 2: Billing & Details Information form */}
              {checkoutStep === 2 && (
                <form onSubmit={handleCheckoutSubmit} className="p-6 md:p-8">
                  <div className="mb-6 flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-[#FFD214] font-black uppercase bg-[#002B5B] px-3 py-1 rounded-md">
                        {checkoutMethod}
                      </span>
                      <h3 className="font-display font-black text-xl text-[#002B5B] mt-2.5">Entrez vos détails de facturation</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase font-mono">Total à Payer</p>
                      <p className="text-lg font-black text-brand-blue font-mono">
                        {selectedCurrency === "NGN" ? "₦" : selectedCurrency === "XOF" ? "" : "$"}
                        {currentPrice.premiumPrice}
                        {selectedCurrency === "XOF" ? " FCFA" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Phone or Email Field for mobile wallets / notifications */}
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                        {checkoutMethod.toLowerCase().includes("money") || checkoutMethod.toLowerCase().includes("wave") || checkoutMethod.toLowerCase().includes("momo") 
                          ? "Numéro de Téléphone Mobile Wallet" 
                          : "Adresse Email du Parent"}
                      </label>
                      <div className="relative">
                        <input
                          type={checkoutMethod.toLowerCase().includes("money") || checkoutMethod.toLowerCase().includes("wave") || checkoutMethod.toLowerCase().includes("momo") ? "tel" : "email"}
                          required
                          value={phoneOrEmail}
                          onChange={(e) => setPhoneOrEmail(e.target.value)}
                          placeholder={checkoutMethod.toLowerCase().includes("money") || checkoutMethod.toLowerCase().includes("wave") || checkoutMethod.toLowerCase().includes("momo") ? "ex: +221 77 123 4567" : "parent@email.com"}
                          className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3.5 text-xs md:text-sm font-semibold transition-all"
                        />
                      </div>
                    </div>

                    {/* Card fields if payment method is card */}
                    {!checkoutMethod.toLowerCase().includes("money") && !checkoutMethod.toLowerCase().includes("wave") && !checkoutMethod.toLowerCase().includes("momo") && (
                      <div className="space-y-4">
                        <div>
                          <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">Numéro de Carte Bancaire</label>
                          <input
                            type="text"
                            required
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                            placeholder="ex: 4123 4567 8901 2345"
                            className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3.5 text-xs md:text-sm font-semibold transition-all font-mono"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">Date d'Expiration</label>
                            <input
                              type="text"
                              required
                              maxLength={5}
                              placeholder="MM/AA"
                              className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3.5 text-xs md:text-sm font-semibold transition-all font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">CVV (Sécurité)</label>
                            <input
                              type="password"
                              required
                              maxLength={3}
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              placeholder="123"
                              className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3.5 text-xs md:text-sm font-semibold transition-all font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50/50 p-3 rounded-xl text-[10px] text-brand-blue font-semibold font-mono uppercase tracking-wider">
                      💡 Saisissez vos coordonnées puis choisissez de simuler le succès ou un échec :
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setCheckoutStep(6); // Step 6 is the Unsuccessful Payment Screen
                      }}
                      className="flex-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold py-3.5 px-4 rounded-xl transition-all text-xs uppercase tracking-wide cursor-pointer text-center flex items-center justify-center gap-1.5"
                    >
                      <X className="w-4 h-4 shrink-0 stroke-[2.5]" />
                      Simuler Échec
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-brand-blue hover:bg-[#001f42] text-white font-extrabold py-3.5 px-4 rounded-xl transition-all text-xs uppercase tracking-wide cursor-pointer text-center flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-4 h-4 shrink-0 stroke-[3]" />
                      Simuler Succès
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Bank Processing Spinner Loader Screen */}
              {checkoutStep === 3 && (
                <div className="p-8 flex flex-col items-center justify-center text-center min-h-[320px]">
                  <Loader2 className="w-12 h-12 text-[#002B5B] animate-spin mb-6" />
                  <p className="text-slate-800 text-sm font-bold max-w-sm mb-2">{processingStatus}</p>
                  <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest animate-pulse">
                    Traitement Bancaire Sécurisé ALAT...
                  </p>
                </div>
              )}

              {/* Step 4: OTP Verification Screen */}
              {checkoutStep === 4 && (
                <form onSubmit={handleOtpVerify} className="p-6 md:p-8 flex flex-col items-center">
                  <div className="bg-blue-50 text-brand-blue w-12 h-12 rounded-full flex items-center justify-center mb-4 border border-blue-100">
                    <ShieldCheck className="w-6 h-6 stroke-[2]" />
                  </div>

                  <div className="text-center max-w-xs mb-6">
                    <h3 className="font-display text-xl font-black text-slate-900 mb-1">
                      Validation OTP Recommandée
                    </h3>
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                      Saisissez le code de validation sécurisé à 4 chiffres envoyé à vos contacts pour finaliser le débit de <strong className="text-[#002B5B]">{currentPrice.premiumLabel}</strong>.
                    </p>
                  </div>

                  <div className="w-full max-w-xs space-y-4">
                    <input
                      type="password"
                      maxLength={4}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • •"
                      className="w-full bg-slate-50 border-2 border-slate-100 focus:border-brand-blue text-center text-xl tracking-widest font-mono font-bold rounded-xl py-3.5 focus:outline-hidden transition-all"
                    />

                    {otpError && (
                      <p className="text-xs font-bold text-rose-500 text-center flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Code erroné ou expiré
                      </p>
                    )}

                    <div className="text-center">
                      <p className="text-[10px] text-slate-400 font-mono">
                        💡 CONSEIL : Saisissez n'importe quels 4 chiffres.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-brand-blue hover:bg-[#001f42] text-white font-bold py-3.5 px-6 rounded-xl transition-all text-xs uppercase tracking-wide cursor-pointer text-center"
                    >
                      Valider la transaction
                    </button>
                  </div>
                </form>
              )}

              {/* Step 5: "Paiement Réussi! 🥳" Success Receipt Screen */}
              {checkoutStep === 5 && (
                <div className="p-6 md:p-8 flex flex-col items-center">
                  
                  {/* Big Green Success Check Mark */}
                  <div className="bg-emerald-50 text-emerald-500 w-16 h-16 rounded-full border border-emerald-100 flex items-center justify-center mb-4 shadow-sm animate-pulse">
                    <CheckCircle2 className="w-9 h-9 text-emerald-600 stroke-[2.5]" />
                  </div>

                  <div className="text-center max-w-md">
                    <h3 className="font-display text-2xl font-black text-emerald-600 mb-1">
                      Paiement réussi! 🥳
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed mb-6">
                      Bienvenue dans La Plume Premium. Votre place dans la Cohorte 1 est confirmée.
                    </p>
                  </div>

                  {/* High Fidelity Transaction Details Table */}
                  <div className="bg-[#f8fafc] border border-slate-150/60 rounded-2xl p-4.5 text-xs w-full max-w-sm space-y-3 mb-6">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono border-b border-slate-200/50 pb-2.5">
                      Détails de la transaction
                    </div>
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-slate-400">Montant payé</span>
                      <span className="font-bold text-slate-800 font-mono">
                        {selectedCurrency === "NGN" ? "₦" : selectedCurrency === "XOF" ? "" : "$"}
                        {PRICING_DATA[selectedCurrency].premiumPrice}
                        {selectedCurrency === "XOF" ? " FCFA" : ""}
                      </span>
                    </div>
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-slate-400">Référence</span>
                      <span className="font-bold text-slate-600 font-mono">LP-2025-00847</span>
                    </div>
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-slate-400">Méthode</span>
                      <span className="font-bold text-slate-600">{checkoutMethod}</span>
                    </div>
                    <div className="flex justify-between items-center font-medium pb-1">
                      <span className="text-slate-400">Statut</span>
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-100 flex items-center gap-1 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        Confirmé
                      </span>
                    </div>
                  </div>

                  {/* La Plume Premium Card */}
                  <div className="bg-[#002B5B] text-white rounded-2xl p-4 w-full max-w-sm shadow-md mb-6 relative overflow-hidden">
                    <div className="absolute right-3 top-3 bg-amber-500 text-[#002B5B] text-[9px] font-black tracking-widest px-2.5 py-1 rounded-md uppercase">
                      ACTIF
                    </div>
                    <p className="text-[10px] font-mono tracking-widest text-brand-yellow font-black uppercase mb-3">
                      💡 La Plume Premium
                    </p>
                    <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-[10px] font-medium text-slate-200">
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[8px] tracking-wider">DÉBUT COHORTE</p>
                        <p className="font-extrabold text-white mt-0.5">1er Août 2025</p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[8px] tracking-wider">DURÉE</p>
                        <p className="font-extrabold text-white mt-0.5">À vie (Cohorte 1)</p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[8px] tracking-wider">STUDENTS</p>
                        <p className="font-extrabold text-white mt-0.5">4,200 inscrits</p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[8px] tracking-wider">PAYS</p>
                        <p className="font-extrabold text-white mt-0.5">{checkoutCountry.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Et maintenant? checklist */}
                  <div className="w-full max-w-sm mb-6">
                    <p className="text-[10px] font-mono tracking-widest text-slate-400 font-black uppercase text-center mb-3">
                      Et maintenant ?
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <button
                        type="button"
                        onClick={() => setCheckedList(prev => ({ ...prev, verifyEmail: !prev.verifyEmail }))}
                        className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5 cursor-pointer bg-white ${
                          checkedList.verifyEmail ? "border-brand-blue bg-blue-50/15" : "border-slate-150"
                        }`}
                      >
                        <div className={`p-1.5 rounded-full ${checkedList.verifyEmail ? "bg-brand-blue text-white" : "bg-slate-50 text-slate-400"}`}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-[10px] font-extrabold text-[#002B5B]">Vérifier email</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCheckedList(prev => ({ ...prev, completeProfile: !prev.completeProfile }))}
                        className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5 cursor-pointer bg-white ${
                          checkedList.completeProfile ? "border-brand-blue bg-blue-50/15" : "border-slate-150"
                        }`}
                      >
                        <div className={`p-1.5 rounded-full ${checkedList.completeProfile ? "bg-brand-blue text-white" : "bg-slate-50 text-slate-400"}`}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-[10px] font-extrabold text-[#002B5B]">Profil complet</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCheckedList(prev => ({ ...prev, readyAug1st: !prev.readyAug1st }))}
                        className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5 cursor-pointer bg-white ${
                          checkedList.readyAug1st ? "border-brand-blue bg-blue-50/15" : "border-slate-150"
                        }`}
                      >
                        <div className={`p-1.5 rounded-full ${checkedList.readyAug1st ? "bg-brand-blue text-white" : "bg-slate-50 text-slate-400"}`}>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className="text-[10px] font-extrabold text-[#002B5B]">Prêt pour 1er Août</span>
                      </button>
                    </div>
                  </div>

                  {/* Share buttons */}
                  <div className="w-full max-w-sm mb-6 border-t border-slate-100 pt-5 text-center">
                    <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase font-black mb-3">
                      Partagez votre inscription ! 🌍
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <a 
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent("Je viens de m'inscrire à La Plume Africa Premium pour préparer le Baccalauréat avec brio! Rejoignez la Cohorte 1 🚀")}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 border border-emerald-200 hover:bg-emerald-50 bg-white text-emerald-600 font-bold py-2.5 px-4 rounded-xl text-xs transition-all"
                      >
                        💬 WhatsApp
                      </a>
                      <button
                        onClick={copyShareLink}
                        type="button"
                        className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 bg-white text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                        {copiedLink ? "Copié! 👍" : "Copier le lien"}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowCheckout(false);
                      onSelectPremiumSuccess();
                    }}
                    className="w-full bg-[#002B5B] hover:bg-brand-blue-light text-white font-extrabold py-4 px-6 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    Accéder à mon Espace Premium <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Step 6: "Paiement non abouti" Unsuccessful Screen */}
              {checkoutStep === 6 && (
                <div className="p-6 md:p-8 flex flex-col items-center">
                  
                  {/* Big Dark Red Failure Check Mark */}
                  <div className="bg-[#820C17] text-white w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-md">
                    <X className="w-8 h-8 stroke-[2.5]" />
                  </div>

                  <div className="text-center max-w-sm mb-6">
                    <h3 className="font-display text-2xl font-black text-slate-900 mb-2">
                      Paiement non abouti
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                      Ne vous inquiétez pas, votre transaction est sécurisée. Aucun montant n'a été débité de votre compte.
                    </p>
                  </div>

                  {/* Reasons box */}
                  <div className="bg-red-50/50 border border-red-100/50 rounded-2xl p-4 text-xs w-full max-w-sm mb-6">
                    <div className="flex items-center gap-2 text-red-700 font-bold mb-2.5">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
                      <span className="font-sans text-xs">Raisons possibles de l'échec :</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-slate-600 font-semibold text-[10px]">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        Fonds insuffisants
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        Infos de carte erronées
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        Erreur de connexion
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        Code PIN incorrect
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        Limite de transaction
                      </div>
                    </div>
                  </div>

                  {/* Que faire maintenant */}
                  <div className="w-full max-w-sm mb-6">
                    <p className="text-[10px] font-mono tracking-widest text-slate-400 font-black uppercase mb-3">
                      QUE FAIRE MAINTENANT?
                    </p>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep(2)}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-150 hover:border-slate-200 bg-white transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-blue-50 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-all">
                            <RefreshCw className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-slate-800">Réessayer avec la même carte</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-all" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setCheckoutStep(1)}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-150 hover:border-slate-200 bg-white transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-slate-50 text-slate-500 group-hover:bg-slate-100 transition-all">
                            <CreditCard className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-slate-800">Utiliser un autre moyen de paiement</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-all" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setShowCheckout(false);
                          onSelectFreeTrial();
                        }}
                        className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-150 hover:border-slate-200 bg-white transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-bold text-slate-800">Commencer l'essai gratuit</span>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    </div>
                  </div>

                  {/* Besoin d'aide box */}
                  <div className="bg-slate-50 border border-slate-150/80 rounded-2xl p-4 w-full max-w-sm mb-6 flex items-center justify-between gap-3">
                    <div className="text-left">
                      <p className="text-xs font-extrabold text-[#002B5B]">Besoin d'aide?</p>
                      <p className="text-[10px] text-slate-400 font-medium">Notre équipe est là pour vous.</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <a
                        href="https://wa.me/message/YOUR_LINK"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold py-1.5 px-3 rounded-lg text-[10px] transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                        WhatsApp
                      </a>
                      <a
                        href="mailto:support@laplume.africa"
                        className="flex items-center justify-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold py-1.5 px-3 rounded-lg text-[10px] transition-all"
                      >
                        <Mail className="w-3.5 h-3.5 text-blue-500" />
                        Email
                      </a>
                    </div>
                  </div>

                  {/* Horiz badges */}
                  <div className="grid grid-cols-3 gap-2 border-t border-b border-slate-100 py-3 w-full max-w-sm mb-6 text-center">
                    <div className="flex flex-col items-center gap-1.5">
                      <X className="w-4 h-4 text-rose-500 stroke-[3.5] bg-rose-50 rounded-full p-0.5" />
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase leading-tight">Aucun montant débité</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5 border-x border-slate-100">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase leading-tight">Compte sécurisé</span>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <Headphones className="w-4 h-4 text-slate-400" />
                      <span className="text-[9px] font-mono font-bold text-slate-400 uppercase leading-tight">Support ALAT</span>
                    </div>
                  </div>

                  {/* Primary & secondary action buttons at the bottom */}
                  <div className="w-full max-w-sm space-y-2.5">
                    <button
                      onClick={() => setCheckoutStep(2)}
                      className="w-full bg-[#002B5B] hover:bg-[#001f42] text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wide cursor-pointer shadow-md"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Réessayer le paiement
                    </button>
                    <button
                      onClick={() => {
                        setShowCheckout(false);
                        onSelectFreeTrial();
                      }}
                      className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3.5 px-6 rounded-xl transition-all text-xs uppercase tracking-wide cursor-pointer text-center"
                    >
                      Commencer l'essai gratuit
                    </button>
                  </div>

                  <p className="text-[9px] font-mono uppercase tracking-wider text-slate-350 mt-6 border-t border-slate-100 pt-3 w-full text-center">
                    Sécurisé par <strong className="text-slate-400">ALAT</strong> by Wema Bank 🔒
                  </p>

                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
