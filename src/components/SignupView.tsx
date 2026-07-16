/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  GraduationCap, ArrowRight, Eye, EyeOff, Sparkles, Compass, 
  MapPin, BookOpen, Target, Check, Trophy, Heart, Shield, Flame,
  Mail, Lightbulb, ChevronDown
} from "lucide-react";
import NigeriaFlag from '../assets/images/images1.jpg';
import GhanaFlag from '../assets/images/Ghana.jpg';
import SierraLeoneFlag from '../assets/images/Sierra Leone.jpg';
import KenyaFlag from '../assets/images/kenya.jpg';
import LiberiaFlag from '../assets/images/liberia.jpg';

interface SignupViewProps {
  setCurrentView: (view: string) => void;
  onSignupSuccess: (name: string) => void;
  initialMode?: "signup" | "login";
}

const countries = [
  { value: "Nigeria", label: "Nigeria", flag: NigeriaFlag },
  { value: "Ghana", label: "Ghana", flag: GhanaFlag },
  { value: "Sierra Leone", label: "Sierra Leone", flag: SierraLeoneFlag },
  { value: "Liberia", label: "Liberia", flag: LiberiaFlag },
  { value: "Kenya", label: "Kenya", flag: KenyaFlag },
  { value: "Other", label: "Autre pays africain", flag: null },
];

export default function SignupView({ setCurrentView, onSignupSuccess, initialMode }: SignupViewProps) {
  const [mode, setMode] = useState<"signup" | "login">(initialMode || "signup");
  const [showPassword, setShowPassword] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "Nigeria",
    school: "",
    classe: "SS3 — Passage du WAEC cette année",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendNotification, setResendNotification] = useState(false);

  React.useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  React.useEffect(() => {
    let interval: any;
    if (showVerification && timer > 0) {
      setCanResend(false);
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [showVerification, timer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      setShowVerification(true);
      setTimer(60);
    } else {
      setIsSuccess(true);
      setTimeout(() => {
        onSignupSuccess(formData.fullName || "Amara");
      }, 1800);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full min-h-[calc(100vh-80px)] bg-[#fef2f0] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl overflow-hidden border border-rose-100/50 text-center flex flex-col items-center py-12 animate-slide-up">
          <div className="bg-emerald-50 text-emerald-500 p-4 rounded-full border border-emerald-100 w-16 h-16 flex items-center justify-center mb-6 shadow-inner animate-bounce">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>
          <h3 className="font-display text-2xl font-extrabold text-brand-blue mb-2">Inscription Réussie !</h3>
          <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-4">
            Bienvenue dans la Cohorte 1, <strong className="text-brand-blue">{formData.fullName || "Amara"}</strong> ! Vous avez gagné un bonus de bienvenue de <strong className="text-amber-500 font-mono">+150 XP</strong>.
          </p>
          <div className="text-xs text-brand-blue-light bg-slate-50 px-4 py-2 rounded-xl font-bold font-mono">
            Redirection vers votre tableau de bord...
          </div>
        </div>
      </div>
    );
  }

  if (showVerification && !isSuccess) {
    const formattedTimer = `00:${String(timer).padStart(2, "0")}`;
    const userEmail = formData.email || "igboechejohn@gmail.com";

    const handleResend = () => {
      if (!canResend) return;
      setTimer(60);
      setCanResend(false);
      setResendNotification(true);
      setTimeout(() => setResendNotification(false), 4000);
    };

    const handleSimulateVerify = () => {
      setIsSuccess(true);
      setTimeout(() => {
        onSignupSuccess(formData.fullName || "Amara");
      }, 2000);
    };

    return (
      <div className="w-full min-h-[calc(100vh-80px)] bg-[#fef2f0] flex flex-col items-center justify-center p-4">
        {resendNotification && (
          <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg font-bold text-xs md:text-sm flex items-center gap-2 animate-bounce z-50">
            <Check className="w-4 h-4 stroke-[3]" />
            Un nouvel email de vérification a été envoyé !
          </div>
        )}

        {/* Main Verification Card */}
        <div className="bg-white w-full max-w-[560px] rounded-3xl p-6 md:p-8 shadow-xl border border-rose-100/40 relative text-center flex flex-col items-center py-10 md:py-12 animate-slide-up">
          
          {/* Closed Envelope Icon */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 shadow-xs">
            <Mail className="w-8 h-8 text-brand-blue" />
          </div>

          {/* Heading */}
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Vérifiez votre boîte mail 📬
          </h2>
          
          <p className="text-slate-600 text-xs md:text-sm mb-1 font-medium">
            Nous avons envoyé un lien de vérification à
          </p>
          <p className="text-brand-blue text-sm md:text-base font-bold mb-4 font-mono break-all px-2">
            {userEmail}
          </p>
          
          <p className="text-slate-500 text-[11px] md:text-xs max-w-sm leading-relaxed mb-6">
            Cliquez sur le lien dans votre email pour activer votre compte La Plume et rejoindre la Cohorte 1.
          </p>

          {/* Action Buttons */}
          <div className="w-full space-y-3">
            <a
              href="https://mail.google.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleSimulateVerify} // Automatically verify on clicking Gmail link to keep the flow extremely friendly!
              className="w-full bg-brand-blue hover:bg-[#001f42] text-white font-bold py-3.5 px-6 rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs md:text-sm font-sans"
            >
              Ouvrir Gmail
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              disabled={!canResend}
              onClick={handleResend}
              className={`w-full py-3.5 px-6 rounded-full font-bold text-xs md:text-sm transition-all border ${
                canResend
                  ? "bg-white border-brand-blue text-brand-blue hover:bg-slate-50 cursor-pointer"
                  : "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              Renvoyer l'email {!canResend && `(${formattedTimer})`}
            </button>
          </div>

          {/* Alert Card / Spam Info */}
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-left text-[11px] md:text-xs text-slate-600 mt-6 flex items-start gap-2.5 w-full">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Vous ne trouvez pas l'email? Vérifiez votre dossier spam. L'email provient de <strong className="text-brand-blue">hello@laplume.africa</strong>
            </p>
          </div>

          {/* Wrong Email / Return to signup Link */}
          <button
            type="button"
            onClick={() => {
              setShowVerification(false);
            }}
            className="text-xs md:text-sm font-bold underline transition-all mt-6 cursor-pointer block"
            style={{ color: "#002B5B" }}
          >
            Mauvais email? Retourner à l'inscription
          </button>

          {/* Live countdown helper text */}
          <div className="text-[10px] md:text-xs text-slate-400 mt-4">
            {timer > 0 ? (
              <span>Vous pouvez renvoyer l'email dans <strong className="font-mono text-brand-blue">{formattedTimer}</strong> secondes</span>
            ) : (
              <span className="text-emerald-600 font-bold">Vous pouvez maintenant renvoyer l'email.</span>
            )}
          </div>

          {/* Interactive bypass for prototype convenience */}
          <div className="mt-8 pt-4 border-t border-slate-100 w-full flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono">
              Mode Démo Interactif
            </span>
            <button
              type="button"
              onClick={handleSimulateVerify}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white/10" />
              Simuler la validation de l'email
            </button>
          </div>

        </div>
      </div>
    );
  }

  const getStrengthData = () => {
    const val = formData.password;
    if (val.length === 0) {
      return { width: "0%", background: "transparent", text: "", color: "" };
    } else if (val.length < 6) {
      return { width: "33%", background: "#E63946", text: "Faible", color: "#E63946" };
    } else if (val.length < 8) {
      return { width: "66%", background: "#F97316", text: "Moyen", color: "#F97316" };
    } else {
      const hasLetter = /[a-zA-Z]/.test(val);
      const hasNumber = /[0-9]/.test(val);
      if (hasLetter && hasNumber) {
        return { width: "100%", background: "#2DC653", text: "Fort", color: "#2DC653" };
      } else {
        return { width: "66%", background: "#F97316", text: "Moyen", color: "#F97316" };
      }
    }
  };

  const strength = getStrengthData();
  const selectedCountry = countries.find(c => c.value === formData.country) || countries[0];

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col lg:flex-row">
      
      {/* LHS Section: Soft Peach/Rose background containing the sign-up card */}
      <div className="w-full lg:w-[58%] bg-[#fef2f0] py-12 px-4 md:px-8 lg:px-12 flex items-center justify-center">
        
        {/* Main Sign-up white card */}
        <div className="bg-white w-full max-w-[560px] rounded-3xl p-6 md:p-8 shadow-xl border border-rose-100/40 relative">
          
          {/* Top Badge */}
          {mode === "signup" && (
            <div className="inline-flex items-center gap-2 bg-[#e6ebf4] text-[#1e3a8a] text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              <Compass className="w-4 h-4 text-brand-blue" />
              <span>Inscription pour Cohorte 1 — Commence dans 29 jours</span>
            </div>
          )}

          {/* Heading */}
          <h2 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            {mode === "signup" ? "Commençons." : "Bon retour. 🪶"}
          </h2>
          <p className="text-slate-500 text-sm mb-6 font-medium">
            {mode === "signup" 
              ? "Rejoignez l'élite académique et préparez-vous pour le succès."
              : "Connectez-vous pour continuer votre parcours en français."
            }
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" ? (
              <>
                {/* Grid 1: Nom complet & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                  Nom complet
                </label>
                <input
                  required
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Ex: Jean Kouassi"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                  Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="nom@exemple.com"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                />
              </div>
            </div>

            {/* Grid 2: Téléphone & Pays */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                  Téléphone
                </label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+234  80 0000 0000"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                  Pays
                </label>
                {/* Custom Country Dropdown */}
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {selectedCountry.flag && (
                        <img 
                          src={selectedCountry.flag} 
                          alt={`${selectedCountry.label} flag`} 
                          className="w-6 h-4 object-cover rounded-sm"
                        />
                      )}
                      <span>{selectedCountry.label}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  
                  {isCountryDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                      {countries.map(country => (
                        <button
                          key={country.value}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, country: country.value }));
                            setIsCountryDropdownOpen(false);
                          }}
                          className="w-full px-4 py-3 flex items-center gap-3 text-xs md:text-sm font-semibold hover:bg-slate-50 transition-all"
                        >
                          {country.flag ? (
                            <img 
                              src={country.flag} 
                              alt={`${country.label} flag`} 
                              className="w-6 h-4 object-cover rounded-sm"
                            />
                          ) : (
                            <div className="w-6 h-4 bg-slate-200 rounded-sm flex items-center justify-center text-xs">🌍</div>
                          )}
                          <span>{country.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Grid 3: École & Classe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                  École
                </label>
                <input
                  required
                  type="text"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  placeholder="Nom de votre établissement"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                  Classe
                </label>
                <select
                  name="classe"
                  value={formData.classe}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all cursor-pointer"
                >
                  <option value="SS1 — Préparation anticipée">SS1 — Préparation anticipée</option>
                  <option value="SS2 — Préparation anticipée">SS2 — Préparation anticipée</option>
                  <option value="SS3 — Passage du WAEC cette année">SS3 — Passage du WAEC cette année</option>
                  <option value="Déjà passé le WAEC">Déjà passé le WAEC</option>
                  <option value="Étudiant universitaire">Étudiant universitaire</option>
                </select>
              </div>
            </div>

            {/* Grid 4: Password & Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="********"
                    className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl pl-4 pr-10 py-3 text-xs md:text-sm font-semibold transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div style={{ width: "100%", height: "4px", background: "#E5E7EB", borderRadius: "2px", marginTop: "6px" }}>
                  <div 
                    id="strength-bar" 
                    style={{ 
                      height: "100%", 
                      width: strength.width, 
                      background: strength.background, 
                      borderRadius: "2px", 
                      transition: "all 0.3s ease" 
                    }}
                  ></div>
                </div>
                <span 
                  id="strength-label"
                  style={{ 
                    fontSize: "12px", 
                    fontFamily: "'Inter', sans-serif", 
                    marginTop: "4px", 
                    display: "block",
                    color: strength.color
                  }}
                >
                  {strength.text}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                  Confirmer
                </label>
                <input
                  required
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="********"
                  className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5 pt-2">
              <input
                id="agreeToTerms"
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                required
                className="w-4 h-4 rounded-sm border-slate-200 text-brand-blue focus:ring-brand-blue mt-0.5 cursor-pointer"
              />
              <label htmlFor="agreeToTerms" className="text-xs text-slate-600 font-medium leading-relaxed select-none cursor-pointer">
                J'accepte les <span className="text-brand-blue underline cursor-pointer hover:text-brand-blue-light">Conditions d'Utilisation</span> et la <span className="text-brand-blue underline cursor-pointer hover:text-brand-blue-light">Politique de Confidentialité</span>.
              </label>
            </div>

            {/* Main Submit Button */}
            <button
              type="submit"
              className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer text-sm"
            >
              Créer Mon Compte
              <ArrowRight className="w-4 h-4" />
            </button>
              </>
            ) : (
              <>
                {/* Email Field */}
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                    ADRESSE EMAIL
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Entrez votre email"
                    className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm font-semibold transition-all"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1.5 font-mono">
                    MOT DE PASSE
                  </label>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Entrez votre mot de passe"
                      className="w-full bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl pl-4 pr-10 py-3 text-xs md:text-sm font-semibold transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Checkbox / Forgot row */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      className="w-4 h-4 rounded-sm border-slate-200 text-brand-blue focus:ring-brand-blue cursor-pointer"
                    />
                    <label htmlFor="rememberMe" className="text-xs text-slate-600 font-medium select-none cursor-pointer">
                      Se souvenir de moi
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-xs font-medium underline cursor-pointer hover:text-brand-blue-light transition-all"
                    style={{ color: "#002B5B" }}
                    onClick={() => alert("Fonctionnalité de réinitialisation de mot de passe à venir !")}
                  >
                    Mot de passe oublié?
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-4 px-6 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer text-sm font-sans"
                >
                  Se connecter
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

          </form>

          {/* OU Divider */}
          <div className="relative flex py-4 items-center mt-4">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 font-mono">OU</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Google Button */}
          <button
            onClick={() => {
              onSignupSuccess("User (Google)");
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              width: "100%",
              height: "48px",
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              cursor: "pointer",
              fontFamily: "'Inter',sans-serif",
              fontSize: "16px",
              color: "#0D1117",
              fontWeight: 500,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4"
              d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6
              2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88
              c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853"
              d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2
              a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07
              A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05"
              d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41
              H1.83a8 8 0 0 0 0 7.18z"/>
              <path fill="#EA4335"
              d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3
              A8 8 0 0 0 1.83 5.4L4.5 7.49
              a4.77 4.77 0 0 1 4.48-3.31z"/>
            </svg>
            Continuer avec Google
          </button>

          {/* Footer sign-in switch link */}
          <div className="text-center mt-6 text-xs text-slate-500 font-medium">
            {mode === "signup" ? (
              <>
                Vous avez déjà un compte?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  style={{
                    color: '#002B5B',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 500,
                    background: 'none',
                    border: 'none',
                    padding: 0
                  }}
                >
                  Se connecter
                </button>
              </>
            ) : (
              <>
                Pas encore de compte?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  style={{
                    color: '#002B5B',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontWeight: 500,
                    background: 'none',
                    border: 'none',
                    padding: 0
                  }}
                >
                  Rejoindre Cohorte 1
                </button>
              </>
            )}
          </div>

        </div>

      </div>

      {/* RHS Section: Deep blue content containing features, quotes, and leaderboard */}
      <div className="w-full lg:w-[42%] bg-brand-blue py-16 px-6 md:px-12 text-white flex flex-col justify-between relative overflow-hidden">
        
        {/* Subtle decorative mesh background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(30,58,138,0.4),transparent)] pointer-events-none" />

        {/* Brand Logo & Slogan Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 text-brand-yellow">
              <GraduationCap className="w-6 h-6 fill-brand-yellow/15" />
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight">
              La Plume
            </span>
          </div>
          <p className="text-slate-300 text-sm font-medium">
            L'excellence académique à portée de main.
          </p>
        </div>

        {/* Middle Area: Quote and Gold line */}
        <div className="my-10 relative z-10 max-w-sm">
          <p className="font-display italic text-lg md:text-xl text-slate-100 font-medium leading-relaxed">
            "La plume est plus puissante que l'épée."
          </p>
          <div className="w-20 h-1 bg-brand-yellow rounded-full mt-4" />
        </div>

        {/* Live Leaderboard Interactive Widget card */}
        <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 max-w-sm">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-mono tracking-widest text-brand-yellow font-bold uppercase">
              CLASSEMENT EN DIRECT
            </span>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
          </div>

          {/* List */}
          <div className="space-y-2.5">
            {[
              { rank: 1, name: "Ibrahim S.", country: "🇸🇳", xp: "2,450 XP", color: "text-amber-500", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=60" },
              { rank: 2, name: "Awa D.", country: "🇨🇮", xp: "2,120 XP", color: "text-slate-300", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=60" },
              { rank: 3, name: "Kofi B.", country: "🇬🇭", xp: "1,980 XP", color: "text-amber-700", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=60" },
              { rank: 4, name: "Zainab L.", country: "🇳🇬", xp: "1,840 XP", color: "text-slate-400", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=60" }
            ].map((usr, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-white/2 border border-white/5 px-3 py-2 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <span className={`font-mono font-bold ${usr.color}`}>{usr.rank}</span>
                  <img src={usr.avatar} alt={usr.name} className="w-6 h-6 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                  <span className="font-semibold text-slate-100">{usr.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">{usr.country}</span>
                  <span className="font-bold text-amber-400 font-mono text-[11px]">{usr.xp}</span>
                </div>
              </div>
            ))}

            {/* Current User highlighted placeholder */}
            <div className="flex items-center justify-between text-xs bg-amber-500/10 border border-amber-500/30 px-3 py-2.5 rounded-xl">
              <div className="flex items-center gap-2.5">
                <span className="font-mono font-black text-brand-yellow">5</span>
                <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-brand-yellow/30 flex items-center justify-center text-xs">
                  👤
                </div>
                <span className="font-black text-brand-yellow uppercase tracking-wider text-[11px]">Vous</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-slate-400">--</span>
                <span className="font-black text-brand-yellow font-mono text-[11px]">0 XP</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Student Count and Overlapping Avatars */}
        <div className="relative z-10 flex items-center justify-between max-w-sm mt-auto border-t border-white/10 pt-6">
          <div>
            <h4 className="text-xl md:text-2xl font-black text-white font-mono tracking-tight leading-none">
              4,200
            </h4>
            <p className="text-[10px] text-slate-300 uppercase tracking-widest font-extrabold mt-1">
              Étudiants inscrits
            </p>
          </div>

          <div className="flex items-center">
            {/* Multi-avatar stack */}
            <div className="flex -space-x-2">
              <img className="w-8 h-8 rounded-full border border-brand-blue object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Student" referrerPolicy="no-referrer" />
              <img className="w-8 h-8 rounded-full border border-brand-blue object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Student" referrerPolicy="no-referrer" />
              <img className="w-8 h-8 rounded-full border border-brand-blue object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" alt="Student" referrerPolicy="no-referrer" />
            </div>
            {/* Plus yellow badge */}
            <div className="w-8 h-8 rounded-full bg-brand-yellow text-brand-blue font-extrabold text-xs flex items-center justify-center border border-brand-blue -ml-2 font-mono shadow-md">
              +
            </div>
          </div>
        </div>

        {/* Pill Badges wrapped at the bottom */}
        <div className="relative z-10 flex flex-wrap gap-2 mt-6 max-w-sm">
          <span className="bg-white/10 border border-white/10 text-slate-200 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            📈 +34% d'amélioration moy.
          </span>
          <span className="bg-white/10 border border-white/10 text-slate-200 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            🏆 Top student
          </span>
          <span className="bg-white/10 border border-white/10 text-slate-200 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
            🔥 Streak record
          </span>
        </div>

      </div>

    </div>
  );
}
