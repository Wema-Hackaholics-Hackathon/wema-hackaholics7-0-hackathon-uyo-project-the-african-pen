/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Check, ArrowRight, User, Phone, BookOpen, FileText, Upload, 
  Sparkles, ShieldCheck, HeartHandshake, HelpCircle, GraduationCap, X, ChevronDown, Camera
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import NigeriaFlag from '../assets/images/images1.jpg';
import GhanaFlag from '../assets/images/Ghana.jpg';
import SierraLeoneFlag from '../assets/images/Sierra Leone.jpg';
import KenyaFlag from '../assets/images/kenya.jpg';
import LiberiaFlag from '../assets/images/liberia.jpg';

interface OnboardingViewProps {
  onSignupSuccess: (name: string) => void;
  userEmail?: string;
  userFullName?: string;
}

const AVATAR_PRESETS = [
  { id: "avatar1", name: "Amara", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" },
  { id: "avatar2", name: "Ibrahim", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
  { id: "avatar3", name: "Awa", url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150" },
  { id: "avatar4", name: "Kofi", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150" }
];

const SCHOOL_SUGGESTIONS = [
  "Lycée classique d'Abidjan (Côte d'Ivoire)",
  "Lycée Scientifique de Yamoussoukro (Côte d'Ivoire)",
  "Lycée Lamine Guèye de Dakar (Sénégal)",
  "Lycée Seydou Nourou Tall de Dakar (Sénégal)",
  "Lycée Blaise Diagne (Sénégal)",
  "Lycée de Tokoin (Togo)",
  "Lycée Béhanzin de Porto-Novo (Bénin)"
];

const COUNTRY_OPTIONS = [
  { value: "+234", label: "Nigeria", flag: NigeriaFlag },
  { value: "+233", label: "Ghana", flag: GhanaFlag },
  { value: "+232", label: "Sierra Leone", flag: SierraLeoneFlag },
  { value: "+254", label: "Kenya", flag: KenyaFlag },
  { value: "+231", label: "Liberia", flag: LiberiaFlag }
];

export default function OnboardingView({ onSignupSuccess, userEmail = "igboechejohn@gmail.com", userFullName = "Amara" }: OnboardingViewProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  // Form State
  const [tosChecked, setTosChecked] = useState(false);
  const [aboutMe, setAboutMe] = useState({
    objective: "Réussir le Baccalauréat avec Mention",
    referral: "Réseaux sociaux (Facebook/Instagram/TikTok)",
    whatsappPrefix: "+234",
    whatsappNumber: ""
  });
  const [selectedAvatar, setSelectedAvatar] = useState<string>("avatar1");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [academicPath, setAcademicPath] = useState({
    examSeries: "Série S2 (Sciences Expérimentales)",
    schoolName: "",
    cityAndCountry: "Dakar, Sénégal"
  });
  const [charterSignature, setCharterSignature] = useState("");
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Computed Values
  const progressPercentage = Math.round((activeStep / 6) * 100);

  const handleStepComplete = (step: number) => {
    setCompletedSteps(prev => ({ ...prev, [step]: true }));
    if (step < 6) {
      setActiveStep(step + 1);
    }
  };

  const handleStepClick = (step: number) => {
    // Only allow clicking steps that have been unlocked (either they are completed, or the step before is completed)
    if (step === 1 || completedSteps[step - 1] || completedSteps[step]) {
      setActiveStep(step);
    }
  };

  const handleFinish = () => {
    onSignupSuccess(userFullName || aboutMe.whatsappNumber || "Étudiant");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#fcfcfd] pb-20 relative">
      {/* Support Modal */}
      <AnimatePresence>
        {showSupportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSupportModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-100 shadow-2xl relative z-10"
            >
              <button 
                onClick={() => setShowSupportModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-brand-blue/5 p-2.5 rounded-2xl text-brand-blue border border-brand-blue/10">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900">Support Cohorte 1</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Besoin d'aide pour finaliser votre inscription ? Notre équipe pédagogique est à votre écoute pour vous guider.
              </p>
              <div className="space-y-3.5">
                <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                  <span className="text-xl">💬</span>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">WHATSAPP DIRECT</p>
                    <a href="https://wa.me/221770000000" target="_blank" rel="noopener noreferrer" className="text-sm font-extrabold text-brand-blue hover:underline">
                      +221 77 000 00 00
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-100 p-4 rounded-2xl">
                  <span className="text-xl">✉️</span>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">SUPPORT EMAIL</p>
                    <a href="mailto:support@laplume.africa" className="text-sm font-extrabold text-brand-blue hover:underline">
                      support@laplume.africa
                    </a>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowSupportModal(false)}
                className="w-full bg-brand-blue text-white font-bold py-3 px-6 rounded-full mt-6 transition-all hover:bg-[#001f42] text-xs md:text-sm cursor-pointer"
              >
                Fermer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Embedded Mini-Header matching screenshot (Support button in top right) */}
      <div className="bg-white border-b border-slate-100 px-4 md:px-8 py-3.5 mb-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-brand-blue p-2 rounded-xl text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-brand-blue block leading-none">
                La Plume
              </span>
              <span className="text-[9px] uppercase tracking-widest font-mono text-amber-500 font-bold block -mt-0.5">
                French Prep
              </span>
            </div>
          </div>
          <button 
            onClick={() => setShowSupportModal(true)}
            className="bg-brand-blue hover:bg-[#001f42] text-white text-xs md:text-sm font-bold px-5 py-2 rounded-full shadow-xs transition-all cursor-pointer"
          >
            Support
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {/* Title & Subtitle */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-[#002B5B] tracking-tight mb-2">
            Configuration de votre profil
          </h1>
          <p className="text-slate-500 text-sm md:text-base font-medium">
            Bienvenue dans la Cohorte 1. Suivez ces étapes pour finaliser votre inscription.
          </p>
        </div>

        {/* Stepper Progress bar */}
        <div className="mb-10 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs md:text-sm font-bold">
            <span className="text-[#002B5B] font-mono">Étape {activeStep} sur 6</span>
            <span className="text-[#002B5B] font-mono">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <motion.div 
              className="bg-brand-blue h-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Collapsible Steps Lists */}
        <div className="space-y-4">
          
          {/* Step 1: Conditions Générales */}
          <div 
            className={`border rounded-2xl transition-all ${
              activeStep === 1 
                ? "border-brand-blue/30 bg-white shadow-md" 
                : completedSteps[1]
                ? "border-emerald-100 bg-white"
                : "border-slate-100 bg-slate-50/50"
            }`}
          >
            <button 
              type="button"
              onClick={() => handleStepClick(1)}
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 focus:outline-hidden"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  completedSteps[1] 
                    ? "bg-emerald-500 text-white" 
                    : activeStep === 1
                    ? "bg-brand-blue text-white"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {completedSteps[1] ? <Check className="w-4 h-4 stroke-[3]" /> : "1"}
                </div>
                <span className={`font-semibold text-sm md:text-base ${
                  activeStep === 1 ? "text-[#002B5B] font-bold" : "text-slate-700"
                }`}>
                  Conditions Générales
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-all ${activeStep === 1 ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence initial={false}>
              {activeStep === 1 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-6 border-t border-slate-50 pt-4 flex flex-col gap-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs md:text-sm text-slate-600 leading-relaxed max-h-[160px] overflow-y-auto">
                      <p className="font-bold mb-2">Bienvenue sur la plateforme La Plume Africa.</p>
                      <p className="mb-2">En utilisant nos services, vous acceptez les conditions suivantes :</p>
                      <ol className="list-decimal pl-4 space-y-2 font-medium">
                        <li><strong>Utilisation du compte :</strong> Votre accès est strictement personnel et réservé aux élèves de la Cohorte 1.</li>
                        <li><strong>Propriété intellectuelle :</strong> Tous les contenus pédagogiques, cours, vidéos, et exercices sont protégés par le droit d'auteur.</li>
                        <li><strong>Assiduité et respect :</strong> Vous vous engagez à respecter les formateurs et les autres apprenants de la communauté.</li>
                      </ol>
                    </div>

                    <label className="flex items-start gap-2.5 text-xs text-slate-600 font-medium leading-relaxed select-none cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={tosChecked}
                        onChange={(e) => setTosChecked(e.target.checked)}
                        className="w-4 h-4 rounded-sm border-slate-200 text-brand-blue focus:ring-brand-blue mt-0.5 cursor-pointer"
                      />
                      <span>J'ai lu et j'accepte les conditions générales d'utilisation du service.</span>
                    </label>

                    <button
                      type="button"
                      disabled={!tosChecked}
                      onClick={() => handleStepComplete(1)}
                      className={`w-full py-3 px-6 rounded-xl font-bold text-xs md:text-sm tracking-wide transition-all uppercase flex items-center justify-center gap-1.5 ${
                        tosChecked 
                          ? "bg-brand-blue hover:bg-[#001f42] text-white shadow-xs cursor-pointer" 
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      J'ACCEPTE
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Step 2: Parlez-nous de vous */}
          <div 
            className={`border rounded-2xl transition-all ${
              activeStep === 2 
                ? "border-brand-blue/30 bg-white shadow-md" 
                : completedSteps[2]
                ? "border-emerald-100 bg-white"
                : "border-slate-100 bg-slate-50/50"
            }`}
          >
            <button 
              type="button"
              disabled={!completedSteps[1] && activeStep !== 2}
              onClick={() => handleStepClick(2)}
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 focus:outline-hidden disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  completedSteps[2] 
                    ? "bg-emerald-500 text-white" 
                    : activeStep === 2
                    ? "bg-brand-blue text-white"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {completedSteps[2] ? <Check className="w-4 h-4 stroke-[3]" /> : "2"}
                </div>
                <span className={`font-semibold text-sm md:text-base ${
                  activeStep === 2 ? "text-[#002B5B] font-bold" : "text-slate-700"
                }`}>
                  Parlez-nous de vous
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-all ${activeStep === 2 ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence initial={false}>
              {activeStep === 2 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-6 border-t border-slate-50 pt-4 flex flex-col gap-4">
                    
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                        Quel est votre principal objectif ?
                      </label>
                      <select
                        value={aboutMe.objective}
                        onChange={(e) => setAboutMe(prev => ({ ...prev, objective: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                      >
                        <option>Réussir le Baccalauréat avec Mention</option>
                        <option>Améliorer mon expression écrite et orale</option>
                        <option>Me préparer aux concours des Grandes Écoles</option>
                        <option>Autre objectif personnel</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                        Comment avez-vous connu La Plume ?
                      </label>
                      <select
                        value={aboutMe.referral}
                        onChange={(e) => setAboutMe(prev => ({ ...prev, referral: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                      >
                        <option>Réseaux sociaux (Facebook/Instagram/TikTok)</option>
                        <option>Par un enseignant ou conseiller d'orientation</option>
                        <option>Recommandé par un ami ou membre de ma famille</option>
                        <option>Recherche Google</option>
                        <option>Autre</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                        Numéro de téléphone (WhatsApp)
                      </label>
                      <div className="flex gap-2">
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                            className="w-32 bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-2 py-3 text-xs md:text-sm font-bold transition-all flex items-center gap-2"
                          >
                            {(() => {
                              const selectedCountry = COUNTRY_OPTIONS.find(c => c.value === aboutMe.whatsappPrefix);
                              return (
                                <>
                                  {selectedCountry?.flag ? (
                                    <img
                                      src={selectedCountry.flag}
                                      alt={`${selectedCountry.label} flag`}
                                      className="w-6 h-4 object-cover rounded-sm"
                                    />
                                  ) : (
                                    <span className="text-base">🌍</span>
                                  )}
                                  <span>{aboutMe.whatsappPrefix}</span>
                                </>
                              );
                            })()}
                            <ChevronDown className={`w-3 h-3 text-slate-400 transition-all ${showCountryDropdown ? "rotate-180" : ""}`} />
                          </button>

                          {showCountryDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                              {COUNTRY_OPTIONS.map(country => (
                                <button
                                  key={country.value}
                                  type="button"
                                  onClick={() => {
                                    setAboutMe(prev => ({ ...prev, whatsappPrefix: country.value }));
                                    setShowCountryDropdown(false);
                                  }}
                                  className="w-full px-3 py-2 flex items-center gap-2 text-xs md:text-sm font-semibold hover:bg-slate-50 transition-all"
                                >
                                  {country.flag ? (
                                    <img
                                      src={country.flag}
                                      alt={`${country.label} flag`}
                                      className="w-6 h-4 object-cover rounded-sm"
                                    />
                                  ) : (
                                    <span className="text-base">🌍</span>
                                  )}
                                  <span>{country.label}</span>
                                  <span className="ml-auto text-slate-400">{country.value}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <input
                          required
                          type="tel"
                          placeholder="77 000 00 00"
                          value={aboutMe.whatsappNumber}
                          onChange={(e) => setAboutMe(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                          className="flex-1 bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={!aboutMe.whatsappNumber.trim()}
                      onClick={() => handleStepComplete(2)}
                      className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs md:text-sm tracking-wide transition-all uppercase flex items-center justify-center gap-1.5 mt-2 ${
                        aboutMe.whatsappNumber.trim() 
                          ? "bg-brand-blue hover:bg-[#001f42] text-white shadow-xs cursor-pointer" 
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      Suivant
                      <ArrowRight className="w-4 h-4" />
                    </button>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Step 3: Photo de profil */}
          <div 
            className={`border rounded-2xl transition-all ${
              activeStep === 3 
                ? "border-brand-blue/30 bg-white shadow-md" 
                : completedSteps[3]
                ? "border-emerald-100 bg-white"
                : "border-slate-100 bg-slate-50/50"
            }`}
          >
            <button 
              type="button"
              disabled={!completedSteps[2] && activeStep !== 3}
              onClick={() => handleStepClick(3)}
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 focus:outline-hidden disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  completedSteps[3] 
                    ? "bg-emerald-500 text-white" 
                    : activeStep === 3
                    ? "bg-brand-blue text-white"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {completedSteps[3] ? <Check className="w-4 h-4 stroke-[3]" /> : "3"}
                </div>
                <span className={`font-semibold text-sm md:text-base ${
                  activeStep === 3 ? "text-[#002B5B] font-bold" : "text-slate-700"
                }`}>
                  Photo de profil
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-all ${activeStep === 3 ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence initial={false}>
              {activeStep === 3 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-6 border-t border-slate-50 pt-4 flex flex-col gap-5">
                    
                    {/* Visual Preview Banner */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <div className="relative">
                        <img 
                          src={uploadedImage || AVATAR_PRESETS.find(a => a.id === selectedAvatar)?.url} 
                          alt="Profil" 
                          className="w-24 h-24 rounded-full object-cover border-4 border-brand-blue/10 shadow-md"
                          referrerPolicy="no-referrer"
                        />
                        <label className="absolute bottom-0 right-0 bg-brand-blue text-white p-2 rounded-full cursor-pointer hover:bg-[#001f42] shadow-md transition-all">
                          <Camera className="w-4 h-4" />
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageUpload} 
                            className="hidden" 
                          />
                        </label>
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-bold text-slate-800 text-sm md:text-base">Choisissez un avatar ou importez votre photo</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-sm">
                          Une belle photo permet aux professeurs et tuteurs de personnaliser le suivi de votre progression pédagogique.
                        </p>
                      </div>
                    </div>

                    {/* Preset Avatars Selection */}
                    <div>
                      <span className="text-xs font-bold uppercase text-slate-400 block mb-3 font-mono">
                        Avatars suggérés (Élèves de la Cohorte)
                      </span>
                      <div className="grid grid-cols-4 gap-3">
                        {AVATAR_PRESETS.map((av) => (
                          <button
                            key={av.id}
                            type="button"
                            onClick={() => {
                              setSelectedAvatar(av.id);
                              setUploadedImage(null); // Clear manual upload when choosing preset
                            }}
                            className={`p-1.5 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 cursor-pointer bg-white ${
                              selectedAvatar === av.id && !uploadedImage
                                ? "border-brand-blue bg-blue-50/20 shadow-xs"
                                : "border-slate-100 hover:border-slate-200"
                            }`}
                          >
                            <img src={av.url} alt={av.name} className="w-12 h-12 rounded-full object-cover shadow-xs" referrerPolicy="no-referrer" />
                            <span className="text-[10px] font-bold text-slate-600">{av.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStepComplete(3)}
                      className="w-full bg-brand-blue hover:bg-[#001f42] text-white font-bold py-3.5 px-6 rounded-xl shadow-xs transition-all uppercase flex items-center justify-center gap-1.5 mt-2 text-xs md:text-sm cursor-pointer"
                    >
                      Enregistrer la photo
                      <ArrowRight className="w-4 h-4" />
                    </button>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Step 4: Parcours scolaire */}
          <div 
            className={`border rounded-2xl transition-all ${
              activeStep === 4 
                ? "border-brand-blue/30 bg-white shadow-md" 
                : completedSteps[4]
                ? "border-emerald-100 bg-white"
                : "border-slate-100 bg-slate-50/50"
            }`}
          >
            <button 
              type="button"
              disabled={!completedSteps[3] && activeStep !== 4}
              onClick={() => handleStepClick(4)}
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 focus:outline-hidden disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  completedSteps[4] 
                    ? "bg-emerald-500 text-white" 
                    : activeStep === 4
                    ? "bg-brand-blue text-white"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {completedSteps[4] ? <Check className="w-4 h-4 stroke-[3]" /> : "4"}
                </div>
                <span className={`font-semibold text-sm md:text-base ${
                  activeStep === 4 ? "text-[#002B5B] font-bold" : "text-slate-700"
                }`}>
                  Parcours scolaire
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-all ${activeStep === 4 ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence initial={false}>
              {activeStep === 4 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-6 border-t border-slate-50 pt-4 flex flex-col gap-4">
                    
                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                        Votre série d'examen
                      </label>
                      <select
                        value={academicPath.examSeries}
                        onChange={(e) => setAcademicPath(prev => ({ ...prev, examSeries: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                      >
                        <option>Série S1 (Scientifique - Mathématiques et Physiques)</option>
                        <option>Série S2 (Sciences Expérimentales)</option>
                        <option>Série L' (Lettres Modernes et Sciences Humaines)</option>
                        <option>Série L1 (Lettres Classiques)</option>
                        <option>Série G (Sciences Économiques et de Gestion)</option>
                        <option>Autre série ou programme équivalent</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                        Établissement scolaire actuel ou d'origine
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Ex: Lycée classique d'Abidjan"
                        value={academicPath.schoolName}
                        onChange={(e) => setAcademicPath(prev => ({ ...prev, schoolName: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all mb-2"
                      />
                      
                      {/* Interactive fast tags suggestions */}
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {SCHOOL_SUGGESTIONS.map((sc, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setAcademicPath(prev => ({ ...prev, schoolName: sc.split(" (")[0] }))}
                            className="bg-slate-50 border border-slate-100 hover:border-brand-blue/30 text-slate-600 hover:text-brand-blue text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                          >
                            + {sc.split(" (")[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                        Ville et Pays de résidence
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Ex: Dakar, Sénégal"
                        value={academicPath.cityAndCountry}
                        onChange={(e) => setAcademicPath(prev => ({ ...prev, cityAndCountry: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={!academicPath.schoolName.trim() || !academicPath.cityAndCountry.trim()}
                      onClick={() => handleStepComplete(4)}
                      className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs md:text-sm tracking-wide transition-all uppercase flex items-center justify-center gap-1.5 mt-2 ${
                        academicPath.schoolName.trim() && academicPath.cityAndCountry.trim()
                          ? "bg-brand-blue hover:bg-[#001f42] text-white shadow-xs cursor-pointer" 
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      Valider le parcours
                      <ArrowRight className="w-4 h-4" />
                    </button>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Step 5: Charte de la Cohorte 1 */}
          <div 
            className={`border rounded-2xl transition-all ${
              activeStep === 5 
                ? "border-brand-blue/30 bg-white shadow-md" 
                : completedSteps[5]
                ? "border-emerald-100 bg-white"
                : "border-slate-100 bg-slate-50/50"
            }`}
          >
            <button 
              type="button"
              disabled={!completedSteps[4] && activeStep !== 5}
              onClick={() => handleStepClick(5)}
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 focus:outline-hidden disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  completedSteps[5] 
                    ? "bg-emerald-500 text-white" 
                    : activeStep === 5
                    ? "bg-brand-blue text-white"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {completedSteps[5] ? <Check className="w-4 h-4 stroke-[3]" /> : "5"}
                </div>
                <span className={`font-semibold text-sm md:text-base ${
                  activeStep === 5 ? "text-[#002B5B] font-bold" : "text-slate-700"
                }`}>
                  Charte de la Cohorte 1
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-all ${activeStep === 5 ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence initial={false}>
              {activeStep === 5 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-6 border-t border-slate-50 pt-4 flex flex-col gap-4">
                    
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-3 text-xs md:text-sm text-slate-600 leading-relaxed">
                      <p className="font-bold text-[#002B5B] flex items-center gap-1.5">
                        <HeartHandshake className="w-4 h-4 text-amber-500" />
                        Charte d'engagement des étudiants
                      </p>
                      
                      <div className="space-y-2.5 font-medium">
                        <p className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">1.</span>
                          <span><strong>Rigueur :</strong> Je m'engage à m'exercer régulièrement et à faire de mon mieux lors de chaque évaluation.</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">2.</span>
                          <span><strong>Esprit d'équipe :</strong> Je m'engage à faire preuve de respect et de solidarité sur les espaces de discussion.</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <span className="text-amber-500 font-bold">3.</span>
                          <span><strong>Honnêteté académique :</strong> Je certifie réaliser mes quiz d'évaluation sans triche.</span>
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                        Signature numérique (Saisissez votre Nom complet)
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Ex: Amara Diallo"
                        value={charterSignature}
                        onChange={(e) => setCharterSignature(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all font-mono italic"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={!charterSignature.trim()}
                      onClick={() => handleStepComplete(5)}
                      className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs md:text-sm tracking-wide transition-all uppercase flex items-center justify-center gap-1.5 mt-2 ${
                        charterSignature.trim() 
                          ? "bg-brand-blue hover:bg-[#001f42] text-white shadow-xs cursor-pointer" 
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      Signer la charte
                      <ArrowRight className="w-4 h-4" />
                    </button>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Step 6: Validation */}
          <div 
            className={`border rounded-2xl transition-all ${
              activeStep === 6 
                ? "border-brand-blue/30 bg-white shadow-md" 
                : completedSteps[6]
                ? "border-emerald-100 bg-white"
                : "border-slate-100 bg-slate-50/50"
            }`}
          >
            <button 
              type="button"
              disabled={!completedSteps[5] && activeStep !== 6}
              onClick={() => handleStepClick(6)}
              className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 focus:outline-hidden disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center transition-all ${
                  completedSteps[6] 
                    ? "bg-emerald-500 text-white" 
                    : activeStep === 6
                    ? "bg-brand-blue text-white"
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {completedSteps[6] ? <Check className="w-4 h-4 stroke-[3]" /> : "6"}
                </div>
                <span className={`font-semibold text-sm md:text-base ${
                  activeStep === 6 ? "text-[#002B5B] font-bold" : "text-slate-700"
                }`}>
                  Validation de l'inscription
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-all ${activeStep === 6 ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence initial={false}>
              {activeStep === 6 && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-6 border-t border-slate-50 pt-4 flex flex-col gap-5 text-center items-center py-6">
                    
                    {/* Golden sparkles icon */}
                    <div className="bg-amber-50 text-amber-500 p-4 rounded-full border border-amber-100 w-16 h-16 flex items-center justify-center mb-1 shadow-inner animate-pulse">
                      <ShieldCheck className="w-8 h-8 text-amber-600" />
                    </div>

                    <div className="max-w-md">
                      <h3 className="font-display text-xl md:text-2xl font-extrabold text-[#002B5B] mb-2">Prêt pour l'aventure !</h3>
                      <p className="text-slate-500 text-xs md:text-sm leading-relaxed mb-6">
                        Toutes les informations requises pour la Cohorte 1 ont été configurées avec succès. Bienvenue dans la communauté de La Plume Africa, <strong>{charterSignature || userFullName}</strong> !
                      </p>
                    </div>

                    {/* Quick Summary Preview */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left text-xs md:text-sm w-full max-w-md space-y-3">
                      <div className="flex justify-between border-b border-slate-200/60 pb-2">
                        <span className="text-slate-400 font-bold">Email :</span>
                        <span className="font-bold text-slate-700">{userEmail}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/60 pb-2">
                        <span className="text-slate-400 font-bold">WhatsApp :</span>
                        <span className="font-mono font-bold text-slate-700">{aboutMe.whatsappPrefix} {aboutMe.whatsappNumber}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/60 pb-2">
                        <span className="text-slate-400 font-bold">Établissement :</span>
                        <span className="font-bold text-slate-700 text-right truncate max-w-[200px]">{academicPath.schoolName}</span>
                      </div>
                      <div className="flex justify-between pb-1">
                        <span className="text-slate-400 font-bold">Série :</span>
                        <span className="font-bold text-slate-700 text-right truncate max-w-[200px]">{academicPath.examSeries.split(" (")[0]}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleFinish}
                      className="w-full max-w-md bg-brand-blue hover:bg-[#001f42] text-white font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer text-xs md:text-sm uppercase tracking-wider font-sans"
                    >
                      Accéder au Tableau de Bord 🚀
                    </button>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
