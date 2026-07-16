import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, Star, Play, Lock, Settings, Bell, ChevronRight, Sparkles,
  Mic, Trophy, BookOpen, Compass, Award, Activity, Heart, ArrowLeft, Check,
  Volume2, CheckCircle2, MessageSquare, Flag, Mail, Newspaper, FileEdit, X, Shield, Menu, Search, Moon, RotateCcw, Users, HelpCircle, Calendar, Flame, Clock
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const userXP = user?.xp ?? 680;
  const userStreak = user?.streak ?? 12;
  const isPremium = user?.isPremium ?? false;

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Skills mastery progress values
  const skills = [
    { name: "Grammaire", progress: 82 },
    { name: "Compréhension", progress: 65 },
    { name: "Rédaction", progress: 45 },
    { name: "Oral", progress: 30 }
  ];

  // Study partners list
  const studyPartners = [
    { name: "Amaka Madu", initials: "AM", status: "Actif • En Session", active: true },
    { name: "Kofi Osei", initials: "KO", status: "Dernier vu il y a 2h", active: false }
  ];

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  const handleSetCurrentView = (view: string) => {
    if (view === "dashboard") navigate("/dashboard");
    else if (view === "parcours") navigate("/parcours");
    else if (view === "blitz") navigate("/blitz");
    else if (view === "quiz") navigate("/quiz");
    else if (view === "validation") navigate("/validation");
    else if (view === "chat") navigate("/chat");
    else if (view === "profile") navigate("/profil");
    else if (view === "plan-selection") navigate("/plan-selection");
    else if (view === "landing") navigate("/");
    else if (view === "ranking" || view === "classement") navigate("/classement");
    else if (view === "mes-cours") navigate("/mes-cours");
    else if (view === "exams") navigate("/examens");
    else if (view === "la-lettre") navigate("/projets/la-lettre");
    else if (view === "la-traduction") navigate("/projets/la-traduction");
    else if (view === "la-debat") navigate("/projets/la-debat");
    else if (view === "la-oral") navigate("/projets/la-oral");
    else if (view === "onboarding") navigate("/onboarding");
  };

  // Sidebar navigation options
  const sidebarItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: Compass, active: true },
    { id: "parcours", label: "Parcours", icon: Award },
    { id: "courses", label: "Mes Cours", icon: BookOpen },
    { id: "blitz", label: "Le Blitz", icon: Play },
    { id: "leaderboard", label: "Classement", icon: Trophy },
    { id: "progression", label: "Ma Progression", icon: Activity },
    { id: "badges", label: "Mes Badges", icon: Star },
    { id: "certificate", label: "Certificat", icon: Award },
  ];

  return (
    <div className="w-full min-h-screen bg-[#fcfcfd] text-slate-800 flex font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1. Side Navigation Rail */}
      <aside className={`border-r border-slate-100 bg-white flex flex-col justify-between shrink-0 fixed md:sticky left-0 top-0 h-screen z-50 transition-all duration-300 ${
        isSidebarOpen 
          ? "w-64 translate-x-0 opacity-100" 
          : "w-0 -translate-x-full md:translate-x-0 md:opacity-0 md:w-0 overflow-hidden border-r-0 pointer-events-none"
      }`}>
        <div className="p-6">
          {/* Logo with Cap Icon */}
          <div className="flex items-center justify-between mb-8">
            <div 
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => handleSetCurrentView("landing")}
            >
              <div className="bg-[#002B5B] p-1.5 rounded-xl text-white group-hover:bg-blue-800 transition-all shadow-md shrink-0">
                <GraduationCap className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-display font-black text-lg tracking-tight text-[#002B5B] block leading-none">
                  La Plume
                </span>
                <span className="text-[9px] uppercase tracking-widest font-mono text-amber-500 font-bold block -mt-0.5">
                  French Prep
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`sidebar-item-${item.id}`}
                  onClick={() => {
                    if (item.id === "dashboard") handleSetCurrentView("dashboard");
                    else if (item.id === "parcours") handleSetCurrentView("parcours");
                    else if (item.id === "blitz") handleSetCurrentView("blitz");
                    else if (item.id === "exams") handleSetCurrentView("exams");
                    else if (item.id === "leaderboard") handleSetCurrentView("classement");
                    else if (item.id === "badges" || item.id === "certificate") handleSetCurrentView("profile");
                    else if (item.id === "courses") handleSetCurrentView("mes-cours");
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    item.active 
                      ? "bg-blue-50 text-blue-700 border border-blue-100" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${item.active ? "text-blue-600" : ""}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.id === "exams" && (
                    <span className="bg-rose-500/15 text-rose-400 text-[8px] font-mono font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm border border-rose-500/25">IA</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Settings */}
        <div className="p-6 border-t border-slate-100">
          <button 
            onClick={() => handleSetCurrentView("dashboard")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer"
          >
            <Settings className="w-4 h-4" />
            <span>Paramètres</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        
        {/* Top Header Navigation */}
        <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-100 px-8 py-4 h-16 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer shrink-0"
              title="Menu principal"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="font-display font-black text-lg text-[#002B5B] tracking-tight">
              La Plume Africa
            </span>
            <div className="hidden md:flex items-center bg-amber-50 border border-amber-200 px-3 py-1 rounded-full gap-2">
              <span className="text-amber-700 text-xs font-mono font-black animate-pulse flex items-center gap-1">
                ⚡ {userXP} XP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Center Search Bar */}
            <div className="hidden md:flex items-center relative w-full max-w-md mx-6">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="app-header-search"
                type="text"
                placeholder="Rechercher un cours, un badge..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl py-2 px-10 text-xs font-medium text-slate-600 outline-none transition-all"
              />
            </div>

            <nav className="hidden md:flex gap-6 text-xs font-bold">
              <button onClick={() => handleSetCurrentView("landing")} className="text-slate-500 hover:text-blue-600 transition-colors">Home</button>
              <button onClick={() => handleSetCurrentView("dashboard")} className="text-[#002B5B] border-b-2 border-[#002B5B] pb-1 font-black">Dashboard</button>
              <button onClick={() => handleSetCurrentView("plan-selection")} className="text-slate-500 hover:text-blue-600 transition-colors">Pricing</button>
            </nav>

            <div className="flex items-center gap-4">
              {/* Theme contrast icon */}
              <button 
                id="theme-contrast-toggle" 
                className="p-2 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                title="Changer de thème"
              >
                <Moon className="w-4 h-4" />
              </button>

              <button className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 relative cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
              </button>
              
              <div 
                className="w-10 h-10 rounded-full border-2 border-amber-400 p-0.5 shrink-0 cursor-pointer"
                onClick={() => handleSetCurrentView("profile")}
              >
                <div className="w-full h-full rounded-full bg-[#002B5B] flex items-center justify-center text-white text-xs font-black">
                  JI
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Scrollable Content */}
        <main className="flex-1 relative overflow-y-auto custom-scrollbar h-[calc(100vh-8rem)] bg-[#fcfcfd] text-slate-800 p-8">
          
          {/* Premium Banner Offer (Only shown if not premium) */}
          {!isPremium ? (
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-3xl p-4 md:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
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
                onClick={() => handleSetCurrentView("plan-selection")}
                className="w-full sm:w-auto shrink-0 bg-[#002B5B] hover:bg-blue-800 text-white font-extrabold text-[10px] uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-sm text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                Devenir Premium
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-3xl p-4.5 mb-6 flex items-center justify-between gap-4 shadow-sm">
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

          {/* Welcome Hero Card Banner */}
          <div className="bg-[#002B5B] text-white rounded-3xl border border-blue-950 shadow-xl p-6 md:p-8 mb-6 relative overflow-hidden">
            {/* Background Ambient Decoratives */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-700/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <h1 className="font-display font-black text-2xl md:text-3xl leading-tight tracking-tight flex items-center gap-2">
                  Bon matin, {user?.name ?? "Johnfavour"}! <span className="inline-block animate-bounce origin-bottom">✍🏽</span>
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
                onClick={() => handleSetCurrentView("parcours")}
                className="shrink-0 bg-[#FFD214] hover:bg-yellow-400 text-[#002B5B] font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition-all shadow-md transform hover:scale-102 active:scale-100 flex items-center gap-1.5 cursor-pointer font-sans"
              >
                Continuer le parcours
              </button>
            </div>
          </div>

          {/* Sub-navigation pill buttons */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 scrollbar-none mb-6">
            <button 
              id="subnav-mes-cours"
              onClick={() => handleSetCurrentView("mes-cours")}
              className="flex items-center gap-2 bg-blue-50/50 hover:bg-blue-100/65 border border-blue-100 text-[#002B5B] rounded-full px-5 py-2.5 text-xs font-bold shrink-0 transition-all cursor-pointer shadow-sm"
            >
              <div className="w-4.5 h-4.5 bg-[#002B5B] text-white rounded-full flex items-center justify-center">
                <BookOpen className="w-2.5 h-2.5" />
              </div>
              <span>Mes Cours d'Élite 📚</span>
            </button>

            <button 
              id="subnav-le-blitz"
              onClick={() => handleSetCurrentView("blitz")}
              className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-800 rounded-full px-5 py-2.5 text-xs font-bold shrink-0 transition-all cursor-pointer shadow-sm"
            >
              <div className="w-4.5 h-4.5 bg-[#FFD214] text-[#002B5B] rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 fill-[#002B5B]" />
              </div>
              <span>Le Blitz ⚡</span>
            </button>

            <button 
              id="subnav-current-session"
              onClick={() => handleSetCurrentView("quiz")}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-full px-5 py-2.5 text-xs font-bold shrink-0 transition-all cursor-pointer shadow-sm"
            >
              <div className="w-4.5 h-4.5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <Play className="w-2.5 h-2.5 fill-blue-600" />
              </div>
              <span>Session en cours</span>
            </button>

            <button 
              id="subnav-revisions"
              onClick={() => handleSetCurrentView("validation")}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-full px-5 py-2.5 text-xs font-bold shrink-0 transition-all cursor-pointer shadow-sm"
            >
              <div className="w-4.5 h-4.5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <RotateCcw className="w-3 h-3" />
              </div>
              <span>Révisions</span>
            </button>

            <button 
              id="subnav-study-room"
              onClick={() => handleSetCurrentView("chat")}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-full px-5 py-2.5 text-xs font-bold shrink-0 transition-all cursor-pointer shadow-sm"
            >
              <div className="w-4.5 h-4.5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-3 h-3" />
              </div>
              <span>Salon d'étude</span>
            </button>

            <button 
              id="subnav-faq-waec"
              onClick={() => handleSetCurrentView("landing")}
              className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-100 rounded-full px-5 py-2.5 text-xs font-bold shrink-0 transition-all cursor-pointer shadow-sm"
            >
              <div className="w-4.5 h-4.5 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <HelpCircle className="w-3 h-3" />
              </div>
              <span>FAQ WAEC</span>
            </button>
          </div>

          {/* Bento Grid Row 1 (Mon Niveau, Maîtrise Compétences, Cohorte en cours) */}
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
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shrink-0 shadow-xs">
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

          {/* Bento Grid Row 2 (Série de 7 jours, Précision Blitz, Dernière Activité) */}
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
                        ? "bg-[#FFD214] text-[#002B5B] shadow-xs" 
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

              <div className="bg-[#f8fafc] border border-slate-100/60 rounded-2xl p-3.5 flex items-start gap-3 my-1">
                <div className="w-8 h-8 rounded-full bg-[#FFFCE8] border border-[#FFEB85] flex items-center justify-center shrink-0 shadow-xs">
                  <Star className="w-4 h-4 fill-[#FFD214]" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">+350 XP gagnés</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Quiz de Grammaire complété</p>
                </div>
              </div>
            </div>

          </div>

          {/* Middle Section Banner: Mission du Jour */}
          <div className="bg-white border-2 border-[#FFD214] rounded-3xl p-6 md:p-8 shadow-sm mb-6 relative overflow-hidden">
            <div className="relative z-10 max-w-xl">
              <span className="bg-[#FFD214] text-[#002B5B] text-[9px] font-black tracking-widest px-3 py-1 rounded-md uppercase font-mono shadow-xs">
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
                  onClick={() => handleSetCurrentView("quiz")}
                  className="bg-[#002B5B] hover:bg-blue-800 text-white font-extrabold text-[11px] uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Commencer (15 min)
                </button>
                <button
                  id="mission-btn-resources"
                  onClick={() => handleSetCurrentView("validation")}
                  className="bg-white hover:bg-slate-50 border border-slate-200 text-[#002B5B] font-extrabold text-[11px] uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer"
                >
                  Ressources
                </button>
              </div>
            </div>
          </div>

          {/* Bento Grid Row 3 (Événements Prochains, Communauté, Distribution XP) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            
            {/* Card: Événements Prochains */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h4 className="font-display font-black text-sm text-[#002B5B] uppercase tracking-wide mb-4">
                Événements Prochains
              </h4>
              <div className="space-y-4">
                {/* Event 1 */}
                <div className="flex items-start gap-3">
                  <span className="bg-blue-50 text-blue-600 font-mono font-black text-[10px] px-2.5 py-1.5 rounded-lg shrink-0">
                    16:00
                  </span>
                  <div>
                    <p className="text-xs font-black text-slate-800">Daily Blitz Challenge</p>
                    <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Aujourd'hui • Direct</p>
                  </div>
                </div>

                {/* Event 2 */}
                <div 
                  onClick={() => handleSetCurrentView("exams")}
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
                onClick={() => handleSetCurrentView("chat")}
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
                      bar.highlight ? "bg-[#FFD214] shadow-xs" : "bg-slate-200"
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

          {/* Row 4 (Ma Progression XP Line Chart, Badges Récents) */}
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
                  <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shadow-xs mb-1.5">
                    <Flame className="w-5 h-5 fill-amber-500" />
                  </div>
                  <span className="text-[9px] font-black leading-tight text-[#002B5B]">Early Bird</span>
                </div>

                {/* Grammar Pro */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-xs mb-1.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black leading-tight text-[#002B5B]">Grammar Pro</span>
                </div>

                {/* Maître Oral (Locked) */}
                <div className="flex flex-col items-center text-center opacity-40">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shadow-xs mb-1.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-semibold leading-tight text-slate-500">Maître Oral</span>
                </div>
              </div>
            </div>

          </div>

          {/* Partenaires d'étude (Bottom Grid Component) */}
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
                    onClick={() => handleSetCurrentView("chat")}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Envoyer un message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}
