/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Menu, Search, Moon, Star, Play, RotateCcw, Users, HelpCircle, 
  Calendar, Check, Flame, Clock, MessageSquare, Lock, ChevronRight, Sparkles, GraduationCap
} from "lucide-react";

interface DashboardWidgetProps {
  userXP: number;
  userStreak: number;
  setCurrentView: (view: string) => void;
  isPremium?: boolean;
  userFullName?: string;
  hideHeader?: boolean;
}

export default function DashboardWidget({ 
  userXP, 
  userStreak, 
  setCurrentView, 
  isPremium = false,
  userFullName = "Johnfavour",
  hideHeader = false
}: DashboardWidgetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((open) => !open);

  // Skills mastery progress values matching the screenshot
  const skills = [
    { name: "Grammaire", progress: 82 },
    { name: "Compréhension", progress: 65 },
    { name: "Rédaction", progress: 45 },
    { name: "Oral", progress: 30 }
  ];

  // Study partners list from the screenshot
  const studyPartners = [
    { name: "Amaka Madu", initials: "AM", status: "Actif • En Session", active: true },
    { name: "Kofi Osei", initials: "KO", status: "Dernier vu il y a 2h", active: false }
  ];

  return (
    <div className="w-full min-h-screen bg-[#fcfcfd] pb-16 font-sans antialiased text-[#002B5B]">
      
      {!hideHeader && (
        <>
          {/* Sidebar Backdrop */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}

          {/* Sidebar Drawer */}
          <aside
            className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-100 shadow-xl transform transition-transform duration-300 md:hidden ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100">
              <p className="text-sm font-black text-[#002B5B]">Menu</p>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
                aria-label="Fermer le menu"
              >
                <span className="text-xl font-black">×</span>
              </button>
            </div>
            <nav className="px-4 py-4 space-y-2">
              {[
                { label: "Tableau de Bord", view: "dashboard" },
                { label: "Parcours", view: "parcours" },
                { label: "Quiz", view: "quiz" },
                { label: "Validation IA", view: "validation" },
                { label: "Tuteur d'IA", view: "chat" },
                { label: "Profil", view: "profile" }
              ].map((item) => (
                <button
                  key={item.view}
                  onClick={() => {
                    setCurrentView(item.view);
                    setIsSidebarOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-2xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* 1. App Header Layout */}
          <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-4">
          {/* Menu Trigger */}
          <button 
            id="app-menu-toggle" 
            className="p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            onClick={toggleSidebar}
            title="Menu principal"
          >
            <Menu className="w-5 h-5 text-slate-500" />
          </button>
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setCurrentView("landing")}>
            <div className="bg-[#002B5B] p-1.5 md:p-2 rounded-xl text-white group-hover:bg-blue-800 transition-all shadow-md shrink-0">
              <GraduationCap className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-base md:text-lg tracking-tight text-[#002B5B] block leading-none">
                La Plume
              </span>
              <span className="text-[8px] md:text-[9px] uppercase tracking-widest font-mono text-amber-500 font-bold block -mt-0.5">
                French Prep
              </span>
            </div>
          </div>
        </div>

        {/* Center Search Bar */}
        <div className="hidden md:flex items-center relative w-full max-w-md mx-6">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            id="app-header-search"
            type="text"
            placeholder="Rechercher un cours, un badge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-brand-blue focus:bg-white rounded-xl py-2 px-10 text-xs font-medium text-slate-600 outline-hidden transition-all"
          />
        </div>

        {/* Right side Actions */}
        <div className="flex items-center gap-3">
          {/* Theme contrast icon */}
          <button 
            id="theme-contrast-toggle" 
            className="p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Changer de thème"
          >
            <Moon className="w-4 h-4" />
          </button>

          {/* Golden XP Pill */}
          <div className="flex items-center gap-1.5 bg-[#FFFCE8] border border-[#FFEB85] text-[#A67C00] px-3.5 py-1.5 rounded-full font-sans text-xs font-extrabold shadow-2xs">
            <div className="w-5 h-5 rounded-full bg-[#FFD214] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Star className="w-3 h-3 fill-white text-[#FFD214]" />
            </div>
            <span>{userXP} XP</span>
          </div>

          {/* User Initial Circle (JI for Johnfavour Igboeche) */}
          <div 
            id="user-profile-circle"
            className="w-8 h-8 rounded-full bg-[#002B5B] hover:bg-brand-blue-light transition-all flex items-center justify-center text-white text-xs font-black cursor-pointer border border-slate-100"
            onClick={() => setCurrentView("profile")}
            title="Profil"
          >
            JI
          </div>
        </div>
      </header>
        </>
      )}
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 mt-6 flex flex-col lg:flex-row gap-6">
        <aside className={`hidden ${isSidebarOpen ? "lg:block" : "lg:hidden"} w-80 shrink-0 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden`}>
          <div className="bg-slate-50 px-5 py-4 border-b border-slate-200">
            <p className="text-sm font-black text-[#002B5B]">Menu</p>
          </div>
          <div className="px-4 py-5 space-y-2">
            {[
              { label: "Tableau de Bord", view: "dashboard" },
              { label: "Parcours", view: "parcours" },
              { label: "Le Blitz", view: "blitz" },
              { label: "Quiz", view: "quiz" },
              { label: "Validation IA", view: "validation" },
              { label: "Tuteur d'IA", view: "chat" },
              { label: "Profil", view: "profile" }
            ].map((item) => (
              <button
                key={item.view}
                onClick={() => setCurrentView(item.view)}
                className="w-full text-left rounded-3xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="flex-1">
          <div className="max-w-5xl mx-auto">

        {/* Premium Banner Offer (Only shown if not premium) */}
        {!isPremium && (
          <div className="bg-amber-50/70 border border-amber-200/60 rounded-3xl p-4 md:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500 rounded-2xl text-white shadow-xs shrink-0">
                <Sparkles className="w-5 h-5 fill-white" />
              </div>
              <div>
                <p className="text-xs font-black text-amber-900 uppercase tracking-wider font-mono">Période d'essai active (Jour 3 sur 7) ⏳</p>
                <p className="text-[11px] text-amber-700 font-semibold mt-0.5">Profitez d'un accès de base. Libérez tout votre potentiel WAEC avec le Pass Premium.</p>
              </div>
            </div>
            <button
              id="upgrade-to-premium-dash"
              onClick={() => setCurrentView("plan-selection")}
              className="w-full sm:w-auto shrink-0 bg-[#002B5B] hover:bg-brand-blue-light text-white font-extrabold text-[10px] uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-sm text-center cursor-pointer flex items-center justify-center gap-1.5"
            >
              Devenir Premium
            </button>
          </div>
        )}

        {isPremium && (
          <div className="bg-emerald-50/60 border border-emerald-150 rounded-3xl p-4.5 mb-6 flex items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500 rounded-2xl text-white shadow-xs shrink-0">
                <Sparkles className="w-5 h-5 fill-white animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-black text-emerald-800 uppercase tracking-wider font-mono">Pass Premium Actif 🌟</p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Accès illimité à la Cohorte 1, mode Le Blitz et simulations d'examens.</p>
              </div>
            </div>
          </div>
        )}

        {/* 2. Welcome Hero Card Banner */}
        <div className="bg-[#002B5B] text-white rounded-3xl border border-blue-950 shadow-xl p-6 md:p-8 mb-6 relative overflow-hidden">
          {/* Background Ambient Decoratives */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-700/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h1 className="font-display font-black text-2xl md:text-3xl leading-tight tracking-tight flex items-center gap-2">
                Bon matin, {userFullName}! <span className="inline-block animate-bounce origin-bottom">✍🏽</span>
              </h1>
              <p className="text-blue-100/85 text-xs md:text-sm font-medium mt-2 leading-relaxed">
                Vous avez fait d'excellents progrès cette semaine. Plus que 18 jours pour maîtriser votre examen!
              </p>
              
              {/* Progress Tracker */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-[10px] md:text-xs font-extrabold uppercase tracking-widest text-blue-200 mb-2 font-mono">
                  <span>Progression Bootcamp</span>
                  <span>40%</span>
                </div>
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-[#FFD214] rounded-full" style={{ width: "40%" }} />
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              id="cta-continue-journey"
              onClick={() => setCurrentView("parcours")}
              className="shrink-0 bg-[#FFD214] hover:bg-yellow-400 text-[#002B5B] font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition-all shadow-md transform hover:scale-102 active:scale-100 flex items-center gap-1.5 cursor-pointer font-sans"
            >
              Continuer le parcours
            </button>
          </div>
        </div>

        {/* 3. Sub-navigation pill buttons */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none mb-6">
          <button 
            id="subnav-mes-cours"
            onClick={() => setCurrentView("mes-cours")}
            className="flex items-center gap-2 bg-blue-50/50 hover:bg-blue-100/65 border border-blue-100 text-[#002B5B] rounded-full px-5 py-2.5 text-xs font-bold shrink-0 transition-all cursor-pointer shadow-2xs"
          >
            <div className="w-4.5 h-4.5 bg-[#002B5B] text-white rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[10px] text-white" style={{ fontVariationSettings: "'FILL' 1" }}>auto_stories</span>
            </div>
            <span>Mes Cours d'Élite 📚</span>
          </button>

          <button 
            id="subnav-le-blitz"
            onClick={() => setCurrentView("blitz")}
            className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-800 rounded-full px-5 py-2.5 text-xs font-bold shrink-0 transition-all cursor-pointer shadow-2xs"
          >
            <div className="w-4.5 h-4.5 bg-[#FFD214] text-[#002B5B] rounded-full flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 fill-[#002B5B] text-[#002B5B]" />
            </div>
            <span>Le Blitz ⚡</span>
          </button>

          <button 
            id="subnav-current-session"
            onClick={() => setCurrentView("quiz")}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-full px-5 py-2.5 text-xs font-bold shrink-0 transition-all cursor-pointer shadow-2xs"
          >
            <div className="w-4.5 h-4.5 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center">
              <Play className="w-2.5 h-2.5 fill-brand-blue text-brand-blue" />
            </div>
            <span>Session en cours</span>
          </button>

          <button 
            id="subnav-revisions"
            onClick={() => setCurrentView("validation")}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-full px-5 py-2.5 text-xs font-bold shrink-0 transition-all cursor-pointer shadow-2xs"
          >
            <div className="w-4.5 h-4.5 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center">
              <RotateCcw className="w-3 h-3 text-brand-blue" />
            </div>
            <span>Révisions</span>
          </button>

          <button 
            id="subnav-study-room"
            onClick={() => setCurrentView("chat")}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-full px-5 py-2.5 text-xs font-bold shrink-0 transition-all cursor-pointer shadow-2xs"
          >
            <div className="w-4.5 h-4.5 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center">
              <Users className="w-3 h-3 text-brand-blue" />
            </div>
            <span>Salon d'étude</span>
          </button>

          <button 
            id="subnav-faq-waec"
            onClick={() => setCurrentView("landing")}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-full px-5 py-2.5 text-xs font-bold shrink-0 transition-all cursor-pointer shadow-2xs"
          >
            <div className="w-4.5 h-4.5 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center">
              <HelpCircle className="w-3 h-3 text-brand-blue" />
            </div>
            <span>FAQ WAEC</span>
          </button>
        </div>

        {/* 4. Bento Grid Row 1 (Mon Niveau, Maîtrise Compétences, Cohorte en cours) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
          {/* Card: Mon Niveau */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm relative flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-display font-black text-sm text-[#002B5B] uppercase tracking-wide">
                Mon Niveau
              </h4>
              <span className="text-amber-500 bg-amber-50 p-1.5 rounded-lg border border-amber-100">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              </span>
            </div>

            <div className="flex items-center gap-5 my-3">
              {/* Circular radial indicator */}
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="28" 
                    stroke="#F1F5F9" 
                    strokeWidth="5" 
                    fill="transparent" 
                  />
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="28" 
                    stroke="#FFD214" 
                    strokeWidth="5" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 28}
                    strokeDashoffset={2 * Math.PI * 28 * 0.3} // 70% progress ring
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute font-mono font-black text-xl text-slate-800">3</span>
              </div>

              <div>
                <p className="text-sm font-black text-[#002B5B]">Elite Cadet</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Suivant: Aspirant (1200 XP)</p>
              </div>
            </div>
          </div>

          {/* Card: Maîtrise Compétences */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h4 className="font-display font-black text-sm text-[#002B5B] uppercase tracking-wide mb-4">
              Maîtrise Compétences
            </h4>
            <div className="space-y-3">
              {skills.map((s, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                    <span>{s.name}</span>
                    <span className="font-mono">{s.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-50 border border-slate-100/50 rounded-full overflow-hidden">
                    <div className="h-full bg-[#002B5B] rounded-full" style={{ width: `${s.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Cohorte en Cours */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <h4 className="font-display font-black text-sm text-[#002B5B] uppercase tracking-wide">
                Cohorte en Cours
              </h4>
            </div>

            <div className="my-3 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0 shadow-3xs">
                <Calendar className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-800">1 Août - 31 Août</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Automne 2025</p>
              </div>
            </div>

            <div className="mt-1">
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-100 inline-flex items-center gap-1 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Statut: ACTIF
              </span>
            </div>
          </div>

        </div>

        {/* 5. Bento Grid Row 2 (Série de 7 jours, Précision Blitz, Dernière Activité) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
          {/* Card: Série de 7 Jours */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="font-display font-black text-sm text-[#002B5B] uppercase tracking-wide mb-3 flex items-center gap-1">
                Série de 7 Jours <span className="text-base">🔥</span>
              </h4>
            </div>

            <div className="grid grid-cols-7 gap-1.5 my-3">
              {[
                { label: "L", checked: true },
                { label: "M", checked: true },
                { label: "M", checked: true },
                { label: "J", checked: true },
                { label: "V", checked: true },
                { label: "S", checked: true },
                { label: "D", checked: false }
              ].map((day, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">{day.label}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    day.checked 
                      ? "bg-[#FFD214] text-[#002B5B] shadow-2xs" 
                      : "border-2 border-dashed border-slate-200 text-slate-300"
                  }`}>
                    {day.checked ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Précision Blitz */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <h4 className="font-display font-black text-sm text-[#002B5B] uppercase tracking-wide">
              Précision Blitz
            </h4>

            <div className="flex flex-col items-center justify-center my-2">
              <div className="relative w-20 h-11 overflow-hidden flex items-end justify-center">
                <svg className="w-20 h-20 absolute -bottom-9">
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="34" 
                    stroke="#F1F5F9" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray={Math.PI * 34}
                    strokeDashoffset={0}
                  />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="34" 
                    stroke="#002B5B" 
                    strokeWidth="6" 
                    fill="transparent" 
                    strokeDasharray={Math.PI * 34}
                    strokeDashoffset={Math.PI * 34 * 0.27} // 73% precision ring
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-mono font-black text-base text-slate-800 z-10 -mb-0.5">73%</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2.5">Dernières 24h</p>
            </div>
          </div>

          {/* Card: Dernière Activité */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <h4 className="font-display font-black text-sm text-[#002B5B] uppercase tracking-wide mb-3">
              Dernière Activité
            </h4>

            <div className="bg-[#f8fafc] border border-slate-150/60 rounded-2xl p-3.5 flex items-start gap-3 my-1">
              <div className="w-8 h-8 rounded-full bg-[#FFFCE8] border border-[#FFEB85] flex items-center justify-center shrink-0 shadow-3xs">
                <Star className="w-4 h-4 fill-[#FFD214] text-[#FFD214]" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-800">+350 XP gagnés</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Quiz de Grammaire complété</p>
              </div>
            </div>
          </div>

        </div>

        {/* 6. Middle Section Banner: Mission du Jour */}
        <div className="bg-white border-2 border-[#FFD214] rounded-3xl p-6 md:p-8 shadow-sm mb-6 relative overflow-hidden">
          {/* Clipboard SVG floating icon */}
          <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 opacity-10 text-slate-400 pointer-events-none hidden sm:block">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              <line x1="9" y1="10" x2="15" y2="10" />
              <line x1="9" y1="14" x2="15" y2="14" />
              <line x1="9" y1="18" x2="13" y2="18" />
            </svg>
          </div>

          <div className="relative z-10 max-w-xl">
            <span className="bg-[#FFD214] text-[#002B5B] text-[9px] font-black tracking-widest px-3 py-1 rounded-md uppercase font-mono shadow-3xs">
              MISSION DU JOUR
            </span>
            <h3 className="font-display font-black text-lg md:text-xl text-[#002B5B] mt-3.5">
              Le Passé Composé vs L'Imparfait
            </h3>
            <p className="text-slate-500 text-xs md:text-sm font-semibold mt-2 leading-relaxed">
              Maîtrisez les nuances des temps passés pour obtenir un score A en rédaction narrative.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                id="mission-btn-start"
                onClick={() => setCurrentView("quiz")}
                className="bg-[#002B5B] hover:bg-brand-blue-light text-white font-extrabold text-[11px] uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Commencer (15 min)
              </button>
              <button
                id="mission-btn-resources"
                onClick={() => setCurrentView("validation")}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-[#002B5B] font-extrabold text-[11px] uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer"
              >
                Ressources
              </button>
            </div>
          </div>
        </div>

        {/* 7. Bento Grid Row 3 (Événements Prochains, Communauté, Distribution XP) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
          {/* Card: Événements Prochains */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h4 className="font-display font-black text-sm text-[#002B5B] uppercase tracking-wide mb-4">
              Événements Prochains
            </h4>
            <div className="space-y-4">
              {/* Event 1 */}
              <div className="flex items-start gap-3">
                <span className="bg-blue-50 text-brand-blue font-mono font-black text-[10px] px-2.5 py-1.5 rounded-lg shrink-0">
                  16:00
                </span>
                <div>
                  <p className="text-xs font-black text-slate-800">Daily Blitz Challenge</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Aujourd'hui • Direct</p>
                </div>
              </div>

              {/* Event 2 */}
              <div 
                onClick={() => {
                  localStorage.removeItem("active_checkpoint_exam");
                  setCurrentView("exams");
                }}
                className="flex items-start gap-3 cursor-pointer hover:bg-rose-50/40 p-1.5 -m-1.5 rounded-xl transition-all"
                title="Accéder aux examens de contrôle (Checkpoints)"
              >
                <span className="bg-rose-50 text-rose-600 font-mono font-black text-[10px] px-2.5 py-1.5 rounded-lg shrink-0">
                  EXAM
                </span>
                <div>
                  <p className="text-xs font-black text-slate-800 hover:text-rose-600">Examens Checkpoint 1-4</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Contrôle Continu</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Communauté */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <h4 className="font-display font-black text-sm text-[#002B5B] uppercase tracking-wide mb-3">
              Communauté
            </h4>

            <div className="flex items-center gap-1.5 my-2">
              {/* Stacked avatars */}
              <div className="flex -space-x-2.5 overflow-hidden">
                <div className="inline-block h-7.5 w-7.5 rounded-full ring-2 ring-white bg-slate-200" />
                <div className="inline-block h-7.5 w-7.5 rounded-full ring-2 ring-white bg-slate-300" />
                <div className="inline-block h-7.5 w-7.5 rounded-full ring-2 ring-white bg-slate-400" />
                <div className="inline-block h-7.5 w-7.5 rounded-full ring-2 ring-white bg-[#002B5B] text-white text-[8px] font-black flex items-center justify-center">
                  +4.2k
                </div>
              </div>
            </div>

            <p className="text-slate-500 text-[11px] font-semibold leading-relaxed mb-4">
              4,200 étudiants sont en ligne maintenant. Prêt pour une étude de groupe ?
            </p>

            <button
              id="comm-join-chat"
              onClick={() => setCurrentView("chat")}
              className="text-xs font-extrabold text-[#002B5B] hover:underline flex items-center gap-1 cursor-pointer transition-all uppercase tracking-wider"
            >
              <span>Rejoindre le chat</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card: Distribution XP */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <h4 className="font-display font-black text-sm text-[#002B5B] uppercase tracking-wide mb-3">
              Distribution XP
            </h4>

            {/* Micro Custom Chart */}
            <div className="h-20 flex items-end justify-between gap-1.5 px-2 my-2">
              {[
                { height: "h-8", highlight: false },
                { height: "h-12", highlight: false },
                { height: "h-16", highlight: true },
                { height: "h-20", highlight: false },
                { height: "h-14", highlight: false },
                { height: "h-6", highlight: false }
              ].map((bar, i) => (
                <div 
                  key={i} 
                  className={`w-full ${bar.height} rounded-t-md transition-all ${
                    bar.highlight ? "bg-[#FFD214] shadow-3xs" : "bg-slate-200"
                  }`} 
                />
              ))}
            </div>

            <div className="flex justify-between items-center text-[8px] font-mono font-bold text-slate-400 border-t border-slate-50 pt-2 px-1">
              <span>0-200</span>
              <span className="text-[#A67C00] font-black">601-800</span>
              <span>1000+</span>
            </div>
          </div>

        </div>

        {/* 8. Row 4 (Ma Progression XP Line Chart, Badges Récents) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          
          {/* Card: Ma Progression XP */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm md:col-span-2 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-display font-black text-sm text-[#002B5B] uppercase tracking-wide">
                Ma Progression XP
              </h4>
              {/* Legend */}
              <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-wider font-mono">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-1 bg-[#FFD214] rounded-full inline-block" />
                  <span className="text-[#A67C00]">Vous</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-1 bg-slate-300 rounded-full inline-block" />
                  <span className="text-slate-400">Moyenne Cohorte</span>
                </div>
              </div>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="relative w-full h-36 my-3">
              <svg className="w-full h-full" viewBox="0 0 100 36" preserveAspectRatio="none">
                {/* Grid guidelines */}
                <line x1="0" y1="9" x2="100" y2="9" stroke="#F1F5F9" strokeWidth="0.5" strokeDasharray="1,1" />
                <line x1="0" y1="18" x2="100" y2="18" stroke="#F1F5F9" strokeWidth="0.5" strokeDasharray="1,1" />
                <line x1="0" y1="27" x2="100" y2="27" stroke="#F1F5F9" strokeWidth="0.5" strokeDasharray="1,1" />
                
                {/* Cohort average line */}
                <path 
                  d="M 5 28 L 20 27 L 35 24 L 50 25 L 65 21 L 80 18 L 95 15" 
                  fill="none" 
                  stroke="#CBD5E1" 
                  strokeWidth="0.75" 
                  strokeLinecap="round"
                />

                {/* User XP progression line */}
                <path 
                  d="M 5 32 L 20 26 L 35 19 L 50 20 L 65 15 L 80 11 L 95 7" 
                  fill="none" 
                  stroke="#FFD214" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                />

                {/* Data point dot highlights */}
                <circle cx="95" cy="7" r="1.2" fill="#FFD214" stroke="#002B5B" strokeWidth="0.5" />
                <circle cx="95" cy="15" r="1.2" fill="#CBD5E1" stroke="#002B5B" strokeWidth="0.5" />
              </svg>
            </div>

            <div className="flex justify-between items-center text-[9px] font-mono font-bold text-slate-400 border-t border-slate-50 pt-3">
              <span>LUN</span>
              <span>MAR</span>
              <span>MER</span>
              <span>JEU</span>
              <span>VEN</span>
              <span>SAM</span>
              <span>DIM</span>
            </div>
          </div>

          {/* Card: Badges Récents */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <h4 className="font-display font-black text-sm text-[#002B5B] uppercase tracking-wide mb-4">
              Badges Récents
            </h4>

            <div className="grid grid-cols-3 gap-2.5 my-2">
              {/* Early Bird */}
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shadow-3xs mb-1.5">
                  <Flame className="w-5 h-5 fill-amber-500" />
                </div>
                <span className="text-[9px] font-black leading-tight text-[#002B5B]">Early Bird</span>
              </div>

              {/* Grammar Pro */}
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-blue shadow-3xs mb-1.5">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-black leading-tight text-[#002B5B]">Grammar Pro</span>
              </div>

              {/* Maître Oral (Locked) */}
              <div className="flex flex-col items-center text-center opacity-40">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-400 shadow-3xs mb-1.5">
                  <Lock className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-semibold leading-tight text-slate-500">Maître Oral</span>
              </div>
            </div>
          </div>

        </div>

        {/* 9. Partenaires d'étude (Bottom Grid Component) */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm max-w-sm">
          <h4 className="font-display font-black text-sm text-[#002B5B] uppercase tracking-wide mb-4">
            Partenaires d'étude
          </h4>
          
          <div className="space-y-4">
            {studyPartners.map((partner, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Initials avatar circle */}
                  <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-700 shrink-0">
                    {partner.initials}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">{partner.name}</p>
                    <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                      {partner.active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />}
                      {partner.status}
                    </p>
                  </div>
                </div>

                {/* Direct Message chat button */}
                <button 
                  id={`chat-partner-${idx}`}
                  onClick={() => setCurrentView("chat")}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-500 hover:text-brand-blue transition-colors cursor-pointer"
                  title="Envoyer un message"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  </div>
</div>
  );
}
