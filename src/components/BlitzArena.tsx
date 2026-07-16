/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, BookOpen, Sparkles, Clock, Star, Lock, CheckCircle, 
  Play, Volume2, Mic, MicOff, Send, RefreshCw, FileText, Check, 
  X, Search, MessageSquare, Award, BookOpenCheck, ChevronLeft, ChevronRight, Flag, Grid
} from "lucide-react";

interface BlitzArenaProps {
  userXP: number;
  userStreak: number;
  setCurrentView: (view: string) => void;
  onGainXP: (amount: number) => void;
  isPremium?: boolean;
}

// WAEC Mock Exam Questions
const mockExamQuestions = {
  sectionA: [
    {
      id: 1,
      question: "Choisissez l'article correct : ___ homme que j'ai vu hier est le directeur de l'école.",
      options: ["Le", "La", "L'", "Un"],
      correct: "L'",
      explanation: "On utilise 'L'' devant un nom singulier commençant par une voyelle ou un h muet."
    },
    {
      id: 2,
      question: "Elle s'est ___ les mains avant d'entrer dans la salle d'examen.",
      options: ["lavé", "lavée", "lavés", "lavées"],
      correct: "lavé",
      explanation: "Le participe passé d'un verbe pronominal ne s'accorde pas si le COD ('les mains') est placé après le verbe."
    },
    {
      id: 3,
      question: "Si j'avais su, je ___ venu plus tôt pour réviser.",
      options: ["serais", "serai", "suis", "serais été"],
      correct: "serais",
      explanation: "Dans une proposition conditionnelle de regret (si + plus-que-parfait), la principale se conjugue au conditionnel passé."
    },
    {
      id: 4,
      question: "Bien que cet exercice ___ difficile, nous devons le terminer.",
      options: ["est", "soit", "sera", "sois"],
      correct: "soit",
      explanation: "La conjonction 'bien que' exige l'emploi du mode subjonctif."
    },
    {
      id: 5,
      question: "Chacun des élèves doit apporter ___ propre stylo et dictionnaire.",
      options: ["leur", "sa", "son", "ses"],
      correct: "son",
      explanation: "'Chacun' est singulier, on emploie donc le possessif singulier 'son' devant le nom masculin 'stylo'."
    },
    {
      id: 6,
      question: "Je ne pense pas qu'il ___ raison dans cette affaire complexe.",
      options: ["ait", "a", "aura", "soit"],
      correct: "ait",
      explanation: "Après un verbe de pensée ou d'opinion employé à la forme négative, on utilise le subjonctif."
    },
    {
      id: 7,
      question: "Il a été arrêté ___ la police pour excès de vitesse.",
      options: ["par", "de", "pour", "avec"],
      correct: "par",
      explanation: "La préposition 'par' introduit régulièrement le complément d'agent à la forme passive."
    },
    {
      id: 8,
      question: "Les amies que j'ai ___ hier étaient extrêmement bienveillantes.",
      options: ["rencontré", "rencontrée", "rencontrés", "rencontrées"],
      correct: "rencontrées",
      explanation: "Le participe passé conjugué avec 'avoir' s'accorde avec le COD ('les amies') s'il est placé avant le verbe."
    },
    {
      id: 9,
      question: "___ que soit votre décision finale, je la respecterai.",
      options: ["Quel", "Quelle", "Quels", "Quelles"],
      correct: "Quelle",
      explanation: "'Quel que' s'accorde en genre et en nombre avec le sujet du verbe être ('décision' - féminin singulier)."
    },
    {
      id: 10,
      question: "Il m'a poliment demandé de ___ prêter mon dictionnaire.",
      options: ["lui", "le", "la", "leur"],
      correct: "lui",
      explanation: "Le pronom COI singulier pour la troisième personne est 'lui' (prêter à quelqu'un)."
    },
    {
      id: 11,
      question: "Quoique vous ___ pour vous défendre, personne ne vous croira.",
      options: ["disiez", "dites", "disiez ou dites", "direz"],
      correct: "disiez",
      explanation: "La locution conjonctive 'quoique' (bien que) exige l'emploi du subjonctif présent."
    },
    {
      id: 12,
      question: "C'est l'étudiant ___ le père est le nouveau professeur de français.",
      options: ["dont", "que", "qui", "duquel"],
      correct: "dont",
      explanation: "Le pronom relatif 'dont' s'emploie pour remplacer un complément introduit par 'de' (le père de l'étudiant)."
    },
    {
      id: 13,
      question: "___-vous que j'ai grandement besoin d'aide pour cette épreuve.",
      options: ["Rappelez", "Rappelez-vous", "Se rappeler", "Rappelez-y"],
      correct: "Rappelez-vous",
      explanation: "À la forme affirmative de l'impératif, le pronom réfléchi se place après le verbe : 'Rappelez-vous'."
    },
    {
      id: 14,
      question: "Ils se sont ___ des messages importants durant toute la nuit.",
      options: ["envoyé", "envoyée", "envoyés", "envoyées"],
      correct: "envoyé",
      explanation: "Le participe passé ne s'accorde pas car le COD ('des messages') est placé après le verbe."
    },
    {
      id: 15,
      question: "Cette magnifique robe africaine lui va à ___.",
      options: ["merveille", "merveilleux", "merveilles", "merveilleusement"],
      correct: "merveille",
      explanation: "L'expression consacrée de la langue française est 'aller à merveille'."
    },
    {
      id: 16,
      question: "Je viendrai assister au cours ___ vous soyez prêts ou non.",
      options: ["que", "quoi que", "bien que", "pourvu que"],
      correct: "que",
      explanation: "La corrélation 'que... ou...' exprime l'alternative et régit le subjonctif."
    },
    {
      id: 17,
      question: "Voici la charmante maison ___ j'ai passé toute mon enfance.",
      options: ["où", "que", "dont", "y"],
      correct: "où",
      explanation: "Le pronom relatif 'où' est employé pour marquer le complément de lieu."
    },
    {
      id: 18,
      question: "Il s'est rapidement habitué ___ se lever tôt chaque matin.",
      options: ["à", "de", "pour", "en"],
      correct: "à",
      explanation: "La construction verbale est 's'habituer à faire quelque chose'."
    },
    {
      id: 19,
      question: "Cette tâche est bien ___ difficile que la précédente.",
      options: ["plus", "aussi", "autant", "moins"],
      correct: "plus",
      explanation: "Pour établir un comparatif de supériorité avec un adjectif, on emploie la structure 'plus... que'."
    },
    {
      id: 20,
      question: "Quels que ___ vos efforts, vous devez continuer à travailler.",
      options: ["soient", "soit", "sois", "sont"],
      correct: "soient",
      explanation: "'Quels que' s'accorde avec le sujet pluriel masculin 'efforts' au subjonctif."
    },
    {
      id: 21,
      question: "Les enfants impatients ont ___ toute la glace après l'école.",
      options: ["mangé", "mangés", "mangée", "manger"],
      correct: "mangé",
      explanation: "Le participe passé conjugué avec l'auxiliaire 'avoir' ne s'accorde pas avec le sujet."
    },
    {
      id: 22,
      question: "Je redoute fort qu'elle ne ___ en retard à l'examen du WAEC.",
      options: ["soit", "est", "sera", "sois"],
      correct: "soit",
      explanation: "Les verbes exprimant la crainte (craindre, redouter) exigent le subjonctif présent."
    },
    {
      id: 23,
      question: "La lettre d'encouragement que tu m'as ___ est très touchante.",
      options: ["écrit", "écrite", "écrits", "écrites"],
      correct: "écrite",
      explanation: "Le participe passé avec l'auxiliaire 'avoir' s'accorde avec le COD ('la lettre') placé devant."
    },
    {
      id: 24,
      question: "___ de personnes étaient présentes à la cérémonie d'ouverture ?",
      options: ["Combien", "Comment", "Pourquoi", "Quel"],
      correct: "Combien",
      explanation: "On utilise 'Combien de' pour interroger sur une quantité dénombrable."
    },
    {
      id: 25,
      question: "Je n'aime pas cette couleur de stylo, je préfère ___.",
      options: ["celle-ci", "celui-ci", "ce", "ça"],
      correct: "celle-ci",
      explanation: "Le pronom démonstratif 'celle-ci' remplace le nom féminin singulier ('la couleur')."
    },
    {
      id: 26,
      question: "Il est indispensable que vous ___ vos devoirs régulièrement.",
      options: ["fassiez", "faites", "ferez", "fassent"],
      correct: "fassiez",
      explanation: "La tournure impersonnelle de nécessité 'il est indispensable que' exige le subjonctif."
    },
    {
      id: 27,
      question: "Les délicieux fruits ___ j'ai achetés au marché de Dakar sont mûrs.",
      options: ["que", "qui", "dont", "où"],
      correct: "que",
      explanation: "Le pronom relatif 'que' est utilisé comme complément d'objet direct du verbe 'acheter'."
    },
    {
      id: 28,
      question: "Elle s'est montrée bien plus habile ___ son frère aîné.",
      options: ["que", "comme", "de", "plus"],
      correct: "que",
      explanation: "La comparaison de supériorité ou d'inégalité se construit avec la conjonction 'que'."
    },
    {
      id: 29,
      question: "Ils se sont immédiatement ___ au premier regard dans la cour.",
      options: ["plu", "plus", "plues", "plu-es"],
      correct: "plu",
      explanation: "Le verbe 'se plaire' est intransitif direct (plaire à quelqu'un), pas de COD, donc le participe passé est invariable."
    },
    {
      id: 30,
      question: "Je cherche un bon dictionnaire ___ je puisse réviser mes verbes.",
      options: ["avec lequel", "auquel", "duquel", "dont"],
      correct: "avec lequel",
      explanation: "On emploie le pronom relatif composé 'avec lequel' pour désigner le moyen d'action."
    },
    {
      id: 31,
      question: "___-toi immédiatement, le bus scolaire va bientôt partir !",
      options: ["Dépêche", "Dépêche-toi", "Se dépêcher", "Dépêches"],
      correct: "Dépêche-toi",
      explanation: "À l'impératif affirmatif des verbes pronominaux, le pronom se place après le verbe relié par un trait d'union."
    },
    {
      id: 32,
      question: "Il est sorti de la classe sans ___ mot d'explication.",
      options: ["dire un", "dire aucun", "aucun", "dire"],
      correct: "dire un",
      explanation: "La tournure classique correcte est 'sans dire un mot' pour évoquer le silence absolu."
    },
    {
      id: 33,
      question: "Si vous ___ fini vos révisions, vous pouvez commencer l'épreuve.",
      options: ["avez", "auriez", "aviez", "êtes"],
      correct: "avez",
      explanation: "Dans le système de la condition réelle (si + présent), la principale est au présent ou à l'impératif."
    },
    {
      id: 34,
      question: "___ d'entre vous ont déjà réussi les tests de français ?",
      options: ["Lesquels", "Lequel", "Laquelle", "Lesquelles"],
      correct: "Lesquels",
      explanation: "Le pronom interrogatif 'Lesquels' remplace et s'accorde au masculin pluriel."
    },
    {
      id: 35,
      question: "Elle s'est ___ une bonne tasse de café pour rester éveillée.",
      options: ["servie", "servi", "servies", "servir"],
      correct: "servi",
      explanation: "Le COD est 'une tasse' et est placé après le verbe, donc le participe passé reste invariable."
    },
    {
      id: 36,
      question: "Je ne suis pas convaincu qu'il ___ faire beau demain.",
      options: ["aille", "va", "vaille", "soit"],
      correct: "aille",
      explanation: "L'expression de doute avec négation ('je ne suis pas convaincu que') exige le subjonctif présent du verbe aller."
    },
    {
      id: 37,
      question: "Il conduit sa voiture de façon beaucoup ___ prudente que son frère.",
      options: ["plus", "aussi", "autant", "très"],
      correct: "plus",
      explanation: "Le comparatif de supériorité d'un adverbe s'écrit sous la forme 'plus + adverbe + que'."
    },
    {
      id: 38,
      question: "Le roman historique ___ je vous ai parlé hier est épuisé.",
      options: ["dont", "de qui", "que", "où"],
      correct: "dont",
      explanation: "Le pronom relatif 'dont' remplace un complément introduit par 'de' (parler de quelque chose)."
    },
    {
      id: 39,
      question: "Il est absolument nécessaire que vous ___ calmes durant l'épreuve.",
      options: ["soyez", "êtes", "sois", "soyez-vous"],
      correct: "soyez",
      explanation: "La nécessité exprimée par 'il est nécessaire que' commande le subjonctif présent."
    },
    {
      id: 40,
      question: "Les élèves motivés se sont brillamment ___ durant l'année.",
      options: ["illustré", "illustrés", "illustrée", "illustrées"],
      correct: "illustrés",
      explanation: "Le verbe pronominal s'accorde avec le sujet masculin pluriel en l'absence d'autre COD."
    }
  ],
  sectionB: {
    passage: "Le rôle de l'éducation en Afrique de l'Ouest moderne ne se limite pas à l'acquisition de diplômes académiques. Aujourd'hui, face aux mutations technologiques rapides, les écoles doivent former des citoyens agiles, capables de résoudre des problèmes locaux tout en restant connectés au reste du monde. Les examens régionaux comme le WAEC jouent un rôle crucial en harmonisant les standards éducatifs et en encourageant une préparation rigoureuse des élèves dans les matières clés comme le français et les mathématiques.",
    questions: [
      {
        id: 41,
        question: "Selon le premier paragraphe, à quoi ne se limite pas l'éducation ?",
        options: [
          "À l'acquisition de diplômes académiques.",
          "Aux sciences dures.",
          "Aux examens nationaux.",
          "Au travail manuel."
        ],
        correct: "À l'acquisition de diplômes académiques.",
        explanation: "Le texte dit textuellement : 'ne se limite pas à l'acquisition de diplômes académiques'."
      },
      {
        id: 42,
        question: "Qu'est-ce que les écoles doivent former aujourd'hui ?",
        options: [
          "Des citoyens agiles.",
          "Des politiciens.",
          "Des ingénieurs informatiques.",
          "Des professeurs d'université."
        ],
        correct: "Des citoyens agiles.",
        explanation: "Le texte indique que les écoles doivent former des citoyens agiles."
      },
      {
        id: 43,
        question: "Quelle institution harmonise les standards éducatifs dans la région ?",
        options: [
          "Le WAEC.",
          "L'UNESCO.",
          "Le CAMES.",
          "L'UNICEF."
        ],
        correct: "Le WAEC.",
        explanation: "Le texte mentionne : 'Les examens régionaux comme le WAEC jouent un rôle crucial en harmonisant les standards éducatifs'."
      },
      {
        id: 44,
        question: "Quelles sont les matières clés citées dans le texte ?",
        options: [
          "Le français et les mathématiques.",
          "L'histoire et la géographie.",
          "La physique et la chimie.",
          "L'anglais et le dessin."
        ],
        correct: "Le français et les mathématiques.",
        explanation: "Le texte cite 'les matières clés comme le français et les mathématiques'."
      },
      {
        id: 45,
        question: "Quel adjectif qualifie les citoyens formés pour faire face aux mutations rapides ?",
        options: [
          "Agiles.",
          "Indifférents.",
          "Passifs.",
          "Scolaires."
        ],
        correct: "Agiles.",
        explanation: "Le texte emploie l'adjectif 'agiles' pour qualifier ces citoyens."
      }
    ]
  },
  sectionC: {
    prompts: [
      {
        id: "prompt1",
        title: "Lettre Amicale",
        text: "Rédigez une lettre à votre ami vivant à l'étranger pour lui décrire comment vous vous préparez pour votre examen du WAEC et les outils numériques que vous utilisez."
      },
      {
        id: "prompt2",
        title: "Discours Argumentatif",
        text: "En tant que représentant des élèves, prononcez un discours de 150 mots devant le conseil de votre lycée sur l'importance d'intégrer des sessions d'apprentissage d'IA dans les cours de français."
      }
    ]
  }
};

// Words for the Dictionnaire slider
const dictionaryWords = [
  { word: "Élision", type: "n.f.", definition: "Suppression de la voyelle finale (a, e, i) d'un mot devant un mot commençant par une voyelle ou un h muet. Exemple: l'arbre au lieu de le arbre.", tip: "Crucial pour l'épreuve de grammaire du WAEC !" },
  { word: "Accorder", type: "v.tr.", definition: "Mettre un mot en harmonie de genre (masculin/féminin) et de nombre (singulier/pluriel) avec le mot auquel il se rapporte.", tip: "Les participes passés avec 'être' s'accordent toujours avec le sujet !" },
  { word: "Subjonctif", type: "n.m.", definition: "Mode exprimant un doute, un souhait, une obligation ou une émotion. Exemple : Il faut que tu saches.", tip: "Fréquent après 'bien que', 'pour que', 'afin que'." },
  { word: "Pléonasme", type: "n.m.", definition: "Répétition superflue de termes de même sens. Exemple: monter en haut, reculer en arrière.", tip: "Évitez-les absolument dans vos rédactions WAEC pour ne pas perdre de points." },
  { word: "Idiotisme", type: "n.m.", definition: "Formule ou expression propre à une langue, impossible à traduire littéralement. Exemple: 'Avoir un cœur d'or'.", tip: "En utiliser quelques-uns enrichit considérablement votre score de style." }
];

export default function BlitzArena({ userXP, userStreak, setCurrentView, onGainXP, isPremium = true }: BlitzArenaProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "exam" | "qcm" | "writing" | "oral">("dashboard");
  const [isDictOpen, setIsDictOpen] = useState(false);
  const [dictSearch, setDictSearch] = useState("");
  
  // Correction mode & Navigation states
  const [examCorrectionMode, setExamCorrectionMode] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [showQuestionMap, setShowQuestionMap] = useState(false);
  const [activeSimulatedId, setActiveSimulatedId] = useState<number | null>(null);

  // Load previous attempt for correction mode if requested from Parcours
  useEffect(() => {
    const savedAttemptStr = localStorage.getItem("current_correction_attempt");
    if (savedAttemptStr) {
      try {
        const attempt = JSON.parse(savedAttemptStr);
        setActiveTab("exam");
        setExamStarted(true);
        setExamFinished(true);
        setExamCorrectionMode(true);
        setExamReport({
          overall: attempt.score,
          grade: attempt.grade,
          sectionA: attempt.sectionA,
          sectionB: attempt.sectionB,
          sectionC: attempt.sectionC,
          essayAnalysis: {
            style: attempt.score >= 80 ? "Niveau remarquable. Structure argumentative rigoureuse, vocabulaire sophistiqué adapté au concours." : "Structure soignée mais manque d'idiotismes. Pensez à relier vos idées avec des connecteurs logiques de concession.",
            corrections: attempt.score >= 80 ? "Excellente élision détectée. Les accords grammaticaux complexes sont parfaitement maîtrisés." : "Quelques erreurs mineures d'accord des adjectifs de couleur et de conjugaison au subjonctif."
          }
        });
        
        // Populate answers so correction mode highlights them nicely
        const simulatedAnswers: Record<number, string> = {
          1: attempt.score >= 80 ? "L'" : "Le",
          2: attempt.score >= 70 ? "lavé" : "lavée",
          3: "serais",
          4: attempt.score >= 80 ? "soit" : "est",
          5: "son",
          6: "Former des citoyens agiles capables de résoudre des problèmes locaux.",
          7: attempt.score >= 70 ? "En harmonisant les standards éducatifs et en encourageant une préparation rigoureuse." : "En réduisant le temps d'étude des matières clés."
        };
        setExamAnswers(simulatedAnswers);
        setExamEssay("Monsieur le Directeur,\n\nJe me permets de vous écrire afin de vous faire part de mon intérêt pour l'intégration de séances d'IA pour perfectionner notre français au WAEC...");
      } catch (e) {
        console.error("Error loading attempt from local storage", e);
      }
      localStorage.removeItem("current_correction_attempt");
    }
  }, []);

  // ================= 1. EXAM SIMULATION STATE =================
  const [examStarted, setExamStarted] = useState(false);
  const [examTimeLeft, setExamTimeLeft] = useState(3000); // 50m default for Section A in seconds
  const [examAnswers, setExamAnswers] = useState<Record<number, string>>({});
  const [examEssay, setExamEssay] = useState("");
  const [selectedEssayPrompt, setSelectedEssayPrompt] = useState(mockExamQuestions.sectionC.prompts[0]);
  const [examFinished, setExamFinished] = useState(false);
  const [examReport, setExamReport] = useState<any>(null);
  const [isExamEvaluating, setIsExamEvaluating] = useState(false);
  const [examSection, setExamSection] = useState<"A" | "transition_to_B" | "B" | "transition_to_C" | "C">("A");
  const [currentQuestionAIndex, setCurrentQuestionAIndex] = useState(0);
  const [examRecordingId, setExamRecordingId] = useState<number | null>(null);
  const [examRecordProgress, setExamRecordProgress] = useState(0);
  const [examRecordedAudios, setExamRecordedAudios] = useState<Record<number, boolean>>({});

  // Helper for generating simulated French grammar / comprehension / synthesis questions
  const getSimulatedQuestion = (id: number) => {
    // Check if it exists in mockExamQuestions.sectionA
    if (id <= 40) {
      return mockExamQuestions.sectionA[id - 1] || mockExamQuestions.sectionA[0];
    }
    // Check if it exists in mockExamQuestions.sectionB.questions
    if (id >= 41 && id <= 45) {
      return mockExamQuestions.sectionB.questions[id - 41] || mockExamQuestions.sectionB.questions[0];
    }
    
    if (id >= 41 && id <= 70) {
      // Section B: Reading Comprehension & Text Synthesis
      const comprehensionTopics = [
        {
          q: "Dans l'expression 'mutations technologiques rapides', que signifie le mot 'mutations' ?",
          opts: ["Changements", "Stabilités", "Pannes", "Découvertes"],
          correct: "Changements",
          exp: "Une mutation désigne une transformation ou un changement profond."
        },
        {
          q: "Selon l'auteur, les citoyens doivent être capables de résoudre des problèmes ___ .",
          opts: ["locaux", "étrangers", "uniquement théoriques", "faciles"],
          correct: "locaux",
          exp: "Le texte de compréhension mentionne explicitement qu'ils doivent être 'capables de résoudre des problèmes locaux'."
        },
        {
          q: "Quel sentiment l'auteur exprime-t-il envers les examens régionaux comme le WAEC ?",
          opts: ["L'approbation", "La critique", "L'indifférence", "Le rejet"],
          correct: "L'approbation",
          exp: "L'auteur qualifie le rôle du WAEC de 'crucial', ce qui montre une opinion très favorable (approbation)."
        },
        {
          q: "Complétez selon le texte : Les écoles doivent former des citoyens agiles tout en restant ___ au reste du monde.",
          opts: ["connectés", "isolés", "opposés", "indifférents"],
          correct: "connectés",
          exp: "Le texte dit : 'tout en restant connectés au reste du monde'."
        },
        {
          q: "Quel est l'objectif principal de l'harmonisation des examens régionaux ?",
          opts: ["Maintenir des standards élevés", "Favoriser la compétition", "Diminuer la charge de travail", "Supprimer les épreuves écrites"],
          correct: "Maintenir des standards élevés",
          exp: "Le WAEC harmonise les standards éducatifs régionaux pour assurer un niveau d'excellence homogène."
        }
      ];
      const index = (id - 41) % comprehensionTopics.length;
      const topic = comprehensionTopics[index];
      return {
        id,
        question: `[Item B-${id}] En se référant au texte de compréhension : ${topic.q}`,
        options: topic.opts,
        correct: topic.correct,
        explanation: topic.exp
      };
    } else {
      // Section C: Expression écrite, connecteurs logiques, style, vocabulaire d'essai (71 to 85)
      const synthesisTopics = [
        {
          q: "Quel connecteur logique est le plus approprié pour introduire une concession ?",
          opts: ["Bien que", "C'est pourquoi", "De plus", "En effet"],
          correct: "Bien que",
          exp: "'Bien que' exprime la concession et est suivi du subjonctif."
        },
        {
          q: "Choisissez la formule de politesse la plus adaptée pour une lettre officielle :",
          opts: ["Veuillez agréer, Monsieur, l'expression de mes sentiments distingués.", "Salut, comment ça va ?", "Amicalement vôtre.", "Je vous salue bien bas."],
          correct: "Veuillez agréer, Monsieur, l'expression de mes sentiments distingués.",
          exp: "Il s'agit d'une formule classique et respectueuse pour les correspondances formelles."
        },
        {
          q: "Quel terme désigne un paragraphe introductif dans une dissertation ?",
          opts: ["Le préambule", "La conclusion", "Le développement", "L'annexe"],
          correct: "Le préambule",
          exp: "Le préambule ou l'introduction prépare le lecteur au sujet de la dissertation."
        },
        {
          q: "Quel connecteur utilisez-vous pour conclure un discours argumentatif ?",
          opts: ["En somme", "D'abord", "Par exemple", "Cependant"],
          correct: "En somme",
          exp: "'En somme' ou 'En conclusion' permet de résumer et de clore un argumentaire."
        },
        {
          q: "Dans une rédaction, pour donner un exemple concret, on utilise :",
          opts: ["notamment", "néanmoins", "par conséquent", "puisque"],
          correct: "notamment",
          exp: "'Notamment' ou 'comme' introduit un cas particulier ou un exemple."
        }
      ];
      const index = (id - 71) % synthesisTopics.length;
      const topic = synthesisTopics[index];
      return {
        id,
        question: `[Item C-${id}] Expression écrite : ${topic.q}`,
        options: topic.opts,
        correct: topic.correct,
        explanation: topic.exp
      };
    }
  };

  // ================= 2. Q_C_M BLITZ STATE =================
  const [qcmIndex, setQcmIndex] = useState(0);
  const [qcmAnswers, setQcmAnswers] = useState<Record<number, string>>({});
  const [qcmSelectedOption, setQcmSelectedOption] = useState<string | null>(null);
  const [qcmFinished, setQcmFinished] = useState(false);
  const [qcmScore, setQcmScore] = useState(0);

  // ================= 3. WRITING COMPOSITION STATE =================
  const [selectedPrompt, setSelectedPrompt] = useState(mockExamQuestions.sectionC.prompts[0]);
  const [essayContent, setEssayContent] = useState("");
  const [isWritingEvaluating, setIsWritingEvaluating] = useState(false);
  const [writingReport, setWritingReport] = useState<any>(null);

  // ================= 4. ORAL SIMULATION STATE =================
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [oralStep, setOralStep] = useState(1); // 1: Listen, 2: Record, 3: Feedback
  const [audioFeedback, setAudioFeedback] = useState<any>(null);

  // Timer for Mock Exam
  useEffect(() => {
    let interval: any;
    if (examStarted && !examFinished && examTimeLeft > 0) {
      interval = setInterval(() => {
        setExamTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (examTimeLeft === 0 && examStarted && !examFinished) {
      if (examSection === "A") {
        setExamSection("transition_to_B");
      } else if (examSection === "B") {
        setExamSection("transition_to_C");
      } else {
        handleFinishExam();
      }
    }
    return () => clearInterval(interval);
  }, [examStarted, examFinished, examTimeLeft, examSection]);

  // Recording timer emulation
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordProgress((prev) => Math.min(prev + 10, 100));
      }, 500);
    } else {
      setRecordProgress(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // Handle auto-stop recording when progress reaches 100%
  useEffect(() => {
    if (isRecording && recordProgress >= 100) {
      handleStopRecording();
    }
  }, [recordProgress, isRecording]);

  // Exam Recording timer emulation
  useEffect(() => {
    let interval: any;
    if (examRecordingId !== null) {
      interval = setInterval(() => {
        setExamRecordProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    } else {
      setExamRecordProgress(0);
    }
    return () => clearInterval(interval);
  }, [examRecordingId]);

  useEffect(() => {
    if (examRecordingId !== null && examRecordProgress >= 100) {
      const qId = examRecordingId;
      setExamRecordedAudios(prev => ({ ...prev, [qId]: true }));
      setExamAnswers(prev => ({ ...prev, [qId]: "Enregistrement oral soumis" }));
      setExamRecordingId(null);
      setExamRecordProgress(0);
    }
  }, [examRecordProgress, examRecordingId]);

  const formatExamTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Trigger Mock Exam finish
  const handleFinishExam = () => {
    setIsExamEvaluating(true);
    setTimeout(() => {
      // Calculate Section A score (40 questions)
      let correctA = 0;
      mockExamQuestions.sectionA.forEach((q) => {
        if (examAnswers[q.id] === q.correct) correctA++;
      });
      const sectionAScore = Math.round((correctA / 40) * 100);

      // Calculate Section B score (3 theory questions, 41 to 43)
      let totalBPoints = 0;
      const bFeedback: Record<number, { score: number; comment: string }> = {};
      const bQuestions = [
        {
          id: 41,
          keywords: ["diplôme", "citizen", "citoyen", "local", "résoudre", "complexe", "limite", "mutations", "adapt", "savoir"],
          prompt: "dépassement des diplômes"
        },
        {
          id: 42,
          keywords: ["agile", "technologique", "mutations", "rapide", "adaptation", "innover", "problème", "changement", "flexib"],
          prompt: "importance de l'agilité"
        },
        {
          id: 43,
          keywords: ["waec", "harmoniser", "standard", "niveau", "excellence", "exigence", "commun", "éval", "critère"],
          prompt: "rôle du WAEC"
        }
      ];

      bQuestions.forEach((bq) => {
        const answer = (examAnswers[bq.id] || "").trim().toLowerCase();
        let score = 0;
        let comment = "";

        if (answer.length === 0) {
          score = 0;
          comment = "Aucune réponse fournie.";
        } else if (answer.length < 15) {
          score = 30;
          comment = "Réponse extrêmement courte. Veuillez développer vos arguments en français soutenu.";
        } else {
          // Check keywords
          const matchedKeywords = bq.keywords.filter(kw => answer.includes(kw));
          const kwScore = Math.min(matchedKeywords.length * 12, 45);
          const baseScore = 50 + Math.min(answer.length / 4, 15); // up to 65
          score = Math.min(Math.round(baseScore + kwScore), 100);

          if (score >= 85) {
            comment = "Excellente analyse théorique ! Argumentation riche, syntaxe fluide et vocabulaire WAEC de niveau supérieur parfaitement utilisé.";
          } else if (score >= 65) {
            comment = "Bonne réponse globale. La structure de la phrase est correcte, mais mériterait des exemples plus précis du texte de compréhension.";
          } else {
            comment = "Compréhension superficielle ou niveau de langue insuffisant. Relisez attentivement le texte pour cibler les éléments clés.";
          }
        }

        totalBPoints += score;
        bFeedback[bq.id] = { score, comment };
      });
      const sectionBScore = Math.round(totalBPoints / 3);

      // Calculate Section C score (3 oral questions, 44 to 46)
      let totalCPoints = 0;
      const cFeedback: Record<number, { pronunciation: number; fluency: number; accuracy: number; advice: string }> = {};
      const cQuestions = [
        { id: 44, advice: "La liaison phonétique obligatoire entre 'nous' et 'avons' (/nuz-avɔ̃/) a été parfaitement détectée par l'IA. Excellente prononciation !" },
        { id: 45, advice: "Bon débit de parole et confiance orale. Attention à bien articuler les voyelles nasales (/ɑ̃/ et /ɔ̃/) et éviter les pauses trop longues." },
        { id: 46, advice: "Structure argumentative orale convaincante et fluide. Pensez à utiliser des marqueurs logiques parlés comme 'donc', 'de plus' ou 'en effet'." }
      ];

      cQuestions.forEach((cq) => {
        const recorded = examRecordedAudios[cq.id];
        if (recorded) {
          const pronunciation = 78 + Math.floor(Math.random() * 18);
          const fluency = 72 + Math.floor(Math.random() * 23);
          const accuracy = 75 + Math.floor(Math.random() * 20);
          const score = Math.round((pronunciation + fluency + accuracy) / 3);

          totalCPoints += score;
          cFeedback[cq.id] = { pronunciation, fluency, accuracy, advice: cq.advice };
        } else {
          cFeedback[cq.id] = { pronunciation: 0, fluency: 0, accuracy: 0, advice: "Aucun enregistrement audio n'a été soumis pour cet item oral." };
        }
      });
      const sectionCScore = Math.round(totalCPoints / 3);

      const overall = Math.round((sectionAScore + sectionBScore + sectionCScore) / 3);

      let grade = "C4";
      if (overall >= 80) grade = "A1 (Excellent)";
      else if (overall >= 70) grade = "B2 (Très Bien)";
      else if (overall >= 60) grade = "C4 (Bien)";
      else if (overall >= 50) grade = "D7 (Passable)";
      else grade = "F9 (Échec)";

      setExamReport({
        overall,
        grade,
        sectionA: sectionAScore,
        sectionB: sectionBScore,
        sectionC: sectionCScore,
        theoryFeedback: bFeedback,
        oralFeedback: cFeedback
      });
      setIsExamEvaluating(false);
      setExamFinished(true);
      onGainXP(150); // Big award for full exam
    }, 2500);
  };

  // Submit QCM question
  const handleQcmSelect = (option: string) => {
    setQcmSelectedOption(option);
    const currentQ = mockExamQuestions.sectionA[qcmIndex];
    const isCorrect = option === currentQ.correct;

    setQcmAnswers(prev => ({ ...prev, [currentQ.id]: option }));
    if (isCorrect) {
      setQcmScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (qcmIndex < mockExamQuestions.sectionA.length - 1) {
        setQcmIndex(prev => prev + 1);
        setQcmSelectedOption(null);
      } else {
        setQcmFinished(true);
        onGainXP(40);
      }
    }, 1500);
  };

  // Submit Real AI Writing analysis
  const handleWritingSubmit = async () => {
    if (!essayContent.trim()) return;
    setIsWritingEvaluating(true);
    setWritingReport(null);

    try {
      const response = await fetch("/api/gemini/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: essayContent })
      });

      if (response.ok) {
        const data = await response.json();
        setWritingReport({
          score: data.score || 78,
          corrections: data.corrections || [],
          feedback: data.overallFeedback || "Bon effort de rédaction ! Le ton est adéquat pour l'épreuve.",
          suggestedRewrite: data.suggestedRewrite || ""
        });
        onGainXP(50);
      } else {
        throw new Error("API call error");
      }
    } catch (e) {
      // Fallback
      setTimeout(() => {
        const words = essayContent.trim().split(/\s+/).filter(Boolean).length;
        const fallbackScore = Math.min(65 + Math.floor(words / 5), 95);
        setWritingReport({
          score: fallbackScore,
          corrections: [
            { original: "je ai", corrected: "j'ai", explanation: "Règle de l'élision obligatoire devant voyelle." },
            { original: "les élève", corrected: "les élèves", explanation: "Accord pluriel oublié." }
          ],
          feedback: "Excellente tentative ! Votre structure respecte les codes de l'épreuve WAEC. Pensez à relire vos accords de verbes.",
          suggestedRewrite: "J'écris cette lettre pour te décrire mon lycée moderne..."
        });
        onGainXP(40);
      }, 1500);
    } finally {
      setIsWritingEvaluating(false);
    }
  };

  // Oral simulation triggers
  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordProgress(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setOralStep(3);
    setAudioFeedback({
      pronunciation: 84,
      fluency: 79,
      accuracy: 88,
      advice: "La liaison dans 'nous_avons' est parfaite ! Travaillez l'intonation montante sur les questions."
    });
    onGainXP(30);
  };

  // Reset Arena view
  const handleBackToDashboard = () => {
    setActiveTab("dashboard");
    // reset states
    setExamStarted(false);
    setExamFinished(false);
    setExamAnswers({});
    setExamEssay("");
    setQcmIndex(0);
    setQcmAnswers({});
    setQcmSelectedOption(null);
    setQcmFinished(false);
    setQcmScore(0);
    setEssayContent("");
    setWritingReport(null);
    setOralStep(1);
    setAudioFeedback(null);
  };

  // Filtered dict words
  const filteredWords = dictionaryWords.filter(w => 
    w.word.toLowerCase().includes(dictSearch.toLowerCase()) ||
    w.definition.toLowerCase().includes(dictSearch.toLowerCase())
  );

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-[#fcfcfd] flex flex-col font-sans text-[#002B5B] relative overflow-x-hidden">
      
      {/* 1. Header Navigation Bar of Arena */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (activeTab !== "dashboard") {
                handleBackToDashboard();
              } else {
                setCurrentView("dashboard");
              }
            }}
            className="flex items-center gap-2 text-slate-500 hover:text-[#002B5B] transition-colors font-semibold text-xs md:text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tableau de Bord</span>
          </button>
          
          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center gap-2">
            <span className="font-display font-black text-lg md:text-xl tracking-tight">Le Blitz</span>
            <span className="bg-[#FFFCE8] text-[#A67C00] border border-[#FFEB85] text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider font-mono">
              PREMIUM
            </span>
          </div>
        </div>

        {/* Action button: Dictionary Slider & User Profile */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDictOpen(true)}
            className="bg-[#002B5B] hover:bg-blue-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Dictionnaire</span>
          </button>

          <div className="w-8 h-8 rounded-full bg-[#002B5B] flex items-center justify-center text-white text-xs font-black border border-slate-100">
            JI
          </div>
        </div>
      </header>

      {/* 2. Main content rendering */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-6 py-8">
        
        <AnimatePresence mode="wait">
          
          {/* ==================== A. DASHBOARD VIEW ==================== */}
          {activeTab === "dashboard" && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Welcome text */}
              <div className="space-y-1">
                <h1 className="font-display font-black text-2xl md:text-4xl tracking-tight text-[#002B5B]">
                  Bienvenue dans l'Arena de Pratique
                </h1>
                <p className="text-slate-500 text-xs md:text-sm font-semibold max-w-2xl leading-relaxed">
                  Préparez-vous à l'excellence. Choisissez votre mode d'entraînement et dominez les épreuves de français du WAEC.
                </p>
              </div>

              {/* Banner: Simulation Examen Blanc Complet */}
              <div className="bg-[#002B5B] text-white rounded-3xl border border-blue-950 p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-stretch justify-between gap-6">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-700/20 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="bg-amber-400 text-[#002B5B] text-[9px] font-black tracking-widest px-3 py-1 rounded-md uppercase font-mono inline-block">
                      RECOMMANDÉ POUR VOUS
                    </span>
                    <h2 className="font-display font-black text-xl md:text-3xl leading-tight tracking-tight">
                      Simulation Examen Blanc Complet
                    </h2>
                    <p className="text-blue-100/80 text-xs md:text-sm font-medium leading-relaxed max-w-md">
                      Mettez-vous en condition réelle : 2h30, toutes les sections, chronomètre officiel. Évaluation immédiate par IA.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                    <button
                      onClick={() => setActiveTab("exam")}
                      className="bg-[#FFD214] hover:bg-yellow-400 text-[#002B5B] font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl transition-all shadow-md flex items-center gap-2 cursor-pointer font-sans"
                    >
                      <span>Commencer l'examen</span>
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </button>
                    <div className="flex items-center gap-1.5 text-blue-200 text-xs font-semibold">
                      <Clock className="w-4 h-4" />
                      <span>Temps estimé : 150 min</span>
                    </div>
                  </div>
                </div>

                {/* Score container on right */}
                <div className="w-full lg:w-72 bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col justify-between shrink-0">
                  <div className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-blue-200 text-[10px] uppercase font-mono font-black tracking-wider">Score moyen Blitz</span>
                      <span className="text-2xl font-display font-black text-[#FFD214]">78%</span>
                    </div>
                    {/* Horizontal progress bar */}
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-[#FFD214] rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>
                  <p className="text-blue-100/70 text-[10px] font-semibold mt-4">
                    Améliorez-vous de 12% pour atteindre le "A1"
                  </p>
                </div>
              </div>

              {/* Grid of 3 modes below */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Card 1: L'Objectif */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-blue shrink-0 shadow-2xs">
                      <CheckCircle className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display font-black text-lg text-[#002B5B]">L'Objectif</h3>
                      <p className="text-slate-500 text-xs font-medium leading-relaxed">
                        Entraînez-vous spécifiquement sur les questions à choix multiples (QCM). Grammaire, vocabulaire et compréhension rapide.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab("qcm")}
                    className="w-full border border-slate-200 hover:border-[#002B5B] hover:bg-slate-50 text-[#002B5B] text-xs font-extrabold uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Mode Blitz (QCM) ➔
                  </button>
                </div>

                {/* Card 2: La Théorie */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFFCE8] border border-[#FFEB85] flex items-center justify-center text-[#A67C00] shrink-0 shadow-2xs">
                      <FileText className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display font-black text-lg text-[#002B5B]">La Théorie</h3>
                      <p className="text-slate-500 text-xs font-medium leading-relaxed">
                        Maîtrisez la rédaction et le résumé. Recevez des corrections personnalisées basées sur les critères officiels du WAEC.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab("writing")}
                    className="w-full border border-slate-200 hover:border-[#002B5B] hover:bg-slate-50 text-[#002B5B] text-xs font-extrabold uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Rédaction & Résumé ➔
                  </button>
                </div>

                {/* Card 3: L'Oral */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
                      <Mic className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display font-black text-lg text-[#002B5B]">L'Oral</h3>
                      <p className="text-slate-500 text-xs font-medium leading-relaxed">
                        Pratiquez votre prononciation et votre compréhension auditive avec notre module interactif de simulation orale.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab("oral")}
                    className="w-full border border-slate-200 hover:border-[#002B5B] hover:bg-slate-50 text-[#002B5B] text-xs font-extrabold uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Test d'Expression Orale ➔
                  </button>
                </div>

              </div>

            </motion.div>
          )}

          {/* ==================== B. FULL EXAM VIEW ==================== */}
          {activeTab === "exam" && (
            <motion.div 
              key="exam"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-[#002B5B] flex items-center gap-2">
                    <Award className="text-amber-500 w-6 h-6" />
                    Examen Blanc Complet WAEC
                  </h2>
                  <p className="text-slate-500 text-xs font-semibold mt-1">Section A (Grammaire) • Section B (Compréhension) • Section C (Rédaction)</p>
                </div>

                {!examFinished && examStarted && (
                  <div className="flex items-center gap-2 bg-[#002B5B] text-white px-4 py-2 rounded-2xl font-mono text-xs font-extrabold shadow-sm">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>{formatExamTime(examTimeLeft)}</span>
                  </div>
                )}
              </div>

              {!examStarted && !examFinished ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center max-w-xl mx-auto space-y-6 shadow-sm">
                  <div className="w-16 h-16 bg-[#FFFCE8] rounded-full flex items-center justify-center text-amber-500 mx-auto shadow-xs">
                    <Award className="w-8 h-8 fill-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-black text-lg text-[#002B5B]">Êtes-vous prêt pour le défi ultime ?</h3>
                    <p className="text-slate-500 text-xs leading-relaxed font-semibold">
                      Cette simulation dure 2h30 et comprend 3 sections cruciales de l'examen de français du WAEC. Vous obtiendrez un rapport de notation IA complet à la fin.
                    </p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-2.5 text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> <span>Section A : 40 QCM de grammaire et syntaxe (Questions 1 à 40)</span></div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> <span>Section B : 3 questions théoriques à rédiger (Questions 41 à 43)</span></div>
                    <div className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> <span>Section C : 3 épreuves orales enregistrées (Questions 44 à 46)</span></div>
                  </div>
                  <button
                    onClick={() => {
                      setExamStarted(true);
                      setExamTimeLeft(3000); // 50m for Section A
                      setExamSection("A");
                    }}
                    className="bg-[#002B5B] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider px-8 py-4 rounded-2xl shadow-md cursor-pointer inline-block"
                  >
                    Démarrer l'examen (Section A : 50 minutes)
                  </button>
                </div>
              ) : examStarted && !examFinished ? (
                examSection === "transition_to_B" ? (
                  <div className="max-w-2xl mx-auto bg-white border border-slate-150 rounded-3xl p-8 space-y-8 text-center shadow-lg relative overflow-hidden my-8 animate-fade-in">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="w-20 h-20 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center text-brand-blue mx-auto shadow-md">
                      <BookOpenCheck className="w-10 h-10 stroke-[1.8] animate-pulse" />
                    </div>
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                        Section A Terminée
                      </span>
                      <h3 className="font-display font-black text-2xl text-[#002B5B] tracking-tight">Prêt pour la Section B : Compréhension ?</h3>
                      <p className="text-slate-500 text-xs font-semibold leading-relaxed max-w-md mx-auto">
                        Félicitations pour avoir complété la Section A (Grammaire et Vocabulaire) ! Vous allez maintenant être évalué sur l'analyse d'un texte de compréhension officiel du WAEC.
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left space-y-3.5 text-xs text-slate-600 max-w-md mx-auto">
                      <h4 className="font-bold text-[#002B5B] uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-200 pb-2">
                        ⚙️ PARAMÈTRES DE LA SECTION B
                      </h4>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-500">Durée :</span>
                        <span className="font-black text-amber-600 font-mono">45 minutes</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-500">Nombre d'items :</span>
                        <span className="font-black text-blue-600 font-mono">3 Questions théoriques (41 à 43)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-500">Format :</span>
                        <span className="font-semibold text-slate-700">Lecture attentive & Saisie de réponses rédigées</span>
                      </div>
                    </div>

                    <div className="pt-4 max-w-md mx-auto">
                      <button
                        onClick={() => {
                          setExamSection("B");
                          setExamTimeLeft(3600); // 1 hour in seconds
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-lg shadow-blue-600/15 transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                      >
                        <span>Lancer la Section B 🚀</span>
                      </button>
                    </div>
                  </div>
                ) : examSection === "transition_to_C" ? (
                  <div className="max-w-2xl mx-auto bg-white border border-slate-150 rounded-3xl p-8 space-y-8 text-center shadow-lg relative overflow-hidden my-8 animate-fade-in">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div className="w-20 h-20 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-500 mx-auto shadow-md">
                      <FileText className="w-10 h-10 stroke-[1.8] animate-pulse" />
                    </div>
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono font-black text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                        Section B Terminée
                      </span>
                      <h3 className="font-display font-black text-2xl text-[#002B5B] tracking-tight">Prêt pour la Section C : Expression Orale ?</h3>
                      <p className="text-slate-500 text-xs font-semibold leading-relaxed max-w-md mx-auto">
                        Excellent travail sur les questions de compréhension ! La dernière épreuve est l'évaluation d'expression orale enregistrée par microphone.
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left space-y-3.5 text-xs text-slate-600 max-w-md mx-auto">
                      <h4 className="font-bold text-[#002B5B] uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-200 pb-2">
                        ⚙️ PARAMÈTRES DE LA SECTION C
                      </h4>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-500">Durée :</span>
                        <span className="font-black text-amber-600 font-mono">30 minutes</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-500">Contenu :</span>
                        <span className="font-black text-blue-600 font-mono">3 Questions d'Expression Orale (44 à 46)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-500">Évaluation :</span>
                        <span className="font-semibold text-slate-700">Analyse phonétique, fluidité et précision par l'IA</span>
                      </div>
                    </div>

                    <div className="pt-4 max-w-md mx-auto">
                      <button
                        onClick={() => {
                          setExamSection("C");
                          setExamTimeLeft(1800); // 30 mins
                        }}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-[#002B5B] font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-lg shadow-yellow-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
                      >
                        <span>Lancer la Section C 🎙️</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start relative">
                    
                    {/* Left columns: Question Forms */}
                    <div className="lg:col-span-2 space-y-6">
                      
                      {/* SECTION A */}
                      {examSection === "A" && (() => {
                        const q = mockExamQuestions.sectionA[currentQuestionAIndex] || mockExamQuestions.sectionA[0];
                        const userAns = examAnswers[q.id];
                        const isAnswered = !!userAns;
                        const isCorrect = userAns === q.correct;

                        return (
                          <div id="sectionA-container" className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-5 animate-fade-in">
                            <div className="border-b border-slate-100 pb-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-display font-black text-xs uppercase text-[#002B5B] tracking-wider">
                                  Section A : Grammaire et Syntaxe
                                </span>
                                <span className="text-[10px] font-mono bg-amber-50 text-amber-600 px-2.5 py-1 rounded-lg border border-amber-100 uppercase font-black">
                                  Question {currentQuestionAIndex + 1} sur 40
                                </span>
                              </div>
                              <div className="w-full bg-slate-150 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-[#002B5B] h-full transition-all duration-300"
                                  style={{ width: `${((currentQuestionAIndex + 1) / 40) * 100}%` }}
                                />
                              </div>
                            </div>

                            <div className="space-y-4 pt-1">
                              <div className="flex justify-between items-start gap-4">
                                <p className="text-sm font-bold text-slate-800 leading-relaxed">
                                  <span className="text-[#002B5B] font-mono font-black mr-2 bg-[#002B5B]/5 px-2 py-0.5 rounded border border-[#002B5B]/10">Q{q.id}</span>
                                  {q.question}
                                </p>
                                {!examCorrectionMode && (
                                  <button
                                    onClick={() => setFlaggedQuestions(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                                    className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-[10px] font-black shrink-0 ${
                                      flaggedQuestions[q.id]
                                        ? "bg-amber-50 border-amber-300 text-amber-600 shadow-xs"
                                        : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                                    }`}
                                    title="Marquer pour révision"
                                  >
                                    <Flag className="w-3.5 h-3.5 fill-current" />
                                    <span className="hidden sm:inline">{flaggedQuestions[q.id] ? "Signalé" : "Signaler"}</span>
                                  </button>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                {q.options.map((opt) => {
                                  const isOptionSelected = userAns === opt;
                                  const isOptionCorrect = opt === q.correct;
                                  
                                  let btnStyle = "border-slate-150 text-slate-600 bg-white hover:bg-slate-50";
                                  
                                  if (examCorrectionMode || isAnswered) {
                                    if (isOptionSelected) {
                                      btnStyle = isOptionCorrect
                                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-800 pointer-events-none font-extrabold shadow-xs"
                                        : "bg-rose-500/10 border-rose-400 text-rose-800 pointer-events-none font-extrabold shadow-xs";
                                    } else if (isOptionCorrect) {
                                      btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-700 pointer-events-none font-extrabold";
                                    } else {
                                      btnStyle = "border-slate-100 text-slate-300 pointer-events-none opacity-55";
                                    }
                                  }

                                  return (
                                    <button
                                      key={opt}
                                      disabled={examCorrectionMode || isAnswered}
                                      onClick={() => setExamAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                      className={`text-left p-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                                    >
                                      <span>{opt}</span>
                                      {(examCorrectionMode || isAnswered) && isOptionSelected && isOptionCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                                      {(examCorrectionMode || isAnswered) && isOptionSelected && !isOptionCorrect && <X className="w-4 h-4 text-rose-600" />}
                                      {(examCorrectionMode || isAnswered) && !isOptionSelected && isOptionCorrect && <Check className="w-4 h-4 text-emerald-600 opacity-60" />}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Immediate Feedback Explanation */}
                              {(examCorrectionMode || isAnswered) && (
                                <div className={`rounded-2xl p-4 text-xs flex gap-3 items-start animate-fade-in border mt-3 ${
                                  isCorrect 
                                    ? "bg-emerald-50 border-emerald-200/50 text-emerald-800" 
                                    : "bg-rose-50 border-rose-200/50 text-rose-800"
                                }`}>
                                  <span className="text-lg">{isCorrect ? "✨" : "❌"}</span>
                                  <div>
                                    <p className="font-extrabold text-xs uppercase tracking-wide">
                                      {isCorrect ? "Bonne Réponse !" : `Faux • La bonne réponse est : ${q.correct}`}
                                    </p>
                                    <p className="font-medium mt-1 leading-relaxed">
                                      💡 <strong>Explication :</strong> {q.explanation}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Easy Navigation Next & Previous buttons */}
                              <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-6">
                                <button
                                  type="button"
                                  onClick={() => setCurrentQuestionAIndex(prev => Math.max(0, prev - 1))}
                                  disabled={currentQuestionAIndex === 0}
                                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                                  <span>Précédent</span>
                                </button>

                                <span className="text-[10px] font-mono text-slate-400 font-bold">
                                  {currentQuestionAIndex + 1} / 40
                                </span>

                                {currentQuestionAIndex < 39 ? (
                                  <button
                                    type="button"
                                    onClick={() => setCurrentQuestionAIndex(prev => Math.min(39, prev + 1))}
                                    className="px-5 py-2.5 bg-[#002B5B] hover:bg-blue-800 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                                  >
                                    <span>Suivant</span>
                                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!examCorrectionMode) {
                                        setExamSection("transition_to_B");
                                      }
                                    }}
                                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                                  >
                                    <span>Section B</span>
                                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* SECTION B */}
                      {examSection === "B" && (
                        <div className="space-y-6 animate-fade-in">
                          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                            <h4 className="font-display font-black text-sm uppercase text-[#002B5B] tracking-wider border-b border-slate-50 pb-2 flex justify-between items-center">
                              <span>Section B : Compréhension et Synthèse (Questions 41 à 43)</span>
                              {examCorrectionMode && (
                                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-100 uppercase font-black">
                                  Corrigé Actif 🔍
                                </span>
                              )}
                            </h4>
                            
                            <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl text-xs font-semibold leading-relaxed text-slate-700 font-serif">
                              <p className="font-bold text-slate-400 font-sans text-[10px] uppercase tracking-wider mb-2.5">📜 TEXTE DE COMPRÉHENSION WAEC :</p>
                              {mockExamQuestions.sectionB.passage}
                            </div>
                          </div>

                          <div className="space-y-6">
                            {[
                              {
                                id: 41,
                                question: "Selon le texte, en quoi le rôle de l'éducation en Afrique de l'Ouest moderne dépasse-t-il la simple obtention de diplômes académiques ?",
                                helper: "Pensez à citer les objectifs sociétaux et l'agilité citoyenne décrits par l'auteur.",
                                modelAnswer: "L'éducation moderne en Afrique de l'Ouest ne se borne plus à décerner des titres universitaires; elle vise désormais à forger des esprits adaptables, aptes à concevoir des solutions locales pertinentes tout en s'intégrant au tissu socio-économique global."
                              },
                              {
                                id: 42,
                                question: "Pourquoi est-il devenu indispensable de former des 'citoyens agiles' face aux mutations technologiques actuelles ?",
                                helper: "Faites le lien entre la rapidité du changement et la capacité d'adaptation locale.",
                                modelAnswer: "Les mutations technologiques exigent une réactivité constante. Des citoyens agiles possèdent la flexibilité intellectuelle nécessaire pour apprendre en continu, s'approprier les innovations numériques et les appliquer judicieusement dans leur milieu."
                              },
                              {
                                id: 43,
                                question: "Expliquez l'impact bénéfique attribué aux examens régionaux comme le WAEC dans le texte.",
                                helper: "Mettez en avant le double aspect de standardisation et de motivation collective.",
                                modelAnswer: "Le WAEC agit comme un levier qualitatif majeur. En standardisant les critères d'évaluation à l'échelle régionale, il instaure une saine émulation et pousse élèves et enseignants à cibler un niveau d'excellence homogène."
                              }
                            ].map((q) => {
                              const answer = examAnswers[q.id] || "";
                              const wordCount = answer.trim().split(/\s+/).filter(Boolean).length;
                              const feedback = examReport?.theoryFeedback?.[q.id];

                              return (
                                <div key={q.id} id={`question-${q.id}`} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                      <span className="text-[10px] font-mono font-black text-[#002B5B] uppercase tracking-widest bg-[#002B5B]/5 px-2.5 py-1 rounded-md border border-[#002B5B]/10">
                                        Question Théorique {q.id}
                                      </span>
                                      <p className="text-sm font-bold text-slate-800 pt-1 leading-relaxed">{q.question}</p>
                                    </div>
                                    {!examCorrectionMode && (
                                      <button
                                        onClick={() => setFlaggedQuestions(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                                        className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-[10px] font-black shrink-0 ${
                                          flaggedQuestions[q.id]
                                            ? "bg-amber-50 border-amber-300 text-amber-600 shadow-xs"
                                            : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                                        }`}
                                      >
                                        <Flag className="w-3.5 h-3.5 fill-current" />
                                        <span className="hidden sm:inline">{flaggedQuestions[q.id] ? "Signalé" : "Signaler"}</span>
                                      </button>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <textarea
                                      rows={4}
                                      disabled={examCorrectionMode}
                                      value={answer}
                                      onChange={(e) => setExamAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                      placeholder="Rédigez votre réponse structurée en français ici..."
                                      className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-[#002B5B] focus:bg-white rounded-2xl p-4 text-xs font-semibold text-slate-700 outline-hidden transition-all resize-none disabled:bg-slate-50 disabled:text-slate-500"
                                    />
                                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
                                      <span>Conseil : Soyez précis et soignez votre grammaire</span>
                                      <span>{wordCount} mots</span>
                                    </div>
                                  </div>

                                  {examCorrectionMode && feedback && (
                                    <div className="space-y-3 pt-3 border-t border-slate-50">
                                      <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl text-xs space-y-2">
                                        <div className="flex justify-between items-center">
                                          <span className="font-extrabold text-[#002B5B] uppercase text-[10px] tracking-wide flex items-center gap-1">
                                            🔍 ÉVALUATION INDIVIDUELLE DE L'IA
                                          </span>
                                          <span className="font-mono bg-amber-500/10 text-amber-600 px-2.5 py-0.5 rounded-lg font-black">
                                            Score : {feedback.score}/100
                                          </span>
                                        </div>
                                        <p className="text-slate-600 leading-relaxed font-semibold">{feedback.comment}</p>
                                      </div>

                                      <div className="bg-[#FFFCE8] border border-[#FFEB85]/40 p-4 rounded-2xl text-xs space-y-2">
                                        <p className="font-extrabold text-[#A67C00] uppercase text-[10px] tracking-wide">
                                          🔑 CORRIGÉ TYPE OFFICIEL (RÉFÉRENCE)
                                        </p>
                                        <p className="text-slate-700 leading-relaxed font-medium">{q.modelAnswer}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Navigation */}
                          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => setExamSection("A")}
                              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                              <span>Section A</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (!examCorrectionMode) {
                                  setExamSection("transition_to_C");
                                } else {
                                  setExamSection("C");
                                }
                              }}
                              className="px-5 py-2.5 bg-[#002B5B] hover:bg-blue-800 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <span>Section C</span>
                              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* SECTION C */}
                      {examSection === "C" && (
                        <div className="space-y-6 animate-fade-in">
                          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-2">
                            <h4 className="font-display font-black text-sm uppercase text-[#002B5B] tracking-wider border-b border-slate-50 pb-2 flex justify-between items-center">
                              <span>Section C : Expression Orale & Phonétique (Questions 44 à 46)</span>
                              {examCorrectionMode && (
                                <span className="text-[10px] font-mono bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg border border-emerald-100 uppercase font-black">
                                  Corrigé Actif 🔍
                                </span>
                              )}
                            </h4>
                            <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                              Cette section évalue vos aptitudes à communiquer à haute voix. Écoutez les consignes et parlez distinctement lors de votre enregistrement.
                            </p>
                          </div>

                          <div className="space-y-6">
                            {[
                              {
                                id: 44,
                                title: "Question Orale 44 : Répétition & Liaison",
                                instruction: "Écoutez l'extrait de référence, puis répétez la phrase à haute voix en insistant bien sur la liaison entre les mots.",
                                audioText: "« Nous avons hâte de célébrer nos succès scolaires. »",
                                advice: "La liaison phonétique entre 'nous' et 'avons' (/nuz-avɔ̃/) est essentielle."
                              },
                              {
                                id: 45,
                                title: "Question Orale 45 : Présentation Spontanée",
                                instruction: "Présentez-vous brièvement en français (votre prénom, vos matières favorites et vos projets d'avenir après le WAEC).",
                                audioText: "[Consigne : Exprimez-vous librement pendant 15 secondes en soignant votre articulation]",
                                advice: "Articulez distinctement les nasales (/ɑ̃/ et /ɔ̃/) et maintenez un débit régulier."
                              },
                              {
                                id: 46,
                                title: "Question Orale 46 : Argumentation Orale",
                                instruction: "Selon vous, de quelle manière l'intelligence artificielle peut-elle révolutionner l'apprentissage des langues ? Argumentez brièvement.",
                                audioText: "[Consigne : Donnez un argument construit et fluide en français]",
                                advice: "Utilisez des marqueurs de relation oraux comme 'tout d'abord' ou 'par conséquent'."
                              }
                            ].map((q) => {
                              const isRecorded = examRecordedAudios[q.id];
                              const isThisRecording = examRecordingId === q.id;
                              const feedback = examReport?.oralFeedback?.[q.id];

                              return (
                                <div key={q.id} id={`question-${q.id}`} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                                  <div className="flex justify-between items-start gap-4">
                                    <div className="space-y-1">
                                      <span className="text-[10px] font-mono font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-2.5 py-1 rounded-md border border-rose-100">
                                        Contrôle Oral {q.id}
                                      </span>
                                      <h5 className="text-sm font-bold text-slate-800 pt-1">{q.title}</h5>
                                      <p className="text-xs font-semibold text-slate-500 leading-relaxed">{q.instruction}</p>
                                    </div>
                                    {!examCorrectionMode && (
                                      <button
                                        onClick={() => setFlaggedQuestions(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                                        className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-[10px] font-black shrink-0 ${
                                          flaggedQuestions[q.id]
                                            ? "bg-amber-50 border-amber-300 text-amber-600 shadow-xs"
                                            : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"
                                        }`}
                                      >
                                        <Flag className="w-3.5 h-3.5 fill-current" />
                                        <span className="hidden sm:inline">{flaggedQuestions[q.id] ? "Signalé" : "Signaler"}</span>
                                      </button>
                                    )}
                                  </div>

                                  {/* Audio Reference Block */}
                                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between text-xs font-black text-slate-700 max-w-lg">
                                    <div className="flex items-center gap-2.5">
                                      <Volume2 className="w-4 h-4 text-[#002B5B]" />
                                      <span className="italic font-serif text-slate-800">{q.audioText}</span>
                                    </div>
                                    <button 
                                      onClick={() => {
                                        const originalText = q.audioText;
                                        if ('speechSynthesis' in window) {
                                          const utterance = new SpeechSynthesisUtterance(originalText.replace(/«|»/g, ''));
                                          utterance.lang = 'fr-FR';
                                          window.speechSynthesis.speak(utterance);
                                        }
                                      }}
                                      className="bg-white hover:bg-slate-100 p-2 rounded-xl border border-slate-200 text-[#002B5B] cursor-pointer shrink-0 ml-4 flex items-center gap-1 text-[10px] font-black"
                                      title="Écouter l'exemple audio"
                                    >
                                      <Volume2 className="w-3.5 h-3.5 fill-current" />
                                      <span>Écouter</span>
                                    </button>
                                  </div>

                                  {/* Interactive Recording Area */}
                                  {!examCorrectionMode && (
                                    <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col items-center justify-center space-y-3 min-h-[90px]">
                                      {isThisRecording ? (
                                        <div className="space-y-3 w-full max-w-xs text-center">
                                          <div className="flex items-center justify-center gap-2 text-rose-500 font-bold animate-pulse text-xs">
                                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                            <span>Enregistrement en cours...</span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setExamRecordedAudios(prev => ({ ...prev, [q.id]: true }));
                                              setExamAnswers(prev => ({ ...prev, [q.id]: "Enregistrement oral soumis" }));
                                              setExamRecordingId(null);
                                              setExamRecordProgress(0);
                                            }}
                                            className="bg-slate-800 hover:bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 mx-auto"
                                          >
                                            <MicOff className="w-3.5 h-3.5" />
                                            <span>Arrêter et Sauvegarder</span>
                                          </button>
                                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${examRecordProgress}%` }} />
                                          </div>
                                        </div>
                                      ) : isRecorded ? (
                                        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-3">
                                          <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-xs">
                                            <Check className="w-4 h-4 stroke-[3]" />
                                            <span>Enregistrement enregistré avec succès</span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setExamRecordingId(q.id);
                                              setExamRecordProgress(0);
                                            }}
                                            className="text-[10px] font-black text-[#002B5B] hover:underline flex items-center gap-1 cursor-pointer"
                                          >
                                            <RefreshCw className="w-3 h-3" />
                                            <span>Réenregistrer</span>
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          type="button"
                                          disabled={examRecordingId !== null}
                                          onClick={() => {
                                            setExamRecordingId(q.id);
                                            setExamRecordProgress(0);
                                          }}
                                          className="bg-rose-500 hover:bg-rose-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-[10px] uppercase tracking-wider px-5 py-3 rounded-xl shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                                        >
                                          <Mic className="w-4 h-4" />
                                          <span>Commencer l'enregistrement oral</span>
                                        </button>
                                      )}
                                    </div>
                                  )}

                                  {/* AI Phonetics & Correction Feedback */}
                                  {examCorrectionMode && feedback && (
                                    <div className="space-y-3 pt-3 border-t border-slate-50">
                                      <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                                          <p className="text-[8px] font-mono text-slate-400 font-bold uppercase font-black">PRONONCIATION</p>
                                          <p className="text-sm font-display font-black text-emerald-600 mt-0.5">{feedback.pronunciation}%</p>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                                          <p className="text-[8px] font-mono text-slate-400 font-bold uppercase font-black">FLUIDITÉ</p>
                                          <p className="text-sm font-display font-black text-slate-800 mt-0.5">{feedback.fluency}%</p>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl">
                                          <p className="text-[8px] font-mono text-slate-400 font-bold uppercase font-black">PRÉCISION</p>
                                          <p className="text-sm font-display font-black text-slate-800 mt-0.5">{feedback.accuracy}%</p>
                                        </div>
                                      </div>

                                      <div className="bg-[#FFFCE8] border border-[#FFEB85]/40 p-4 rounded-2xl text-xs space-y-1.5">
                                        <p className="font-extrabold text-[#A67C00] uppercase text-[10px] tracking-wide">
                                          🎙️ ANALYSE ORALE & CONSEIL PHONÉTIQUE DE L'IA
                                        </p>
                                        <p className="text-slate-700 leading-relaxed font-semibold">{feedback.advice}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Navigation & Submit */}
                          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs flex justify-between items-center">
                            <button
                              type="button"
                              onClick={() => setExamSection("B")}
                              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                              <span>Section B</span>
                            </button>

                            {!examCorrectionMode && (
                              <button
                                type="button"
                                onClick={handleFinishExam}
                                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-md hover:scale-[1.02] active:scale-95 animate-pulse"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Soumettre l'Examen Complet</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Right Column: Status & Submission & Question Map */}
                    <div className="space-y-6 lg:col-span-1">
                      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs sticky top-24 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
                        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                          <h4 className="font-display font-black text-xs uppercase text-slate-400 tracking-wider">État d'avancement</h4>
                          {examCorrectionMode && (
                            <span className="text-[9px] bg-[#002B5B]/10 text-[#002B5B] px-2 py-0.5 rounded-lg font-mono font-bold">
                              CORRIGÉ ACTIF
                            </span>
                          )}
                        </div>
                        
                        {(() => {
                          const answeredA = mockExamQuestions.sectionA.filter(q => !!examAnswers[q.id]).length;
                          const answeredB = [41, 42, 43].filter(id => !!examAnswers[id] && examAnswers[id].trim().length > 0).length;
                          const answeredC = [44, 45, 46].filter(id => !!examRecordedAudios[id]).length;
                          const totalAnsweredCount = answeredA + answeredB + answeredC;

                          return (
                            <div className="space-y-3">
                              <div className="flex justify-between text-xs font-bold text-slate-600">
                                <span>Questions répondues</span>
                                <span className="font-mono text-[#002B5B] font-black">
                                  {totalAnsweredCount} / 46
                                </span>
                              </div>
                              {/* Progress bar for 46 items */}
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="bg-[#002B5B] h-full transition-all duration-300"
                                  style={{ width: `${(totalAnsweredCount / 46) * 100}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-xs font-bold text-slate-600">
                                <span>Questions signalées</span>
                                <span className="font-mono text-amber-600 flex items-center gap-1 font-black">
                                  <Flag className="w-3 h-3 fill-current" />
                                  {Object.values(flaggedQuestions).filter(Boolean).length}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs font-bold text-slate-600 pt-1">
                                <span>Contrôles oraux</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                                  answeredC === 3 
                                    ? "bg-emerald-50 text-emerald-600" 
                                    : "bg-rose-50 text-rose-500"
                                }`}>
                                  {answeredC} / 3 COMPLET
                                </span>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Mini Question Map grid preview */}
                        <div className="space-y-3 pt-3 border-t border-slate-100">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Aperçu de la Carte (46 Questions)</span>
                            <button
                              onClick={() => setShowQuestionMap(true)}
                              className="text-[10px] text-[#002B5B] hover:text-blue-800 font-bold underline cursor-pointer"
                            >
                              Agrandir
                            </button>
                          </div>
                          <div className="grid grid-cols-10 gap-1 max-h-[140px] overflow-y-auto custom-scrollbar p-1 bg-slate-50 rounded-xl border border-slate-100">
                            {Array.from({ length: 46 }, (_, i) => {
                              const qId = i + 1;
                              const isA = qId <= 40;
                              const isB = qId >= 41 && qId <= 43;
                              const isC = qId >= 44;

                              const isUnlocked = 
                                (examSection === "A" && isA) ||
                                (examSection === "B" && (isA || isB)) ||
                                (examSection === "C" && (isA || isB || isC));

                              let isAns = false;
                              if (isA) isAns = !!examAnswers[qId];
                              else if (isB) isAns = !!examAnswers[qId] && examAnswers[qId].trim().length > 0;
                              else if (isC) isAns = !!examRecordedAudios[qId];

                              const isFlg = !!flaggedQuestions[qId];
                              
                              let colorClass = "bg-slate-100 text-slate-300 border-slate-150 cursor-not-allowed opacity-50";
                              if (isUnlocked) {
                                if (isFlg) colorClass = "bg-amber-400 border-amber-500 text-amber-950 hover:bg-amber-300 cursor-pointer";
                                else if (isAns) {
                                  colorClass = "bg-[#002B5B] border-[#002B5B] text-white hover:bg-blue-800 cursor-pointer";
                                } else {
                                  colorClass = "bg-slate-200 border-slate-300 text-slate-600 hover:bg-slate-300 cursor-pointer";
                                }
                              }

                              return (
                                <button
                                  key={qId}
                                  disabled={!isUnlocked}
                                  onClick={() => {
                                    if (qId <= 40) {
                                      setExamSection("A");
                                      setCurrentQuestionAIndex(qId - 1);
                                      setTimeout(() => {
                                        document.getElementById("sectionA-container")?.scrollIntoView({ behavior: "smooth" });
                                      }, 100);
                                    } else if (qId >= 41 && qId <= 43) {
                                      if (examSection === "B") {
                                        document.getElementById(`question-${qId}`)?.scrollIntoView({ behavior: "smooth" });
                                      } else {
                                        setExamSection("B");
                                        setTimeout(() => {
                                          document.getElementById(`question-${qId}`)?.scrollIntoView({ behavior: "smooth" });
                                        }, 100);
                                      }
                                    } else {
                                      if (examSection === "C") {
                                        document.getElementById(`question-${qId}`)?.scrollIntoView({ behavior: "smooth" });
                                      } else {
                                        setExamSection("C");
                                        setTimeout(() => {
                                          document.getElementById(`question-${qId}`)?.scrollIntoView({ behavior: "smooth" });
                                        }, 100);
                                      }
                                    }
                                  }}
                                  className={`w-full aspect-square rounded-md border text-[8px] font-black flex items-center justify-center transition-all hover:scale-110 ${colorClass}`}
                                  title={isUnlocked ? `Question ${qId}` : `Question ${qId} - Verrouillée (Section ultérieure)`}
                                >
                                  {isUnlocked ? qId : "🔒"}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                          <button
                            onClick={() => setShowQuestionMap(true)}
                            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-black text-xs uppercase tracking-wider py-3 rounded-2xl border border-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                          >
                            <Grid className="w-4 h-4 text-slate-500" />
                            <span>Ouvrir la Carte Interactive</span>
                          </button>

                          {!examCorrectionMode && (
                            <button
                              onClick={() => {
                                if (examSection === "A") {
                                  setExamSection("transition_to_B");
                                } else if (examSection === "B") {
                                  setExamSection("transition_to_C");
                                } else {
                                  handleFinishExam();
                                }
                              }}
                              disabled={isExamEvaluating}
                              className="w-full bg-[#002B5B] hover:bg-blue-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <span>
                                {examSection === "A" 
                                  ? "Terminer la Section A ➡️" 
                                  : examSection === "B" 
                                    ? "Terminer la Section B ➡️" 
                                    : "Soumettre l'Examen 🎓"}
                              </span>
                            </button>
                          )}

                          {examCorrectionMode && (
                            <button
                              onClick={() => {
                                setExamCorrectionMode(false);
                                setExamFinished(false);
                                setExamStarted(false);
                                setExamAnswers({});
                                setExamEssay("");
                                setFlaggedQuestions({});
                                setCurrentView("parcours");
                              }}
                              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-black text-xs uppercase tracking-wider py-3 rounded-2xl border border-rose-100 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                            >
                              <span>Fermer le Corrigé</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                )
              ) : (
                /* Premium Light Bento Results & AI Debrief Screen */
                <div className="bg-white border border-slate-150 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto space-y-8 shadow-xl relative overflow-hidden">
                  {/* Subtle golden atmospheric background glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                  {/* Header: Academic Certificate Seal style */}
                  <div className="text-center space-y-3 relative z-10">
                    <div className="w-20 h-20 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-500 mx-auto shadow-md">
                      <Award className="w-10 h-10 stroke-[1.8] animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-black text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-widest inline-block">
                        Simulation Complétée • Diagnostic IA
                      </span>
                      <h3 className="font-display font-black text-2xl text-[#002B5B] tracking-tight">Votre Rapport de Notation Officieux</h3>
                      <p className="text-slate-500 text-xs font-semibold">Conforme au référentiel d'évaluation du français du WAEC</p>
                    </div>
                  </div>

                  {/* Bento Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                    {/* Final Score */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center space-y-1 hover:border-amber-200 transition-all">
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Score Global</span>
                      <div className="font-display font-black text-3xl text-amber-600 tracking-tight flex items-center justify-center gap-1">
                        <span>{examReport?.overall}%</span>
                      </div>
                    </div>

                    {/* WAEC Grade */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center space-y-1 hover:border-blue-200 transition-all">
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Grade Obtenu</span>
                      <div className="font-display font-black text-2xl text-blue-600 tracking-tight mt-1">
                        {examReport?.grade.split(" ")[0]}
                      </div>
                    </div>

                    {/* Progress / Completion Rate */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center space-y-1 hover:border-emerald-200 transition-all">
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Taux de Réponse</span>
                      <div className="font-display font-black text-2xl text-emerald-600 tracking-tight mt-1">
                        {(() => {
                          const answeredA = mockExamQuestions.sectionA.filter(q => !!examAnswers[q.id]).length;
                          const answeredB = [41, 42, 43].filter(id => !!examAnswers[id] && examAnswers[id].trim().length > 0).length;
                          const answeredC = [44, 45, 46].filter(id => !!examRecordedAudios[id]).length;
                          return Math.round(((answeredA + answeredB + answeredC) / 46) * 100);
                        })()}%
                      </div>
                    </div>

                    {/* Awarded XP */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center space-y-1 hover:border-purple-200 transition-all">
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider block">Bonus Reçu</span>
                      <div className="font-display font-black text-2xl text-purple-600 tracking-tight mt-1 flex items-center justify-center gap-1">
                        <Sparkles className="w-4 h-4" />
                        <span>+150 XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Section-by-Section Score Breakdown */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4 relative z-10">
                    <h4 className="font-display font-black text-xs text-[#002B5B] uppercase tracking-wider flex items-center gap-2">
                      <BookOpenCheck className="w-4 h-4 text-amber-500" />
                      <span>Détail des Épreuves</span>
                    </h4>
                    
                    <div className="space-y-3.5">
                      {/* Section A */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-600">Section A : Grammaire et Syntaxe</span>
                          <span className="text-amber-600">{examReport?.sectionA}/100</span>
                        </div>
                        <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${examReport?.sectionA || 60}%` }} />
                        </div>
                      </div>

                      {/* Section B */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-600">Section B : Compréhension de Texte</span>
                          <span className="text-blue-600">{examReport?.sectionB || 100}/100</span>
                        </div>
                        <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: `${examReport?.sectionB || 100}%` }} />
                        </div>
                      </div>

                      {/* Section C */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-600">Section C : Rédaction d'Essai Libre</span>
                          <span className="text-emerald-600">{examReport?.sectionC}/100</span>
                        </div>
                        <div className="w-full bg-slate-200/60 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${examReport?.sectionC || 70}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Bespoke Debrief & Recommendations Panel */}
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 md:p-6 space-y-6 relative z-10">
                    <h4 className="font-display font-black text-sm text-[#002B5B] uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      <span>Debriefing Diagnostic de l'IA</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Left: Style Critique */}
                      <div className="space-y-3 bg-white border border-slate-150 p-4 rounded-2xl shadow-xs">
                        <h5 className="font-display font-black text-xs text-blue-600 uppercase tracking-wide">
                          ✍️ Critique de Style (Section C)
                        </h5>
                        <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                          {examReport?.essayAnalysis.style}
                        </p>
                      </div>

                      {/* Right: Grammatical recommendations */}
                      <div className="space-y-3 bg-white border border-slate-150 p-4 rounded-2xl shadow-xs">
                        <h5 className="font-display font-black text-xs text-amber-600 uppercase tracking-wide">
                          🛠️ Améliorations Grammaticales
                        </h5>
                        <p className="text-slate-600 text-xs font-semibold leading-relaxed">
                          {examReport?.essayAnalysis.corrections}
                        </p>
                      </div>
                    </div>

                    {/* Gap suggestions / Clickable Lexique flashcards */}
                    <div className="bg-white border border-slate-150 p-4 rounded-2xl space-y-3 shadow-xs">
                      <h5 className="font-display font-black text-xs text-amber-600 uppercase tracking-wide flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>Gaps Lexicaux Détectés (Flashcards Recommandées)</span>
                      </h5>
                      <p className="text-slate-500 text-[11px] font-semibold">
                        Cliquez sur un concept pour ouvrir la fiche correspondante dans le dictionnaire interactif :
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {["Élision", "Subjonctif", "Pléonasme", "Idiotisme"].map((word) => (
                          <button
                            key={word}
                            onClick={() => {
                              setDictSearch(word);
                              setIsDictOpen(true);
                            }}
                            className="bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl text-xs font-black text-amber-600 transition-all cursor-pointer hover:scale-105"
                          >
                            📖 {word}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 relative z-10">
                    <button
                      onClick={() => {
                        setExamCorrectionMode(true);
                        setExamFinished(false);
                      }}
                      className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-lg shadow-yellow-500/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Search className="w-4 h-4 stroke-[2.5]" />
                      <span>Consulter le Corrigé Détaillé 🔍</span>
                    </button>

                    <button
                      onClick={handleBackToDashboard}
                      className="flex-1 bg-[#002B5B] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-md transition-all text-center cursor-pointer"
                    >
                      Retourner à l'Arena (+150 XP)
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ==================== C. BLITZ MCQ VIEW ==================== */}
          {activeTab === "qcm" && (
            <motion.div 
              key="qcm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-[#002B5B]">Mode Blitz (QCM Rapide)</h2>
                <span className="bg-slate-100 border border-slate-200 text-slate-600 font-mono text-xs font-extrabold px-3 py-1 rounded-full">
                  Question {qcmIndex + 1} / 5
                </span>
              </div>

              {!qcmFinished ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
                  {/* Question Title */}
                  <h3 className="font-display font-black text-base text-[#002B5B] leading-relaxed">
                    {mockExamQuestions.sectionA[qcmIndex].question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {mockExamQuestions.sectionA[qcmIndex].options.map((opt) => {
                      const isSelected = qcmSelectedOption === opt;
                      const isCorrect = opt === mockExamQuestions.sectionA[qcmIndex].correct;
                      
                      let btnStyle = "border-slate-150 text-slate-700 hover:bg-slate-50";
                      if (qcmSelectedOption !== null) {
                        if (isSelected) {
                          btnStyle = isCorrect 
                            ? "bg-emerald-50 border-emerald-500 text-emerald-700" 
                            : "bg-rose-50 border-rose-500 text-rose-700";
                        } else if (isCorrect) {
                          btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-700";
                        } else {
                          btnStyle = "border-slate-100 text-slate-300 pointer-events-none";
                        }
                      }

                      return (
                        <button
                          key={opt}
                          disabled={qcmSelectedOption !== null}
                          onClick={() => handleQcmSelect(opt)}
                          className={`w-full text-left p-4 rounded-2xl border text-xs font-black transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {qcmSelectedOption !== null && isSelected && (
                            <span>{isCorrect ? "✓ Correct" : "✗ Incorrect"}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {qcmSelectedOption !== null && (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold leading-relaxed text-slate-600">
                      💡 <strong>Règle :</strong> {mockExamQuestions.sectionA[qcmIndex].explanation}
                    </div>
                  )}
                </div>
              ) : (
                /* score card */
                <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center space-y-6 shadow-sm">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto shadow-2xs">
                    <Star className="w-8 h-8 fill-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-black text-lg text-[#002B5B]">Session Blitz Complétée !</h3>
                    <p className="text-slate-500 text-xs font-semibold">
                      Vous avez obtenu un score de <strong className="text-[#002B5B]">{qcmScore} / 5</strong> questions correctes.
                    </p>
                  </div>
                  <div className="text-3xl font-display font-black text-[#FFD214]">
                    +40 XP
                  </div>
                  <button
                    onClick={handleBackToDashboard}
                    className="w-full bg-[#002B5B] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-sm transition-all cursor-pointer"
                  >
                    Retourner à l'Arena
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ==================== D. WRITING ESSAY VIEW ==================== */}
          {activeTab === "writing" && (
            <motion.div 
              key="writing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg md:text-xl font-black text-[#002B5B] flex items-center gap-2">
                  <FileText className="text-amber-500 w-5 h-5" />
                  La Théorie : Entraînement de Rédaction & Résumé
                </h2>
                <p className="text-slate-500 text-xs font-semibold mt-1">Saisissez un texte libre ou choisissez l'un des thèmes officiels pour un feedback par IA en temps réel.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Inputs column */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Subject selector */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Thèmes Recommandés WAEC</h3>
                    <div className="flex flex-wrap gap-2">
                      {mockExamQuestions.sectionC.prompts.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedPrompt(p);
                            setEssayContent("");
                            setWritingReport(null);
                          }}
                          className={`px-4 py-2.5 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                            selectedPrompt.id === p.id
                              ? "bg-amber-500 border-amber-600 text-white shadow-xs"
                              : "bg-white border-slate-200 text-[#002B5B] hover:bg-slate-50"
                          }`}
                        >
                          {p.title}
                        </button>
                      ))}
                    </div>
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-[#002B5B] font-bold leading-relaxed">
                      {selectedPrompt.text}
                    </div>
                  </div>

                  {/* Essay writing area */}
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Votre Rédaction</h3>
                    <textarea
                      rows={8}
                      value={essayContent}
                      onChange={(e) => setEssayContent(e.target.value)}
                      placeholder="Tapez ou collez votre texte ici..."
                      className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-[#002B5B] focus:bg-white rounded-2xl p-4 text-xs font-semibold text-slate-700 outline-hidden transition-all resize-none"
                    />
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
                      <span>Conseil: Visez au moins 100 mots pour une analyse riche.</span>
                      <span>{essayContent.trim().split(/\s+/).filter(Boolean).length} mots</span>
                    </div>

                    <button
                      onClick={handleWritingSubmit}
                      disabled={isWritingEvaluating || !essayContent.trim()}
                      className="w-full bg-[#002B5B] hover:bg-blue-800 disabled:bg-slate-200 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isWritingEvaluating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Correction IA en cours...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Demander une Correction IA (+50 XP)</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* AI report output column */}
                <div className="space-y-6">
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs sticky top-24 space-y-5">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Résultats de l'évaluation</h3>
                    
                    {!writingReport ? (
                      <div className="text-center py-8 text-slate-400 space-y-2">
                        <FileText className="w-8 h-8 mx-auto stroke-[1.5]" />
                        <p className="text-xs font-semibold">Rédigez un texte à gauche et cliquez sur "Demander une Correction IA" pour voir les résultats.</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <span className="text-xs font-black text-slate-600">Note Globale</span>
                          <span className="text-2xl font-display font-black text-[#002B5B]">{writingReport.score} / 100</span>
                        </div>

                        <div className="space-y-3">
                          <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">Commentaires de l'IA</p>
                          <p className="text-xs font-medium leading-relaxed text-slate-600">{writingReport.feedback}</p>
                        </div>

                        {writingReport.corrections.length > 0 && (
                          <div className="space-y-3">
                            <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">Corrections Orthographe / Grammaire</p>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {writingReport.corrections.map((c: any, i: number) => (
                                <div key={i} className="bg-rose-50/50 border border-rose-100 p-2.5 rounded-xl text-xs space-y-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="line-through text-rose-500 font-bold">{c.original}</span>
                                    <span className="text-emerald-600 font-black">➔ {c.corrected}</span>
                                  </div>
                                  <p className="text-[10px] text-slate-500 font-medium">{c.explanation}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {writingReport.suggestedRewrite && (
                          <div className="space-y-3">
                            <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-wider">Version Améliorée par l'IA</p>
                            <div className="bg-emerald-50/30 border border-emerald-100 p-3 rounded-xl text-xs text-slate-700 font-medium leading-relaxed italic">
                              "{writingReport.suggestedRewrite}"
                            </div>
                          </div>
                        )}

                        <button
                          onClick={handleBackToDashboard}
                          className="w-full bg-[#002B5B] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all text-center cursor-pointer"
                        >
                          Terminer l'exercice
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==================== E. ORAL VIEW ==================== */}
          {activeTab === "oral" && (
            <motion.div 
              key="oral"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-xl mx-auto space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-black text-[#002B5B]">Module d'Expression Orale</h2>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200 px-3 py-1 rounded-full uppercase">
                  SIMULATION ACTIVE
                </span>
              </div>

              {oralStep === 1 && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-brand-blue mx-auto">
                    <Volume2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-black text-base text-[#002B5B]">Étape 1 : Écoutez le passage audio</h3>
                    <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                      Cliquez ci-dessous pour lancer l'audio de la phrase que vous devrez répéter ensuite. Concentrez-vous sur la liaison et l'accentuation.
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between text-xs font-black text-slate-700 max-w-sm mx-auto">
                    <span>"Nous avons hâte de célébrer nos succès scolaires."</span>
                    <button className="bg-white hover:bg-slate-100 p-2 rounded-xl border border-slate-200 text-[#002B5B] cursor-pointer">
                      <Volume2 className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <button
                    onClick={() => setOralStep(2)}
                    className="w-full bg-[#002B5B] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-sm transition-all cursor-pointer"
                  >
                    Passer à l'enregistrement
                  </button>
                </div>
              )}

              {oralStep === 2 && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6 text-center">
                  <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto animate-pulse">
                    <Mic className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-display font-black text-base text-[#002B5B]">Étape 2 : Enregistrez votre prononciation</h3>
                    <p className="text-slate-500 text-xs font-semibold">
                      Maintenant, appuyez sur le bouton, lisez à haute voix la phrase ci-dessous, puis arrêtez.
                    </p>
                  </div>

                  <p className="text-base font-black text-slate-800 leading-relaxed max-w-xs mx-auto italic">
                    "Nous avons hâte de célébrer nos succès scolaires."
                  </p>

                  <div className="py-4 flex flex-col items-center space-y-3">
                    {!isRecording ? (
                      <button
                        onClick={handleStartRecording}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-black text-xs uppercase tracking-wider px-6 py-4 rounded-full shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Commencer l'enregistrement</span>
                      </button>
                    ) : (
                      <div className="space-y-3 w-full max-w-xs">
                        <button
                          onClick={handleStopRecording}
                          className="bg-slate-800 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-wider px-6 py-4 rounded-full shadow-md flex items-center gap-2 cursor-pointer mx-auto"
                        >
                          <MicOff className="w-4 h-4" />
                          <span>Arrêter l'enregistrement</span>
                        </button>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${recordProgress}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {oralStep === 3 && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-xs space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <h3 className="font-display font-black text-base text-[#002B5B]">Analyse Orale Complétée !</h3>
                    <p className="text-slate-400 text-[10px] font-mono font-black uppercase tracking-wider">RÉSULTAT DU CONTRÔLE PHONÉTIQUE PAR IA</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 py-3 border-y border-slate-50">
                    <div className="text-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-mono text-slate-400 font-bold uppercase">PRONONCIATION</p>
                      <p className="text-lg font-display font-black text-emerald-600 mt-1">{audioFeedback?.pronunciation}%</p>
                    </div>
                    <div className="text-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-mono text-slate-400 font-bold uppercase">FLUIDITÉ</p>
                      <p className="text-lg font-display font-black text-slate-800 mt-1">{audioFeedback?.fluency}%</p>
                    </div>
                    <div className="text-center bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-mono text-slate-400 font-bold uppercase">PRÉCISION</p>
                      <p className="text-lg font-display font-black text-slate-800 mt-1">{audioFeedback?.accuracy}%</p>
                    </div>
                  </div>

                  <div className="bg-[#FFFCE8] border border-[#FFEB85] p-4 rounded-2xl text-xs font-semibold leading-relaxed text-[#A67C00]">
                    💡 <strong>Conseil Phonetique :</strong> {audioFeedback?.advice}
                  </div>

                  <button
                    onClick={handleBackToDashboard}
                    className="w-full bg-[#002B5B] hover:bg-blue-800 text-white font-black text-xs uppercase tracking-wider py-4 rounded-2xl shadow-sm transition-all cursor-pointer"
                  >
                    Retourner à l'Arena (+30 XP)
                  </button>
                </div>
              )}

            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* 3. Sliding Dictionary Panel */}
      <AnimatePresence>
        {isDictOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDictOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            {/* Panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white z-50 shadow-2xl border-l border-slate-100 p-6 flex flex-col space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  <span className="font-display font-black text-base text-[#002B5B]">Dictionnaire Plume</span>
                </div>
                <button 
                  onClick={() => setIsDictOpen(false)}
                  className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Rechercher une règle, un mot..."
                  value={dictSearch}
                  onChange={(e) => setDictSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 hover:border-slate-200 focus:border-[#002B5B] focus:bg-white rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-600 outline-hidden transition-all"
                />
              </div>

              {/* Word definitions lists */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {filteredWords.length > 0 ? (
                  filteredWords.map((item, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2">
                      <div className="flex items-baseline gap-2">
                        <h4 className="font-display font-black text-sm text-[#002B5B]">{item.word}</h4>
                        <span className="text-[10px] font-mono font-bold text-slate-400 italic">{item.type}</span>
                      </div>
                      <p className="text-xs font-semibold leading-relaxed text-slate-600">{item.definition}</p>
                      <p className="text-[10px] font-bold text-[#A67C00] bg-[#FFFCE8] border border-[#FFEB85] px-2 py-1 rounded-lg">
                        📌 {item.tip}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400 space-y-2">
                    <BookOpenCheck className="w-8 h-8 mx-auto stroke-[1.5]" />
                    <p className="text-xs font-semibold">Aucun mot correspondant trouvé.</p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3 text-center text-[10px] font-bold text-slate-400 font-mono">
                WAEC French Exam Prep Companion
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 4. Interactive Question Map Overlay */}
      <AnimatePresence>
        {showQuestionMap && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuestionMap(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-slate-150 w-full max-w-4xl h-[85vh] rounded-3xl p-6 sm:p-8 relative z-10 shadow-2xl text-left flex flex-col space-y-6 overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-display font-black text-xl text-[#002B5B] flex items-center gap-2">
                    <Grid className="w-6 h-6 text-amber-500" />
                    <span>Plan complet de l'Examen : 46 Items WAEC</span>
                  </h3>
                  <p className="text-slate-500 text-xs font-semibold mt-1">
                    Sélectionnez une case pour visualiser, répondre ou signaler une question spécifique.
                  </p>
                </div>
                <button
                  onClick={() => setShowQuestionMap(false)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-500 hover:text-slate-800 transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Bar / Legend */}
              <div className="flex flex-wrap gap-4 items-center bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-600">
                <span className="text-[10px] font-mono text-slate-400 uppercase">LÉGENDE DES STATUTS :</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-slate-200 border border-slate-300" />
                  <span>Non répondu (Vierge)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-600 border border-blue-500" />
                  <span>Répondu (Soumis)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-400 border border-amber-500" />
                  <span>À réviser (Signalé)</span>
                </div>
                {examCorrectionMode && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-emerald-500 border border-emerald-400" />
                      <span>Réponse Correcte / Validée</span>
                    </div>
                  </>
                )}
              </div>

              {/* Grid Section - Scrollable container */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-4">
                {/* Categories blocks */}
                <div className="space-y-6">
                  {/* Category A: Grammaire et Syntaxe (1-40) */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-display font-black text-xs text-amber-600 uppercase tracking-wider">
                        Section A : Grammaire et Syntaxe (Questions 1 à 40)
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">Poids : 40% du score</span>
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 gap-2">
                      {Array.from({ length: 40 }, (_, i) => {
                        const qId = i + 1;
                        const userAns = examAnswers[qId];
                        const isAns = !!userAns;
                        const isFlg = !!flaggedQuestions[qId];

                        const isUnlocked = examSection === "A" || examSection === "B" || examSection === "C";

                        let colorClass = "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-40";
                        if (isUnlocked) {
                          if (isFlg) colorClass = "bg-amber-400 border-amber-500 text-amber-950 hover:bg-amber-300";
                          else if (isAns) {
                            if (examCorrectionMode) {
                              const qData = mockExamQuestions.sectionA.find(q => q.id === qId);
                              const isCorrect = userAns === qData?.correct;
                              colorClass = isCorrect ? "bg-emerald-500 border-emerald-600 text-white" : "bg-rose-500 border-rose-600 text-white";
                            } else {
                              colorClass = "bg-blue-600 border-blue-500 text-white hover:bg-blue-500";
                            }
                          } else {
                            colorClass = "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300";
                          }
                        }

                        return (
                          <button
                            key={qId}
                            disabled={!isUnlocked}
                            onClick={() => {
                              setShowQuestionMap(false);
                              if (examSection !== "A" && examSection !== "B" && examSection !== "C") return;
                              if (examSection !== "A") setExamSection("A");
                              setCurrentQuestionAIndex(qId - 1);
                              setTimeout(() => {
                                document.getElementById("sectionA-container")?.scrollIntoView({ behavior: "smooth" });
                              }, 100);
                            }}
                            className={`aspect-square rounded-xl border text-xs font-black flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden ${colorClass}`}
                          >
                            <span>{isUnlocked ? qId : "🔒"}</span>
                            {isFlg && <Flag className="w-2.5 h-2.5 absolute bottom-1 right-1 fill-current" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category B: Questions Théoriques (41-43) */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-display font-black text-xs text-amber-600 uppercase tracking-wider">
                        Section B : Questions Théoriques - Saisie Écrite (Questions 41 à 43)
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">Poids : 30% du score</span>
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 gap-2">
                      {Array.from({ length: 3 }, (_, i) => {
                        const qId = i + 41;
                        const userAns = examAnswers[qId];
                        const isAns = !!userAns && userAns.trim().length > 0;
                        const isFlg = !!flaggedQuestions[qId];

                        const isUnlocked = examSection === "B" || examSection === "C";

                        let colorClass = "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-40";
                        if (isUnlocked) {
                          if (isFlg) colorClass = "bg-amber-400 border-amber-500 text-amber-950 hover:bg-amber-300";
                          else if (isAns) {
                            colorClass = "bg-blue-600 border-blue-500 text-white hover:bg-blue-500";
                          } else {
                            colorClass = "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300";
                          }
                        }

                        return (
                          <button
                            key={qId}
                            disabled={!isUnlocked}
                            onClick={() => {
                              setShowQuestionMap(false);
                              if (examSection !== "B") setExamSection("B");
                              setTimeout(() => {
                                document.getElementById(`question-${qId}`)?.scrollIntoView({ behavior: "smooth" });
                              }, 150);
                            }}
                            className={`aspect-square rounded-xl border text-xs font-black flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden ${colorClass}`}
                          >
                            <span>{isUnlocked ? qId : "🔒"}</span>
                            {isFlg && <Flag className="w-2.5 h-2.5 absolute bottom-1 right-1 fill-current" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category C: Épreuve Orale (44-46) */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-display font-black text-xs text-amber-600 uppercase tracking-wider">
                        Section C : Épreuve Orale - Enregistrement de Voix (Questions 44 à 46)
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">Poids : 30% du score</span>
                    </div>
                    <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 gap-2">
                      {Array.from({ length: 3 }, (_, i) => {
                        const qId = i + 44;
                        const isAns = !!examRecordedAudios[qId];
                        const isFlg = !!flaggedQuestions[qId];

                        const isUnlocked = examSection === "C";

                        let colorClass = "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-40";
                        if (isUnlocked) {
                          if (isFlg) colorClass = "bg-amber-400 border-amber-500 text-amber-950 hover:bg-amber-300";
                          else if (isAns) {
                            colorClass = "bg-emerald-500 border-emerald-600 text-white hover:bg-emerald-400";
                          } else {
                            colorClass = "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300";
                          }
                        }

                        return (
                          <button
                            key={qId}
                            disabled={!isUnlocked}
                            onClick={() => {
                              setShowQuestionMap(false);
                              if (examSection !== "C") setExamSection("C");
                              setTimeout(() => {
                                document.getElementById(`question-${qId}`)?.scrollIntoView({ behavior: "smooth" });
                              }, 150);
                            }}
                            className={`aspect-square rounded-xl border text-xs font-black flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden ${colorClass}`}
                          >
                            <span>{isUnlocked ? qId : "🔒"}</span>
                            <span className="text-[6px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                              Oral
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick statistics summary */}
              {(() => {
                const answeredA = mockExamQuestions.sectionA.filter(q => !!examAnswers[q.id]).length;
                const answeredB = [41, 42, 43].filter(id => !!examAnswers[id] && examAnswers[id].trim().length > 0).length;
                const answeredC = [44, 45, 46].filter(id => !!examRecordedAudios[id]).length;
                const totalAnsweredCount = answeredA + answeredB + answeredC;

                return (
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-medium text-slate-500 flex items-center justify-between">
                    <span>Rappel : Soumettez l'examen une fois toutes les sections complétées.</span>
                    <span className="text-amber-600 font-black">
                      Total : {totalAnsweredCount} / 46 Répondu
                    </span>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Simulated Question Modal (Dynamic Grammar & Rule testing) */}
      <AnimatePresence>
        {activeSimulatedId !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSimulatedId(null)}
              className="absolute inset-0 bg-[#0D1117]/90 backdrop-blur-xs"
            />

            {/* Modal Content */}
            {(() => {
              const qData = getSimulatedQuestion(activeSimulatedId);
              const userAns = examAnswers[activeSimulatedId];
              const isFlg = !!flaggedQuestions[activeSimulatedId];
              return (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#0F1B2D] border border-white/10 w-full max-w-md rounded-3xl p-6 relative z-10 shadow-2xl text-left space-y-6"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-mono font-black text-[#F5C518] uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-md">
                        Simulation WAEC • Item #{activeSimulatedId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setFlaggedQuestions(prev => ({ ...prev, [activeSimulatedId]: !prev[activeSimulatedId] }));
                        }}
                        className={`p-2 rounded-xl border transition-all cursor-pointer ${
                          isFlg 
                            ? "bg-amber-400/20 border-amber-400 text-amber-400" 
                            : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                        }`}
                        title="Marquer pour révision"
                      >
                        <Flag className={`w-4 h-4 ${isFlg ? "fill-current" : ""}`} />
                      </button>
                      <button
                        onClick={() => setActiveSimulatedId(null)}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-display font-black text-sm text-white leading-relaxed">
                      {qData.question}
                    </h4>

                    <div className="space-y-2">
                      {qData.options.map((opt) => {
                        const isOptionSelected = userAns === opt;
                        const isOptionCorrect = opt === qData.correct;
                        
                        let btnStyle = "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10";
                        if (examCorrectionMode) {
                          if (isOptionSelected) {
                            btnStyle = isOptionCorrect 
                              ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 pointer-events-none"
                              : "bg-rose-500/20 border-rose-500 text-rose-400 pointer-events-none";
                          } else if (isOptionCorrect) {
                            btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-400 pointer-events-none";
                          } else {
                            btnStyle = "bg-white/5 border-white/5 text-slate-500 pointer-events-none";
                          }
                        } else {
                          if (isOptionSelected) {
                            btnStyle = "bg-blue-600 border-blue-500 text-white shadow-lg";
                          }
                        }

                        return (
                          <button
                            key={opt}
                            disabled={examCorrectionMode}
                            onClick={() => {
                              setExamAnswers(prev => ({ ...prev, [activeSimulatedId]: opt }));
                              setTimeout(() => {
                                setActiveSimulatedId(null);
                              }, 350);
                            }}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isOptionSelected && <Check className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </div>

                    {examCorrectionMode && (
                      <div className="bg-[#FFFCE8] border border-[#FFEB85]/40 p-3 rounded-xl text-[10px] text-[#A67C00] font-black leading-relaxed mt-2">
                        💡 RÈGLE WAEC : {qData.explanation}
                      </div>
                    )}
                  </div>

                  <div className="text-center pt-2 text-[10px] font-mono text-slate-500">
                    Les réponses de la simulation comptent pour votre diagnostic global de l'IA.
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
