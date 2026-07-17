import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Settings,
  Bell,
  Menu,
  ArrowLeft,
  Wallet,
  Star,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Plus,
  ArrowRight,
  CreditCard,
  Trophy,
  CheckCircle
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import ClaimModal from "../../components/ClaimModal";

export default function WalletPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isClaimSuccess, setIsClaimSuccess] = useState(false);

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
    else if (view === "wallet") navigate("/wallet");
  };

  // Sidebar navigation options
  const sidebarItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: GraduationCap },
    { id: "parcours", label: "Parcours", icon: Trophy },
    { id: "courses", label: "Mes Cours", icon: GraduationCap },
    { id: "blitz", label: "Le Blitz", icon: Star },
    { id: "leaderboard", label: "Classement", icon: Trophy },
    { id: "wallet", label: "Portefeuille", icon: Wallet, active: true },
  ];

  // Transaction history data
  const transactionHistory = [
    {
      id: 1,
      title: "Bourse L'Excellence Foundation",
      description: "Attribué pour réussite au concours mensuel",
      amount: "+ 10 000 ₦",
      status: "En attente",
      isPositive: true,
      icon: CheckCircle2,
      color: "bg-emerald-500/10 text-emerald-500"
    },
    {
      id: 2,
      title: "Récompense Blitz Series",
      description: "Série de 10 réponses correctes",
      amount: "+ 500 ₦",
      status: "12 Oct 2023",
      isPositive: true,
      icon: Trophy,
      color: "bg-blue-500/10 text-blue-500"
    },
    {
      id: 3,
      title: "Bonus Parrainage Étudiant",
      description: "Adhésion de 'Aissatou M.'",
      amount: "+ 2 000 ₦",
      status: "05 Oct 2023",
      isPositive: true,
      icon: Star,
      color: "bg-amber-500/10 text-amber-500"
    },
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
                    else if (item.id === "wallet") handleSetCurrentView("wallet");
                    else if (item.id === "leaderboard") handleSetCurrentView("classement");
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
              Portefeuille
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 relative cursor-pointer">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-rose-500" />
              </button>
              
              <div 
                className="w-10 h-10 rounded-full border-2 border-amber-400 p-0.5 shrink-0 cursor-pointer"
                onClick={() => handleSetCurrentView("profile")}
              >
                <div className="w-full h-full rounded-full bg-[#002B5B] flex items-center justify-center text-white text-xs font-black">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "JI"}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Scrollable Content */}
        <main className="flex-1 relative overflow-y-auto custom-scrollbar h-[calc(100vh-8rem)] bg-[#fcfcfd] text-slate-800 p-8">
          
          {/* Top Announcement Banner */}
          <div className="w-full bg-amber-50 text-amber-800 font-medium text-xs md:text-sm py-3 px-6 rounded-2xl flex justify-center items-center text-center gap-2 mb-6 border border-amber-100">
            <span className="material-symbols-outlined text-base">campaign</span>
            <span>Live Pilot Active: High-barrier language and oral engine live for testing</span>
          </div>

          {/* Hero Section: Premium Scholarship Card */}
          <section className="relative overflow-hidden rounded-3xl bg-[#002B5B] text-white p-6 md:p-8 lg:p-10 shadow-xl mb-8">
            {/* Abstract Animation Placeholder Background */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none">
              <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-10 w-48 h-48 bg-blue-400/20 rounded-full blur-2xl" />
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400 text-[#002B5B] font-bold text-xs uppercase tracking-wider">
                  <Star className="w-4 h-4 fill-amber-400" />
                  Fonds Débloqués
                </span>
                <h3 className="font-display font-black text-2xl md:text-3xl leading-tight">
                  Bourse L'Excellence <br /> Foundation
                </h3>
                <p className="text-blue-100/90 text-sm max-w-md font-medium">
                  Félicitations, {user?.name ?? "Jean-Igor"}! Vos performances exceptionnelles en français vous ont valu cette bourse de mérite académique.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  {!isClaimSuccess ? (
                    <button
                      onClick={() => setIsClaimModalOpen(true)}
                      className="bg-white text-[#002B5B] px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Wallet className="w-4 h-4" />
                      Réclamer mes 10 000 ₦
                    </button>
                  ) : (
                    <button
                      disabled
                      className="bg-emerald-500 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Réclamation Enregistrée!
                    </button>
                  )}
                  <button className="bg-[#002B5B]/30 border border-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-bold hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
                    <ShieldCheck className="w-4 h-4" />
                    Détails du Fonds
                  </button>
                </div>
              </div>

              <div className="hidden lg:flex justify-end">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 w-72 rotate-3 transform hover:rotate-0 transition-all duration-500">
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-[#002B5B]" />
                    </div>
                    <CreditCard className="w-8 h-8 text-white/50" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] text-white/60 uppercase tracking-widest font-mono">Titulaire</p>
                    <p className="font-display text-lg font-black">
                      {user?.name ? user.name.toUpperCase() : "JEAN-IGOR KOUAMÉ"}
                    </p>
                  </div>
                  <div className="mt-6 flex justify-between items-end">
                    <p className="font-mono tracking-widest text-white/90">•••• •••• 10k</p>
                    <div className="w-10 h-6 bg-white/20 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Wallet Stats Bento Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Balance Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Wallet className="w-6 h-6" />
                </div>
                <span className="text-emerald-500 flex items-center text-xs font-bold gap-1">+12% <ArrowRight className="w-3 h-3 rotate-[-45deg]" /></span>
              </div>
              <p className="text-slate-500 font-medium text-sm">Solde Actuel</p>
              <h4 className="font-display font-black text-2xl text-[#002B5B] mt-1">10 000 ₦</h4>
              <p className="text-[10px] text-slate-400 mt-2 italic">Dernière mise à jour: Aujourd'hui</p>
            </div>

            {/* XP to Cash Converter */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <Star className="w-6 h-6 fill-amber-600" />
                </div>
              </div>
              <p className="text-slate-500 font-medium text-sm">Points Convertibles</p>
              <h4 className="font-display font-black text-2xl text-[#002B5B] mt-1">4 250 XP</h4>
              <p className="text-xs text-slate-500 mt-2">Équivalent à ≈ 850 ₦</p>
            </div>

            {/* Rewards Status */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
              <p className="text-slate-500 font-medium text-sm">Statut de Compte</p>
              <h4 className="font-display font-black text-2xl text-[#002B5B] mt-1">Vérifié</h4>
              <p className="text-xs text-emerald-600 flex items-center gap-1 mt-2 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                KYC Complété
              </p>
            </div>

            {/* Next Payout */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>
              <p className="text-slate-500 font-medium text-sm">Prochain Paiement</p>
              <h4 className="font-display font-black text-2xl text-[#002B5B] mt-1">Le 28 Oct</h4>
              <p className="text-xs text-slate-500 mt-2">Clôture des examens Friday</p>
            </div>
          </section>

          {/* Bottom Content Split */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Transaction History */}
            <section className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-display font-black text-lg text-[#002B5B]">Historique des Gains</h3>
                <button className="text-blue-600 font-medium text-sm flex items-center gap-1 hover:underline cursor-pointer">
                  Voir tout <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {transactionHistory.map((transaction) => {
                  const Icon = transaction.icon;
                  return (
                    <div key={transaction.id} className="p-5 hover:bg-slate-50 transition-all duration-200 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full ${transaction.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-[#002B5B]">{transaction.title}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{transaction.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-sm ${transaction.isPositive ? "text-emerald-600" : "text-slate-800"}`}>
                          {transaction.amount}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{transaction.status}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Banking Connections & Actions */}
            <section className="space-y-6">
              {/* Link Bank Card */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-5">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-[#002B5B]" />
                  <h3 className="font-display font-black text-lg text-[#002B5B]">Retrait de fonds</h3>
                </div>
                <p className="text-sm text-slate-500 font-medium">
                  Connectez votre compte bancaire pour transférer vos bourses directement.
                </p>
                <div className="p-6 bg-white rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-slate-50 transition-all duration-200 group">
                  <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:border-blue-600" />
                  </div>
                  <span className="font-medium text-blue-600">Ajouter une banque</span>
                </div>
                <button className="w-full py-3 bg-blue-600 text-white rounded-full font-bold shadow-md hover:bg-blue-700 transition-all duration-200 opacity-50 cursor-not-allowed">
                  Transférer vers ma banque
                </button>
              </div>

              {/* Security Info */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div className="space-y-2">
                    <h4 className="font-bold text-sm text-[#002B5B]">Sécurité L'Excellence</h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Vos fonds sont garantis par le fonds de réserve de l'académie et sécurisés par cryptage de bout en bout.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Claim Modal */}
      {isClaimModalOpen && (
        <ClaimModal
          onClose={() => setIsClaimModalOpen(false)}
          onSuccess={(studentName) => {
            setIsClaimModalOpen(false);
            setIsClaimSuccess(true);
          }}
        />
      )}
    </div>
  );
}
