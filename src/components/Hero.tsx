/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Users, Flame, HelpCircle, BookOpen, AlertCircle, XCircle, CheckCircle, 
  Sparkles, Award, ArrowRight, ShieldCheck, PlayCircle, Globe, GraduationCap,
  Trophy, Check, X, Headphones, Volume2, Calendar, ShieldAlert, Video, FileCheck
} from "lucide-react";

interface HeroProps {
  setCurrentView: (view: string) => void;
  openSignupModal: () => void;
  language?: 'en' | 'fr';
  onLanguageToggle?: () => void;
}

export default function Hero({ setCurrentView, openSignupModal, language = 'en', onLanguageToggle }: HeroProps) {
  // Live Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 23,
    hours: 22,
    minutes: 45,
    seconds: 14
  });

  // Interactive Blitz Demo State
  const [blitzSelectedOption, setBlitzSelectedOption] = useState<string | null>(null);
  const [blitzCorrect, setBlitzCorrect] = useState<boolean | null>(null);
  const [blitzTimer, setBlitzTimer] = useState<number>(45); // countdown for interactive demo

  // Gamified Leaderboard Demo State
  const [amaraXP, setAmaraXP] = useState<number>(1220);
  const [hasClaimedXPDemo, setHasClaimedXPDemo] = useState<boolean>(false);

  // Countdown timer for cohort closes
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Timer for interactive Blitz card
  useEffect(() => {
    const bTimer = setInterval(() => {
      setBlitzTimer((prev) => (prev > 1 ? prev - 1 : 45));
    }, 1000);
    return () => clearInterval(bTimer);
  }, []);

  const handleBlitzSelect = (option: string) => {
    setBlitzSelectedOption(option);
    const isCorrect = option === "B"; // B is the correct answer: "serais venu"
    setBlitzCorrect(isCorrect);
    
    // Reward Amara +50 XP if correct and hasn't claimed yet
    if (isCorrect && !hasClaimedXPDemo) {
      setAmaraXP((prev) => prev + 50);
      setHasClaimedXPDemo(true);
    }
  };

  const resetBlitzDemo = () => {
    setBlitzSelectedOption(null);
    setBlitzCorrect(null);
    setBlitzTimer(45);
  };

  const heroStudentImage = new URL(
    "../assets/images/download (1).jpg",
    import.meta.url
  ).href;

  const registeredCountries = [
    { logo: new URL("../assets/images/images1.jpg", import.meta.url).href, flag: "🇳🇬", name: "Nigeria" },
    { logo: new URL("../assets/images/Ghana.jpg", import.meta.url).href, name: "Ghana" },
    { logo: new URL("../assets/images/kenya.jpg", import.meta.url).href, name: "Kenya" },
    { logo: new URL("../assets/images/Sierra Leone.jpg", import.meta.url).href, name: "Sierra Leone" },
    { logo: new URL("../assets/images/liberia.jpg", import.meta.url).href, name: "Liberia" }
  ];

  // 6 Reality Points matching the screenshot exactly
  const realities = [
    {
      title: "No structured study plan",
      desc: "Wandering standard plans of syllabus items will leave you without direction."
    },
    {
      title: "Past questions with no explanations",
      desc: "Human brains learn by correcting mistakes, books leave you with 'why?' at 11 night."
    },
    {
      title: "Zero oral and listening practice",
      desc: "WAEC expects real conversational gift; school mostly provides black audio record."
    },
    {
      title: "Studying alone with no accountability",
      desc: "It's easy to lose motivation when you're the only one preparing in your room."
    },
    {
      title: "Expensive tutors families can't afford",
      desc: "Private tutors charge astronomical rates, locking out thousands of bright students."
    },
    {
      title: "No way to track improvement",
      desc: "You go to the exam with diagnostic blindspots, not knowing your grammatical weaknesses."
    }
  ];

  // 8 Solution Points matching the screenshot exactly
  const solutions = [
    {
      title: "30-Day Structured Bootcamp",
      desc: "A daily, step-by-step roadmap covering all WAEC French topics from grammar to letter-writing.",
      icon: Calendar,
      color: "bg-amber-50 text-amber-600 border-amber-100"
    },
    {
      title: "Le Blitz — Timed Theory, objective and oral Challenges",
      desc: "practice Grammar, spelling, and Syntax under real exam pressure.",
      icon: Flame,
      color: "bg-amber-500 text-white border-amber-600"
    },
    {
      title: "Weekly Proctored practical projects",
      desc: "Simulate real exam tests with timed essays and oral presentation exams.",
      icon: ShieldAlert,
      color: "bg-blue-50 text-blue-600 border-blue-100"
    },
    {
      title: "Live National Leaderboard",
      desc: "Compete with peers across Nigeria, Ghana, and Anglophone Africa for daily XP superiority.",
      icon: Trophy,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100"
    },
    {
      title: "AI-Powered Answer Validation",
      desc: "Instant feedback explaining your essay mistakes, syntax propagation, and vocabulary suggestions.",
      icon: Sparkles,
      color: "bg-purple-50 text-purple-600 border-purple-100"
    },
    {
      title: "Oral and Listening Practice",
      desc: "High-quality audio tracks and voice practice mimicking real WAEC oral assessment formats.",
      icon: Headphones,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100"
    },
    {
      title: "Expert Video Explanations",
      desc: "Step-by-step videos for every single essay question, curated by WAEC French teachers.",
      icon: Video,
      color: "bg-rose-50 text-rose-600 border-rose-100"
    },
    {
      title: "Verified Completion Certificate",
      desc: "Earn a formal credential of French proficiency with a detailed sub-criteria report upon finishing.",
      icon: FileCheck,
      color: "bg-slate-50 text-slate-700 border-slate-200"
    }
  ];

  // 4 steps to French excellence
  const steps = [
    {
      num: "01",
      title: "Register",
      desc: "Create your profile in 1 minute. Registration is completely free."
    },
    {
      num: "02",
      title: "Learn",
      desc: "Complete daily bite-sized video tutorials, dark drills, and essay modules."
    },
    {
      num: "03",
      title: "Compete",
      desc: "Fight for supremacy on the Leaderboard by completing timed challenges."
    },
    {
      num: "04",
      title: "Conquer",
      desc: "Walk into the WAEC exam hall with absolute fluency and confidence."
    }
  ];

  // Syllabus Segment Cards
  const syllabusSeries = [
    {
      id: "Series 1",
      title: "Objective",
      items: ["Grammar rules", "Idiomatic Vocabulary", "Text comprehension"]
    },
    {
      id: "Series 2",
      title: "Theory",
      items: ["Essay construction", "Formal Letter Writing", "English-French Translation"]
    },
    {
      id: "Series 3",
      title: "Oral",
      items: ["Audio listening tracks", "Pronunciation diagnostics", "Spoken conversation skills"]
    },
    {
      id: "Series 4",
      title: "Le Blitz",
      items: ["High-pressure theory mocks", "Conjugations and synonyms", "Time management skills"]
    }
  ];

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-white via-slate-50/50 to-white px-4 md:px-8 pt-12 pb-20 md:py-24 relative overflow-hidden">
        
        {/* Decorative Grid or Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-40">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-100 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* LHS Hero Text Block - takes 7 columns */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-blue-50 text-brand-blue border border-blue-100 text-xs md:text-sm font-semibold px-4 py-1.5 rounded-full mb-6 shadow-xs animate-float-fast">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Cohort 1 is now open · Limited spots available · Register today
            </div>

            {/* Heading */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-brand-blue mb-6 leading-[1.08]">
              MASTER FRENCH. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue-light via-blue-700 to-indigo-900">DOMINATE WAEC.</span>
            </h1>

            {/* Subheading */}
            <p className="text-slate-500 text-base md:text-lg lg:text-xl max-w-2xl mb-10 leading-relaxed font-medium">
              West Africa's first French-exam-bootcamp. 30-Days. One Cohort. Thousands of students across Anglophone Africa. One goal — excellence.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10">
              <button
                onClick={openSignupModal}
                className="w-full sm:w-auto bg-brand-blue hover:bg-brand-blue-light text-white font-extrabold text-base px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-2"
              >
                {language === 'en' ? 'Join Cohort — Free' : 'Rejoindre la cohorte — Gratuit'}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById("how-it-works");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-brand-blue border-2 border-brand-blue/10 hover:border-brand-blue font-bold text-base px-8 py-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlayCircle className="w-5 h-5 text-brand-blue" />
                {language === 'en' ? 'How it Works' : 'Comment ça marche'}
              </button>
            </div>
            <div className="flex justify-center lg:justify-start mb-8">
              <button
                onClick={onLanguageToggle}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
              >
                <Globe className="w-4 h-4 text-slate-600" />
                {language === 'en' ? 'Switch to French' : 'Passer en anglais'}
              </button>
            </div>

            {/* Social Proof Avatars */}
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-100 shadow-sm w-full sm:w-auto justify-center lg:justify-start">
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" alt="Student" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100" alt="Student" />
                <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100" alt="Student" />
              </div>
              <span className="text-xs md:text-sm font-semibold text-slate-700">
                Rejoint par <strong className="text-brand-blue">4,200+ étudiants</strong> africains
              </span>
            </div>

          </div>

          {/* RHS Hero Image Block with Floating Badges - takes 5 columns */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end py-8">
            
            <div className="relative w-full max-w-[390px] md:max-w-[420px] lg:mr-4">
              
              {/* Backglow element */}
              <div className="absolute inset-4 bg-amber-400/20 rounded-3xl blur-2xl transform rotate-3 -z-10" />
              
              {/* Main Rounded Image */}
              <div className="relative rounded-3xl overflow-hidden border-[12px] border-white shadow-2xl aspect-square bg-slate-100">
                <img 
                  src={heroStudentImage}
                  alt="Smiling African Student" 
                  className="w-full h-full object-cover transform hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floater Badge 1: Bonjour! (Top Left) */}
              <div className="absolute -top-6 -left-6 bg-white text-slate-800 font-extrabold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-100/80 animate-float-slow">
                <span className="text-lg">👋</span>
                <span className="font-display text-xs md:text-sm">Bonjour!</span>
              </div>

              {/* Floater Badge 2: Réussi (Middle Right) */}
              <div className="absolute top-[30%] -right-6 bg-white text-emerald-600 font-extrabold px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-100/80 animate-float-medium">
                <CheckCircle className="w-4 h-4 text-emerald-500 fill-emerald-55 font-bold" />
                <span className="font-display text-xs md:text-sm">Réussi</span>
              </div>

              {/* Floater Badge 3: +150 XP (Bottom Left) */}
              <div className="absolute bottom-[20%] -left-8 bg-white text-amber-600 font-black px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-100/80 animate-float-fast">
                <Award className="w-4.5 h-4.5 text-amber-500" />
                <span className="font-mono text-xs md:text-sm">+150 XP</span>
              </div>

              {/* Floater Badge 4: Afrique (Bottom Right) */}
              <div className="absolute -bottom-4 right-4 bg-white text-brand-blue font-extrabold px-5 py-3 rounded-full shadow-xl flex items-center gap-2 border border-slate-100/80 animate-float-slow">
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="font-display text-xs md:text-sm">Afrique</span>
              </div>

              {/* Additional Decorative Floating Words/Phrases matching "floating words like the one in my image" */}
              <div className="absolute -top-12 right-12 text-[11px] font-mono font-bold bg-blue-50/80 border border-blue-100/50 backdrop-blur-xs text-blue-800 px-2.5 py-1 rounded-lg shadow-xs opacity-85 hover:opacity-100 transition-all pointer-events-none animate-float-medium">
                S'il vous plaît
              </div>

              <div className="absolute top-[65%] -left-16 text-[10px] font-mono font-bold bg-rose-50/80 border border-rose-100/50 backdrop-blur-xs text-brand-coral px-2.5 py-1 rounded-lg shadow-xs opacity-85 hover:opacity-100 transition-all pointer-events-none animate-float-slow" style={{ animationDelay: '1s' }}>
                Félicitations!
              </div>

              <div className="absolute bottom-[8%] -right-12 text-[11px] font-mono font-bold bg-amber-50/80 border border-amber-100/50 backdrop-blur-xs text-amber-800 px-2.5 py-1 rounded-lg shadow-xs opacity-85 hover:opacity-100 transition-all pointer-events-none animate-float-fast" style={{ animationDelay: '2.5s' }}>
                A1 avec brio!
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Countdown Timer Section */}
      <section className="w-full py-16 bg-gradient-to-b from-white to-slate-50/50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-[11px] font-mono font-extrabold text-slate-400 uppercase tracking-widest block mb-3">COHORT 1 STATUS : COHORT STARTS IN</span>
          
          {/* Countdown Cards Container */}
          <div className="flex justify-center items-center gap-2 md:gap-6 max-w-lg mx-auto mb-10 px-2">
            {/* Days Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-3 md:p-5 shadow-lg flex-1 min-w-[55px] md:min-w-[90px] flex flex-col items-center">
              <span className="text-xl xs:text-3xl md:text-5xl font-black text-brand-blue tracking-tight font-mono">{String(timeLeft.days).padStart(2, "0")}</span>
              <span className="text-[8px] md:text-[10px] text-slate-400 uppercase font-extrabold tracking-wider mt-1">days</span>
            </div>
            
            {/* Hours Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-3 md:p-5 shadow-lg flex-1 min-w-[55px] md:min-w-[90px] flex flex-col items-center">
              <span className="text-xl xs:text-3xl md:text-5xl font-black text-brand-blue tracking-tight font-mono">{String(timeLeft.hours).padStart(2, "0")}</span>
              <span className="text-[8px] md:text-[10px] text-slate-400 uppercase font-extrabold tracking-wider mt-1">hours</span>
            </div>

            {/* Minutes Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-3 md:p-5 shadow-lg flex-1 min-w-[55px] md:min-w-[90px] flex flex-col items-center">
              <span className="text-xl xs:text-3xl md:text-5xl font-black text-brand-blue tracking-tight font-mono">{String(timeLeft.minutes).padStart(2, "0")}</span>
              <span className="text-[8px] md:text-[10px] text-slate-400 uppercase font-extrabold tracking-wider mt-1">mins</span>
            </div>

            {/* Seconds Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-3 md:p-5 shadow-lg flex-1 min-w-[55px] md:min-w-[90px] flex flex-col items-center">
              <span className="text-xl xs:text-3xl md:text-5xl font-black text-brand-blue tracking-tight font-mono text-brand-coral">{String(timeLeft.seconds).padStart(2, "0")}</span>
              <span className="text-[8px] md:text-[10px] text-brand-coral uppercase font-extrabold tracking-wider mt-1">secs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Flag Section (Social Proof Countries with Infinite Marquee) */}
      <section className="w-full py-8 border-y border-slate-100 bg-slate-50/30 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="flex items-center gap-2 text-xs uppercase font-mono font-bold tracking-widest text-slate-400 shrink-0 text-center md:text-left">
            <Globe className="w-4 h-4" />
            REGISTERED STUDENTS FROM:
          </span>
          <div className="relative flex overflow-hidden w-full max-w-3xl py-1">
            {/* Left and Right gradient fades for premium look */}
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-50/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-50/80 to-transparent z-10 pointer-events-none" />
            
            <div className="animate-marquee flex whitespace-nowrap py-1">
              {registeredCountries.map((c, idx) => (
                <div key={`c1-${idx}`} className="flex items-center gap-2 bg-white px-4.5 py-2.5 rounded-xl border border-slate-100 shadow-xs mr-6 shrink-0 transition-transform hover:scale-105 duration-200">
                  {c.logo ? (
                    <img src={c.logo} alt={`${c.name} logo`} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-xl">{c.flag}</span>
                  )}
                  <span className="text-xs font-bold text-slate-600">{c.name}</span>
                </div>
              ))}
              {/* Duplicate set for seamless infinite loop */}
              {registeredCountries.map((c, idx) => (
                <div key={`c2-${idx}`} className="flex items-center gap-2 bg-white px-4.5 py-2.5 rounded-xl border border-slate-100 shadow-xs mr-6 shrink-0 transition-transform hover:scale-105 duration-200">
                  {c.logo ? (
                    <img src={c.logo} alt={`${c.name} logo`} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-xl">{c.flag}</span>
                  )}
                  <span className="text-xs font-bold text-slate-600">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* THE REALITY Section */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="bg-rose-50 text-brand-coral border border-rose-100 uppercase font-mono font-black tracking-wider text-[10px] px-3 py-1 rounded-full inline-block mb-3">THE REALITY</span>
          <h2 className="font-display text-2xl md:text-3xl font-extrabold text-brand-blue tracking-tight leading-tight">
         Most students fail WAEC French not because they're not smart — but because they never had the right preparation
          </h2>
        </div>

        {/* Problems Grid - Red X elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {realities.map((prob, i) => (
            <div 
              key={i} 
              className="bg-white border border-slate-100/80 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 flex items-start gap-4"
            >
              <div className="bg-rose-50 text-brand-coral p-2.5 rounded-xl border border-rose-100 shrink-0 mt-0.5">
                <X className="w-4 h-4 font-black stroke-[3]" />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-base text-slate-900 mb-1">{prob.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{prob.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* THE LA PLUME SOLUTION Section */}
      <section className="w-full bg-slate-50/40 border-y border-slate-100 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="bg-brand-blue text-white uppercase font-mono font-black tracking-wider text-[10px] px-3 py-1 rounded-full inline-block mb-3">THE LA PLUME SOLUTION</span>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-extrabold text-brand-blue tracking-tight">
              Everything you need to walk into that exam hall ready.
            </h2>
          </div>

          {/* Solution Grid - 8 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solutions.map((sol, i) => {
              const Icon = sol.icon;
              return (
                <div 
                  key={i} 
                  className="bg-white border border-slate-100/80 hover:border-slate-200/80 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className={`${sol.color} p-3 rounded-2xl border w-fit mb-5 shadow-inner`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-extrabold text-base text-brand-blue mb-2 leading-snug">{sol.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed flex-grow font-semibold">{sol.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* THE REVOLUTION Section - Meet Le Blitz */}
      <section className="w-full max-w-6xl mx-auto px-4 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Text Area */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase font-mono font-black tracking-wider text-[10px] px-3 py-1 rounded-full inline-block mb-3">THE REVOLUTION</span>
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-brand-blue tracking-tight mb-6">
            Meet 'Le Blitz'. The ultimate mental drill.
          </h2>
          <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8 max-w-lg font-semibold">
            Every day at your leisure, you have the chance to solve questions. No Google. No dictionaries. Just you and the clock. be it objective, theory or oral based questions
          </p>
          
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-sm text-slate-600 font-bold">
              <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50" />
              Build extreme exam-room confidence
            </li>
            <li className="flex items-center gap-3 text-sm text-slate-600 font-bold">
              <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-50" />
              Instant national ranking updates
            </li>
          </ul>
        </div>

        {/* Live Blitz Mockup Card Area */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-brand-blue rounded-3xl p-6 shadow-2xl border-4 border-slate-800/20 text-white relative overflow-hidden">
            
            {/* Header elements */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-mono uppercase bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 font-bold tracking-wider">
                Question 4 of 15
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-yellow font-mono bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/25">
                <Flame className="w-3.5 h-3.5 fill-brand-yellow text-brand-yellow animate-pulse" />
                <span>00:{String(blitzTimer).padStart(2, "0")}</span>
              </div>
            </div>

            {/* Question Box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
              <h4 className="text-xs uppercase text-slate-300 font-mono font-bold mb-1">Completer la phrase :</h4>
              <p className="text-base md:text-lg font-extrabold tracking-tight">
                "Si j'avais su, je ______ venu plus tôt."
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-2.5 mb-6">
              {[
                { key: "A", text: "serais" },
                { key: "B", text: "serais venu" },
                { key: "C", text: "serais" }
              ].map((opt, idx) => {
                const isSelected = blitzSelectedOption === opt.key;
                return (
                  <button
                    key={idx}
                    onClick={() => handleBlitzSelect(opt.key)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? opt.key === "B"
                          ? "bg-emerald-600/30 border-emerald-500 text-emerald-300 font-bold"
                          : "bg-rose-600/30 border-rose-500 text-rose-300 font-bold"
                        : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-slate-200"
                    }`}
                  >
                    <span className="text-xs md:text-sm font-semibold">
                      <strong className="font-mono bg-white/10 px-1.5 py-0.5 rounded-md mr-2">{opt.key}</strong>
                      {opt.text}
                    </span>
                    {isSelected && opt.key === "B" && <Check className="w-4 h-4 text-emerald-400" />}
                    {isSelected && opt.key !== "B" && <X className="w-4 h-4 text-rose-400" />}
                  </button>
                );
              })}
            </div>

            {/* Explanatory popup */}
            {blitzSelectedOption && (
              <div className={`p-4 rounded-xl border animate-slide-up text-xs leading-relaxed ${
                blitzCorrect 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200" 
                  : "bg-rose-500/10 border-rose-500/30 text-rose-200"
              }`}>
                {blitzCorrect ? (
                  <div>
                    <span className="font-bold block mb-0.5">✨ Excellent ! (+50 XP)</span>
                    The condition "si j'avais su" (past conditional trigger) requires "je serais venu" to complete the sequence correctly.
                  </div>
                ) : (
                  <div>
                    <span className="font-bold block mb-0.5">❌ Presque ! Réessayez.</span>
                    "Serais" is grammatically incomplete here because it requires the past participle "venu" for the past conditional action.
                  </div>
                )}
                <button 
                  onClick={resetBlitzDemo} 
                  className="mt-2 text-[10px] uppercase font-bold text-slate-300 underline hover:text-white"
                >
                  Recommencer le test
                </button>
              </div>
            )}

          </div>
        </div>

      </section>

      {/* GAMIFIED REVIEWS ("Learning that feels like winning") section */}
      <section className="w-full bg-slate-50/40 border-y border-slate-100 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="bg-amber-100 text-amber-800 border border-amber-200 uppercase font-mono font-black tracking-wider text-[10px] px-3 py-1 rounded-full inline-block mb-3">GAMIFIED REVIEWS</span>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-extrabold text-brand-blue tracking-tight">
              Learning that feels like winning
            </h2>
            <p className="text-slate-500 text-sm md:text-base mt-4 font-semibold max-w-xl mx-auto">
              Study guides are boring. High-stakes competition is electric. La Plume wraps the total WAEC curriculum in a premium game loop that keeps you addicted to studying French daily.
            </p>
          </div>

          {/* Dashboard Leaderboard mockup card */}
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-6 md:p-8">
            
            {/* User score header row */}
            <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-brand-blue/5 p-3 rounded-2xl border border-brand-blue/10">
                  <GraduationCap className="w-6 h-6 text-brand-blue" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-base text-brand-blue">Amara Temi <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">(Vous)</span></h4>
                  <span className="text-[10px] font-mono uppercase bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-md">
                    Niveau 3 Elite Cadet 🚀
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-brand-blue font-mono block">{amaraXP} XP</span>
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Points totaux</span>
              </div>
            </div>

            {/* Progress bar to Level 4 */}
            <div className="mb-8">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                <span>Progression vers Niveau 4</span>
                <span>{amaraXP} / 1500 XP</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-blue rounded-full transition-all duration-1000"
                  style={{ width: `${(amaraXP / 1500) * 100}%` }}
                />
              </div>
              {hasClaimedXPDemo && (
                <span className="text-[10px] text-emerald-500 font-bold mt-1.5 block text-center animate-bounce">
                  🎉 +50 XP Récupérés via Le Blitz Live Demo !
                </span>
              )}
            </div>

            {/* Ranking leaderboard list */}
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 font-black tracking-widest block mb-4">
                CLASSEMENT RÉGIONAL EN DIRECT ~ COHORTE 1
              </span>

              <div className="space-y-2">
                {[
                  { rank: 1, name: "Kofi Mensah", country: "🇬🇭 Ghana", xp: 1420 },
                  { rank: 2, name: "Amina Bello", country: "🇳🇬 Nigeria", xp: 1310 },
                  { rank: 3, name: "Kwame Appiah", country:"🇬🇭 Ghana", xp: 1240 },
                  { rank: 4, name: "Amara Temi", country: "🇳🇬 Nigeria", xp: amaraXP, isCurrentUser: true },
                  { rank: 5, name: "Femi Olatunji", country: "🇳🇬 Nigeria", xp: 1150 }
                ].map((student, sidx) => {
                  return (
                    <div 
                      key={sidx}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        student.isCurrentUser
                          ? "bg-brand-blue/5 border-brand-blue text-brand-blue font-bold shadow-xs scale-[1.02]"
                          : "bg-slate-50/50 border-slate-100/50 text-slate-600"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`font-mono text-xs font-black min-w-[18px] text-center ${
                          student.rank === 1 ? "text-amber-500" : student.rank === 2 ? "text-slate-400" : student.rank === 3 ? "text-amber-700" : "text-slate-400"
                        }`}>
                          #{student.rank}
                        </span>
                        <div>
                          <span className="text-xs font-extrabold block leading-tight">
                            {student.name} {student.isCurrentUser && "👑"}
                          </span>
                          <span className="text-[9px] text-slate-400 block font-semibold">{student.country}</span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold font-mono">{student.xp} XP</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FOUR STEPS Section */}
      <section id="how-it-works" className="w-full max-w-6xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase font-mono font-black tracking-wider text-[10px] px-3 py-1 rounded-full inline-block mb-3">FOUR STEPS</span>
          <h2 className="font-display text-2xl md:text-4xl font-extrabold text-brand-blue tracking-tight leading-tight">
            Four steps to French excellence
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => {
            return (
              <div 
                key={idx}
                className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all relative text-center flex flex-col items-center"
              >
                {/* Number sphere */}
                <div className="bg-brand-blue text-white font-mono font-black text-xs w-9 h-9 rounded-full flex items-center justify-center shadow-md mb-4 border border-brand-blue/10">
                  {step.num}
                </div>
                <h4 className="font-display font-extrabold text-base text-slate-800 mb-2">{step.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full bg-slate-50/40 border-y border-slate-100 py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="bg-brand-blue text-white uppercase font-mono font-black tracking-wider text-[10px] px-3 py-1 rounded-full inline-block mb-3">SYLLABUS COVERAGE</span>
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-extrabold text-brand-blue tracking-tight">
              We know the exam better than anyone.
            </h2>
          </div>

          {/* 4 Cards Series */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {syllabusSeries.map((series, i) => {
              return (
                <div 
                  key={i}
                  className="bg-white border border-slate-100/80 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col"
                >
                  <span className="text-[10px] font-mono uppercase text-brand-blue font-bold tracking-widest block mb-2">
                    {series.id}
                  </span>
                  <h4 className="font-display font-extrabold text-lg text-slate-800 mb-4">{series.title}</h4>
                  
                  <ul className="space-y-3 flex-grow">
                    {series.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 font-bold" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}
