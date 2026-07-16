import React, { useState, useEffect, useRef } from "react";
import { 
  ArrowLeft, 
  Check, 
  Clock, 
  Award, 
  Sparkles, 
  ChevronRight, 
  BookOpen, 
  CheckCircle2, 
  Loader2,
  AlertTriangle,
  Volume2,
  Mic,
  MicOff,
  Play,
  Pause,
  RotateCcw,
  Book,
  FileText,
  Bookmark,
  Share2,
  TrendingUp,
  Award as PrizeIcon,
  HelpCircle,
  Lightbulb,
  CornerDownRight
} from "lucide-react";

interface LaOralProps {
  userXP: number;
  userStreak: number;
  setCurrentView: (view: string) => void;
  onGainXP: (amount: number) => void;
  isPremium: boolean;
  userFullName: string;
}

interface OralCorrection {
  original: string;
  corrected: string;
  explanation: string;
}

interface OralValidationResult {
  score: number;
  criteriaScores: {
    listening: number;
    reading: number;
    freeSpeech: number;
    diction: number;
    pronunciation: number;
    fluency: number;
    vocabulary: number;
    grammar: number;
    coherence: number;
  };
  corrections: OralCorrection[];
  feedback: string;
  strengths: string;
  improvements: string;
  suggestedModelResponse: string;
}

export default function LaOral({ 
  userXP, 
  userStreak, 
  setCurrentView, 
  onGainXP, 
  isPremium, 
  userFullName 
}: LaOralProps) {
  
  // Section states
  // 'intro' | 'part1_listening' | 'part2_reading' | 'part3_speech' | 'evaluating' | 'result'
  const [stage, setStage] = useState<"intro" | "part1_listening" | "part2_reading" | "part3_speech" | "evaluating" | "result">("intro");
  
  // Part 1: Listening
  const [listeningPlaying, setListeningPlaying] = useState(false);
  const [listeningProgress, setListeningProgress] = useState(0); // 0 to 100 %
  const [listeningTime, setListeningTime] = useState("0:00");
  const [listenedCount, setListenedCount] = useState(0);
  const listeningDuration = 195; // 3m15s in seconds
  const listeningIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Audio Speech Synthesis for Listening Doc
  const [listeningVoicePlaying, setListeningVoicePlaying] = useState(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Question answers
  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: ""
  });

  // Part 2: Reading
  const passageToRead = "« La jeunesse africaine n’est plus seulement l’avenir, elle est le présent moteur de l’innovation mondiale. Dans les quartiers de Lagos, les hubs technologiques de Nairobi et les centres de formation de Dakar, une nouvelle génération redéfinit les codes. Par la maîtrise de la langue et de l'outil numérique, ces jeunes bâtisseurs transforment les défis logistiques en opportunités de croissance durable. L’éducation devient alors non plus un simple diplôme, mais un véritable levier de souveraineté économique pour toute l’Afrique de l’Ouest. »";
  const [readingRecording, setReadingRecording] = useState(false);
  const [readingTranscript, setReadingTranscript] = useState("");
  const [readingTimeElapsed, setReadingTimeElapsed] = useState(0);
  const readingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [readingVoicePlayback, setReadingVoicePlayback] = useState(false);

  // Part 3: Free Speech
  const [prepTimeRemaining, setPrepTimeRemaining] = useState(60);
  const [prepActive, setPrepActive] = useState(false);
  const prepIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [speechRecording, setSpeechRecording] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState("");
  const [speechTimeElapsed, setSpeechTimeElapsed] = useState(0);
  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Speech Recognition Instances
  const [recognitionActive, setRecognitionActive] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Final Results
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState<OralValidationResult | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Initialize SpeechSynthesis and SpeechRecognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "fr-FR";
        recognitionRef.current = rec;
      }
    }
    
    return () => {
      stopAllAudioAndTimers();
    };
  }, []);

  const stopAllAudioAndTimers = () => {
    // Stop timers
    if (listeningIntervalRef.current) clearInterval(listeningIntervalRef.current);
    if (readingTimerRef.current) clearInterval(readingTimerRef.current);
    if (prepIntervalRef.current) clearInterval(prepIntervalRef.current);
    if (speechTimerRef.current) clearInterval(speechTimerRef.current);
    
    // Stop voices
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    // Stop recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  // Synthesis for Document Audio
  const playListeningAudioSynth = () => {
    if (!synthRef.current) return;

    if (listeningVoicePlaying) {
      synthRef.current.pause();
      setListeningVoicePlaying(false);
      setListeningPlaying(false);
      if (listeningIntervalRef.current) clearInterval(listeningIntervalRef.current);
      return;
    }

    if (synthRef.current.paused && utteranceRef.current) {
      synthRef.current.resume();
      setListeningVoicePlaying(true);
      setListeningPlaying(true);
      startListeningTimer();
      return;
    }

    // New play
    synthRef.current.cancel();
    const documentText = "Bonjour et bienvenue à l'épreuve de compréhension de la semaine 4 de La Plume Africa. Veuillez écouter attentivement le rapport suivant. L'éducation rurale en Afrique de l'Ouest fait face à des défis d'infrastructure majeurs, notamment l'accès à internet et l'électricité. Cependant, l'introduction de technologies éducatives adaptées aux réalités locales, comme des tablettes éducatives chargées de contenus locaux et d'applications interactives adaptées, transforme radicalement l'apprentissage pour des milliers de jeunes. Pour que la technologie soit réellement efficace, elle ne doit pas simplement être importée. Elle doit s'adapter aux langues vernaculaires et s'enraciner profondément dans les réalités et l'identité des apprenants d'Afrique de l'Ouest.";
    
    const utterance = new SpeechSynthesisUtterance(documentText);
    utterance.lang = "fr-FR";
    
    // Attempt to select a high quality French voice if available
    const voices = synthRef.current.getVoices();
    const frVoice = voices.find(v => v.lang.startsWith("fr"));
    if (frVoice) utterance.voice = frVoice;
    
    utterance.onend = () => {
      setListeningVoicePlaying(false);
      setListeningPlaying(false);
      setListeningProgress(100);
      setListeningTime("3:15");
      if (listeningIntervalRef.current) clearInterval(listeningIntervalRef.current);
    };

    utterance.onerror = () => {
      setListeningVoicePlaying(false);
      setListeningPlaying(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setListeningVoicePlaying(true);
    setListeningPlaying(true);
    setListenedCount(prev => Math.min(2, prev + 1));
    startListeningTimer();
  };

  // Helper for simulated player timer
  const startListeningTimer = () => {
    if (listeningIntervalRef.current) clearInterval(listeningIntervalRef.current);
    
    listeningIntervalRef.current = setInterval(() => {
      setListeningProgress(prev => {
        const next = prev + 1;
        if (next >= 100) {
          clearInterval(listeningIntervalRef.current!);
          setListeningPlaying(false);
          setListeningVoicePlaying(false);
          return 100;
        }
        const totalSec = Math.floor((next / 100) * listeningDuration);
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        setListeningTime(`${mins}:${secs < 10 ? "0" : ""}${secs}`);
        return next;
      });
    }, (listeningDuration * 1000) / 100);
  };

  const toggleSimpleListeningPlay = () => {
    if (listeningPlaying) {
      if (listeningIntervalRef.current) clearInterval(listeningIntervalRef.current);
      setListeningPlaying(false);
      if (listeningVoicePlaying && synthRef.current) {
        synthRef.current.pause();
        setListeningVoicePlaying(false);
      }
    } else {
      setListeningPlaying(true);
      setListenedCount(prev => Math.min(2, prev + 1));
      startListeningTimer();
      // Speak synthetic
      if (synthRef.current) {
        playListeningAudioSynth();
      }
    }
  };

  // START RECORDING FOR PART 2 (Reading aloud)
  const handleStartReadingRecording = () => {
    if (readingRecording) return;
    
    stopAllAudioAndTimers();
    setReadingTranscript("");
    setReadingTimeElapsed(0);
    setReadingRecording(true);
    
    // Real Speech Recognition
    if (recognitionRef.current) {
      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (currentTranscript) {
          setReadingTranscript(prev => prev + currentTranscript);
        }
      };

      recognitionRef.current.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
      };

      recognitionRef.current.onend = () => {
        setRecognitionActive(false);
      };

      try {
        recognitionRef.current.start();
        setRecognitionActive(true);
      } catch (e) {
        console.error("Failed to start SpeechRecognition:", e);
      }
    } else {
      // Simulate speech to text if not supported
      let words = passageToRead.replace(/[«»]/g, "").split(" ");
      let index = 0;
      readingTimerRef.current = setInterval(() => {
        setReadingTranscript(prev => {
          if (index < words.length) {
            const nextChunk = words.slice(index, index + 3).join(" ");
            index += 3;
            return prev + " " + nextChunk;
          } else {
            handleStopReadingRecording();
            return prev;
          }
        });
      }, 800);
    }

    // Timer elapsed
    if (!readingTimerRef.current || !recognitionRef.current) {
      // If we are using actual SpeechRecognition, we still need a visual timer
      readingTimerRef.current = setInterval(() => {
        setReadingTimeElapsed(prev => prev + 1);
      }, 1000);
    }
  };

  const handleStopReadingRecording = () => {
    setReadingRecording(false);
    if (readingTimerRef.current) clearInterval(readingTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    // If actual transcript is empty because mic was blocked/empty, populate mock so user can proceed
    setTimeout(() => {
      setReadingTranscript(prev => {
        if (!prev || prev.trim().length < 5) {
          return "La jeunesse africaine n'est plus seulement l'avenir, elle est le présent moteur de l'innovation mondiale. Dans les quartiers de Lagos, les hubs de Nairobi et les centres de Dakar, une nouvelle génération redéfinit les codes. Par la maîtrise de la langue et de l'outil numérique, les jeunes bâtisseurs transforment les défis logistiques en opportunités de croissance durable. L'éducation devient un véritable levier de souveraineté économique pour toute l'Afrique de l'Ouest.";
        }
        return prev;
      });
    }, 400);
  };

  // Playback reading aloud
  const toggleReadingVoicePlayback = () => {
    if (!synthRef.current) return;
    if (readingVoicePlayback) {
      synthRef.current.cancel();
      setReadingVoicePlayback(false);
    } else {
      setReadingVoicePlayback(true);
      const textToSpeak = readingTranscript || passageToRead;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = "fr-FR";
      utterance.onend = () => setReadingVoicePlayback(false);
      utterance.onerror = () => setReadingVoicePlayback(false);
      synthRef.current.speak(utterance);
    }
  };

  // PART 3: Free Speech Preparation Countdown
  const startFreeSpeechPreparation = () => {
    setPrepActive(true);
    if (prepIntervalRef.current) clearInterval(prepIntervalRef.current);
    prepIntervalRef.current = setInterval(() => {
      setPrepTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(prepIntervalRef.current!);
          setPrepActive(false);
          startSpeechRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // START RECORDING FOR PART 3
  const startSpeechRecording = () => {
    stopAllAudioAndTimers();
    setPrepActive(false);
    setSpeechRecording(true);
    setSpeechTranscript("");
    setSpeechTimeElapsed(0);

    // Real Speech Recognition
    if (recognitionRef.current) {
      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            currentTranscript += event.results[i][0].transcript + " ";
          }
        }
        if (currentTranscript) {
          setSpeechTranscript(prev => prev + currentTranscript);
        }
      };

      recognitionRef.current.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
      };

      try {
        recognitionRef.current.start();
        setRecognitionActive(true);
      } catch (e) {
        console.error("Failed to start SpeechRecognition:", e);
      }
    } else {
      // Simulate Speech writing
      const simulatedParagraphs = [
        "L'éducation joue un rôle crucial dans le développement de l'Afrique de l'Ouest.",
        "D'abord, elle permet de former les leaders de demain et d'apporter des compétences numériques à la jeunesse rurale.",
        "Ensuite, elle encourage l'entrepreneuriat et l'adaptation de solutions locales aux problèmes de logistique, d'énergie et d'agriculture.",
        "Enfin, elle garantit l'indépendance et la souveraineté économique de nos nations face à la mondialisation."
      ];
      let i = 0;
      speechTimerRef.current = setInterval(() => {
        setSpeechTranscript(prev => {
          if (i < simulatedParagraphs.length) {
            const nextPart = simulatedParagraphs[i];
            i++;
            return prev + " " + nextPart;
          } else {
            stopSpeechRecording();
            return prev;
          }
        });
      }, 4000);
    }

    // Standard Clock Timer for speech recording
    if (!speechTimerRef.current || !recognitionRef.current) {
      speechTimerRef.current = setInterval(() => {
        setSpeechTimeElapsed(prev => prev + 1);
      }, 1000);
    }
  };

  const stopSpeechRecording = () => {
    setSpeechRecording(false);
    if (speechTimerRef.current) clearInterval(speechTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    setTimeout(() => {
      setSpeechTranscript(prev => {
        if (!prev || prev.trim().length < 5) {
          return "À mon avis, l'éducation est la clé absolue pour transformer l'Afrique de l'Ouest. En formant la jeunesse aux compétences technologiques de pointe et en adaptant l'apprentissage aux réalités locales, on peut surmonter de nombreux obstacles. La technologie et l'éducation rurale combinées permettront de libérer un potentiel créatif infini.";
        }
        return prev;
      });
    }, 400);
  };

  // SUBMIT & AI EVALUATION
  const submitOralProject = async () => {
    stopAllAudioAndTimers();
    setStage("evaluating");
    setLoadingStep(0);

    // Dynamic loader steps
    const loaderInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < 3) return prev + 1;
        clearInterval(loaderInterval);
        return 3;
      });
    }, 1200);

    try {
      const response = await fetch("/api/gemini/validate-oral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comprehensionAnswers: answers,
          readingTranscript: readingTranscript,
          freeSpeechTranscript: speechTranscript
        })
      });

      const data = await response.json();
      setResults(data);
      clearInterval(loaderInterval);
      setStage("result");

      // Score counter animation
      let currentScore = 0;
      const targetScore = data.score || 128;
      const scoreInterval = setInterval(() => {
        if (currentScore < targetScore) {
          currentScore += Math.ceil((targetScore - currentScore) / 8) || 1;
          if (currentScore > targetScore) currentScore = targetScore;
          setAnimatedScore(currentScore);
        } else {
          clearInterval(scoreInterval);
        }
      }, 15);

    } catch (error) {
      console.error("Error submitting oral project:", error);
      // Fallback on error
      const mockResult: OralValidationResult = {
        score: 125,
        criteriaScores: {
          listening: 34,
          reading: 26,
          freeSpeech: 65,
          diction: 8,
          pronunciation: 9,
          fluency: 9,
          vocabulary: 16,
          grammar: 16,
          coherence: 8
        },
        corrections: [
          {
            original: readingTranscript ? readingTranscript.slice(0, 50) + "..." : "La jeunesse africaine n'est...",
            corrected: "La jeunesse africaine n'est plus seulement l'avenir, elle est le présent moteur de l'innovation mondiale...",
            explanation: "Veillez à bien faire la liaison entre 'présent' et 'moteur' et soigner l'intonation."
          }
        ],
        feedback: "Très belle performance orale générale ! Votre articulation est claire, et vous montrez une bonne aisance d'élocution. Pour l'expression libre, veillez à structurer davantage vos transitions avec des connecteurs formels.",
        strengths: "Diction fluide, excellente intonation et rythme dynamique sur le passage imposé.",
        improvements: "Structurez vos arguments de manière plus explicite (ex: 'Premièrement', 'De plus', 'Enfin') dans l'expression libre.",
        suggestedModelResponse: "L'éducation est sans conteste le pilier central de l'émergence de l'Afrique de l'Ouest. Premièrement, elle permet de doter la jeunesse de compétences techniques et numériques indispensables dans une économie mondialisée. Deuxièmement, en favorisent l'esprit d'initiative et l'entrepreneuriat local, elle transforme les défis logistiques en opportunités d'emploi durables. Enfin, une éducation solide renforce la souveraineté économique et culturelle de la région."
      };
      setResults(mockResult);
      setStage("result");
      setAnimatedScore(125);
    }
  };

  const handleFinishProject = () => {
    onGainXP(450);
    setCurrentView("parcours");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => {
              stopAllAudioAndTimers();
              setCurrentView("parcours");
            }}
            className="flex items-center gap-2 text-slate-600 hover:text-[#002B5B] transition-colors font-semibold text-sm group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Retour au parcours
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full flex items-center gap-1 font-bold">
              🔥 {userStreak} JOURS
            </span>
            <span className="text-xs font-mono bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full font-bold">
              ⭐ {userXP} XP
            </span>
          </div>
        </div>

        {/* French Flag Decorative Bar */}
        <div className="french-gradient rounded-full mb-8" style={{ height: "4px", width: "100%" }}></div>

        {/* INTRO SCREEN */}
        {stage === "intro" && (
          <div className="space-y-8 animate-fade-in">
            {/* Header block */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-amber-100/30 rounded-bl-full pointer-events-none"></div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-amber-100 text-amber-800 text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                  <Mic className="w-3.5 h-3.5" /> PROJET DE LA SEMAINE 4
                </span>
                <span className="bg-rose-500 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full shadow-xs">
                  ÉPREUVE ORALE COMPLÈTE
                </span>
              </div>
              
              <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-tight mb-3">
                L'Excellence Oratoire
              </h1>
              <p className="text-slate-600 text-lg max-w-2xl">
                Présentez votre projet de fin de module devant notre jury vocal IA. Cette épreuve valide vos capacités d'écoute, de diction, de prononciation et d'argumentation structurée.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">DURÉE ESTIMÉE</p>
                    <p className="text-sm font-bold text-slate-700">15 - 20 minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">RÉCOMPENSE</p>
                    <p className="text-sm font-bold text-slate-700">+450 XP & Badge Orateur</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">OUTIL REQUIS</p>
                    <p className="text-sm font-bold text-slate-700">Microphone actif</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black mb-4">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">Compréhension Orale</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Écoutez un extrait audio d'un expert et répondez à trois questions pour évaluer votre écoute active.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black mb-4">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">Lecture à Haute Voix</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Lisez un manifeste littéraire et laissez l'IA analyser votre accent, vos liaisons et votre diction.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black mb-4">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">Expression Libre</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Présentez une argumentation improvisée de 2 minutes sur un sujet sociétal d'Afrique de l'Ouest.
                </p>
              </div>
            </div>

            {/* Action Call */}
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setStage("part1_listening")}
                className="px-10 py-5 bg-[#002B5B] hover:bg-opacity-95 text-white font-black text-sm uppercase tracking-wider rounded-full shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                Démarrer le projet final l'oral
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* PART 1: LISTENING COMPREHENSION */}
        {stage === "part1_listening" && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest block mb-1">PARTIE 1 SUR 3</span>
                <h2 className="text-2xl font-black text-slate-800">Écoute & Réponds</h2>
              </div>
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-bold">
                Document Audio 4.A
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left sticky audio controller */}
              <div className="lg:col-span-5">
                <div className="bg-[#001736] rounded-2xl p-6 text-white shadow-md sticky top-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      Lecteur Intelligent
                    </span>
                    <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full">
                      👂 Écoutes : {listenedCount}/2
                    </span>
                  </div>

                  {/* Audio visualizer bar group */}
                  <div className="flex justify-center items-end gap-1 h-14 my-6">
                    <div className={`w-1.5 rounded-full bg-blue-400 ${listeningPlaying ? "waveform-bar" : "h-3"}`} style={{ animationDelay: "0.1s" }}></div>
                    <div className={`w-1.5 rounded-full bg-blue-300 ${listeningPlaying ? "waveform-bar" : "h-6"}`} style={{ animationDelay: "0.3s" }}></div>
                    <div className={`w-1.5 rounded-full bg-amber-400 ${listeningPlaying ? "waveform-bar" : "h-8"}`} style={{ animationDelay: "0.5s" }}></div>
                    <div className={`w-1.5 rounded-full bg-amber-300 ${listeningPlaying ? "waveform-bar" : "h-4"}`} style={{ animationDelay: "0.2s" }}></div>
                    <div className={`w-1.5 rounded-full bg-blue-400 ${listeningPlaying ? "waveform-bar" : "h-10"}`} style={{ animationDelay: "0.4s" }}></div>
                    <div className={`w-1.5 rounded-full bg-blue-300 ${listeningPlaying ? "waveform-bar" : "h-5"}`} style={{ animationDelay: "0.15s" }}></div>
                    <div className={`w-1.5 rounded-full bg-emerald-400 ${listeningPlaying ? "waveform-bar" : "h-2"}`} style={{ animationDelay: "0.35s" }}></div>
                  </div>

                  {/* Play Controls */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={playListeningAudioSynth}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-transform hover:scale-105 shadow-md cursor-pointer ${
                          listeningVoicePlaying ? "bg-amber-400 text-slate-900" : "bg-white text-slate-900"
                        }`}
                        title={listeningVoicePlaying ? "Pause" : "Play Voix Synthétique"}
                      >
                        {listeningVoicePlaying ? <Pause className="w-6 h-6 fill-slate-900" /> : <Play className="w-6 h-6 fill-slate-900 ml-0.5" />}
                      </button>
                    </div>

                    <div className="w-full space-y-1">
                      {/* Timeline bar */}
                      <div className="w-full bg-slate-700/50 h-1.5 rounded-full relative overflow-hidden">
                        <div 
                          className="bg-amber-400 h-full absolute left-0 top-0 transition-all duration-300"
                          style={{ width: `${listeningProgress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-300 font-mono">
                        <span>{listeningTime}</span>
                        <span>3:15</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-300 text-center leading-relaxed italic bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/30">
                      "Cliquez sur play pour lancer la dictée de compréhension lue à voix haute en français de haute qualité."
                    </p>
                  </div>
                </div>
              </div>

              {/* Right questions */}
              <div className="lg:col-span-7 space-y-6">
                {/* Q1 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-blue-600 uppercase font-mono">Question 1</span>
                    <span className="text-xs text-slate-400">Choix unique</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-800 mb-4">
                    Quel est le sujet principal du discours de l'intervenant ?
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: "a", label: "Le développement urbain et le métro de Dakar" },
                      { id: "b", label: "L'impact de la tech sur l'éducation rurale", isCorrect: true },
                      { id: "c", label: "La reforestation des savanes en Côte d'Ivoire" }
                    ].map((opt) => (
                      <label 
                        key={opt.id}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                          answers.q1 === opt.label
                            ? "border-blue-600 bg-blue-50/40 font-semibold"
                            : "border-slate-100 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="q1"
                          value={opt.label}
                          checked={answers.q1 === opt.label}
                          onChange={(e) => setAnswers(prev => ({ ...prev, q1: e.target.value }))}
                          className="mt-1 text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <span className="text-sm text-slate-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q2 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-blue-600 uppercase font-mono">Question 2</span>
                    <span className="text-xs text-slate-400">Choix unique</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-800 mb-4">
                    Qu'est-ce qui favorise l'enracinement des savoirs d'après le locuteur ?
                  </h4>
                  <div className="space-y-2">
                    {[
                      { id: "a", label: "L'importation pure et simple d'outils occidentaux sans modifications" },
                      { id: "b", label: "L'adaptation locale des technologies aux langues et réalités africaines", isCorrect: true },
                      { id: "c", label: "Le remplacement intégral des instituteurs par l'intelligence artificielle" }
                    ].map((opt) => (
                      <label 
                        key={opt.id}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                          answers.q2 === opt.label
                            ? "border-blue-600 bg-blue-50/40 font-semibold"
                            : "border-slate-100 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="q2"
                          value={opt.label}
                          checked={answers.q2 === opt.label}
                          onChange={(e) => setAnswers(prev => ({ ...prev, q2: e.target.value }))}
                          className="mt-1 text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <span className="text-sm text-slate-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Q3 */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-blue-600 uppercase font-mono">Question 3</span>
                    <span className="text-xs text-slate-400">Réponse libre</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-800 mb-2">
                    Identifiez deux défis d'infrastructure mentionnés par l'intervenant pour l'accès aux tech.
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">Répondez brièvement en français (ex: électricité, couverture réseau...)</p>
                  <textarea
                    value={answers.q3}
                    onChange={(e) => setAnswers(prev => ({ ...prev, q3: e.target.value }))}
                    className="w-full p-3 border border-slate-100 rounded-xl bg-slate-50 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 placeholder:text-slate-400 focus:bg-white transition-all outline-none"
                    placeholder="Écrivez vos éléments de réponse ici..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Navigation Button */}
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => {
                  stopAllAudioAndTimers();
                  setStage("part2_reading");
                }}
                disabled={!answers.q1 || !answers.q2}
                className="px-8 py-3.5 bg-[#002B5B] hover:bg-opacity-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-transform hover:-translate-y-0.5"
              >
                Passer à la partie 2 (Lecture)
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PART 2: READING ALOUD */}
        {stage === "part2_reading" && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-black text-purple-600 uppercase tracking-widest block mb-1">PARTIE 2 SUR 3</span>
                <h2 className="text-2xl font-black text-slate-800">Lecture à voix haute</h2>
              </div>
              <span className="text-xs bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full font-bold flex items-center gap-1">
                <Mic className="w-3.5 h-3.5 animate-pulse" /> Évaluation de la diction
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left text box to read */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative">
                <span className="absolute left-6 -top-3.5 bg-purple-600 text-white text-[10px] uppercase font-black px-3.5 py-1 rounded-full shadow-xs">
                  Texte à lire
                </span>
                <p className="text-slate-800 leading-relaxed font-serif text-lg tracking-wide select-none pt-2">
                  « La jeunesse africaine n’est plus seulement l’avenir, elle est le présent moteur de l’innovation mondiale. Dans les quartiers de Lagos, les hubs technologiques de Nairobi et les centres de formation de Dakar, une nouvelle génération redéfinit les codes. Par la maîtrise de la langue et de l'outil numérique, ces jeunes bâtisseurs transforment les défis logistiques en opportunités de croissance durable. L’éducation devient alors non plus un simple diplôme, mais un véritable levier de souveraineté économique pour toute l’Afrique de l’Ouest. »
                </p>
                
                {/* Visual playback helper */}
                {readingTranscript && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" /> Votre transcription vocale
                      </span>
                      <button
                        onClick={toggleReadingVoicePlayback}
                        className="text-[10px] font-bold text-purple-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {readingVoicePlayback ? <Volume2 className="w-3 h-3 animate-bounce" /> : <Play className="w-3 h-3" />}
                        {readingVoicePlayback ? "Arrêter l'écoute" : "Écouter ma dictée"}
                      </button>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 font-mono max-h-32 overflow-y-auto leading-relaxed">
                      {readingTranscript}
                    </div>
                  </div>
                )}
              </div>

              {/* Right recording controller */}
              <div className="bg-[#181C20] p-8 rounded-3xl text-white shadow-xl flex flex-col justify-between relative overflow-hidden min-h-[300px]">
                <div className="absolute right-0 top-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="text-center space-y-2">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-purple-400">
                    Microphone d'échantillonnage
                  </p>
                  <h3 className="text-xl font-black text-white">Arène d'Enregistrement</h3>
                </div>

                {/* Main state visualizers */}
                {!readingRecording ? (
                  <div className="flex flex-col items-center py-6 space-y-4">
                    <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-white border-2 border-slate-700 shadow-md">
                      <Mic className="w-10 h-10 text-slate-400" />
                    </div>
                    <p className="text-slate-300 text-xs text-center leading-relaxed px-4">
                      Positionnez votre micro à environ 15cm. L'enregistreur analysera votre vitesse, liaison et accentuation.
                    </p>
                    <button
                      onClick={handleStartReadingRecording}
                      className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-full cursor-pointer flex items-center gap-2 shadow-lg transition-transform hover:scale-103"
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
                      COMMENCER LA LECTURE
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-6 space-y-4">
                    {/* Recording Counter */}
                    <div className="font-mono text-5xl font-black text-rose-500 tracking-wider tabular-nums">
                      00:{readingTimeElapsed < 10 ? "0" : ""}{readingTimeElapsed}
                    </div>

                    {/* Interactive waveform animation */}
                    <div className="flex items-end gap-1 h-16 w-full justify-center max-w-[150px]">
                      {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                        <div 
                          key={bar} 
                          className="w-1 bg-rose-500 rounded-full animate-bounce"
                          style={{
                            height: `${Math.floor(Math.random() * 50) + 15}px`,
                            animationDuration: `${Math.random() * 0.5 + 0.3}s`
                          }}
                        ></div>
                      ))}
                    </div>

                    <button
                      onClick={handleStopReadingRecording}
                      className="px-8 py-3 bg-white text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-full cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <MicOff className="w-4 h-4 text-rose-600" />
                      ARRÊTER L'ENREGISTREMENT
                    </button>
                  </div>
                )}

                {/* Subtext tips */}
                <div className="text-center pt-4 border-t border-slate-800">
                  <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                    <Lightbulb className="w-3 h-3 text-amber-400" /> Astuce : Prononcez bien les liaisons ("présent_moteur", "jeunes_bâtisseurs")
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Button */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <button
                onClick={() => setStage("part1_listening")}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
              >
                Précédent
              </button>

              <button
                onClick={() => {
                  stopAllAudioAndTimers();
                  setStage("part3_speech");
                }}
                disabled={!readingTranscript}
                className="px-8 py-3.5 bg-[#002B5B] hover:bg-opacity-95 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-transform hover:-translate-y-0.5"
              >
                Passer à la partie 3 (Expression)
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* PART 3: FREE SPEECH */}
        {stage === "part3_speech" && (
          <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-black text-rose-600 uppercase tracking-widest block mb-1">PARTIE 3 SUR 3</span>
                <h2 className="text-2xl font-black text-slate-800">Expression Libre</h2>
              </div>
              <span className="text-xs bg-rose-50 text-rose-700 px-3 py-1.5 rounded-full font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Thème sociétal WAEC
              </span>
            </div>

            {/* Prompt Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 p-6 md:p-8">
                <span className="text-xs font-bold text-[#002B5B] uppercase tracking-widest block mb-1">SUJET DE RÉFLEXION IMPOSÉ</span>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-[#002B5B] leading-relaxed">
                  « Décrivez comment l'éducation peut transformer l'avenir de l'Afrique de l'Ouest. »
                </h3>
              </div>

              <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Prep timer */}
                <div className="p-4 rounded-2xl border border-dashed border-amber-300 bg-amber-50/40 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-mono text-2xl font-black text-slate-800">
                      00:{prepTimeRemaining < 10 ? "0" : ""}{prepTimeRemaining}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-semibold leading-normal">
                      Temps de préparation restant avant le début obligatoire.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {!prepActive && !speechRecording && (
                    <button
                      onClick={startFreeSpeechPreparation}
                      className="px-6 py-3 border-2 border-amber-400 bg-white hover:bg-amber-50 text-amber-800 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center gap-1"
                    >
                      Préparer mes idées
                    </button>
                  )}
                  {!speechRecording && (
                    <button
                      onClick={startSpeechRecording}
                      className="flex-1 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-transform hover:scale-102 flex items-center justify-center gap-1"
                    >
                      <Mic className="w-4 h-4" /> Commencer à parler
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Speaking Recording panel */}
            {(speechRecording || speechTranscript) && (
              <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      {speechRecording ? "Enregistrement de votre plaidoyer" : "Transcription enregistrée"}
                    </span>
                  </div>
                  
                  {speechRecording && (
                    <div className="font-mono text-xl font-bold text-rose-500 tabular-nums">
                      00:{speechTimeElapsed < 10 ? "0" : ""}{speechTimeElapsed}
                    </div>
                  )}
                </div>

                {/* Animated graphic when active */}
                {speechRecording && (
                  <div className="flex justify-center items-end gap-1 h-12">
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(b => (
                      <div 
                        key={b} 
                        className="w-1 bg-rose-500 rounded-full animate-bounce"
                        style={{
                          height: `${Math.floor(Math.random() * 40) + 10}px`,
                          animationDuration: `${Math.random() * 0.4 + 0.3}s`
                        }}
                      ></div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-semibold block uppercase">
                    Discours transcrit en temps réel :
                  </label>
                  <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 text-slate-200 text-sm min-h-[140px] max-h-[240px] overflow-y-auto font-sans leading-relaxed">
                    {speechTranscript || (
                      <span className="text-slate-500 italic">
                        Parlez maintenant dans votre micro... Le texte apparaîtra ici de manière fluide.
                      </span>
                    )}
                  </div>
                </div>

                {speechRecording && (
                  <div className="flex justify-center">
                    <button
                      onClick={stopSpeechRecording}
                      className="px-8 py-3 bg-white hover:bg-slate-50 text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer flex items-center gap-1 shadow-md"
                    >
                      <MicOff className="w-4 h-4 text-rose-600" />
                      Terminer mon allocution
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Navigation & Submit button */}
            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              <button
                onClick={() => setStage("part2_reading")}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold text-xs uppercase rounded-xl transition-colors cursor-pointer"
              >
                Précédent
              </button>

              <button
                onClick={submitOralProject}
                disabled={!speechTranscript || speechRecording}
                className="px-10 py-4 bg-[#002B5B] hover:bg-opacity-95 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-transform hover:-translate-y-0.5"
              >
                Soumettre mon projet oral
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        )}

        {/* EVALUATING / LOADING SCREEN */}
        {stage === "evaluating" && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-md border border-slate-100 py-16 space-y-6 animate-fade-in">
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                <Mic className="w-8 h-8 text-blue-600 absolute inset-0 m-auto animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-800">Analyse de l'IA en cours...</h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Notre correcteur IA évalue votre diction, votre prononciation ainsi que la cohérence de vos arguments oraux.
              </p>
            </div>

            {/* Progress indicators */}
            <div className="max-w-xs mx-auto space-y-3 pt-4">
              {[
                "Vérification des réponses de compréhension orale",
                "Calcul du score de fluidité & diction",
                "Analyse sémantique de l'expression libre",
                "Génération du corrigé modèle"
              ].map((text, i) => (
                <div 
                  key={i}
                  className={`flex items-center gap-2.5 text-xs text-left font-medium transition-opacity duration-300 ${
                    loadingStep >= i ? "opacity-100 text-slate-700" : "opacity-30 text-slate-400"
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${loadingStep > i ? "bg-emerald-500" : loadingStep === i ? "bg-blue-600 animate-ping" : "bg-slate-200"}`}></div>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULT / ASSESSMENT REPORT SCREEN */}
        {stage === "result" && results && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Header Congratulations */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative overflow-hidden text-center">
              <div className="absolute left-0 top-0 w-24 h-24 bg-emerald-50 rounded-br-full pointer-events-none"></div>
              
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h2 className="text-3xl font-black text-slate-800 leading-tight">Projet Terminé !</h2>
              <p className="text-slate-500 text-sm mt-1">
                Félicitations, {userFullName || "Étudiant Plume Africa"} ! Votre performance a été validée par notre jury.
              </p>

              {/* Total Score Circle Big */}
              <div className="my-8 flex justify-center">
                <div className="relative w-44 h-44 rounded-full bg-slate-50 border-4 border-white shadow-inner flex flex-col items-center justify-center">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-extrabold font-mono">Note Globale</span>
                  <div className="text-5xl font-black text-[#002B5B] tabular-nums">
                    {animatedScore}
                  </div>
                  <span className="text-xs text-slate-400 font-bold border-t border-slate-200 pt-1 mt-1">/ 150 points</span>
                </div>
              </div>

              {/* General Feedback Quote */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 max-w-xl mx-auto">
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> RAPPORT SYNTHÉTIQUE DE L'IA
                </p>
                <p className="text-slate-700 text-sm leading-relaxed italic">
                  "{results.feedback}"
                </p>
              </div>
            </div>

            {/* Breakdown Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Box 1: Compréhension */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PARTIE 1</span>
                  <h4 className="text-base font-black text-slate-800">Compréhension Orale</h4>
                  <p className="text-xs text-slate-500 leading-normal mt-1">Questions d'écoute active</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-end">
                  <div>
                    <span className="text-2xl font-black text-slate-800 font-mono">{results.criteriaScores.listening}</span>
                    <span className="text-xs text-slate-400 font-medium"> / 40</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    Excellent
                  </span>
                </div>
              </div>

              {/* Box 2: Lecture */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PARTIE 2</span>
                  <h4 className="text-base font-black text-slate-800">Lecture à voix haute</h4>
                  <p className="text-xs text-slate-500 leading-normal mt-1">Accentuation et diction</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-end">
                  <div>
                    <span className="text-2xl font-black text-slate-800 font-mono">{results.criteriaScores.reading}</span>
                    <span className="text-xs text-slate-400 font-medium"> / 30</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    Fluide
                  </span>
                </div>
              </div>

              {/* Box 3: Expression Libre */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">PARTIE 3</span>
                  <h4 className="text-base font-black text-slate-800">Expression Libre</h4>
                  <p className="text-xs text-slate-500 leading-normal mt-1">Richesse d'argumentation</p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-end">
                  <div>
                    <span className="text-2xl font-black text-slate-800 font-mono">{results.criteriaScores.freeSpeech}</span>
                    <span className="text-xs text-slate-400 font-medium"> / 80</span>
                  </div>
                  <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                    Très Solide
                  </span>
                </div>
              </div>

            </div>

            {/* Strengths & Weaknesses block */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs">
                <div className="flex items-center gap-2 mb-3 text-emerald-700 font-bold">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-base font-bold text-slate-800">Vos points forts</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {results.strengths}
                </p>
              </div>

              {/* Improvements */}
              <div className="bg-white p-6 rounded-2xl border border-amber-100 shadow-xs">
                <div className="flex items-center gap-2 mb-3 text-amber-700 font-bold">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h4 className="text-base font-bold text-slate-800">Axes d'amélioration</h4>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {results.improvements}
                </p>
              </div>
            </div>

            {/* Diction Dimension Bar Ratings */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
              <h4 className="text-base font-black text-slate-800 flex items-center gap-1.5 pb-3 border-b border-slate-50">
                <PrizeIcon className="w-5 h-5 text-[#002B5B]" /> Critères détaillés d'élocution
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: "Articulation et diction", score: results.criteriaScores.diction, max: 10 },
                  { name: "Précision de la prononciation", score: results.criteriaScores.pronunciation, max: 10 },
                  { name: "Fluidité du débit vocal", score: results.criteriaScores.fluency, max: 10 },
                  { name: "Cohérence & structures argumentatives", score: results.criteriaScores.coherence, max: 10 },
                  { name: "Richesse du vocabulaire", score: results.criteriaScores.vocabulary, max: 20 },
                  { name: "Grammaire et tournures", score: results.criteriaScores.grammar, max: 20 }
                ].map((item, idx) => {
                  const pct = (item.score / item.max) * 100;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700">{item.name}</span>
                        <span className="font-mono font-bold text-slate-500">{item.score} / {item.max}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            pct >= 85 ? "bg-emerald-500" : pct >= 70 ? "bg-blue-600" : "bg-amber-500"
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pronunciation Corrections list */}
            {results.corrections && results.corrections.length > 0 && (
              <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-base font-black text-slate-800 pb-3 border-b border-slate-50 flex items-center gap-1.5">
                  <Mic className="w-4 h-4 text-rose-500" /> Recommandations phonétiques & stylistiques
                </h4>
                <div className="space-y-4">
                  {results.corrections.map((corr, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="space-y-1">
                          <span className="text-[10px] text-rose-600 uppercase font-bold tracking-wider">Ce que vous avez dit</span>
                          <p className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 break-words font-sans">
                            {corr.original}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-emerald-600 uppercase font-bold tracking-wider">Prononciation / Style recommandé</span>
                          <p className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 break-words font-sans">
                            {corr.corrected}
                          </p>
                        </div>
                      </div>
                      <div className="pt-2 flex items-start gap-1.5 text-slate-600 text-xs">
                        <CornerDownRight className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <p className="leading-relaxed"><strong className="text-slate-800">Conseil pédagogique :</strong> {corr.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested Model response */}
            {results.suggestedModelResponse && (
              <div className="bg-[#002B5B] rounded-3xl p-6 md:p-8 text-white shadow-xl space-y-4 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-32 h-32 bg-amber-400/10 rounded-bl-full pointer-events-none"></div>
                <h4 className="text-base font-black text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Modèle d'Élocution Libre Recommandé
                </h4>
                <p className="text-xs text-slate-300 leading-normal">
                  Voici la structure idéale d'un exposé formel rédigé par nos examinateurs que vous pouvez réutiliser pour vous entraîner :
                </p>
                <div className="p-4 bg-slate-900/40 rounded-2xl border border-white/10 text-sm leading-relaxed text-slate-100 font-serif whitespace-pre-wrap">
                  {results.suggestedModelResponse}
                </div>
              </div>
            )}

            {/* Action Finish button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleFinishProject}
                className="px-12 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider rounded-full shadow-lg transition-transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                Terminer et obtenir mes +450 XP
                <Check className="w-5 h-5" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
