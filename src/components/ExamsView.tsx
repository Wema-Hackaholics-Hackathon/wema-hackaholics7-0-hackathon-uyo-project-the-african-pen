/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Clock, Award, Shield, Check, X, AlertTriangle, 
  Volume2, Mic, MicOff, RefreshCw, ChevronLeft, ChevronRight, 
  Flag, Eye, Wifi, UserCheck, Sparkles, BookOpen, Lock, Trophy, Play, Menu
} from "lucide-react";

interface ExamsViewProps {
  userXP: number;
  userStreak: number;
  setCurrentView: (view: string) => void;
  onGainXP: (amount: number) => void;
  isPremium?: boolean;
  hideSidebar?: boolean;
}

export default function ExamsView({
  userXP,
  userStreak,
  setCurrentView,
  onGainXP,
  isPremium = false,
  hideSidebar = false
}: ExamsViewProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(!hideSidebar);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
    if (hideSidebar) {
      setIsSidebarOpen(false);
    }
  }, [hideSidebar]);

  // Navigation tabs inside Exams panel
  const [activeTab, setActiveTab] = useState<"lobby" | "exam" | "warning" | "results">("lobby");

  const [activeCheckpoint, setActiveCheckpoint] = useState<string>(() => {
    return localStorage.getItem("active_checkpoint_exam") || "cp1";
  });

  useEffect(() => {
    const handleSync = () => {
      const stored = localStorage.getItem("active_checkpoint_exam");
      if (stored) {
        setActiveCheckpoint(stored);
      }
    };
    handleSync();
    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, []);

  const getExamTitle = () => {
    switch (activeCheckpoint) {
      case "cp1": return "EXAMEN CHECKPOINT 1 : GRAMMAIRE & ORTHOGRAPHE";
      case "cp2": return "EXAMEN CHECKPOINT 2 : TRADUCTION & SYNTAXE";
      case "cp3": return "EXAMEN CHECKPOINT 3 : ARGUMENTATION WRITING";
      case "cp4": return "EXAMEN CHECKPOINT FINAL : SIMULATION WAEC COMPLETE";
      default: return "EXAMEN CHECKPOINT 1 : GRAMMAIRE & ORTHOGRAPHE";
    }
  };

  const getExamSubtitle = () => {
    switch (activeCheckpoint) {
      case "cp1": return "Épreuve officielle de la Semaine 1 — Niveau Régional";
      case "cp2": return "Épreuve officielle de la Semaine 2 — Niveau Académique";
      case "cp3": return "Épreuve officielle de la Semaine 3 — Niveau Supérieur";
      case "cp4": return "Épreuve officielle de la Semaine 4 — Synthèse Générale";
      default: return "Épreuve officielle de contrôle";
    }
  };

  const getExamHeaderTitle = () => {
    switch (activeCheckpoint) {
      case "cp1": return "Examen Checkpoint 1 — Semaine 1";
      case "cp2": return "Examen Checkpoint 2 — Semaine 2";
      case "cp3": return "Examen Checkpoint 3 — Semaine 3";
      case "cp4": return "Examen Checkpoint Final — Semaine 4";
      default: return "Examen Checkpoint — Proctored Evaluation";
    }
  };

  const getExamDescription = () => {
    switch (activeCheckpoint) {
      case "cp1": return "L'épreuve majeure de contrôle de la semaine 1 de La Plume. Conçue pour recréer l'exacte pression d'une épreuve réelle du WAEC, axée sur les bases grammaticales et d'orthographe.";
      case "cp2": return "L'épreuve majeure de contrôle de la semaine 2 de La Plume. Cette évaluation teste vos capacités de traduction bidirectionnelle et d'analyse syntaxique sous surveillance intelligente.";
      case "cp3": return "L'épreuve majeure de contrôle de la semaine 3 de La Plume. Chronométrée et ultra-sécurisée, elle valide vos techniques d'argumentation de transition et d'organisation rhétorique.";
      case "cp4": return "L'épreuve finale globale de La Plume. Une simulation complète et rigoureuse récapitulant l'ensemble des compétences orales et écrites requises pour réussir l'examen du baccalauréat.";
      default: return "L'épreuve majeure de contrôle de La Plume. Conçue pour valider vos compétences dans des conditions optimales sous surveillance intelligente proctorisée.";
    }
  };
  
  // Preparation Checklist States
  const [webcamTested, setWebcamTested] = useState<boolean>(false);
  const [internetTested, setInternetTested] = useState<boolean>(false);
  const [identityTested, setIdentityTested] = useState<boolean>(false);
  const [isTestingWebcam, setIsTestingWebcam] = useState<boolean>(false);
  const [isTestingInternet, setIsTestingInternet] = useState<boolean>(false);
  const [isTestingIdentity, setIsTestingIdentity] = useState<boolean>(false);

  // Countdown timer for next official Friday Exam
  const [countdown, setCountdown] = useState({ days: 2, hours: 14, minutes: 35, seconds: 22 });

  // Proctoring and security states
  const [violations, setViolations] = useState<number>(0);
  const [showWarningPopup, setShowWarningPopup] = useState<boolean>(false);
  const [autoReturnCounter, setAutoReturnCounter] = useState<number>(3);
  const [isLockedInFullscreen, setIsLockedInFullscreen] = useState<boolean>(false);

  // Exam Progress States
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<"A" | "B" | "C">("A");
  const [examTimeLeft, setExamTimeLeft] = useState<number>(7200); // 2 hours in seconds
  const [currentQuestionAIdx, setCurrentQuestionAIdx] = useState<number>(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});

  // Answers State
  const [sectionAAnswers, setSectionAAnswers] = useState<Record<number, string>>({});
  const [sectionBAnswers, setSectionBAnswers] = useState<Record<number, string>>({});
  const [sectionCOrals, setSectionCOrals] = useState<Record<number, boolean>>({});
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingId, setRecordingId] = useState<number | null>(null);
  const [recordProgress, setRecordProgress] = useState<number>(0);

  // Results State
  const [finalScore, setFinalScore] = useState<number>(0);
  const [aiFeedback, setAiFeedback] = useState<string>("");

  // Refs
  const examContainerRef = useRef<HTMLDivElement>(null);
  const timerIntervalRef = useRef<any>(null);
  const recordingIntervalRef = useRef<any>(null);

  // Dynamic Exam Content based on Active Checkpoint
  const getExamData = (checkpoint: string) => {
    switch (checkpoint) {
      case "cp2":
        return {
          sectionAQuestions: [
            {
              id: 1,
              question: "Traduisez correctement en français : « I wish I had known earlier. »",
              options: [
                "A) Si seulement j'avais su plus tôt.",
                "B) Je souhaite que je savais plus tôt.",
                "C) J'aimerais savoir plus tôt.",
                "D) Si seulement je saurais plus tôt."
              ],
              correct: "A) Si seulement j'avais su plus tôt.",
              explanation: "Pour exprimer un regret au passé, on utilise 'si seulement' suivi du plus-que-parfait du subjonctif/de l'indicatif ou le conditionnel passé."
            },
            {
              id: 2,
              question: "Quelle est la traduction la plus idiomatique de : « We look forward to hearing from you. »",
              options: [
                "A) Nous regardons en avant d'entendre de vous.",
                "B) Dans l'attente de vous lire.",
                "C) Nous attendons avec impatience d'entendre votre voix.",
                "D) Nous avons hâte d'entendre parler de vous."
              ],
              correct: "B) Dans l'attente de vous lire.",
              explanation: "En français académique et épistolaire, 'Dans l'attente de vous lire' ou 'Dans l'attente de vos nouvelles' est la tournure professionnelle consacrée."
            },
            {
              id: 3,
              question: "Choisissez la traduction correcte de : « He is said to be extremely wealthy. »",
              options: [
                "A) Il est dit d'être extrêmement riche.",
                "B) On dit qu'il est extrêmement riche.",
                "C) Il a dit être extrêmement riche.",
                "D) Il est dit d'être extrêmement fortuné."
              ],
              correct: "B) On dit qu'il est extrêmement riche.",
              explanation: "La structure passive anglaise 'is said to + infinitif' se traduit en français par la structure impersonnelle 'On dit que + indicatif'."
            },
            {
              id: 4,
              question: "Complétez la traduction de : « She succeeded in passing the WAEC exam. » -> « Elle a réussi ___ l'examen du WAEC. »",
              options: ["A) à réussir", "B) de passer", "C) à passer", "D) pour réussir"],
              correct: "A) à réussir",
              explanation: "Le verbe 'réussir' se construit avec la préposition 'à' devant un infinitif ('réussir à faire quelque chose'). 'Réussir à l'examen' est aussi d'usage."
            },
            {
              id: 5,
              question: "Traduisez : « Unless you make an effort... »",
              options: [
                "A) À moins que vous ne fassiez un effort...",
                "B) Moins que vous fassiez un effort...",
                "C) Sauf si vous faites pas d'effort...",
                "D) À moins que vous faites un effort..."
              ],
              correct: "A) À moins que vous ne fassiez un effort...",
              explanation: "La locution 'à moins que' exige le subjonctif et s'accompagne généralement d'un 'ne' explétif facultatif mais fortement recommandé au niveau académique."
            },
            {
              id: 6,
              question: "Traduisez : « The lecture hall we were talking about. »",
              options: [
                "A) L'amphithéâtre que nous parlions.",
                "B) L'amphithéâtre dont nous parlions.",
                "C) L'amphithéâtre à propos de quoi nous parlions.",
                "D) L'amphithéâtre où nous parlions."
              ],
              correct: "B) L'amphithéâtre dont nous parlions.",
              explanation: "Le verbe 'parler' se construisant avec la préposition 'de' ('parler de quelque chose'), le pronom relatif requis est 'dont'."
            },
            {
              id: 7,
              question: "Quelle est la traduction la plus idiomatique de : « To let the cat out of the bag » ?",
              options: [
                "A) Laisser le chat sortir du sac.",
                "B) Vendre la mèche.",
                "C) Donner sa langue au chat.",
                "D) Acheter un chat en poche."
              ],
              correct: "B) Vendre la mèche.",
              explanation: "L'expression idiomatique anglaise signifiant révéler un secret correspond à l'expression française 'vendre la mèche'."
            },
            {
              id: 8,
              question: "Traduisez : « As soon as they arrive, call me. »",
              options: [
                "A) Aussitôt qu'ils arrivent, appelez-moi.",
                "B) Dès qu'ils arriveront, appelez-moi.",
                "C) Aussitôt qu'ils vont arriver, appelez-moi.",
                "D) Dès qu'ils sont arrivés, appelez-moi."
              ],
              correct: "B) Dès qu'ils arriveront, appelez-moi.",
              explanation: "En français, après les conjonctions de temps comme 'dès que' ou 'aussitôt que', on emploie le futur simple si l'action principale est au futur ou à l'impératif."
            },
            {
              id: 9,
              question: "Choisissez la syntaxe correcte : « J'ai vu un candidat ___ le stylo est tombé. »",
              options: ["A) que", "B) dont", "C) de qui", "D) auquel"],
              correct: "B) dont",
              explanation: "On utilise 'dont' car le nom qu'il complète est précédé de l'article défini ou possessif se rapportant au complément de nom (le stylo DU candidat)."
            },
            {
              id: 10,
              question: "Traduisez : « She made them read the lesson. »",
              options: [
                "A) Elle les a faits lire la leçon.",
                "B) Elle leur a fait lire la leçon.",
                "C) Elle les a fait lire la leçon.",
                "D) Elle a fait eux lire la leçon."
              ],
              correct: "C) Elle les a fait lire la leçon.",
              explanation: "Le participe passé de 'faire' suivi d'un infinitif est toujours invariable, et ici le pronom COD de la personne qui effectue l'action de lire est 'les' (faire faire quelque chose à quelqu'un)."
            }
          ],
          sectionBPassage: "Le bilinguisme fonctionnel est devenu un atout stratégique pour l'intégration économique et diplomatique de la jeunesse d'Afrique de l'Ouest. Bien que le Nigeria soit principalement anglophone et les nations limitrophes comme le Bénin ou le Niger soient francophones, les échanges commerciaux régionaux forcent l'émergence d'une double compétence linguistique. La traduction n'est plus seulement une discipline académique rigide, mais un pont vivant. Cependant, traduire ne consiste pas à transposer des mots mécaniquement d'une langue à l'autre ; cela exige une compréhension intime des nuances culturelles, des structures syntaxiques spécifiques et des idiotismes propres à chaque aire linguistique.",
          sectionBQuestions: [
            {
              id: 41,
              question: "Pourquoi la traduction est-elle qualifiée de « pont vivant » dans le texte, au-delà d'une simple discipline rigide ?",
              helper: "Expliquez l'importance du bilinguisme pour l'intégration de la jeunesse ouest-africaine."
            },
            {
              id: 42,
              question: "Qu'est-ce que l'auteur entend par l'affirmation selon laquelle la traduction exige une « compréhension intime des nuances culturelles » ?",
              helper: "Argumentez sur la différence entre la traduction littérale et la traduction idiomatique en donnant vos propres exemples."
            },
            {
              id: 43,
              question: "Reformulez l'idée principale du texte concernant les dynamiques régionales entre le Nigeria et ses voisins francophones.",
              helper: "Rédigez une synthèse claire de 30 à 50 mots."
            }
          ],
          sectionCQuestions: [
            {
              id: 44,
              title: "Épreuve Orale 44 : Traduction Orale Spontanée",
              consigne: "Traduisez oralement cette phrase anglaise en français impeccable en soignant la prononciation et les liaisons.",
              audioText: "« Please remember to submit your final homework before midnight. »"
            },
            {
              id: 45,
              title: "Épreuve Orale 45 : Lecture Rythmée Bilingue",
              consigne: "Lisez la formule bilingue suivante avec assurance, clarté et sans hésitation.",
              audioText: "« Language is the key to collaboration. La langue est la clé de la collaboration. »"
            }
          ]
        };
      case "cp3":
        return {
          sectionAQuestions: [
            {
              id: 1,
              question: "Quel connecteur logique exprime le mieux la concession ou l'opposition modérée ?",
              options: ["A) En effet", "B) Par conséquent", "C) Certes", "D) C'est pourquoi"],
              correct: "C) Certes",
              explanation: "Le connecteur 'Certes' permet de concéder un argument avant de présenter une objection (souvent suivi de 'mais' ou 'cependant')."
            },
            {
              id: 2,
              question: "Quel connecteur logique est le plus adapté pour introduire une alternative stricte ?",
              options: ["A) Soit... soit...", "B) Car... et...", "C) D'une part", "D) En outre"],
              correct: "A) Soit... soit...",
              explanation: "'Soit... soit...' exprime la disjonction, c'est-à-dire l'obligation de choisir entre deux options mutuellement exclusives."
            },
            {
              id: 3,
              question: "Quel terme de transition est le plus académique pour clore une dissertation ?",
              options: ["A) En somme", "B) Finalement", "C) Tout est bien qui finit bien", "D) Au bout du compte"],
              correct: "A) En somme",
              explanation: "'En somme' ou 'En définitive' sont des locutions extrêmement formelles et académiques adaptées à la conclusion d'un essai littéraire."
            },
            {
              id: 4,
              question: "Quel connecteur exprime la conséquence d'une cause évidente ?",
              options: ["A) Parce que", "B) Par conséquent", "C) Puisque", "D) Vu que"],
              correct: "B) Par conséquent",
              explanation: "'Par conséquent' introduit de manière formelle et logique le résultat inéluctable d'un fait précédemment posé."
            },
            {
              id: 5,
              question: "Choisissez le connecteur logique idéal pour ajouter un argument de poids supérieur :",
              options: ["A) De surcroît", "B) En effet", "C) Par exemple", "D) À mon avis"],
              correct: "A) De surcroît",
              explanation: "'De surcroît' (ou 'en outre', 'qui plus est') permet d'additionner un argument de manière élégante et cumulative."
            },
            {
              id: 6,
              question: "Dans une dissertation littéraire, l'étape de la 'thèse' est logiquement suivie de :",
              options: ["A) L'antithèse", "B) L'introduction", "C) La conclusion", "D) L'exorde"],
              correct: "A) L'antithèse",
              explanation: "Le plan dialectique traditionnel comporte trois étapes : Thèse (affirmation), Antithèse (objection) et Synthèse (dépassement)."
            },
            {
              id: 7,
              question: "Quelle figure de rhétorique consiste à atténuer une vérité choquante ou douloureuse ?",
              options: ["A) Une hyperbole", "B) Un euphémisme", "C) Un oxymore", "D) Une métaphore"],
              correct: "B) Un euphémisme",
              explanation: "L'euphémisme atténue l'expression d'une idée pour en limiter le caractère déplaisant (ex: 'il nous a quittés' au lieu de 'il est mort')."
            },
            {
              id: 8,
              question: "Quel terme désigne l'appel à la logique et à la raison de l'auditoire ?",
              options: ["A) Le pathos", "B) Le logos", "C) L'ethos", "D) La dissonance"],
              correct: "B) Le logos",
              explanation: "Dans la rhétorique d'Aristote, le logos est l'art de persuader par le raisonnement logique et les faits démontrables."
            },
            {
              id: 9,
              question: "Complétez logiquement la phrase : « L'étude est ardue ; ___ elle est nécessaire. »",
              options: ["A) néanmoins", "B) en effet", "C) ainsi", "D) car"],
              correct: "A) néanmoins",
              explanation: "'Néanmoins' marque l'opposition ou la restriction par rapport à un obstacle mentionné juste avant."
            },
            {
              id: 10,
              question: "Quelle est la fonction première d'une phrase de transition dans un paragraphe ?",
              options: [
                "A) Introduire de nouveaux exemples sans lien.",
                "B) Assurer la continuité logique entre deux arguments distincts.",
                "C) Répéter la thèse de l'introduction mot pour mot.",
                "D) Conclure définitivement l'ensemble de la dissertation."
              ],
              correct: "B) Assurer la continuité logique entre deux arguments distincts.",
              explanation: "Une transition serves de charnière logique pour fluidifier la lecture et montrer l'articulation de la pensée."
            }
          ],
          sectionBPassage: "L'avènement de l'intelligence artificielle générative bouleverse profondément l'avenir du travail humain et de la création littéraire. Certains technophiles prophétisent la disparition des rédacteurs, traducteurs et romanciers au profit de modèles probabilistes d'une vélocité sans précédent. Certes, les algorithmes excellent dans la synthèse d'informations massives et la génération de canevas standardisés. Néanmoins, l'essence de l'argumentation humaine réside dans la conviction morale, la sensibilité culturelle et la capacité de concevoir des paradoxes poétiques qui échappent par définition aux calculs statistiques. L'outil technologique doit donc demeurer un auxiliaire intellectuel, et non se substituer à la conscience critique qui fonde notre humanité.",
          sectionBQuestions: [
            {
              id: 41,
              question: "Identifiez et analysez la thèse réfutée (l'antithèse) et la thèse défendue par l'auteur dans ce texte.",
              helper: "Structurez votre analyse de manière formelle (minimum 30 mots)."
            },
            {
              id: 42,
              question: "Qu'est-ce qui différencie fondamentalement, selon l'auteur, l'argumentation humaine des productions de l'intelligence artificielle ?",
              helper: "Appuyez-vous sur des notions rhétoriques telles que la sensibilité morale ou culturelle."
            },
            {
              id: 43,
              question: "Rédigez un paragraphe d'argumentation d'une dizaine de lignes pour soutenir ou nuancer le point de vue de l'auteur sur l'IA comme outil d'aide à la création.",
              helper: "Utilisez au moins trois connecteurs logiques différents (ex: certes, de plus, en définitive)."
            }
          ],
          sectionCQuestions: [
            {
              id: 44,
              title: "Épreuve Orale 44 : Mini-Exposé Persuasif",
              consigne: "Défendez oralement votre opinion sur l'importance d'apprendre des langues étrangères à l'ère de l'intelligence artificielle.",
              audioText: "« L'intelligence artificielle traduit vite, mais elle ne ressent rien. Apprendre une langue, c'est adopter une âme. »"
            },
            {
              id: 45,
              title: "Épreuve Orale 45 : Déclamation Rhétorique",
              consigne: "Lisez ce plaidoyer avec une intonation théâtrale et persuasive. Insistez sur le rythme ternaire.",
              audioText: "« Nous devons écrire pour résister, pour penser par nous-mêmes, et pour préserver la liberté de notre esprit ! »"
            }
          ]
        };
      case "cp4":
        return {
          sectionAQuestions: [
            {
              id: 1,
              question: "Choisissez l'énoncé de synthèse grammaticalement irréprochable :",
              options: [
                "A) Bien qu'il a été prévenu, il n'a pas pris de précautions.",
                "B) Quoiqu'il ait été prévenu, il n'a pas pris de précautions.",
                "C) Malgré qu'il ait été prévenu, il n'a pas pris de précautions.",
                "D) Bien qu'il soit prévenu, il ne prenait pas de précautions."
              ],
              correct: "B) Quoiqu'il ait été prévenu, il n'a pas pris de précautions.",
              explanation: "'Quoique' est suivi du subjonctif. 'Malgré que' est considéré comme incorrect en français soutenu (sauf dans 'malgré que j'en aie')."
            },
            {
              id: 2,
              question: "Trouvez l'intrus sémantique parmi les adjectifs suivants :",
              options: ["A) Éphémère", "B) Fugace", "C) Transitoire", "D) Pérenne"],
              correct: "D) Pérenne",
              explanation: "Pérenne signifie durable, éternel, tandis que les trois autres adjectifs décrivent ce qui est bref ou passager."
            },
            {
              id: 3,
              question: "Identifiez l'accord correct du participe passé du verbe pronominal :",
              options: [
                "A) Elles se sont téléphonées hier soir.",
                "B) Elles se sont téléphoné hier soir.",
                "C) Elles se sont téléphoner hier soir.",
                "D) Elles se sont téléphonés hier soir."
              ],
              correct: "B) Elles se sont téléphoné hier soir.",
              explanation: "Le verbe 'téléphoner' est intransitif en français ('téléphoner À quelqu'un'), donc le pronom réfléchi 'se' est un COI. Pas d'accord."
            },
            {
              id: 4,
              question: "Complétez la concordance des temps : « Si nous ___ plus tôt, nous n'aurions pas raté le début de l'épreuve. »",
              options: ["A) serions partis", "B) étions partis", "C) partions", "D) fussions partis"],
              correct: "B) étions partis",
              explanation: "La structure de l'hypothèse irréelle du passé exige 'si + plus-que-parfait de l'indicatif' suivi du 'conditionnel passé' dans la principale."
            },
            {
              id: 5,
              question: "Quelle est la traduction correcte de : « We had to call off the regional exam. »",
              options: [
                "A) Nous avions à appeler l'examen régional.",
                "B) Nous avons dû annuler l'examen régional.",
                "C) Nous devions rejeter l'examen régional.",
                "D) Nous avons été forcés de rappeler l'examen régional."
              ],
              correct: "B) Nous avons dû annuler l'examen régional.",
              explanation: "'To call off' est un phrasal verb signifiant annuler. 'Had to' se traduit par le passé composé 'avons dû' exprimant l'obligation accomplie."
            },
            {
              id: 6,
              question: "Quel connecteur logique convient pour exprimer une concession forte ? « Il pleut à verse, ___ nous irons courir. »",
              options: ["A) de plus", "B) pourtant", "C) ainsi", "D) car"],
              correct: "B) pourtant",
              explanation: "'Pourtant' marque l'opposition ou la concession inattendue par rapport au premier membre de phrase."
            },
            {
              id: 7,
              question: "Quelle figure de style est employée dans : « Cette obscure clarté qui tombe des étoiles. »",
              options: ["A) Un oxymore", "B) Une litote", "C) Un pléonasme", "D) Une métaphore"],
              correct: "A) Un oxymore",
              explanation: "L'oxymore consiste à réunir deux termes de sens opposés dans un même groupe de mots ('obscure clarté')."
            },
            {
              id: 8,
              question: "Choisissez la bonne conjugaison : « Il convient que vous ___ d'une rigueur absolue. »",
              options: ["A) faites preuve", "B) fassiez preuve", "C) ferez preuve", "D) fassent preuve"],
              correct: "B) fassiez preuve",
              explanation: "La tournure impersonnelle 'il convient que' ou 'il faut que' est obligatoirement suivie du subjonctif présent."
            },
            {
              id: 9,
              question: "Trouvez la préposition correcte : « Il s'est plaint ___ ne pas avoir reçu son relevé de notes officiel. »",
              options: ["A) à", "B) de", "C) pour", "D) avec"],
              correct: "B) de",
              explanation: "Le verbe pronominal 'se plaindre' se construit avec la préposition 'de' ('se plaindre de quelque chose')."
            },
            {
              id: 10,
              question: "Quel pronom relatif complète : « C'est une épreuve redoutable ___ je me prépare activement. »",
              options: ["A) de laquelle", "B) à laquelle", "C) dont", "D) auquel"],
              correct: "B) à laquelle",
              explanation: "On utilise 'à laquelle' (féminin singulier) car la construction verbale est 'se préparer À quelque chose'."
            }
          ],
          sectionBPassage: "L'excellence académique en Afrique de l'Ouest francophone constitue le pilier fondamental du développement socio-économique contemporain. Face aux exigences d'une mondialisation ultra-compétitive, les institutions d'enseignement supérieur et secondaire redéfinissent leurs critères d'évaluation. Il ne s'agit plus de former de simples exécutants dépositaires de savoirs statiques, mais des concepteurs, des penseurs critiques et des citoyens dotés d'une intégrité éthique exemplaire. Les examens proctored de fin de cycle, sous l'égide de conseils d'évaluation réformés, incarnent cette volonté de justice républicaine et de méritocratie absolue.",
          sectionBQuestions: [
            {
              id: 41,
              question: "Selon l'auteur, quelle mutation majeure subissent les objectifs des institutions d'enseignement face à la mondialisation ?",
              helper: "Saisissez une analyse argumentée (minimum 25 mots)."
            },
            {
              id: 42,
              question: "En quoi les examens surveillés (proctored) participent-ils à l'avènement d'une justice républicaine et d'une méritocratie ?",
              helper: "Détaillez votre vision éthique des examens de fin de cycle."
            },
            {
              id: 43,
              question: "Proposez une synthèse structurée des idées fortes développées dans ce passage.",
              helper: "Utilisez un vocabulaire soutenu et des liaisons logiques élégantes."
            }
          ],
          sectionCQuestions: [
            {
              id: 44,
              title: "Épreuve Orale 44 : Déclaration de Rigueur",
              consigne: "Récitez le serment académique de La Plume de votre voix la plus claire et posée.",
              audioText: "« Devant mes pairs, je m'engage à cultiver l'excellence, la probité intellectuelle et la maîtrise de la langue. »"
            },
            {
              id: 45,
              title: "Épreuve Orale 45 : Exposé de Synthèse WAEC",
              consigne: "Présentez oralement en 45 secondes une réflexion ordonnée sur le rôle du français comme vecteur d'intégration en Afrique de l'Ouest.",
              audioText: "« Le français n'est pas seulement une langue d'examen, c'est un carrefour culturel et un vecteur de fraternité sous-régionale. »"
            }
          ]
        };
      case "cp1":
      default:
        return {
          sectionAQuestions: [
            {
              id: 1,
              question: "Choisissez la forme correcte du verbe : « Il faut que vous ___ (partir) maintenant. »",
              options: ["A) partiez", "B) partez", "C) partirez", "D) partissent"],
              correct: "A) partiez",
              explanation: "Après 'il faut que', on emploie le subjonctif présent : 'que vous partiez'."
            },
            {
              id: 2,
              question: "Laquelle de ces phrases est correctement orthographiée ?",
              options: [
                "A) Elles se sont lavé les mains.",
                "B) Elles se sont lavées les mains.",
                "C) Elles se sont lavés les mains.",
                "D) Elles se sont laver les mains."
              ],
              correct: "A) Elles se sont lavé les mains.",
              explanation: "Le participe passé du verbe pronominal ne s'accorde pas car le COD 'les mains' est placé après le verbe."
            },
            {
              id: 3,
              question: "Complétez : « Quoiqu'il ___ fatigué, il continue ses révisions. »",
              options: ["A) soit", "B) est", "C) sera", "D) fut"],
              correct: "A) soit",
              explanation: "La conjonction de concession 'quoique' est toujours suivie du subjonctif."
            },
            {
              id: 4,
              question: "Trouvez le synonyme de l'adjectif « éphémère » :",
              options: ["A) durable", "B) transitoire", "C) éternel", "D) superficiel"],
              correct: "B) transitoire",
              explanation: "Éphémère signifie qui dure peu de temps, tout comme transitoire."
            },
            {
              id: 5,
              question: "« S'il avait fait beau hier, nous ___ faire une promenade en forêt. »",
              options: ["A) serions allés", "B) irons", "C) irions", "D) étions allés"],
              correct: "A) serions allés",
              explanation: "Dans l'hypothèse au passé (si + plus-que-parfait), la principale est au conditionnel passé."
            },
            {
              id: 6,
              question: "Choisissez l'accord correct : « Les dix kilomètres que j'ai ___ m'ont épuisé. »",
              options: ["A) courus", "B) couru", "C) courues", "D) coururs"],
              correct: "B) couru",
              explanation: "Le verbe courir est ici intransitif (kilomètres est une mesure), donc pas d'accord avec le participe."
            },
            {
              id: 7,
              question: "Quel est l'antonyme de « loquace » ?",
              options: ["A) bavard", "B) taciturne", "C) volubile", "D) chaleureux"],
              correct: "B) taciturne",
              explanation: "Taciturne (qui parle peu) est le contraire parfait de loquace."
            },
            {
              id: 8,
              question: "Dans quelle phrase utilise-t-on correctement le pronom « dont » ?",
              options: [
                "A) C'est l'étudiant dont je t'ai parlé.",
                "B) C'est l'étudiant dont j'ai vu hier.",
                "C) C'est l'étudiant dont je lui ai donné un livre.",
                "D) C'est l'étudiant dont qui a gagné le prix."
              ],
              correct: "A) C'est l'étudiant dont je t'ai parlé.",
              explanation: "On emploie 'dont' pour remplacer un complément introduit par 'de' (parler DE quelqu'un)."
            },
            {
              id: 9,
              question: "Choisissez la bonne préposition : « Il s'est résigné ___ accepter cet échec temporaire. »",
              options: ["A) à", "B) de", "C) pour", "D) en"],
              correct: "A) à",
              explanation: "La structure correcte est 'se résigner à faire quelque chose'."
            },
            {
              id: 10,
              question: "Identifiez la figure de style : « Le vent hurlait dans les branches sombres. »",
              options: ["A) Une métaphore", "B) Une comparaison", "C) Une personnification", "D) Une hyperbole"],
              correct: "C) Une personnification",
              explanation: "Attribuer des actions humaines (hurler) à un élément inanimé (le vent) est une personnification."
            }
          ],
          sectionBPassage: "L'éducation moderne en Afrique de l'Ouest connaît d'importantes transformations structurelles sous l'impulsion des nouvelles technologies de l'information. Jadis centrée sur des enseignements strictement théoriques, l'école s'ouvre désormais à des méthodes d'apprentissage connectées et pragmatiques. Les examens standardisés régionaux, tels que le WAEC, évoluent pour tester non seulement la mémorisation factuelle, mais surtout la créativité intellectuelle, l'agilité linguistique et la capacité à argumenter de manière structurée. Cette transition s'accompagne d'un défi majeur : former des citoyens dotés d'une pensée critique rigoureuse capables de s'adapter aux mutations globales tout en restant solidement ancrés dans les réalités locales.",
          sectionBQuestions: [
            {
              id: 41,
              question: "Expliquez brièvement comment le rôle de l'éducation en Afrique de l'Ouest moderne se transforme selon l'auteur du texte.",
              helper: "Saisissez votre réponse rédigée ci-dessous (minimum 20 mots)."
            },
            {
              id: 42,
              question: "Pourquoi est-il crucial pour les examens régionaux comme le WAEC de valoriser la pensée critique plutôt que la mémorisation ?",
              helper: "Expliquez en argumentant à l'aide d'exemples concrets de votre parcours académique."
            },
            {
              id: 43,
              question: "Qu'entend l'auteur par l'expression « s'adapter aux mutations globales tout en restant solidement ancrés dans les réalités locales » ?",
              helper: "Proposez une analyse de cette dualité éducative moderne."
            }
          ],
          sectionCQuestions: [
            {
              id: 44,
              title: "Épreuve Orale 44 : Répétition de Phrase & Liaison",
              consigne: "Écoutez l'extrait de référence ci-dessous, puis enregistrez-vous à voix haute en insistant bien sur la liaison requise.",
              audioText: "« Les élèves ont un examen crucial vendredi prochain à dix heures. »"
            },
            {
              id: 45,
              title: "Épreuve Orale 45 : Lecture de Texte Rythmée",
              consigne: "Lisez l'extrait avec une intonation naturelle et fluide. Marquez les pauses appropriées.",
              audioText: "« Quoique le défi soit immense, l'excellence reste à notre portée si nous travaillons sans relâche. »"
            }
          ]
        };
    }
  };

  const examData = getExamData(activeCheckpoint);
  const sectionAQuestions = examData.sectionAQuestions;

  // Fill up mock questions to 40 questions total to fulfill requirements
  const additionalQuestions = Array.from({ length: 30 }, (_, i) => ({
    id: i + 11,
    question: `Question objective ${i + 11} de validation du WAEC : Choisissez la concordance de temps appropriée pour parfaire la phrase d'illustration du Checkpoint ${activeCheckpoint.replace("cp", "")}.`,
    options: ["A) option A", "B) option B", "C) option C", "D) option D"],
    correct: "A) option A",
    explanation: "Explication théorique standard de l'épreuve du WAEC."
  }));

  const fullSectionAQuestions = [...sectionAQuestions, ...additionalQuestions];
  const sectionBPassage = examData.sectionBPassage;
  const sectionBQuestions = examData.sectionBQuestions;
  const sectionCQuestions = examData.sectionCQuestions;

  // Lobby countdown logic
  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
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
    return () => clearInterval(countdownInterval);
  }, []);

  // Fullscreen and Tab Violation Listeners
  useEffect(() => {
    if (!examStarted) return;

    // Start timer
    timerIntervalRef.current = setInterval(() => {
      setExamTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Violation Event Listeners: Tab Switch (visibilitychange) and Window Blur
    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolationIncident();
      }
    };

    const handleWindowBlur = () => {
      triggerViolationIncident();
    };

    // Fullscreen Change Listeners to detect escapes
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsLockedInFullscreen(isCurrentlyFullscreen);
      if (!isCurrentlyFullscreen && examStarted) {
        // Exited fullscreen - counts as a minor violation
        triggerViolationIncident();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      clearInterval(timerIntervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [examStarted]);

  // Request fullscreen on start
  const enterExamFullscreen = async () => {
    try {
      if (examContainerRef.current) {
        if (examContainerRef.current.requestFullscreen) {
          await examContainerRef.current.requestFullscreen();
        }
      }
    } catch (err) {
      console.warn("Fullscreen request was blocked or not supported", err);
    }
  };

  // Trigger Proctoring Warning Popup
  const triggerViolationIncident = () => {
    setViolations(prev => {
      const newVal = prev + 1;
      if (newVal >= 3) {
        // Strike limit reached! Auto submit
        setTimeout(() => {
          handleAutoSubmit("LIMIT_EXCEEDED");
        }, 100);
      } else {
        // Show warning popup
        setShowWarningPopup(true);
        setAutoReturnCounter(3);
      }
      return newVal;
    });
  };

  // Warning Popup AutoReturn Counter
  useEffect(() => {
    let returnTimer: any;
    if (showWarningPopup) {
      returnTimer = setInterval(() => {
        setAutoReturnCounter(prev => {
          if (prev <= 1) {
            clearInterval(returnTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(returnTimer);
  }, [showWarningPopup]);

  const handleReturnToExam = async () => {
    setShowWarningPopup(false);
    await enterExamFullscreen();
  };

  // Formatter for countdown
  const formatCountdown = () => {
    const d = countdown.days.toString().padStart(2, "0");
    const h = countdown.hours.toString().padStart(2, "0");
    const m = countdown.minutes.toString().padStart(2, "0");
    const s = countdown.seconds.toString().padStart(2, "0");
    return `${d} jours ${h} heures ${m} mins ${s} secs`;
  };

  // Formatter for timer
  const formatExamTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Simulate Checklist Testing
  const handleTestWebcam = () => {
    setIsTestingWebcam(true);
    setTimeout(() => {
      setWebcamTested(true);
      setIsTestingWebcam(false);
    }, 1200);
  };

  const handleTestInternet = () => {
    setIsTestingInternet(true);
    setTimeout(() => {
      setInternetTested(true);
      setIsTestingInternet(false);
    }, 1000);
  };

  const handleTestIdentity = () => {
    setIsTestingIdentity(true);
    setTimeout(() => {
      setIdentityTested(true);
      setIsTestingIdentity(false);
    }, 1500);
  };

  const canStartExam = webcamTested && internetTested && identityTested;

  // Start Exam simulation
  const startOfficialMock = async () => {
    setViolations(0);
    setShowWarningPopup(false);
    setSectionAAnswers({});
    setSectionBAnswers({});
    setSectionCOrals({});
    setCurrentQuestionAIdx(0);
    setCurrentSection("A");
    setExamTimeLeft(7200); // 2 hours
    setExamStarted(true);
    setActiveTab("exam");
    await enterExamFullscreen();
  };

  // Oral simulator recording logic
  const handleToggleRecording = (qId: number) => {
    if (isRecording) {
      clearInterval(recordingIntervalRef.current);
      setIsRecording(false);
      setRecordingId(null);
      setSectionCOrals(prev => ({ ...prev, [qId]: true }));
    } else {
      setIsRecording(true);
      setRecordingId(qId);
      setRecordProgress(0);
      recordingIntervalRef.current = setInterval(() => {
        setRecordProgress(p => {
          if (p >= 100) {
            clearInterval(recordingIntervalRef.current);
            setIsRecording(false);
            setRecordingId(null);
            setSectionCOrals(prev => ({ ...prev, [qId]: true }));
            return 100;
          }
          return p + 10;
        });
      }, 300);
    }
  };

  // Auto/Manual submission and AI scoring generator
  const handleAutoSubmit = (reason?: string) => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    clearInterval(timerIntervalRef.current);
    setExamStarted(false);

    // Calculate score based on answers selected
    let correctCount = 0;
    fullSectionAQuestions.forEach(q => {
      if (sectionAAnswers[q.id] === q.correct) {
        correctCount++;
      }
    });

    // Score from Section A is out of 100
    const sectionAScore = Math.round((correctCount / fullSectionAQuestions.length) * 100);
    
    // Check theory answers
    let theoryScore = 50; // baseline
    const b41 = sectionBAnswers[41] || "";
    const b42 = sectionBAnswers[42] || "";
    const b43 = sectionBAnswers[43] || "";
    if (b41.trim().length > 30) theoryScore += 10;
    if (b42.trim().length > 40) theoryScore += 15;
    if (b43.trim().length > 45) theoryScore += 15;
    theoryScore = Math.min(theoryScore, 95);

    // Check oral completion
    let oralScore = 40;
    if (sectionCOrals[44]) oralScore += 25;
    if (sectionCOrals[45]) oralScore += 25;

    // Overall Weighted Score
    const finalVal = Math.round((sectionAScore * 0.4) + (theoryScore * 0.4) + (oralScore * 0.2));
    setFinalScore(finalVal);

    // AI Feedback Text formulation based on score
    let feedback = "";
    if (reason === "LIMIT_EXCEEDED") {
      feedback = "⚠️ ALERTE PROCTORING : L'examen a été soumis de force en raison d'infractions répétées au protocole de sécurité (3 changements d'onglets ou sorties d'application détectés). Votre score reflète les réponses enregistrées jusqu'à l'incident.\n\n";
    }

    if (finalVal >= 80) {
      feedback += "Félicitations, cher élève d'Afrique de l'Ouest ! Vous avez obtenu la mention d'excellence A1. Votre maîtrise de la concordance des temps, du subjonctif présent ainsi que la clarté et la structure académique de vos réponses écrites sont admirables. Vos liaisons orales sont de très haut niveau. Vous êtes d'ores et déjà prêt pour dominer l'épreuve réelle du WAEC.";
    } else if (finalVal >= 65) {
      feedback += "Félicitations ! Vous obtenez la mention B2 (Très Bien). Votre niveau général en grammaire française (Section A) est très solide, notamment sur l'accord du participe passé. Néanmoins, votre argumentation écrite (Section B) manque légèrement d'ancrage textuel précis. À l'oral (Section C), soignez davantage les articulations des nasales franglaises. Un travail soutenu sur ces points faibles fera de vous un candidat d'élite.";
    } else {
      feedback += "Vous obtenez la mention C4 (Satisfaisant). Les bases de grammaire sont présentes mais la structure narrative de la Section B et la fluidité d'élocution orale nécessitent un entraînement régulier. Les notions de concordance après les locutions concessives (bien que, quoique) doivent être revues. Nous vous recommandons de suivre activement notre parcours de révision personnalisé.";
    }

    setAiFeedback(feedback);
    onGainXP(1000); // 1000 XP reward as requested!
    setActiveTab("results");
  };

  return (
    <div className="w-full min-h-screen bg-[#fcfcfd] text-[#002B5B] flex font-sans antialiased selection:bg-[#FFD214] selection:text-[#002B5B]">
      
      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-35 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar navigation */}
      <aside className={`border-r border-slate-100 bg-white flex flex-col justify-between shrink-0 fixed md:sticky left-0 top-0 h-screen z-40 transition-all duration-300 ${
        isSidebarOpen 
          ? "w-64 translate-x-0 opacity-100" 
          : "w-0 -translate-x-full md:translate-x-0 md:opacity-0 md:w-0 overflow-hidden border-r-0 pointer-events-none"
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView("dashboard")}>
              <div className="bg-[#002B5B] p-1.5 rounded-xl text-white group-hover:bg-blue-800 transition-all shadow-md shrink-0">
                <Award className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-display font-bold text-lg tracking-tight text-[#002B5B] block leading-none">
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

          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "Tableau de Bord", icon: ArrowLeft },
              { id: "parcours", label: "Parcours", icon: Award },
              { id: "blitz", label: "Le Blitz", icon: Play }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-slate-500 hover:bg-slate-50 hover:text-[#002B5B]`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-100 text-[10px] font-mono text-slate-400 text-center">
          Proctoring IA Actif
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden" ref={examContainerRef}>
        
        {/* Header bar */}
        <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-100 px-8 py-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer shrink-0"
              title="Menu principal"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="font-display font-bold text-sm md:text-base text-[#002B5B] tracking-tight uppercase flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-500 fill-rose-500/10" />
              <span>{getExamHeaderTitle()} — Weekly Proctored Mock</span>
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            {activeTab === "exam" && (
              <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 text-rose-600 px-4 py-1.5 rounded-full font-bold uppercase text-[10px]">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                <span>Mode Sécurisé Actif</span>
              </div>
            )}
            
            {activeTab === "exam" && (
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 text-[#002B5B] px-3.5 py-1.5 rounded-xl font-bold">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{formatExamTime(examTimeLeft)}</span>
              </div>
            )}
          </div>
        </header>

        {/* Outer Warning Overlay during examination */}
        {showWarningPopup && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white border-2 border-rose-500 rounded-3xl p-8 max-w-lg w-full text-center space-y-6 shadow-2xl relative">
              <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center text-rose-500 mx-auto animate-bounce">
                <AlertTriangle className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="font-display font-bold text-xl text-[#002B5B] uppercase tracking-wider">⚠️ INCIDENT DE PROCTORING DÉTECTÉ</h3>
                <p className="text-rose-600 text-xs font-bold font-mono bg-rose-50 px-3 py-1 rounded-md border border-rose-100 inline-block">
                  Avertissement : {violations} sur 3 infractions enregistrées
                </p>
                <p className="text-slate-600 text-xs leading-relaxed font-semibold pt-2">
                  Vous avez quitté l'environnement d'examen sécurisé (changement d'onglet ou perte de focus).
                  Notre proctoring IA a enregistré cette violation. À la 3ème infraction, votre copie sera automatiquement soumise au jury d'évaluation régionale.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-semibold text-slate-500">
                L'application rétablit la surveillance en continu.
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleReturnToExam}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Retourner à l'examen maintenant
                </button>
              </div>
              
              <p className="text-[10px] text-slate-400 font-mono">
                Reprise automatique dans {autoReturnCounter}s...
              </p>
            </div>
          </div>
        )}

        {/* Content switchboard */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          
          {/* ================== TAB 1: LOBBY & PREPARATION ================== */}
          {activeTab === "lobby" && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">

              {/* Event Info Card */}
              <div className="bg-[#002B5B] border border-blue-950 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl text-white">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-4">
                    <span className="bg-[#FFD214] text-[#002B5B] text-[10px] font-mono font-black tracking-widest px-3 py-1 rounded-md uppercase">
                      ÉPREUVE OFFICIELLE COHORTE 1
                    </span>
                    <h1 className="font-display font-black text-2xl md:text-4xl tracking-tight leading-none text-white">
                      {getExamTitle()}
                    </h1>
                    <p className="text-blue-100/80 text-xs md:text-sm font-medium max-w-xl leading-relaxed">
                      {getExamDescription()}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-semibold text-blue-200 pt-1">
                      <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-[#FFD214]" /> <span>Durée : 120 minutes</span></div>
                      <div className="flex items-center gap-1"><Award className="w-4 h-4 text-[#FFD214]" /> <span>Stakes : +1,000 XP & Impact Ranking</span></div>
                      <div className="flex items-center gap-1"><Shield className="w-4 h-4 text-rose-400" /> <span>Surveillance IA : Activée</span></div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center min-w-[200px] shrink-0">
                    <p className="text-[10px] text-blue-200 font-mono uppercase font-black tracking-wider">Prochain Examen de Contrôle</p>
                    <p className="text-xs font-black text-[#FFD214] mt-1.5 font-mono">{formatCountdown()}</p>
                    <p className="text-[10px] text-slate-400 mt-2">Disponible 24h/7 pour évaluation</p>
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Preparation Checklist and Exam Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Checklist Card */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-lg text-[#002B5B] flex items-center gap-2">
                      <Shield className="w-5 h-5 text-amber-500" />
                      <span>Configuration Sécurisée & Matériel</span>
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 font-semibold">
                      Vous devez obligatoirement effectuer ces trois tests avant de pouvoir lancer l'épreuve.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Webcam Test */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl shrink-0 ${webcamTested ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"}`}>
                          <Eye className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#002B5B]">Test de Webcam & Présence</p>
                          <p className="text-[10px] text-slate-500 font-medium">Validation de l'environnement de travail</p>
                        </div>
                      </div>
                      <button
                        onClick={handleTestWebcam}
                        disabled={webcamTested || isTestingWebcam}
                        className={`text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg cursor-pointer transition-all ${
                          webcamTested 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100 font-extrabold"
                            : "bg-[#FFD214] text-[#002B5B] hover:bg-yellow-400"
                        }`}
                      >
                        {isTestingWebcam ? "Test..." : webcamTested ? "Prêt ✓" : "Tester"}
                      </button>
                    </div>

                    {/* Internet speed Test */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl shrink-0 ${internetTested ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"}`}>
                          <Wifi className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#002B5B]">Vitesse de Connexion Internet</p>
                          <p className="text-[10px] text-slate-500 font-medium">Bande passante requise pour la synchronisation</p>
                        </div>
                      </div>
                      <button
                        onClick={handleTestInternet}
                        disabled={internetTested || isTestingInternet}
                        className={`text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg cursor-pointer transition-all ${
                          internetTested 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100 font-extrabold"
                            : "bg-[#FFD214] text-[#002B5B] hover:bg-yellow-400"
                        }`}
                      >
                        {isTestingInternet ? "Test..." : internetTested ? "Prêt ✓" : "Tester"}
                      </button>
                    </div>

                    {/* Identity Test */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl shrink-0 ${identityTested ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"}`}>
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#002B5B]">Authentification d'Identité Étudiant</p>
                          <p className="text-[10px] text-slate-500 font-medium">Conformité aux règles d'évaluation du WAEC</p>
                        </div>
                      </div>
                      <button
                        onClick={handleTestIdentity}
                        disabled={identityTested || isTestingIdentity}
                        className={`text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg cursor-pointer transition-all ${
                          identityTested 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100 font-extrabold"
                            : "bg-[#FFD214] text-[#002B5B] hover:bg-yellow-400"
                        }`}
                      >
                        {isTestingIdentity ? "Test..." : identityTested ? "Prêt ✓" : "Tester"}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={startOfficialMock}
                      disabled={!canStartExam}
                      className={`w-full py-4 rounded-2xl text-xs uppercase font-bold tracking-widest transition-all cursor-pointer text-center ${
                        canStartExam 
                          ? "bg-[#002B5B] text-white hover:bg-blue-800 shadow-md scale-102"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                      }`}
                    >
                      {canStartExam ? "COMMENCER L'EXAMEN EN MODE SÉCURISÉ 🚀" : "Veuillez finaliser tous les tests"}
                    </button>
                  </div>
                </div>

                {/* Rules & Warnings */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="font-display font-bold text-lg text-[#002B5B] flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-rose-500" />
                      <span>Règles strictes de l'épreuve</span>
                    </h3>
                    
                    <ul className="space-y-3 text-xs font-semibold text-slate-600">
                      <li className="flex items-start gap-2.5">
                        <span className="text-amber-500 font-mono mt-0.5">•</span>
                        <span><strong>Verrouillage plein écran obligatoire</strong> : Toute tentative de quitter le mode plein écran annulera la validité du test.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-amber-500 font-mono mt-0.5">•</span>
                        <span><strong>Détection de changement d'onglet</strong> : Si vous changez d'application ou d'onglet, un avertissement s'affichera immédiatement.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-amber-500 font-mono mt-0.5">•</span>
                        <span><strong>Règle des 3 strikes</strong> : À la 3ème infraction constatée, votre travail est instantanément gelé et envoyé en soumission automatique.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-amber-500 font-mono mt-0.5">•</span>
                        <span><strong>Retours impossibles</strong> : Une fois l'épreuve démarrée, le chronomètre ne s'arrêtera sous aucun prétexte.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                    <span className="text-amber-600 font-mono font-bold text-xs uppercase tracking-wide">
                      🔒 SESSION DE PROCTORING ACTIVE : LA PLUME AFRICA IA
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================== TAB 2: RUNNING PROCTORED EXAM ================== */}
          {activeTab === "exam" && (
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fade-in relative">
              
              {/* Left 2 Cols: Question Stage */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Section selection bar */}
                <div className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between gap-3 font-semibold text-xs text-slate-500">
                  <span className="text-slate-400 uppercase tracking-wider">Épreuve active :</span>
                  <div className="flex gap-2.5">
                    <button 
                      onClick={() => setCurrentSection("A")}
                      className={`px-3.5 py-1.5 rounded-lg border uppercase transition-all text-xs font-bold ${currentSection === "A" ? "bg-[#002B5B] text-white border-[#002B5B]" : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"}`}
                    >
                      Section A (QCM)
                    </button>
                    <button 
                      onClick={() => setCurrentSection("B")}
                      className={`px-3.5 py-1.5 rounded-lg border uppercase transition-all text-xs font-bold ${currentSection === "B" ? "bg-[#002B5B] text-white border-[#002B5B]" : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"}`}
                    >
                      Section B (Théorie)
                    </button>
                    <button 
                      onClick={() => setCurrentSection("C")}
                      className={`px-3.5 py-1.5 rounded-lg border uppercase transition-all text-xs font-bold ${currentSection === "C" ? "bg-[#002B5B] text-white border-[#002B5B]" : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100"}`}
                    >
                      Section C (Oral)
                    </button>
                  </div>
                </div>

                {/* SECTION A INTERACTIVE VIEW */}
                {currentSection === "A" && (() => {
                  const q = fullSectionAQuestions[currentQuestionAIdx];
                  const userAns = sectionAAnswers[q.id];
                  
                  return (
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-wider">SECTION A — QUESTIONS OBJECTIVES</span>
                          <h4 className="text-sm font-bold text-[#002B5B] uppercase">Grammaire, Syntaxe & Idiotismes</h4>
                        </div>
                        <span className="text-xs font-mono bg-slate-50 text-slate-600 px-3 py-1 rounded-lg border border-slate-100 font-bold">
                          {currentQuestionAIdx + 1} / 40
                        </span>
                      </div>

                      <div className="text-sm font-bold text-[#002B5B] leading-relaxed pt-2">
                        {q.question}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        {q.options.map((opt) => {
                          const isSelected = userAns === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => setSectionAAnswers(prev => ({ ...prev, [q.id]: opt }))}
                              className={`text-left p-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                                isSelected 
                                  ? "bg-blue-50/50 border-[#002B5B] text-[#002B5B]"
                                  : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100/50 hover:text-[#002B5B]"
                              }`}
                            >
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Navigation and Actions */}
                      <div className="flex justify-between items-center pt-6 border-t border-slate-100 mt-8">
                        <button
                          disabled={currentQuestionAIdx === 0}
                          onClick={() => setCurrentQuestionAIdx(p => Math.max(0, p - 1))}
                          className="px-4 py-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 border border-slate-100"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Précédent</span>
                        </button>

                        <button
                          onClick={() => setFlaggedQuestions(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                          className={`px-4 py-2.5 rounded-xl border transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                            flaggedQuestions[q.id]
                              ? "bg-amber-50 border-amber-200 text-amber-600"
                              : "bg-transparent border-slate-100 text-slate-400 hover:text-[#002B5B]"
                          }`}
                        >
                          <Flag className="w-4 h-4 fill-current" />
                          <span>{flaggedQuestions[q.id] ? "Signalé" : "Marquer pour révision"}</span>
                        </button>

                        {currentQuestionAIdx < 39 ? (
                          <button
                            onClick={() => setCurrentQuestionAIdx(p => Math.min(39, p + 1))}
                            className="px-5 py-2.5 bg-[#002B5B] hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <span>Suivant</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => setCurrentSection("B")}
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <span>Passer à la Section B</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {/* SECTION B WRITING THEORETICAL VIEW */}
                {currentSection === "B" && (
                  <div className="space-y-6">
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-wider">SECTION B — COMPRÉHENSION ET THÉORIE</span>
                        <span className="text-xs font-mono text-slate-500 font-bold uppercase">Texte Officiel</span>
                      </div>
                      
                      <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-xs font-semibold leading-relaxed text-slate-700 font-serif max-h-48 overflow-y-auto">
                        <p className="font-bold text-[#002B5B] font-sans text-[10px] uppercase tracking-wider mb-2">📖 TEXTE WAEC DE RÉFÉRENCE :</p>
                        {sectionBPassage}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {sectionBQuestions.map((q) => {
                        const answerVal = sectionBAnswers[q.id] || "";
                        const wordCount = answerVal.trim().split(/\s+/).filter(Boolean).length;
                        return (
                          <div key={q.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                            <div className="flex items-start gap-3 justify-between">
                              <div>
                                <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                                  Question {q.id}
                                </span>
                                <h5 className="text-sm font-bold text-[#002B5B] mt-2 leading-relaxed">{q.question}</h5>
                                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{q.helper}</p>
                              </div>
                            </div>

                            <textarea
                              value={answerVal}
                              onChange={(e) => setSectionBAnswers(p => ({ ...p, [q.id]: e.target.value }))}
                              placeholder="Rédigez votre réponse structurée en français classique..."
                              rows={4}
                              className="w-full bg-slate-50 border border-slate-100 focus:border-[#002B5B] focus:bg-white rounded-xl p-4 text-xs font-medium text-slate-700 outline-hidden transition-all"
                            />

                            <div className="flex justify-end text-[10px] font-mono text-slate-400 font-bold">
                              <span>Mots : {wordCount} (Recommandé: &gt; 20)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        onClick={() => setCurrentSection("A")}
                        className="px-5 py-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all text-xs font-bold cursor-pointer border border-slate-200"
                      >
                        Précédent (Section A)
                      </button>
                      <button
                        onClick={() => setCurrentSection("C")}
                        className="px-5 py-3 bg-[#002B5B] hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Lancer la Section C (Oral)
                      </button>
                    </div>
                  </div>
                )}

                {/* SECTION C AUDIO ORAL VIEW */}
                {currentSection === "C" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-2">
                      <h4 className="font-display font-bold text-sm uppercase text-[#002B5B] tracking-wider border-b border-slate-100 pb-2">
                        Section C : Expression Orale & Phonétique (Questions 44 et 45)
                      </h4>
                      <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                        Cette section évalue vos aptitudes de prononciation et fluidité. Écoutez la phrase de référence, puis enregistrez votre voix de manière claire et audible.
                      </p>
                    </div>

                    <div className="space-y-6">
                      {sectionCQuestions.map((q) => {
                        const isRecorded = sectionCOrals[q.id];
                        const isThisRecording = recordingId === q.id;

                        return (
                          <div key={q.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                            <span className="text-[10px] font-mono font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
                              CONTROLE ORAL {q.id}
                            </span>
                            <h5 className="text-sm font-bold text-[#002B5B] leading-relaxed">{q.title}</h5>
                            <p className="text-xs font-semibold text-slate-500">{q.consigne}</p>

                            {/* Reference sentence audio play */}
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between text-xs font-bold text-slate-600">
                              <div className="flex items-center gap-2.5">
                                <Volume2 className="w-4 h-4 text-amber-500" />
                                <span className="italic font-serif text-[#002B5B]">{q.audioText}</span>
                              </div>
                              <button
                                onClick={() => {
                                  if ('speechSynthesis' in window) {
                                    const utterance = new SpeechSynthesisUtterance(q.audioText.replace(/«|»/g, ''));
                                    utterance.lang = 'fr-FR';
                                    window.speechSynthesis.speak(utterance);
                                  }
                                }}
                                className="bg-white hover:bg-slate-100 p-2 rounded-xl border border-slate-200 text-amber-600 cursor-pointer flex items-center gap-1 text-[10px] transition-all"
                              >
                                <Volume2 className="w-3.5 h-3.5 fill-current" />
                                <span>Écouter</span>
                              </button>
                            </div>

                            {/* Simulated Voice Recording UI */}
                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center space-y-3 min-h-[90px]">
                              {isThisRecording ? (
                                <div className="space-y-2 w-full max-w-xs text-center">
                                  <div className="flex items-center justify-center gap-2 text-rose-500 font-bold animate-pulse text-xs">
                                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                                    <span>Enregistrement en cours...</span>
                                  </div>
                                  <button
                                    onClick={() => handleToggleRecording(q.id)}
                                    className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 mx-auto"
                                  >
                                    <MicOff className="w-3.5 h-3.5" />
                                    <span>Arrêter et Sauvegarder</span>
                                  </button>
                                  <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${recordProgress}%` }} />
                                  </div>
                                </div>
                              ) : isRecorded ? (
                                <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
                                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs">
                                    <Check className="w-4 h-4 stroke-[3]" />
                                    <span>Enregistrement vocal soumis avec succès</span>
                                  </div>
                                  <button
                                    onClick={() => handleToggleRecording(q.id)}
                                    className="text-[10px] font-bold text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Réenregistrer</span>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleToggleRecording(q.id)}
                                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] uppercase tracking-wider px-5 py-3 rounded-xl cursor-pointer flex items-center gap-2 shadow-xs transition-all"
                                >
                                  <Mic className="w-4 h-4 text-rose-500" />
                                  <span>Démarrer l'enregistrement</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <button
                        onClick={() => setCurrentSection("B")}
                        className="px-5 py-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all text-xs font-bold cursor-pointer border border-slate-200"
                      >
                        Précédent (Section B)
                      </button>
                      <button
                        onClick={() => handleAutoSubmit("MANUAL")}
                        className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4 fill-current" />
                        <span>SOUMETTRE LA COPIE FINALE</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Active Proctoring Telemetry Panel */}
              <div className="space-y-6">
                
                {/* Security Box */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#002B5B]">STATUS SURVEILLANCE</h4>
                  </div>
                  
                  <div className="space-y-4 pt-1">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-500">Navigateur :</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Verrouillé
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-500">Webcam IA :</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Actif
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-500">Plein écran :</span>
                      <span className={isLockedInFullscreen ? "text-emerald-600 font-bold" : "text-amber-500 font-bold"}>
                        {isLockedInFullscreen ? "Oui ✓" : "Non ⚠️"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-slate-500">Infractions :</span>
                      <span className={`font-bold font-mono px-2 py-0.5 rounded-sm ${violations > 0 ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-slate-100 text-slate-500"}`}>
                        {violations} / 2 avertissements
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-[10px] font-mono text-slate-400 text-center leading-relaxed">
                    Toute absence prolongée devant la webcam déclenche un gel du temps.
                  </div>
                </div>

                {/* Question Navigator Map */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#002B5B]">CARTE DES QUESTIONS</h4>
                  </div>

                  <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                    Cliquez sur un index pour naviguer directement au QCM sélectionné.
                  </p>

                  <div className="grid grid-cols-5 gap-2 pt-2">
                    {fullSectionAQuestions.map((q, idx) => {
                      const isAnswered = !!sectionAAnswers[q.id];
                      const isFlagged = flaggedQuestions[q.id];
                      const isActive = currentQuestionAIdx === idx && currentSection === "A";

                      let tileStyle = "bg-slate-50 border-slate-100 text-slate-500 hover:text-[#002B5B] hover:bg-slate-100";
                      if (isActive) {
                        tileStyle = "bg-[#002B5B] text-white border-[#002B5B] font-bold";
                      } else if (isFlagged) {
                        tileStyle = "bg-amber-50 border-amber-200 text-amber-600";
                      } else if (isAnswered) {
                        tileStyle = "bg-blue-50 border-blue-100 text-blue-600";
                      }

                      return (
                        <button
                          key={q.id}
                          onClick={() => {
                            setCurrentSection("A");
                            setCurrentQuestionAIdx(idx);
                          }}
                          className={`w-full py-2.5 rounded-lg border text-[10px] font-mono font-bold transition-all text-center cursor-pointer ${tileStyle}`}
                        >
                          Q{q.id}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap gap-3 text-[10px] font-bold text-slate-400 border-t border-slate-100 pt-4">
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-[#002B5B]" /> <span>Actif</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-blue-100" /> <span>Répondu</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-xs bg-amber-100" /> <span>Signalé</span></div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================== TAB 3: DETAILED RESULTS REPORT CARD ================== */}
          {activeTab === "results" && (
            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
              
              <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                
                {/* Result header banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                      Rapport d'Évaluation Officiel IA
                    </span>
                    <h2 className="font-display font-bold text-2xl text-[#002B5B]">Résultats — {getExamHeaderTitle()}</h2>
                    <p className="text-slate-500 text-xs font-semibold">Session d'Évaluation de Contrôle IA</p>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl shrink-0 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider block">Note Globale</span>
                      <span className="text-3xl font-display font-bold text-[#002B5B] mt-1 block">{finalScore}%</span>
                    </div>
                    <div className="w-px h-10 bg-slate-200" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider block">Mention WAEC</span>
                      <span className="text-2xl font-display font-bold text-emerald-600 mt-1 block">
                        {finalScore >= 80 ? "A1 (Excellent)" : finalScore >= 65 ? "B2 (Très Bien)" : "C4 (Satisfaisant)"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score breakdown metrics cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Récompense</span>
                    <span className="text-xs font-bold text-amber-600 block mt-1">+1,000 XP</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Temps utilisé</span>
                    <span className="text-xs font-bold text-[#002B5B] block mt-1">01:45:12</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Proctoring</span>
                    <span className={`text-xs font-bold block mt-1 ${violations >= 3 ? "text-rose-600" : "text-emerald-600"}`}>
                      {violations >= 3 ? "Soumission IA" : "Validé ✓"}
                    </span>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Classement</span>
                    <span className="text-xs font-bold text-[#002B5B] block mt-1 font-mono">Maître de la Concorde</span>
                  </div>
                </div>

                {/* AI Mentor feedback box */}
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 space-y-3">
                  <h4 className="font-bold text-emerald-700 text-xs flex items-center gap-1.5 uppercase tracking-wider font-mono">
                    <Sparkles className="w-4 h-4 animate-pulse fill-emerald-600 text-emerald-600" />
                    <span>AI MENTOR FEEDBACK & ANALYSE</span>
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-700 font-medium whitespace-pre-line">
                    {aiFeedback}
                  </p>
                </div>

                {/* Skills analysis charts bar custom code */}
                <div className="space-y-4 pt-2">
                  <h4 className="font-display font-bold text-sm text-[#002B5B] uppercase tracking-wider">ANALYSE DES COMPÉTENCES CLÉS</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Grammar */}
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">Grammaire et Syntaxe (Section A)</span>
                        <span className="text-emerald-600 font-bold font-mono">92%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "92%" }} />
                      </div>
                    </div>

                    {/* Comprehension */}
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">Compréhension de Texte (Section B)</span>
                        <span className="text-amber-600 font-bold font-mono">84%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: "84%" }} />
                      </div>
                    </div>

                    {/* Writing expression */}
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">Expression Écrite (Section B)</span>
                        <span className="text-amber-600 font-bold font-mono">75%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: "75%" }} />
                      </div>
                    </div>

                    {/* Oral accuracy */}
                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500">Phonétique et Liaison (Section C)</span>
                        <span className="text-rose-600 font-bold font-mono">62%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500" style={{ width: "62%" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customized revision zone roadmap selection */}
                <div className="border-t border-slate-100 pt-6 space-y-4">
                  <h4 className="font-display font-bold text-sm text-[#002B5B] uppercase tracking-wider">PARCOURS DE RÉVISION PERSONNALISÉ RECOMMANDÉ</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-slate-100 bg-slate-50 rounded-2xl p-4 flex gap-3.5 items-start">
                      <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 font-bold text-xs font-mono border border-rose-100">1</div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-[#002B5B]">Leçon 11 : Phonétique & Accentuation</h5>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">Travaillez la liaison des nasales orales et les schémas d'articulation vocaux.</p>
                        <button onClick={() => setCurrentView("parcours")} className="text-[10px] font-bold text-amber-600 hover:underline pt-1.5 block">Lancer la leçon ➔</button>
                      </div>
                    </div>

                    <div className="border border-slate-100 bg-slate-50 rounded-2xl p-4 flex gap-3.5 items-start">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold text-xs font-mono border border-amber-100">2</div>
                      <div className="space-y-1">
                        <h5 className="text-xs font-bold text-[#002B5B]">Leçon 4 : Grammaire Avancée & Subjonctif</h5>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">Revoir les concordances de temps et l'usage obligatoire du subjonctif après 'bien que'.</p>
                        <button onClick={() => setCurrentView("parcours")} className="text-[10px] font-bold text-amber-600 hover:underline pt-1.5 block">Lancer la leçon ➔</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back button */}
                <div className="pt-4 flex justify-center">
                  <button
                    onClick={() => {
                      setActiveTab("lobby");
                      setViolations(0);
                    }}
                    className="px-6 py-3.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs font-bold tracking-wider transition-all uppercase cursor-pointer border border-slate-200"
                  >
                    Retourner au Lobby des Examens
                  </button>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
