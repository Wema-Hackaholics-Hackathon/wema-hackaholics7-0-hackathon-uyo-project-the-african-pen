/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Check, X, CreditCard, ShieldCheck, HelpCircle, Loader2, 
  Smartphone, ArrowRight, Share2, Sparkles, CheckCircle2, Copy, Globe, Info, Lock,
  AlertTriangle, RefreshCw, Mail, Headphones, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface PricingProps {
  openSignupModal: () => void;
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

export default function Pricing({ openSignupModal }: PricingProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("NGN");
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<number>(1); // 1: Country & Method, 2: Info form, 3: Processing, 4: OTP Verification, 5: Success
  const [checkoutCountry, setCheckoutCountry] = useState(COUNTRIES[0]);
  const [checkoutMethod, setCheckoutMethod] = useState(COUNTRIES[0].methods[0]);
  
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
    } else if (showCheckout && checkoutStep === 5 && countdown === 0) {
      // Auto close or trigger signup on countdown end
      // We will let them stay but inform them they can proceed
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

  return (
    <section className="w-full py-20 md:py-28 bg-[#fcfcfd] border-t border-slate-100" id="pricing">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="bg-amber-50 text-amber-700 border border-amber-200 uppercase font-mono font-bold tracking-widest text-[10px] px-3.5 py-1.5 rounded-full inline-block mb-3">
            TARIFS COHORTE 1
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-brand-blue tracking-tight leading-tight mb-3">
            Un investissement pour votre réussite académique
          </h2>
          <p className="text-slate-500 text-sm md:text-base font-medium">
            Choisissez l'accès qui correspond à vos objectifs de préparation du Baccalauréat.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex justify-center items-center gap-2.5 mb-14 bg-slate-50 border border-slate-100 p-1.5 rounded-full max-w-md mx-auto">
          <button
            onClick={() => setSelectedCurrency("NGN")}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCurrency === "NGN" 
                ? "bg-brand-blue text-white shadow-xs" 
                : "text-slate-600 hover:text-[#002B5B]"
            }`}
          >
            🇳🇬 Naira (NGN)
          </button>
          <button
            onClick={() => setSelectedCurrency("XOF")}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCurrency === "XOF" 
                ? "bg-brand-blue text-white shadow-xs" 
                : "text-slate-600 hover:text-[#002B5B]"
            }`}
          >
            🌍 Franc CFA (XOF)
          </button>
          <button
            onClick={() => setSelectedCurrency("USD")}
            className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCurrency === "USD" 
                ? "bg-brand-blue text-white shadow-xs" 
                : "text-slate-600 hover:text-[#002B5B]"
            }`}
          >
            🇺🇸 Dollars (USD)
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          
          {/* Free Offer - Trial Cohort */}
          <div className="bg-white border border-slate-150 rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:border-slate-200 transition-all relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block font-mono">DÉCOUVERTE</span>
                <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-md">10 JOURS</span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-brand-blue font-mono">
                  {selectedCurrency === "NGN" ? "₦" : selectedCurrency === "XOF" ? "FCFA " : "$"}0
                </span>
                <span className="text-slate-400 text-xs font-semibold lowercase">/ {currentPrice.suffix}</span>
              </div>

              <div className="h-px bg-slate-100 mb-6" />

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[3] mt-0.5" />
                  <span>Accès limité aux quiz d'évaluation initiaux</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[3] mt-0.5" />
                  <span>Vocabulaire thématique de base (50 thèmes)</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[3] mt-0.5" />
                  <span>Accès au forum communautaire des étudiants</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-350 line-through">
                  <X className="w-4 h-4 text-slate-300 shrink-0 stroke-[2.5] mt-0.5" />
                  <span>Tutorat interactif par IA (Chatbot 24/7 illimité)</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-350 line-through">
                  <X className="w-4 h-4 text-slate-300 shrink-0 stroke-[2.5] mt-0.5" />
                  <span>Évaluations d'expression écrite corrigées par l'IA</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-350 line-through">
                  <X className="w-4 h-4 text-slate-300 shrink-0 stroke-[2.5] mt-0.5" />
                  <span>Sujets types d'examen officiels complets</span>
                </li>
              </ul>
            </div>

            <button
              onClick={openSignupModal}
              className="w-full bg-slate-50 hover:bg-slate-100 text-brand-blue font-bold text-xs md:text-sm py-4 rounded-xl transition-all text-center cursor-pointer font-sans"
            >
              Démarrer l'essai gratuit
            </button>
          </div>

          {/* Premium Pass - The Premium Pass */}
          <div className="bg-brand-blue text-white border-2 border-brand-blue rounded-3xl p-8 shadow-lg flex flex-col justify-between relative transform hover:-translate-y-1 transition-all">
            
            {/* Populaire Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full border-2 border-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-white" />
              COHORTE 1 RECOMMANDÉ
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block font-mono">PASS COMPLET PREMIUM</span>
                <span className="bg-amber-500/25 text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-md border border-amber-500/30">90 JOURS</span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-brand-yellow font-mono">
                  {selectedCurrency === "NGN" ? "₦" : selectedCurrency === "XOF" ? "" : "$"}
                  {currentPrice.premiumPrice}
                  {selectedCurrency === "XOF" ? " FCFA" : ""}
                </span>
                <span className="text-slate-300 text-xs font-semibold lowercase">/ {currentPrice.suffix}</span>
              </div>

              <div className="h-px bg-white/10 mb-6" />

              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-100">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3] mt-0.5" />
                  <span>Accès complet au programme d'entraînement intensif 90j</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-100">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3] mt-0.5" />
                  <span><strong>Professeur IA 24/7</strong> pour expliquer chaque règle complexe</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-100">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3] mt-0.5" />
                  <span>Production écrite évaluée et corrigée selon le barème officiel</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-100">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3] mt-0.5" />
                  <span>+1,500 Exercices interactifs & sujets corrigés pas-à-pas</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-100">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3] mt-0.5" />
                  <span>Certificat de réussite de la Cohorte 1 vérifié</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-slate-100">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 stroke-[3] mt-0.5" />
                  <span>Suivi de progression et rapports détaillés envoyés aux parents</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setShowCheckout(true);
                setCheckoutStep(1);
              }}
              className="w-full bg-brand-yellow hover:bg-amber-400 text-brand-blue font-extrabold text-xs md:text-sm py-4 rounded-xl shadow-md transition-all text-center cursor-pointer font-sans"
            >
              Rejoindre la Cohorte Premium
            </button>
          </div>

        </div>

        {/* Security & Partner notice */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-16 text-slate-400 text-xs font-bold font-mono">
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-500" />
            PAIEMENTS SÉCURISÉS (PAYSTACK / STRIPE)
          </div>
          <div className="hidden sm:block text-slate-300">|</div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#002B5B]" />
            SATISFAIT OU REMBOURSÉ SOUS 7 JOURS
          </div>
        </div>

      </div>

      {/* Checkout Simulator Modal Overlay */}
      <AnimatePresence>
        {showCheckout && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 overflow-y-auto">
            
            {/* Dark background blur */}
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
                    <span className="text-[10px] font-mono tracking-widest text-brand-yellow font-black uppercase bg-brand-blue px-3 py-1 rounded-md">
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
                  <div className="mb-6 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(1)}
                      className="text-xs font-bold text-slate-400 hover:text-[#002B5B] underline"
                    >
                      Retour
                    </button>
                    <div className="h-4 w-px bg-slate-200" />
                    <div>
                      <h3 className="font-display font-black text-lg text-[#002B5B]">Saisissez vos informations</h3>
                      <p className="text-[10px] text-slate-400 font-mono">PAIEMENT PAR {checkoutMethod.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Dynamic Inputs depending on Method */}
                    {checkoutMethod.includes("Money") || checkoutMethod.includes("Wave") || checkoutMethod.includes("MTN") || checkoutMethod.includes("ALAT") ? (
                      <>
                        <div>
                          <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                            Numéro de compte / Téléphone associé
                          </label>
                          <input
                            required
                            type="tel"
                            value={phoneOrEmail}
                            onChange={(e) => setPhoneOrEmail(e.target.value)}
                            placeholder="Ex: 07 00 00 00 00"
                            className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all font-mono"
                          />
                        </div>
                        <div className="bg-amber-50/50 border border-amber-200/50 p-3.5 rounded-xl flex gap-2.5">
                          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-amber-800 leading-relaxed font-semibold">
                            Une notification push (demande de débit) sera envoyée sur ce numéro. Assurez-vous que votre compte dispose de fonds suffisants.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                            Numéro de Carte Bancaire
                          </label>
                          <input
                            required
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4000 1234 5678 9010"
                            className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                              Expiration
                            </label>
                            <input
                              required
                              type="text"
                              placeholder="MM/AA"
                              className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all font-mono"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                              CVV
                            </label>
                            <input
                              required
                              type="password"
                              maxLength={3}
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value)}
                              placeholder="123"
                              className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all font-mono"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                        Adresse Email pour le reçu
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="nom@exemple.com"
                        className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-blue hover:bg-[#001f42] text-white font-bold py-3.5 px-6 rounded-xl mt-6 transition-all flex items-center justify-center gap-2 text-xs md:text-sm uppercase tracking-wide cursor-pointer"
                  >
                    Payer {PRICING_DATA[selectedCurrency].premiumLabel}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Step 3: Simulated Gateway Processing Load State */}
              {checkoutStep === 3 && (
                <div className="p-8 text-center flex flex-col items-center py-16">
                  <div className="relative mb-6">
                    <Loader2 className="w-12 h-12 text-brand-blue animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-xs">🔒</div>
                  </div>
                  <h3 className="font-display font-black text-[#002B5B] text-xl mb-2">Traitement en cours</h3>
                  <p className="text-xs text-slate-500 max-w-xs mb-1">
                    Veuillez ne pas fermer cette fenêtre. Nous connectons votre compte au réseau bancaire sécurisé.
                  </p>
                  <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 font-mono text-[10px] text-brand-blue-light font-bold uppercase tracking-wider mt-4">
                    {processingStatus}
                  </div>
                </div>
              )}

              {/* Step 4: Secure SMS/OTP Authorization Input simulation */}
              {checkoutStep === 4 && (
                <form onSubmit={handleOtpVerify} className="p-6 md:p-8">
                  <div className="text-center mb-6">
                    <div className="bg-amber-50 text-amber-500 w-12 h-12 rounded-full border border-amber-100 flex items-center justify-center mx-auto mb-3">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="font-display font-black text-lg text-[#002B5B]">Vérification de sécurité</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Un code de sécurité à 4 chiffres a été envoyé par SMS ou application. Saisissez-le ci-dessous pour autoriser la transaction.
                    </p>
                  </div>

                  <div className="space-y-4 max-w-xs mx-auto text-center">
                    <div>
                      <input
                        required
                        type="text"
                        maxLength={4}
                        placeholder="0000"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        className="w-full text-center tracking-widest text-2xl font-black bg-slate-50 border border-slate-150 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl py-3.5 transition-all font-mono"
                      />
                      {otpError && (
                        <p className="text-red-500 text-[10px] font-bold font-mono uppercase mt-2">
                          CODE DE SÉCURITÉ INVALIDE (Saisissez 4 chiffres)
                        </p>
                      )}
                    </div>

                    <div className="bg-blue-50/50 p-3 rounded-xl text-[10px] text-brand-blue font-semibold font-mono uppercase tracking-wider">
                      💡 Saisissez 4 chiffres et choisissez l'issue de la transaction :
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

                  {/* High Fidelity Transaction Details Table matching screenshot */}
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
                  <div className="bg-brand-blue text-white rounded-2xl p-4 w-full max-w-sm shadow-md mb-6 relative overflow-hidden">
                    <div className="absolute right-3 top-3 bg-amber-500 text-[#002B5B] text-[9px] font-black tracking-widest px-2.5 py-1 rounded-md uppercase">
                      ACTIF
                    </div>
                    <p className="text-[10px] font-mono tracking-widest text-brand-yellow font-black uppercase mb-3">
                      💡 La Plume Premium
                    </p>
                    <div className="grid grid-cols-2 gap-y-3.5 gap-x-2 text-[10px] font-medium text-slate-200">
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[8px] tracking-wider">DÉBUT COHORTE</p>
                        <p className="font-extrabold text-white mt-0.5">1er Août 2024</p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-bold uppercase text-[8px] tracking-wider">DURÉE</p>
                        <p className="font-extrabold text-white mt-0.5">30 jours</p>
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
                    <div className="mt-4 border-t border-white/10 pt-3">
                      <div className="flex justify-between text-[9px] font-mono text-slate-400 font-bold">
                        <span>Progression</span>
                        <span>0%</span>
                      </div>
                      <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-brand-yellow h-full w-0" />
                      </div>
                    </div>
                  </div>

                  {/* Et maintenant? checklist matching screenshot */}
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

                  {/* Share buttons matching screenshot */}
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
                        className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 bg-white text-slate-800 font-bold py-2.5 px-4 rounded-xl text-xs transition-all cursor-pointer"
                      >
                        𝕏 Twitter/X
                      </button>
                    </div>
                    {copiedLink && (
                      <p className="text-[9px] font-mono font-bold text-emerald-600 uppercase mt-2">
                        LIEN DE PARTAGE COPIÉ AVEC SUCCÈS !
                      </p>
                    )}
                  </div>

                  {/* Submit Continuer Button */}
                  <button
                    onClick={() => {
                      setShowCheckout(false);
                      openSignupModal();
                    }}
                    className="w-full max-w-sm bg-[#002B5B] hover:bg-[#001f42] text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wide cursor-pointer shadow-md"
                  >
                    Continuer vers l'intégration ➔
                  </button>

                  <p className="text-[10px] text-slate-400 font-mono mt-4">
                    Redirection automatique dans <span className="font-bold text-slate-600">{countdown}</span> secondes...
                  </p>

                  <p className="text-[9px] font-mono uppercase tracking-wider text-slate-350 mt-6 border-t border-slate-100 pt-3 w-full text-center">
                    Paiement traité par <strong className="text-slate-400">ALAT</strong> by Wema Bank
                  </p>

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
                          openSignupModal();
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

                  {/* Horiz badges matching screenshot */}
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
                        openSignupModal();
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
    </section>
  );
}
