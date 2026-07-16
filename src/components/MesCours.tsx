/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  BookOpen, Search, Star, Play, Calendar, Check, Award, Compass, 
  Trophy, Activity, ChevronRight, ArrowLeft, BookOpenCheck, 
  Sparkles, CheckCircle2, Bookmark, Flame, HelpCircle, GraduationCap,
  MessageSquare, User, Lock, Volume2, ArrowRight, Menu, RefreshCw
} from "lucide-react";

interface MesCoursProps {
  userXP: number;
  userStreak: number;
  setCurrentView: (view: string) => void;
  onGainXP: (amount: number) => void;
  isPremium?: boolean;
  userFullName?: string;
}

interface MiniQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface CourseArticle {
  id: string;
  category: "Verbes" | "Vocabulaire" | "Basiques" | "Adjectifs" | "Pronoms" | "Divers";
  title: string;
  description: string;
  readTime: string;
  xpReward: number;
  icon: React.ComponentType<any>;
  content: {
    introduction: string;
    sections: {
      title: string;
      paragraphs: string[];
      list?: string[];
      exampleTable?: { left: string; right: string }[];
    }[];
    waecTip: string;
    miniQuiz: MiniQuizQuestion[];
  };
}

const ARTICLES_DATA: CourseArticle[] = [
  {
    id: "etre-avoir",
    category: "Verbes",
    title: "The Difference Between Être and Avoir",
    description: "Master the two most essential pillars of the French language and how to use them correctly.",
    readTime: "6 min",
    xpReward: 15,
    icon: Flame,
    content: {
      introduction: "In French, 'être' (to be) and 'avoir' (to have) are far more than just basic verbs. They are the essential auxiliary blocks used to form almost all compound past tenses. Understanding when and how to use each is the absolute key to exam success.",
      sections: [
        {
          title: "1. Core Usage of the verb Être",
          paragraphs: [
            "The verb 'être' is used to describe states of being, identity, professions, nationality, and location (e.g., 'Je suis étudiant', 'Elle est canadienne').",
            "It also acts as the auxiliary verb for a select group of movement verbs (the 'House of Être' / DR & MRS VANDERTRAMPP) and all pronominal (reflexive) verbs."
          ],
          list: [
            "Example of motion: 'Il est allé à Paris.' (He went to Paris.)",
            "Example of reflexive: 'Nous nous sommes levés.' (We got up.)"
          ]
        },
        {
          title: "2. Core Usage of the verb Avoir",
          paragraphs: [
            "The verb 'avoir' is used to express possession, age (unlike English! e.g., 'J'ai 17 ans', literally 'I have 17 years'), and physical sensations.",
            "It is also the auxiliary verb for the vast majority of active verbs in the compound past tense (passé composé)."
          ],
          exampleTable: [
            { left: "Avoir faim / soif", right: "To be hungry / thirsty" },
            { left: "Avoir sommeil", right: "To be sleepy" },
            { left: "Avoir peur", right: "To be afraid" },
            { left: "Avoir raison / tort", right: "To be right / wrong" }
          ]
        }
      ],
      waecTip: "⚠️ Watch out for the age trap! Examiners love to test this in multiple-choice questions. We ALWAYS use Avoir for age (e.g., 'J'ai dix-sept ans' and NEVER 'Je suis dix-sept ans'). Also remember to agree past participles with 'être' auxiliaries (e.g., 'Elle est allée').",
      miniQuiz: [
        {
          question: "Complete the sentence: « Hier soir, ma sœur ___ partie en voyage d'études. »",
          options: ["est", "a", "as", "était"],
          correctAnswer: "est",
          explanation: "Correct! The verb 'partir' is a verb of movement that uses the auxiliary 'être'. Note also the feminine agreement 'partie'."
        },
        {
          question: "Translate correctly: « I am 16 years old. »",
          options: ["Je suis seize ans.", "J'ai seize ans.", "Je suis à seize ans.", "J'ai seize d'années."],
          correctAnswer: "J'ai seize ans.",
          explanation: "Great job! In French, you always use the verb 'avoir' to state a person's age."
        }
      ]
    }
  },
  {
    id: "er-ir-re-verbs",
    category: "Verbes",
    title: "-ER, -IR, and -RE Verbs",
    description: "A guide to regular verb conjugations and identifying the major verb groups in French.",
    readTime: "7 min",
    xpReward: 15,
    icon: Play,
    content: {
      introduction: "Regular French verbs are categorized into three main conjugation families based on their infinitives. Mastering these systematic patterns saves you valuable grammar marks in writing and oral tests.",
      sections: [
        {
          title: "1. The First Group: Verbs ending in -ER",
          paragraphs: [
            "This covers over 90% of all French verbs. To conjugate in the present tense, remove the '-er' and add: -e, -es, -e, -ons, -ez, -ent.",
            "Example with 'Parler' (to speak): Je parle, Tu parles, Il/Elle parle, Nous parlons, Vous parlez, Ils/Elles parlent."
          ],
          list: [
            "Spelling exception for -ger: keep the 'e' before 'o' to maintain soft pronunciation (e.g., 'Nous mangeons').",
            "Spelling exception for -cer: change 'c' to 'ç' before 'o' (e.g., 'Nous commençons')."
          ]
        },
        {
          title: "2. The Second Group: Verbs ending in -IR",
          paragraphs: [
            "To conjugate regular -IR verbs, remove '-ir' and add: -is, -is, -it, -issons, -issez, -issent.",
            "Example with 'Finir' (to finish): Je finis, Tu finis, Il/Elle finit, Nous finissons, Vous finissez, Ils/Elles finissent."
          ]
        }
      ],
      waecTip: "⚠️ A classic exam trap is the first person plural (Nous) for -cer and -ger verbs. Writing 'nous mangons' instead of 'nous mangeons' or 'nous commencons' instead of 'nous commençons' is heavily penalized.",
      miniQuiz: [
        {
          question: "What is the correct present tense spelling of 'voyager' with 'nous'?",
          options: ["nous voyagons", "nous voyageons", "nous voyagissons", "nous voyagez"],
          correctAnswer: "nous voyageons",
          explanation: "Perfect! The extra 'e' is essential to keep the 'g' soft."
        }
      ]
    }
  },
  {
    id: "passe-compose-imparfait",
    category: "Verbes",
    title: "Passé Composé vs. Imparfait",
    description: "Know exactly when to use each past tense to tell stories accurately in French.",
    readTime: "8 min",
    xpReward: 15,
    icon: Star,
    content: {
      introduction: "Choosing between the passé composé and the imparfait is one of the most tested areas in French exams. Each past tense plays a precise and distinct role in a narrative.",
      sections: [
        {
          title: "1. Passé Composé: Specific and Completed Actions",
          paragraphs: [
            "Use the passé composé for main events, specific actions that are completed, unique actions with a clear beginning and end, or actions that interrupt an ongoing state.",
            "Example: 'Hier, j'ai écrit une lettre.' (Yesterday, I wrote a letter - a completed specific event)."
          ]
        },
        {
          title: "2. Imparfait: Descriptions, Ongoing Actions, and Habits",
          paragraphs: [
            "Use the imparfait to describe background settings, weather, feelings, age, or to express repetitive, habitual, or ongoing actions in the past (what used to happen).",
            "Example: 'Quand j'étais jeune, je jouais au football.' (When I was young, I used to play soccer - a habit/description)."
          ]
        }
      ],
      waecTip: "🔑 Look out for keyword triggers! Adverbs like 'Soudain' (suddenly), 'Tout à coup', or 'Un jour' trigger the Passé Composé. Expressions like 'Chaque jour', 'D'habitude', or 'Pendant que' (while) require the Imparfait.",
      miniQuiz: [
        {
          question: "Complete: « Soudain, mon ami ___ (entrer) dans la classe. »",
          options: ["est entré", "entrait", "a entré", "entra"],
          correctAnswer: "est entré",
          explanation: "Exactly! 'Soudain' signals a sudden completed action in the past, demanding the Passé Composé."
        }
      ]
    }
  },
  {
    id: "days-of-week",
    category: "Vocabulaire",
    title: "Days of the Week",
    description: "Lundi to Dimanche: Pronunciation and cultural context for the days of the week.",
    readTime: "4 min",
    xpReward: 15,
    icon: Calendar,
    content: {
      introduction: "Knowing how to express time and schedule actions is a basic yet crucial capability tested in reading comprehension and correspondence. Let's master the days of the week.",
      sections: [
        {
          title: "1. The Days and Capitalization Rules",
          paragraphs: [
            "The seven days are: lundi (Monday), mardi (Tuesday), mercredi (Wednesday), jeudi (Thursday), vendredi (Friday), samedi (Saturday), dimanche (Sunday).",
            "Crucial Rule: Unlike English, French days of the week are NEVER capitalized unless they start a sentence."
          ]
        },
        {
          title: "2. Expressing Routine ('On Mondays')",
          paragraphs: [
            "To express a habitual action that happens every week on a certain day, place the singular masculine article 'le' before the day.",
            "Example: 'Le lundi, je fais du sport.' means 'On Mondays/Every Monday, I exercise.'"
          ]
        }
      ],
      waecTip: "⚠️ Avoid capital letters like 'Lundi' in mid-sentence. Writing capital letters for days is a common anglicism that will lose you spelling and grammar points in exams.",
      miniQuiz: [
        {
          question: "Translate correctly: « I play tennis on Saturdays (every Saturday). »",
          options: [
            "Je joue au tennis le samedi.",
            "Je joue au tennis chaque Samedi.",
            "Je joue au tennis tous les Samedis.",
            "Je joue au tennis en samedi."
          ],
          correctAnswer: "Je joue au tennis le samedi.",
          explanation: "Excellent! 'Le samedi' correctly expresses recurring action on Saturdays, and is properly written in lowercase."
        }
      ]
    }
  },
  {
    id: "numbers-1-20",
    category: "Vocabulaire",
    title: "Numbers 1-20",
    description: "Count like a native speaker with our guide to French numbers and their quirks.",
    readTime: "5 min",
    xpReward: 15,
    icon: Award,
    content: {
      introduction: "Spelling out French numbers accurately is essential for dictations, essays, and writing dates. Let's review the spellings from 1 to 20 and learn some major spelling rules.",
      sections: [
        {
          title: "1. Spelling Numbers 1 to 20",
          paragraphs: [
            "un (1), deux (2), trois (3), quatre (4), cinq (5), six (6), sept (7), huit (8), neuf (9), dix (10), onze (11), douze (12), treize (13), quatorze (14), quinze (15), seize (16), dix-sept (17), dix-huit (18), dix-neuf (19), vingt (20).",
            "Remember that hyphenation is mandatory for compound numbers under 100, such as dix-sept, dix-huit, and dix-neuf."
          ]
        },
        {
          title: "2. The Agreement of 'Vingt' (20) and 'Cent' (100)",
          paragraphs: [
            "The words 'vingt' and 'cent' take a plural 's' ONLY if they are multiplied by a number AND not followed by any other number.",
            "Example: 'quatre-vingts' (80) has an 's', but 'quatre-vingt-cinq' (85) does not because it is followed by 'cinq'."
          ]
        }
      ],
      waecTip: "⚠️ This is a favorite trick of exam boards! Keep in mind: 'quatre-vingts dollars' (with S) but 'quatre-vingt-trois dollars' (WITHOUT S). Similarly, 'trois cents' (with S) vs 'trois cent dix' (WITHOUT S).",
      miniQuiz: [
        {
          question: "Choose the correct spelling for the number 80:",
          options: ["quatre-vingt", "quatre-vingts", "quatre-vingt-s", "quatre vingt"],
          correctAnswer: "quatre-vingts",
          explanation: "Perfect! 'Vingt' is multiplied by four and followed by no other digit, so it takes a plural 's'."
        }
      ]
    }
  },
  {
    id: "sports-vocabulary",
    category: "Vocabulaire",
    title: "Sports Vocabulary",
    description: "Le football, le tennis, and more. Discuss your favorite activities in French.",
    readTime: "6 min",
    xpReward: 15,
    icon: Compass,
    content: {
      introduction: "Discussing sports and leisure activities is a classic subject in French compositions. Learn the necessary nouns and, more importantly, the grammatical constructions that accompany them.",
      sections: [
        {
          title: "1. Jouer à vs. Faire de",
          paragraphs: [
            "Use the verb 'jouer à' (+ contraction) for team sports and games played with a ball or piece (e.g., 'jouer au football', 'jouer au tennis', 'jouer aux échecs').",
            "Use the verb 'faire de' (+ contraction) for individual sports, physical activities, and musical instruments (e.g., 'faire du vélo', 'faire de la natation', 'faire de la gymnastique')."
          ]
        },
        {
          title: "2. Essential Sport Terms",
          paragraphs: [
            "Le football (soccer), le basket-ball (basketball), le tennis (tennis), l'athlétisme (athletics), la natation (swimming), la randonnée (hiking), le cyclisme (cycling).",
            "Remember that 'le football' is often shortened to 'le foot' in everyday conversations."
          ]
        }
      ],
      waecTip: "⚠️ Don't mix up the prepositions! Say 'Je fais DU football' or 'Je joue AU football', but never 'Je joue du football'. Correct preposition contracts like 'au' (à + le) and 'du' (de + le) are heavily graded.",
      miniQuiz: [
        {
          question: "Complete: « Chaque week-end, mon frère fait ___ vélo. »",
          options: ["du", "au", "le", "de la"],
          correctAnswer: "du",
          explanation: "Excellent! 'Faire' requires 'de' + article. 'Vélo' is masculine, so 'de' + 'le' contracts to 'du'."
        }
      ]
    }
  },
  {
    id: "pronunciation-english",
    category: "Basiques",
    title: "Pronunciation for English Speakers",
    description: "Overcoming common phonetic hurdles for native English speakers learning French.",
    readTime: "8 min",
    xpReward: 15,
    icon: Volume2,
    content: {
      introduction: "French pronunciation can seem intimidating due to silent letters and unfamiliar vowels. Understanding a few core physical rules helps you sound natural and communicate confidently in speaking exams.",
      sections: [
        {
          title: "1. The French 'R'",
          paragraphs: [
            "The French 'R' is not rolled like in Spanish, nor is it dental like in English. It is a uvular sound produced at the back of the throat, similar to gargling or clearing your throat softly.",
            "Practice saying words like 'paris', 'très', or 'rouge' by keeping your tongue flat behind your lower teeth."
          ]
        },
        {
          title: "2. Vowel Distinctions: 'U' vs. 'OU'",
          paragraphs: [
            "English speakers often struggle to differentiate 'u' and 'ou'.",
            "To make the 'ou' sound (as in 'vous'), shape your lips like saying 'too'.",
            "To make the 'u' sound (as in 'tu'), round your lips tightly like saying 'ee' but blowing air out. This is a crucial distinction (e.g., 'au dessous' [below] vs 'au dessus' [above])."
          ]
        }
      ],
      waecTip: "🔑 Pronunciation mistakes can change the entire meaning of a word! For instance, 'jus' (juice) vs 'joue' (cheek), or 'bu' (drank) vs 'boue' (mud). Pronounce vowels clearly to secure high marks in reading aloud and conversational tests.",
      miniQuiz: [
        {
          question: "Which of these words contains the tightly rounded 'U' sound instead of the 'OU' sound?",
          options: ["tu", "tout", "nous", "vous"],
          correctAnswer: "tu",
          explanation: "Spot on! 'Tu' is pronounced with the rounded French 'U' sound, while 'tout', 'nous', and 'vous' use the 'OU' sound."
        }
      ]
    }
  },
  {
    id: "articles-definis-indefinis",
    category: "Basiques",
    title: "Definite Articles",
    description: "Le, la, and les: understanding gender and number in French nouns.",
    readTime: "6 min",
    xpReward: 15,
    icon: Bookmark,
    content: {
      introduction: "Definite articles (le, la, l', les) and indefinite articles (un, une, des) form the basis of nominal expressions in French. A critical aspect is knowing when to use elision and liaison.",
      sections: [
        {
          title: "1. Elision before vowels and Silent H",
          paragraphs: [
            "Before singular nouns starting with a vowel or a silent 'H' (H muet), 'le' and 'la' contract into 'l''.",
            "Examples: 'l'école' (the school - feminine), 'l'homme' (the man - masculine, silent H)."
          ]
        },
        {
          title: "2. The Exception: Aspirated H",
          paragraphs: [
            "Nouns beginning with an aspirated 'H' (H aspiré) prevent both elision and liaison. The 'H' acts as a hard consonant barrier.",
            "Famous Examples: 'le haricot' (never l'haricot), 'les haricots' (pronounced 'lé hariko', never 'lé-z-hariko')."
          ]
        }
      ],
      waecTip: "⚠️ A highly recurrent exam trap! Questions often test the word 'haricots' or 'héros'. Always write 'le haricot' or 'les haricots' and never pronounce a linking 'Z' sound between 'les' and 'haricots'.",
      miniQuiz: [
        {
          question: "Which expression is grammatically correct?",
          options: ["l'haricot vert", "le haricot vert", "la haricot vert", "l'haricot-vert"],
          correctAnswer: "le haricot vert",
          explanation: "Perfect! The 'H' in 'haricot' is aspirated, which blocks elision."
        },
        {
          question: "How is « les haricots » correctly pronounced?",
          options: [
            "Without liaison (lé hariko)",
            "With 'Z' liaison (lé-z-ariko)",
            "By dropping the H (l'hariko)",
            "With a silent 's'"
          ],
          correctAnswer: "Without liaison (lé hariko)",
          explanation: "Correct! The aspirated 'H' blocks the linking 'Z' sound completely."
        }
      ]
    }
  },
  {
    id: "consonants-punctuation",
    category: "Basiques",
    title: "Consonants & Punctuation",
    description: "Rules for silent letters and French-specific punctuation marks like guillemets.",
    readTime: "5 min",
    xpReward: 15,
    icon: HelpCircle,
    content: {
      introduction: "French orthography utilizes special punctuation marks and silent final consonants. Learning these rules helps you write immaculate essays and read texts correctly.",
      sections: [
        {
          title: "1. Silent Final Consonants (The CAREFUL rule)",
          paragraphs: [
            "As a general rule, final consonants in French words are silent. However, consonants in the word **C-R-F-L** (Careful) are usually pronounced when they appear at the end of a word.",
            "Examples of pronounced finals: sac (C), fer (R), chef (F), fil (L).",
            "Examples of silent finals: chaud (D), lit (T), loup (P), vous (S)."
          ]
        },
        {
          title: "2. French Punctuation Marks",
          paragraphs: [
            "French uses 'les guillemets' (« ») instead of standard quotation marks (\"\") to indicate speech or quotes.",
            "Unlike English, double punctuation marks like colons (:), semicolons (;), exclamation points (!), and question marks (?) require a non-breaking space (espace insécable) before them in written French."
          ]
        }
      ],
      waecTip: "🔑 Always use proper French quotation marks « » instead of English quotation marks \"\" in your French essay writing. This attention to detail shows cultural mastery and wins you layout and formatting points.",
      miniQuiz: [
        {
          question: "Which of these final consonants is usually PRONOUNCED at the end of a French word?",
          options: ["R (as in Careful)", "T", "D", "S"],
          correctAnswer: "R (as in Careful)",
          explanation: "Great! Consonants C, R, F, and L (forming the mnemonic 'CaReFuL') are typically pronounced at the ends of words."
        }
      ]
    }
  },
  {
    id: "colors-plurals",
    category: "Adjectifs",
    title: "Colors and Plurals",
    description: "How to describe things vividly and match your adjectives with the subject.",
    readTime: "7 min",
    xpReward: 15,
    icon: Sparkles,
    content: {
      introduction: "Adjectives of color follow standard agreement rules, but they also have fascinating exceptions. Let's learn how to make color adjectives plural and gender-appropriate.",
      sections: [
        {
          title: "1. Regular Color Agreements",
          paragraphs: [
            "Standard colors act as regular adjectives and agree in gender and number with the noun they qualify.",
            "Examples: un livre vert ➔ des livres verts; une robe verte ➔ des robes vertes."
          ]
        },
        {
          title: "2. Invariable Color Adjectives (The Noun Rule)",
          paragraphs: [
            "When a color adjective is derived from a noun (like a fruit, flower, or mineral), it is completely **invariable** (it never changes spelling for gender or plural).",
            "Key exceptions: orange (orange), marron (chestnut/brown), cerise (cherry), chocolat (chocolate).",
            "Example: des chaussures marron (never marrons), des ballons orange (never oranges)."
          ]
        }
      ],
      waecTip: "⚠️ Orange and Marron are two of the most common exceptions tested. Always leave them singular and masculine, even when modifying plural feminine nouns (e.g., 'des chemises orange'). Note that 'rose' (pink) is an exception to the exception and DOES take an 's' in plural (e.g., 'des fleurs roses').",
      miniQuiz: [
        {
          question: "Select the correct grammatical form:",
          options: ["des tables marrons", "des tables marron", "des tables marronne", "des tables marronnes"],
          correctAnswer: "des tables marron",
          explanation: "Perfect! 'Marron' is a noun-derived color, making it completely invariable."
        }
      ]
    }
  },
  {
    id: "feminine-adjectives",
    category: "Adjectifs",
    title: "Feminine Adjectives",
    description: "The transformation rules for making any adjective feminine in French.",
    readTime: "7 min",
    xpReward: 15,
    icon: Sparkles,
    content: {
      introduction: "In French, all adjectives must match the gender of the noun they describe. Let's learn the systematic guidelines for changing a masculine adjective to its feminine counterpart.",
      sections: [
        {
          title: "1. The General Rule and Simple Terminations",
          paragraphs: [
            "In general, you make a masculine adjective feminine by adding a silent 'e' at the end (e.g., 'grand' becomes 'grande', 'intelligent' becomes 'intelligente').",
            "If the masculine adjective already ends with 'e', it remains unchanged in the feminine form (e.g., 'facile' stays 'facile', 'rapide' stays 'rapide')."
          ]
        },
        {
          title: "2. Common Irregular Suffix Changes",
          paragraphs: [
            "Many adjective endings change systematically in the feminine form:",
            "-eux becomes -euse (heureux ➔ heureuse)",
            "-er becomes -ère (cher ➔ chère)",
            "-if becomes -ive (actif ➔ active)",
            "-el becomes -elle (naturel ➔ naturelle)"
          ]
        }
      ],
      waecTip: "🔑 Pay close attention to special irregulars: 'beau' (beautiful), 'nouveau' (new), and 'vieux' (old). Before a masculine singular noun starting with a vowel or silent H, they change to 'bel', 'nouvel', and 'vieil' (e.g., 'un bel homme', 'un nouvel ami').",
      miniQuiz: [
        {
          question: "Complete the sentence: « Cet étudiant a acheté un ___ ordinateur. »",
          options: ["nouveau", "nouvel", "nouvelle", "nouveaux"],
          correctAnswer: "nouvel",
          explanation: "Awesome! 'Ordinateur' is masculine singular starting with a vowel, so 'nouveau' becomes 'nouvel'."
        }
      ]
    }
  },
  {
    id: "subject-object-pronouns",
    category: "Pronoms",
    title: "Subject & Object Pronouns",
    description: "From Je/Tu to me/le: navigate the world of French sentence structure with ease.",
    readTime: "8 min",
    xpReward: 15,
    icon: User,
    content: {
      introduction: "To prevent repetitive phrasing and write with natural flow, you must master direct object pronouns (COD) and indirect object pronouns (COI). This is a heavy favorite for WAEC examiners.",
      sections: [
        {
          title: "1. Knowing COD vs. COI",
          paragraphs: [
            "Direct Object Pronouns (COD) answer 'who?' or 'what?'. They are: me, te, le/la, nous, vous, les.",
            "Indirect Object Pronouns (COI) answer 'to whom?' or 'to what?'. They replace nouns preceded by 'à'. They are: me, te, lui (singular for both genders), nous, vous, leur (plural for both genders)."
          ],
          list: [
            "COD Example: 'Je vois Marie.' ➔ 'Je la vois.' (I see her.)",
            "COI Example: 'Je parle à Jean.' ➔ 'Je lui parle.' (I speak to him.)"
          ]
        },
        {
          title: "2. Placement in a Sentence",
          paragraphs: [
            "Generally, object pronouns are placed directly BEFORE the conjugated verb (e.g., 'Je lui donne le livre').",
            "In double-verb structures (like future proche: conjugated verb + infinitive), place the pronoun immediately before the infinitive (e.g., 'Je vais les acheter')."
          ]
        }
      ],
      waecTip: "⚠️ Remember past participle agreement with preceding COD! E.g., 'J'ai vu la robe' ➔ 'Je l'ai vue' (agree with feminine 'l''). There is NEVER agreement with COI pronouns like lui/leur (e.g., 'Je leur ai parlé' remains unchanged).",
      miniQuiz: [
        {
          question: "Select the correct sentence for: « J'ai écrit aux professeurs. »",
          options: [
            "Je les ai écrit.",
            "Je leur ai écrit.",
            "Je lui ai écrit.",
            "Je leur ai écrits."
          ],
          correctAnswer: "Je leur ai écrit.",
          explanation: "Correct! 'Écrire' takes an indirect object (écrire À quelqu'un). For plural COI, we use 'leur', and there is no past participle agreement."
        }
      ]
    }
  },
  {
    id: "accent-marks",
    category: "Divers",
    title: "Accent Marks Guide",
    description: "Never mix up your aigu, grave, and circonflexe ever again with our cheat sheet.",
    readTime: "5 min",
    xpReward: 15,
    icon: Bookmark,
    content: {
      introduction: "In French, accents are not merely cosmetic. They dictate vowel pronunciation and serve vital grammatical roles to distinguish words with identical sounds but different meanings.",
      sections: [
        {
          title: "1. Accents as Grammatical Distinguishers (Homophones)",
          paragraphs: [
            "Several accents exist purely to help readers distinguish between words in writing:",
            "- 'a' (has - verb avoir) vs 'à' (at / to - preposition)",
            "- 'ou' (or - conjunction) vs 'où' (where - place/time)"
          ]
        },
        {
          title: "2. Phonetic Accents (Aigu, Grave, Circonflexe)",
          paragraphs: [
            "Accent Aigu (é) only goes on 'e' and makes a closed sound, like 'ay' in 'play' (e.g., café, école).",
            "Accent Grave (è) makes an open 'eh' sound like in 'bed' (e.g., père, très).",
            "Accent Circonflexe (â, ê, î, ô, û) historically denotes a dropped silent letter, usually an 's' from old French (e.g., hospital ➔ hôpital, forest ➔ forêt)."
          ]
        }
      ],
      waecTip: "⚠️ Forgetting to write 'à' (with accent) for 'at/to' and writing 'a' instead is a common mistake heavily penalized by examiners. Always verify your accent marks on prepositions!",
      miniQuiz: [
        {
          question: "Identify the correctly accented sentence:",
          options: [
            "Où veux-tu aller, à Lagos ou à Cotonou ?",
            "Ou veux-tu aller, a Lagos ou a Cotonou ?",
            "Où veux-tu aller, a Lagos ou a Cotonou ?",
            "Ou veux-tu aller, à Lagos ou à Cotonou ?"
          ],
          correctAnswer: "Où veux-tu aller, à Lagos ou à Cotonou ?",
          explanation: "Perfect! 'Où' indicates place, 'à' is the preposition, and 'ou' indicates alternatives."
        }
      ]
    }
  },
  {
    id: "how-to-greet",
    category: "Divers",
    title: "How to Greet People",
    description: "Formal and informal greetings to start any conversation on the right foot.",
    readTime: "4 min",
    xpReward: 15,
    icon: MessageSquare,
    content: {
      introduction: "Greetings are the gateway to successful oral communication and dialogue compositions. Learn how to address people formally and informally depending on the social context.",
      sections: [
        {
          title: "1. Formal Greetings: The Rule of Respect",
          paragraphs: [
            "Always use 'Bonjour' (Good morning/afternoon) or 'Bonsoir' (Good evening) in professional or formal settings, accompanied by 'Monsieur' (Sir) or 'Madame' (Ma'am).",
            "Ask 'Comment allez-vous ?' (How are you?) and use the pronoun 'vous' to show respect to elders, teachers, or strangers."
          ]
        },
        {
          title: "2. Informal Greetings: Among Friends",
          paragraphs: [
            "Use 'Salut !' (Hi/Bye) or 'Coucou !' (Hey!) with friends, peers, and family members.",
            "Ask 'Ça va ?' or 'Comment ça va ?' (How's it going?) and use the pronoun 'tu' (informal you)."
          ]
        }
      ],
      waecTip: "⚠️ In written dialogues or letter compositions, never address an elder, examiner, or authority figure with 'Salut' or 'tu'. Keeping the appropriate register of politeness (vouvoiement) is vital for your grade.",
      miniQuiz: [
        {
          question: "How should you formally greet a female interviewer at an oral exam?",
          options: ["Salut Madame !", "Bonjour Madame.", "Coucou Madame !", "Ça va Madame ?"],
          correctAnswer: "Bonjour Madame.",
          explanation: "Correct! 'Bonjour Madame' is the polite, respectful, and standard formal greeting."
        }
      ]
    }
  },
  {
    id: "travel-catacombes",
    category: "Divers",
    title: "Travel: Les Catacombes",
    description: "Explore the history and specialized vocabulary of Paris' most famous underground site.",
    readTime: "10 min",
    xpReward: 25,
    icon: Compass,
    content: {
      introduction: "The Catacombs of Paris form a fascinating underground ossuary holding the remains of over six million people. Learning about this historic monument enriches your cultural awareness and equips you with vocabulary for tourism and history essays.",
      sections: [
        {
          title: "1. What are the Catacombs?",
          paragraphs: [
            "In the late 18th century, Paris' cemeteries became severely overcrowded, causing public health hazards. The city resolved to transfer remains to former underground stone quarries.",
            "The ossuary was opened to the public in 1809 and today attracts visitors from all over the world."
          ]
        },
        {
          title: "2. Specialized Travel & Historical Vocabulary",
          paragraphs: [
            "un monument (a monument), un ossuaire (an ossuary), les ossements (remains/bones), un guide (a guide), les galeries souterraines (underground galleries), un voyageur (a traveler), explorer (to explore)."
          ]
        }
      ],
      waecTip: "🔑 High-scoring compositions often refer to Parisian historical landmarks. Mentioning 'Les Catacombes de Paris' or 'La Tour Eiffel' with accurate historical context demonstrates advanced vocabulary and authentic cultural appreciation.",
      miniQuiz: [
        {
          question: "What is the French word for human skeletal remains / bones?",
          options: ["les ossements", "les monuments", "les carrières", "les pierres"],
          correctAnswer: "les ossements",
          explanation: "Bravo! 'Les ossements' is the specific French term for skeletal remains."
        }
      ]
    }
  }
];

export default function MesCours({ 
  userXP, 
  userStreak, 
  setCurrentView, 
  onGainXP,
  isPremium = false,
  userFullName = "Johnfavour"
}: MesCoursProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [activeArticle, setActiveArticle] = useState<CourseArticle | null>(null);
  
  // Quiz progress state for active reading article
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [xpEarnedThisSession, setXpEarnedThisSession] = useState(0);

  const speakWord = (word: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        const u = new SpeechSynthesisUtterance(word);
        u.lang = "fr-FR";
        u.rate = 0.85; // Slightly slower for clear teaching
        window.speechSynthesis.speak(u);
      } catch (err) {
        console.warn("Speech Synthesis failed:", err);
      }
    }
  };

  // Available categories matching mockup
  const categories = ["Tous", "Verbes", "Vocabulaire", "Basiques", "Adjectifs", "Pronoms", "Divers"];

  // Filtered articles based on search and category
  const filteredArticles = ARTICLES_DATA.filter(art => {
    const matchesCategory = selectedCategory === "Tous" || art.category === selectedCategory;
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenArticle = (article: CourseArticle) => {
    setActiveArticle(article);
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setQuizScore(0);
    setQuizFinished(false);
    setXpEarnedThisSession(0);
  };

  const handleCloseArticle = () => {
    setActiveArticle(null);
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption || !activeArticle) return;
    
    const currentQ = activeArticle.content.miniQuiz[quizIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    
    setIsAnswered(true);
  };

  const handleNextQuizQuestion = () => {
    if (!activeArticle) return;
    
    setSelectedOption(null);
    setIsAnswered(false);
    
    if (quizIndex < activeArticle.content.miniQuiz.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      // Quiz finished! Calculate XP award
      const successRate = quizScore / activeArticle.content.miniQuiz.length;
      let finalXP = 0;
      if (successRate === 1) {
        finalXP = activeArticle.xpReward; // Max XP
      } else if (successRate >= 0.5) {
        finalXP = Math.round(activeArticle.xpReward * 0.7);
      } else {
        finalXP = 5; // Minimal encouragement XP
      }
      
      onGainXP(finalXP);
      setXpEarnedThisSession(finalXP);
      setQuizFinished(true);
    }
  };

  // Sidebar Items identical to ParcoursView to ensure unified layout
  const sidebarItems = [
    { id: "dashboard", label: "Tableau de Bord", icon: Compass },
    { id: "parcours", label: "Mon Parcours", icon: Award },
    { id: "courses", label: "Mes Cours", icon: BookOpen, active: true },
    { id: "blitz", label: "Le Blitz", icon: Play },
    { id: "leaderboard", label: "Classement", icon: Trophy },
    { id: "progression", label: "Ma Progression", icon: Activity },
    { id: "profile", label: "Mon Profil", icon: User }
  ];

  return (
    <div className="w-full min-h-screen bg-[#fcfcfd] text-[#002B5B] flex font-sans antialiased">
      
      {/* Mobile Sidebar Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-35 lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR - Identical visual appearance to ParcoursView */}
      <aside className={`flex flex-col h-screen fixed left-0 top-0 p-6 bg-white border-r border-slate-100 w-64 z-40 transition-all duration-300 ${
        isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 pointer-events-none"
      }`}>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView("landing")}>
            <div className="bg-[#002B5B] p-2 rounded-xl text-white shadow-md">
              <GraduationCap className="w-5.5 h-5.5" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-display font-bold text-lg tracking-tight text-[#002B5B] block leading-none">
                La Plume
              </span>
              <span className="text-[9px] uppercase tracking-widest font-mono text-amber-500 font-bold block mt-0.5">
                French Prep
              </span>
            </div>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Sidebar Nav links */}
        <div className="flex-grow">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4 font-mono">
            Menu principal
          </span>
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  id={`cours-sidebar-item-${item.id}`}
                  onClick={() => {
                    if (item.id === "dashboard") setCurrentView("dashboard");
                    else if (item.id === "parcours") setCurrentView("parcours");
                    else if (item.id === "blitz") setCurrentView("blitz");
                    else if (item.id === "leaderboard") setCurrentView("ranking");
                    else if (item.id === "profile" || item.id === "progression") setCurrentView("profile");
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
                  {item.id === "courses" && (
                    <span className="bg-amber-500/15 text-amber-600 text-[8px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-sm border border-amber-500/25">
                      BIBLIO
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar footer profile */}
        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 px-2">
            <div 
              className="w-10 h-10 rounded-full bg-[#002B5B] flex items-center justify-center text-white text-xs font-black cursor-pointer border border-slate-100"
              onClick={() => setCurrentView("profile")}
            >
              JI
            </div>
            <div>
              <p className="font-sans font-bold text-xs text-slate-800 truncate max-w-[130px]">{userFullName}</p>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse" />
                {isPremium ? "Premium Actif" : "Essai Gratuit"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN FRAME - Compensate for sidebar on desktop */}
      <div className={`flex-grow flex flex-col min-h-screen transition-all duration-300 ${
        isSidebarOpen ? "lg:pl-64" : "lg:pl-0"
      }`}>
        
        {/* TOP STATUS BAR - Matches dashboard/parcours style */}
        <div className="sticky top-0 z-30 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
              title="Menu principal"
            >
              <Menu className="w-5 h-5 text-slate-500" />
            </button>
            <div className="flex items-center gap-1 ml-1">
              <span className="material-symbols-outlined text-amber-500 animate-pulse text-lg">auto_stories</span>
              <span className="font-display font-extrabold text-sm md:text-base text-[#002B5B]">Mes Cours d'Excellence</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick XP counter */}
            <div className="flex items-center gap-1.5 bg-[#FFFCE8] border border-[#FFEB85] text-[#A67C00] px-3 py-1 rounded-full text-xs font-extrabold shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-[#FFD214] text-[#FFD214]" />
              <span>{userXP} XP</span>
            </div>
            {/* Streak Counter */}
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-full text-xs font-extrabold shadow-2xs">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{userStreak} jours</span>
            </div>
          </div>
        </div>

        {/* HUB VIEW OR ARTICLE WRITER PANEL */}
        {!activeArticle ? (
          <div className="flex-grow">
            {/* Header Banner - Tricolor inspired subtle design */}
            <header className="relative pt-12 pb-14 px-6 md:px-12 bg-linear-to-r from-blue-50/50 via-white to-amber-50/30 border-b border-slate-100">
              <div className="max-w-5xl mx-auto relative z-10">
                
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-1.5 mb-4 text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
                  <button onClick={() => setCurrentView("dashboard")} className="hover:text-[#002B5B] transition-colors">Accueil</button>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-[#002B5B]">Mes Cours</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-[#002B5B] underline decoration-amber-400 decoration-2">Bibliothèque de Grammaire</span>
                </nav>

                <div className="max-w-3xl">
                  <h1 className="font-display font-black text-2xl md:text-4xl text-[#002B5B] mb-3 leading-tight tracking-tight">
                    Featured Grammar Articles
                  </h1>
                  <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed max-w-2xl">
                    Learn French grammar rules and exceptions from our comprehensive guides designed for exam excellence.
                  </p>
                </div>
              </div>

              {/* Graphical background elements */}
              <div className="absolute right-10 bottom-4 opacity-5 hidden md:block">
                <BookOpenCheck className="w-48 h-48 text-[#002B5B]" />
              </div>
            </header>

            {/* Smart Search & Filter Segment */}
            <div className="sticky top-14 bg-[#fcfcfd]/95 backdrop-blur-md z-20 py-4 border-b border-slate-100 px-6 md:px-12">
              <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                
                {/* Category Horizontal scroll list */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none max-w-full">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-[#002B5B] text-white shadow-sm"
                          : "bg-white border border-slate-100 text-slate-500 hover:border-slate-200 hover:text-slate-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Instant search input */}
                <div className="relative w-full md:w-72 shrink-0">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Filtrer par mot-clé..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200/80 hover:border-slate-300 focus:border-brand-blue rounded-xl py-2 pl-9 pr-4 text-xs font-medium text-slate-600 outline-hidden transition-all shadow-3xs"
                  />
                </div>

              </div>
            </div>

            {/* Course Articles Grid */}
            <section className="max-w-5xl mx-auto px-6 md:px-12 py-10">
              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article, idx) => {
                    const CardIcon = article.icon;
                    const categoryLabels: Record<string, string> = {
                      "Tous": "ALL",
                      "Verbes": "VERBS",
                      "Vocabulaire": "VOCABULARY",
                      "Basiques": "BASICS",
                      "Adjectifs": "ADJECTIVES",
                      "Pronoms": "PRONOUNS",
                      "Divers": "MISCELLANEOUS"
                    };
                    const categoryEng = categoryLabels[article.category] || "GENERAL";

                    return (
                      <div 
                        key={article.id}
                        onClick={() => handleOpenArticle(article)}
                        className="group bg-white rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,43,91,0.05)] border border-transparent hover:border-[#002B5B]/30 hover:shadow-md transition-all duration-300 flex flex-col h-full cursor-pointer relative"
                        style={{ contentVisibility: "auto" }}
                      >
                        {/* Upper icon left-aligned */}
                        <div className="w-12 h-12 mb-4 flex items-center justify-center bg-slate-50 rounded-lg text-[#002B5B] group-hover:scale-105 transition-transform">
                          <CardIcon className="w-6 h-6 stroke-[2]" />
                        </div>

                        {/* Category label */}
                        <span className="text-[10px] tracking-widest font-extrabold text-[#002B5B] uppercase mb-3 block font-mono">
                          {categoryEng}
                        </span>

                        {/* Title & Desc */}
                        <h3 className="font-display font-black text-sm md:text-base text-[#002B5B] mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                          {article.title}
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-grow line-clamp-2">
                          {article.description}
                        </p>

                        {/* Bottom action link */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 font-mono">
                            <Volume2 className="w-3.5 h-3.5 text-slate-300" />
                            {article.readTime} • +{article.xpReward} XP
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-black text-blue-600 group-hover:translate-x-1 transition-transform">
                            Read Article <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center max-w-md mx-auto my-10 shadow-3xs">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-4">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-slate-800 mb-1">Aucun cours trouvé</h3>
                  <p className="text-slate-400 text-xs leading-relaxed mb-4">
                    Aucun article ne correspond à votre filtre "{searchQuery}". Essayez un mot-clé plus générique ou effacez la barre de recherche.
                  </p>
                  <button 
                    onClick={() => { setSearchQuery(""); setSelectedCategory("Tous"); }}
                    className="bg-slate-50 border border-slate-200 text-[#002B5B] text-xs font-bold px-4 py-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Effacer les filtres
                  </button>
                </div>
              )}
            </section>
          </div>
        ) : (
          /* SINGLE DETAILED ARTICLE VIEW WITH MIN-QUIZ */
          <div className="flex-grow bg-white py-8 px-6 md:px-12">
            <div className="max-w-3xl mx-auto">
              
              {/* Top back actions */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={handleCloseArticle}
                  className="inline-flex items-center gap-1.5 text-[#002B5B] hover:text-blue-600 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[3.5]" />
                  Retour aux cours
                </button>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-[#002B5B] font-mono text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-blue-100">
                    {activeArticle.category}
                  </span>
                  <span className="text-slate-400 text-xs font-bold flex items-center gap-1 font-mono">
                    <Volume2 className="w-4 h-4" />
                    Lecture {activeArticle.readTime}
                  </span>
                </div>
              </div>

              {/* Check if article has bespoke premium layout, otherwise render default structure */}
              {activeArticle.id === "etre-avoir" ? (
                <div className="space-y-10 text-slate-800 mb-12">
                  {/* Breadcrumbs */}
                  <div className="text-slate-400 text-[10px] md:text-xs font-semibold flex items-center gap-1.5 font-sans">
                    <span className="hover:text-[#002B5B] cursor-pointer" onClick={handleCloseArticle}>Accueil</span>
                    <span className="text-slate-300 font-normal">&gt;</span>
                    <span className="hover:text-[#002B5B] cursor-pointer" onClick={handleCloseArticle}>Mes Cours</span>
                    <span className="text-slate-300 font-normal">&gt;</span>
                    <span className="hover:text-[#002B5B] cursor-pointer" onClick={handleCloseArticle}>Bibliothèque de Grammaire</span>
                    <span className="text-slate-300 font-normal">&gt;</span>
                    <span className="text-[#002B5B] font-bold">Être vs Avoir</span>
                  </div>

                  {/* Article Title Header */}
                  <div>
                    <span className="bg-blue-500/15 text-blue-700 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border border-blue-200/50 mb-3 inline-block font-mono">
                      ALLO Verbes
                    </span>
                    <h1 className="font-display font-black text-2xl md:text-4xl text-[#002B5B] leading-tight tracking-tight mb-3">
                      La Différence Entre Être et Avoir
                    </h1>
                    <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                      Comprendre les deux piliers de la langue française : comment les utiliser comme verbes principaux et comme auxiliaires indispensables.
                    </p>
                  </div>
                  
                  <div className="w-full h-1 bg-linear-to-r from-blue-500 via-amber-400 to-rose-400 rounded-full" />

                  {/* En Bref Box */}
                  <div className="bg-[#002B5B] text-white rounded-2xl p-6 relative overflow-hidden shadow-md">
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                      <BookOpenCheck className="w-40 h-40 text-white" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-amber-400 text-lg">lightbulb</span>
                        <span className="font-mono text-xs font-black uppercase tracking-widest text-amber-400">En bref</span>
                      </div>
                      <p className="text-xs md:text-sm leading-relaxed font-semibold">
                        <strong>Être</strong> (To Be) et <strong>Avoir</strong> (To Have) sont les deux verbes les plus utilisés en français. Ils fonctionnent à la fois comme des verbes d'action/état et comme des <em>auxiliaires</em> pour former les temps composés.
                      </p>
                    </div>
                  </div>

                  {/* Questions Clés & Classroom Picture Block */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-3xs flex flex-col justify-center">
                      <h3 className="font-display font-black text-sm text-[#002B5B] mb-4 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-blue-600 text-base">forum</span>
                        <span>Questions clés</span>
                      </h3>
                      <ul className="space-y-3.5 text-xs text-slate-600 font-bold">
                        <li className="flex items-start gap-3">
                          <span className="w-5 h-5 bg-blue-50 text-blue-600 font-bold rounded-sm flex items-center justify-center shrink-0 text-[10px] border border-blue-100 font-mono">?</span>
                          <span>Quand utiliser "Avoir" pour exprimer un état physique ?</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-5 h-5 bg-blue-50 text-blue-600 font-bold rounded-sm flex items-center justify-center shrink-0 text-[10px] border border-blue-100 font-mono">?</span>
                          <span>Quels sont les verbes qui utilisent l'auxiliaire "Être" ?</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="w-5 h-5 bg-blue-50 text-blue-600 font-bold rounded-sm flex items-center justify-center shrink-0 text-[10px] border border-blue-100 font-mono">?</span>
                          <span>Comment accorder le participe passé ?</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="rounded-2xl relative overflow-hidden flex flex-col justify-end min-h-[180px] shadow-3xs group">
                      <img 
                        src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600"
                        alt="Classroom"
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
                      <div className="relative z-10 p-6 text-white">
                        <p className="font-serif italic text-xs md:text-sm text-slate-100 mb-2 leading-relaxed">
                          "La grammaire est le socle de l'excellence."
                        </p>
                        <span className="text-[8px] uppercase font-mono tracking-widest text-amber-400 font-extrabold block">
                          L'Académie Élite
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 1: Être et Avoir comme Verbes Principaux */}
                  <div className="space-y-6 pt-2">
                    <div className="flex items-center gap-2 border-l-4 border-[#002B5B] pl-3">
                      <h2 className="font-display font-black text-lg md:text-xl text-[#002B5B] tracking-tight">
                        1. Être et Avoir comme Verbes Principaux
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-3">
                        <h3 className="font-display font-bold text-sm text-[#002B5B] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span>Le verbe Être (Identity/State)</span>
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Utilisé pour l'identité, la nationalité, la profession, le lieu ou une caractéristique.
                        </p>
                        <div className="bg-white border border-slate-200/50 rounded-xl p-3.5 text-xs font-bold text-slate-700 italic shadow-3xs">
                          "Je suis étudiant à Abidjan."
                          <span className="block text-[10px] text-slate-400 font-normal not-italic mt-1">I am a student in Abidjan.</span>
                        </div>
                      </div>

                      <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 space-y-3">
                        <h3 className="font-display font-bold text-sm text-[#002B5B] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Le verbe Avoir (Possession)</span>
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Utilisé pour exprimer ce que l'on possède ou ce qui nous appartient.
                        </p>
                        <div className="bg-white border border-slate-200/50 rounded-xl p-3.5 text-xs font-bold text-slate-700 italic shadow-3xs">
                          "J'ai un nouvel ordinateur."
                          <span className="block text-[10px] text-slate-400 font-normal not-italic mt-1">I have a new computer.</span>
                        </div>
                      </div>
                    </div>

                    {/* Warning Box */}
                    <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-5 space-y-4">
                      <div className="flex items-center gap-2 text-rose-700">
                        <span className="material-symbols-outlined text-lg">warning</span>
                        <h4 className="font-display font-black text-xs uppercase tracking-wider font-mono">
                          Attention ! (Be Careful!)
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        Les anglophones font souvent l'erreur d'utiliser 'Être' là où le français impose <strong>Avoir</strong>. Voici les expressions les plus courantes :
                      </p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { title: "ÂGE", expression: "J'ai 17 ans", note: "vs I am 17" },
                          { title: "BESOINS", expression: "J'ai faim / soif", note: "vs I am hungry / thirsty" },
                          { title: "SENSATION", expression: "J'ai chaud / froid", note: "vs I am hot / cold" },
                          { title: "CHANCE", expression: "J'ai de la chance", note: "vs I am lucky" },
                          { title: "ÉMOTION", expression: "J'ai peur", note: "vs I am afraid" },
                          { title: "RAISON", expression: "J'ai raison", note: "vs I am right" }
                        ].map((item, idx) => (
                          <div key={idx} className="bg-white border border-slate-100 rounded-xl p-3 text-center space-y-1 shadow-3xs">
                            <span className="text-[8px] font-bold text-rose-500 tracking-widest uppercase block font-mono">{item.title}</span>
                            <span className="text-xs font-bold text-slate-800 block">{item.expression}</span>
                            <span className="text-[9px] text-slate-400 block font-medium italic">{item.note}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Être et Avoir comme Auxiliaires */}
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-2 border-l-4 border-[#002B5B] pl-3">
                      <h2 className="font-display font-black text-lg md:text-xl text-[#002B5B] tracking-tight">
                        2. Être et Avoir comme Auxiliaires
                      </h2>
                    </div>
                    <p className="text-xs md:text-sm leading-relaxed text-slate-600 font-medium">
                      Pour former le <strong className="text-blue-600">Passé Composé</strong>, vous devez choisir entre l'auxiliaire Être ou Avoir + le participe passé. 95% des verbes utilisent Avoir.
                    </p>

                    <div className="border border-slate-200/60 rounded-2xl overflow-hidden shadow-3xs bg-white">
                      <div className="bg-slate-50/80 border-b border-slate-200/60 px-5 py-4 flex items-center justify-between">
                        <h3 className="font-display font-bold text-xs text-[#002B5B] uppercase tracking-wider font-mono">
                          Le Club des 17 : DR & MRS VANDERTRAMPP
                        </h3>
                        <span className="bg-blue-600 text-white text-[8px] font-black tracking-widest uppercase font-mono px-2 py-0.5 rounded-md">
                          Mnémonique
                        </span>
                      </div>
                      <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                          { verb: "Devenir", eng: "to become" },
                          { verb: "Revenir", eng: "to return" },
                          { verb: "Monter", eng: "to go up" },
                          { verb: "Rester", eng: "to stay" },
                          { verb: "Sortir", eng: "to go out" },
                          { verb: "Venir", eng: "to come" },
                          { verb: "Arriver", eng: "to arrive" },
                          { verb: "Naître", eng: "to be born" }
                        ].map((item, idx) => (
                          <div key={idx} className="border border-slate-100 rounded-xl p-3 space-y-0.5 text-center bg-slate-50/40">
                            <span className="text-xs font-bold text-[#002B5B] block">{item.verb}</span>
                            <span className="text-[9px] text-slate-400 block font-medium italic">{item.eng}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-slate-50/50 border-t border-slate-200/60 p-4 text-[10px] md:text-xs text-slate-600 font-bold leading-relaxed">
                        💡 <strong>Règle d'or :</strong> Tous les verbes pronominaux (se laver, se promener, etc.) utilisent également l'auxiliaire <strong>Être</strong>.
                      </div>
                    </div>
                  </div>

                  {/* Section 3: L'Accord du Participe Passé */}
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-2 border-l-4 border-[#002B5B] pl-3">
                      <h2 className="font-display font-black text-lg md:text-xl text-[#002B5B] tracking-tight">
                        3. L'Accord du Participe Passé
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-3xs">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Activity className="w-4 h-4" />
                          </div>
                          <h3 className="font-display font-bold text-xs text-[#002B5B] uppercase tracking-wider font-mono">Avec Être</h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Le participe passé s'accorde <strong className="text-blue-600">toujours</strong> en genre et en nombre avec le sujet.
                        </p>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs font-bold text-blue-700 italic">
                          "Elle est allée au marché."
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-3xs">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                            <Lock className="w-4 h-4" />
                          </div>
                          <h3 className="font-display font-bold text-xs text-[#002B5B] uppercase tracking-wider font-mono">Avec Avoir</h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Le participe passé ne s'accorde <strong className="text-amber-600">jamais</strong> avec le sujet (mais peut s'accorder avec le COD s'il est placé avant).
                        </p>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs font-bold text-amber-700 italic">
                          "Elle a mangé une pomme."
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom Styled WAEC Tip inside Bespoke Layout */}
                  <div className="bg-[#FFFCE8] border-2 border-[#FFD214] rounded-2xl p-5 md:p-6 shadow-3xs">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 fill-amber-500 text-amber-500" />
                      <h4 className="font-display font-black text-xs uppercase tracking-widest text-[#A67C00] font-mono">
                        Astuce de l'Examen WAEC d'Élite
                      </h4>
                    </div>
                    <p className="text-xs md:text-sm leading-relaxed text-[#5F4500] font-bold">
                      {activeArticle.content.waecTip}
                    </p>
                  </div>

                  {/* Continuer mon apprentissage */}
                  <div className="pt-8 border-t border-slate-100 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Continuer mon apprentissage
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        onClick={() => {
                          const nextArt = ARTICLES_DATA.find(a => a.id === "er-ir-re-verbs");
                          if (nextArt) handleOpenArticle(nextArt);
                        }}
                        className="w-full text-left p-4 rounded-xl border border-slate-200/60 hover:border-blue-500/40 hover:shadow-2xs transition-all flex items-center justify-between group bg-slate-50/20 cursor-pointer"
                      >
                        <div>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Leçon suivante</span>
                          <span className="text-xs font-extrabold text-[#002B5B] group-hover:text-blue-600 transition-colors">Les verbes en -ER, -IR et -RE</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button 
                        onClick={() => {
                          const assocArt = ARTICLES_DATA.find(a => a.id === "passe-compose-imparfait");
                          if (assocArt) handleOpenArticle(assocArt);
                        }}
                        className="w-full text-left p-4 rounded-xl border border-slate-200/60 hover:border-blue-500/40 hover:shadow-2xs transition-all flex items-center justify-between group bg-slate-50/20 cursor-pointer"
                      >
                        <div>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Thème associé</span>
                          <span className="text-xs font-extrabold text-[#002B5B] group-hover:text-blue-600 transition-colors">Passé Composé vs Imparfait</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : activeArticle.id === "days-of-week" ? (
                <div className="space-y-10 text-slate-800 mb-12">
                  {/* Article Title Header */}
                  <div>
                    <span className="bg-blue-500/15 text-blue-700 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border border-blue-200/50 mb-3 inline-block font-mono">
                      ALLO VOCABULAIRE
                    </span>
                    <h1 className="font-display font-black text-2xl md:text-4xl text-[#002B5B] leading-tight tracking-tight mb-3">
                      Days of the Week
                    </h1>
                    <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                      Lundi to Dimanche: Pronunciation and grammatical rules for the days of the week.
                    </p>
                  </div>
                  
                  <div className="w-full h-1 bg-linear-to-r from-blue-500 via-amber-400 to-rose-400 rounded-full" />

                  {/* En Bref Box */}
                  <div className="bg-[#002B5B] text-white rounded-2xl p-6 relative overflow-hidden shadow-md">
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                      <Calendar className="w-40 h-40 text-white" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-amber-400 text-lg">lightbulb</span>
                          <span className="font-mono text-xs font-black uppercase tracking-widest text-amber-400">En bref</span>
                        </div>
                        <p className="text-xs md:text-sm leading-relaxed font-semibold max-w-xl">
                          Savoir situer les actions dans le temps est un point fondamental testé chaque année à la section de compréhension écrite du WAEC.
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 shrink-0 border border-white/10 space-y-2 text-xs font-bold text-slate-100 w-full md:w-52">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>7 jours masculins</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Pas de majuscule</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Début : Lundi</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Apprendre les Jours Prononciation Segment */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-black text-[#002B5B] text-xs uppercase tracking-wider font-mono">
                        Apprendre les jours
                      </h3>
                      <button 
                        onClick={() => {
                          ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"].forEach((day, idx) => {
                            setTimeout(() => speakWord(day), idx * 1000);
                          });
                        }}
                        className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-[#002B5B] border border-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-3xs"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Tout écouter</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                      {[
                        { day: "Lundi", eng: "Monday" },
                        { day: "Mardi", eng: "Tuesday" },
                        { day: "Mercredi", eng: "Wednesday" },
                        { day: "Jeudi", eng: "Thursday" },
                        { day: "Vendredi", eng: "Friday" },
                        { day: "Samedi", eng: "Saturday" },
                        { day: "Dimanche", eng: "Sunday" }
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => speakWord(item.day.toLowerCase())}
                          className="bg-white border border-slate-200/80 hover:border-blue-500/40 rounded-2xl p-4 text-center group cursor-pointer transition-all hover:scale-105 shadow-3xs"
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-50/50 text-[#002B5B] group-hover:bg-[#002B5B] group-hover:text-white flex items-center justify-center mx-auto mb-2.5 transition-colors">
                            <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                          </div>
                          <span className="text-xs font-black text-slate-800 block leading-none mb-1 group-hover:text-blue-600 transition-colors">{item.day}</span>
                          <span className="text-[10px] text-slate-400 font-medium block leading-none">{item.eng}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grammar Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-3xs">
                        <h3 className="font-display font-black text-sm text-[#002B5B] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span>La Capitalisation</span>
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Contrairement à l'anglais, les jours de la semaine en français ne prennent <strong>pas de majuscule</strong>, sauf s'ils débutent une phrase.
                        </p>
                        <div className="space-y-2 text-xs font-bold">
                          <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-center gap-2.5 text-rose-800">
                            <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] shrink-0 font-black">✕</span>
                            <div>
                              <span className="text-[8px] font-bold text-rose-500 uppercase tracking-widest block font-mono">Faux</span>
                              <span>Je pars ce Lundi.</span>
                            </div>
                          </div>
                          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-center gap-2.5 text-emerald-800">
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] shrink-0 font-black">✓</span>
                            <div>
                              <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest block font-mono">Vrai</span>
                              <span>Je pars ce lundi.</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 flex items-start gap-4 shadow-3xs">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#002B5B] shrink-0 mt-0.5">
                          <span className="material-symbols-outlined text-lg">keyboard_double_arrow_left</span>
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="font-display font-bold text-xs text-[#002B5B]">L'Ordre de la Semaine</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            Dans le calendrier francophone, la semaine commence par le <strong>lundi</strong> et non par le dimanche.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-3xs">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-black text-sm text-[#002B5B] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span>Le Genre</span>
                          </h3>
                          <span className="bg-blue-600/10 text-blue-800 text-[8px] font-black tracking-widest uppercase font-mono px-2 py-0.5 rounded-md border border-blue-200/50">
                            Tous Masculins
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Tous les jours de la semaine sont de genre <strong>masculin</strong>. On utilise donc l'article 'le' ou les adjectifs masculins.
                        </p>
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-xs font-bold text-slate-700 italic">
                          "Un lundi pluvieux."
                          <span className="block text-[10px] text-slate-400 font-normal not-italic mt-1">(A rainy Monday)</span>
                        </div>
                      </div>

                      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-4 shadow-3xs">
                        <h3 className="font-display font-black text-sm text-[#002B5B] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span>L'Usage de l'Article</span>
                        </h3>
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Sans article</span>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Pour parler d'un jour spécifique et proche : <strong>"Je te vois lundi."</strong> <span className="text-slate-400 font-normal">(I see you [this] Monday)</span>.
                            </p>
                          </div>
                          <div className="h-px bg-slate-100" />
                          <div className="space-y-1">
                            <span className="text-[8px] font-bold text-blue-500 uppercase tracking-widest block font-mono">Avec article "Le"</span>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Pour exprimer une habitude répétitive : <strong>"Le lundi, je fais du sport."</strong> <span className="text-slate-400 font-normal">(On Mondays/Every Monday, I exercise)</span>.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Le Pluriel des Jours */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-3xs relative overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <div className="md:col-span-2 space-y-3">
                        <h3 className="font-display font-black text-sm text-[#002B5B] flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          <span>Le Pluriel des Jours</span>
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Bien que l'on utilise souvent "le + jour" pour l'habitude, il est tout à fait possible de mettre les jours au pluriel.
                        </p>
                        <ul className="space-y-2.5 text-xs font-semibold text-slate-600">
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                            <span><strong>Les lundis</strong> : Se dit pour parler de plusieurs lundis spécifiques.</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 shrink-0" />
                            <span><strong>Tous les lundis</strong> : Expression courante pour "Every Monday".</span>
                          </li>
                        </ul>
                      </div>

                      <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center relative bg-slate-50/50 space-y-1.5">
                        <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs absolute -top-3.5 -right-3.5 shadow-xs font-bold">
                          ✎
                        </div>
                        <span className="font-sans font-black text-blue-600 text-lg md:text-xl block leading-none">les lundis</span>
                        <span className="text-[10px] text-slate-400 font-bold block leading-relaxed max-w-[160px] mx-auto">
                          On ajoute simplement un "s" comme pour un nom commun classique.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* WAEC Tip */}
                  <div className="bg-[#FFFCE8] border-2 border-[#FFD214] rounded-2xl p-5 md:p-6 shadow-3xs">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 fill-amber-500 text-amber-500" />
                      <h4 className="font-display font-black text-xs uppercase tracking-widest text-[#A67C00] font-mono">
                        Astuce de l'Examen WAEC d'Élite
                      </h4>
                    </div>
                    <p className="text-xs md:text-sm leading-relaxed text-[#5F4500] font-bold">
                      {activeArticle.content.waecTip}
                    </p>
                  </div>

                  {/* Continuer mon apprentissage */}
                  <div className="pt-8 border-t border-slate-100 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Continuer mon apprentissage
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        onClick={() => {
                          const nextArt = ARTICLES_DATA.find(a => a.id === "numbers-1-20");
                          if (nextArt) handleOpenArticle(nextArt);
                        }}
                        className="w-full text-left p-4 rounded-xl border border-slate-200/60 hover:border-blue-500/40 hover:shadow-2xs transition-all flex items-center justify-between group bg-slate-50/20 cursor-pointer"
                      >
                        <div>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Leçon suivante</span>
                          <span className="text-xs font-extrabold text-[#002B5B] group-hover:text-blue-600 transition-colors">Les Nombres 1-20</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button 
                        onClick={() => {
                          const assocArt = ARTICLES_DATA.find(a => a.id === "articles-definis-indefinis");
                          if (assocArt) handleOpenArticle(assocArt);
                        }}
                        className="w-full text-left p-4 rounded-xl border border-slate-200/60 hover:border-blue-500/40 hover:shadow-2xs transition-all flex items-center justify-between group bg-slate-50/20 cursor-pointer"
                      >
                        <div>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Thème associé</span>
                          <span className="text-xs font-extrabold text-[#002B5B] group-hover:text-blue-600 transition-colors">Les Articles Définis</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : activeArticle.id === "accent-marks" ? (
                <div className="space-y-10 text-slate-800 mb-12">
                  {/* Article Title Header */}
                  <div>
                    <span className="bg-blue-500/15 text-blue-700 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border border-blue-200/50 mb-3 inline-block font-mono">
                      LEÇON DE GRAMMAIRE
                    </span>
                    <h1 className="font-display font-black text-2xl md:text-4xl text-[#002B5B] leading-tight tracking-tight mb-3">
                      Accent Marks Guide
                    </h1>
                    <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                      Never mix up your aigu, grave, and circonflexe ever again with our cheat sheet.
                    </p>
                  </div>
                  
                  <div className="w-full h-1 bg-linear-to-r from-blue-500 via-amber-400 to-rose-400 rounded-full" />

                  {/* En Bref Box */}
                  <div className="bg-[#002B5B] text-white rounded-2xl p-6 relative overflow-hidden shadow-md">
                    <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                      <Sparkles className="w-40 h-40 text-white" />
                    </div>
                    <div className="relative z-10 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-amber-400 text-lg">lightbulb</span>
                        <span className="font-mono text-xs font-black uppercase tracking-widest text-amber-400">En bref</span>
                      </div>
                      <p className="text-xs md:text-sm leading-relaxed font-semibold">
                        Les accents en français ne sont pas décoratifs. Ils ont une valeur phonétique (modifiant le son d'une voyelle) et une valeur grammaticale (permettant de distinguer les homophones).
                      </p>
                    </div>
                  </div>

                  {/* Résumé Rapide */}
                  <div className="space-y-4 pt-2">
                    <h3 className="font-display font-black text-[#002B5B] text-xs uppercase tracking-wider font-mono">
                      Résumé Rapide
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { accent: "Aigu", desc: "é" },
                        { accent: "Grave", desc: "è" },
                        { accent: "Circonflexe", desc: "ê" },
                        { accent: "Tréma", desc: "ë" },
                        { accent: "Cédille", desc: "ç" }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center space-y-1 shadow-3xs">
                          <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-2 shadow-2xs">
                            {item.desc}
                          </span>
                          <span className="text-xs font-bold text-[#002B5B] block">{item.accent}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Table Overview */}
                  <div className="space-y-4">
                    <h3 className="font-display font-black text-[#002B5B] text-xs uppercase tracking-wider font-mono">
                      Vue d'ensemble des Accents
                    </h3>
                    <div className="border border-slate-200/60 rounded-2xl overflow-hidden shadow-3xs bg-white">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-[#002B5B] text-white uppercase font-mono font-bold tracking-widest text-[9px]">
                          <tr>
                            <th className="py-3 px-4">Symbole</th>
                            <th className="py-3 px-4">Nom Français</th>
                            <th className="py-3 px-4">Exemple</th>
                            <th className="py-3 px-4">Traduction</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                          {[
                            { symbol: "é", name: "Accent Aigu", example: "Un Été", trans: "A Summer" },
                            { symbol: "è", name: "Accent Grave", example: "Un Père", trans: "A Father" },
                            { symbol: "ê", name: "Accent Circonflexe", example: "Une Forêt", trans: "A Forest" },
                            { symbol: "ë", name: "Tréma", example: "Naïf", trans: "Naive" },
                            { symbol: "ç", name: "Cédille", example: "Français", trans: "French" }
                          ].map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                              <td className="py-3 px-4 font-black text-blue-600 text-sm">{row.symbol}</td>
                              <td className="py-3 px-4 font-bold text-slate-800">{row.name}</td>
                              <td className="py-3 px-4 italic font-bold text-[#002B5B]">{row.example}</td>
                              <td className="py-3 px-4 font-medium text-slate-400">{row.trans}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Analyse Détaillée Grid */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 border-l-4 border-[#002B5B] pl-3">
                      <h2 className="font-display font-black text-lg md:text-xl text-[#002B5B] tracking-tight">
                        Analyse Détaillée
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Accent Aigu */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-3xs">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">é</span>
                          <h3 className="font-display font-bold text-xs text-[#002B5B]">L'Accent Aigu</h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Le plus commun. On ne le trouve que sur la lettre <strong>É</strong>. Il ferme le son de la voyelle, un peu comme le "ey" dans "hey" ou "day".
                        </p>
                        <div className="bg-slate-50 rounded-xl p-3 text-[11px] space-y-1.5 font-bold">
                          <div className="flex justify-between text-slate-700"><span>écrire</span><span className="text-slate-400 font-medium">to write</span></div>
                          <div className="flex justify-between text-slate-700"><span>bébé</span><span className="text-slate-400 font-medium">baby</span></div>
                          <div className="flex justify-between text-slate-700"><span>donné</span><span className="text-slate-400 font-medium">given</span></div>
                        </div>
                      </div>

                      {/* Accent Grave */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-3xs">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">è</span>
                          <h3 className="font-display font-bold text-xs text-[#002B5B]">L'Accent Grave</h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Utilisé sur <strong>À, È, Ù</strong>. Sur le 'È', il ouvre le son ('eh' comme 'bed'). Pour 'À' et 'Ù', il sert à différencier des homonymes (a vs à).
                        </p>
                        <div className="bg-slate-50 rounded-xl p-3 text-[11px] space-y-1.5 font-bold">
                          <div className="flex justify-between text-slate-700"><span>a vs à (at/to)</span><span className="text-slate-400 font-medium">sirène</span></div>
                          <div className="flex justify-between text-slate-700"><span>ou vs où (where)</span><span className="text-slate-400 font-medium">père</span></div>
                        </div>
                      </div>

                      {/* Accent Circonflexe */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-3xs">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">ê</span>
                          <h3 className="font-display font-bold text-xs text-[#002B5B]">L'Accent Circonflexe</h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Le "chapeau". Historiquement, il remplace une lettre disparue (souvent un "S"). Pensez aux liens avec l'anglais !
                        </p>
                        <div className="bg-slate-50 rounded-xl p-3 text-[11px] space-y-1.5 font-bold">
                          <div className="flex justify-between text-slate-700"><span>Hospital</span><span className="text-slate-400 font-medium">hôpital</span></div>
                          <div className="flex justify-between text-slate-700"><span>Forest</span><span className="text-slate-400 font-medium">forêt</span></div>
                          <div className="flex justify-between text-slate-700"><span>Isle</span><span className="text-slate-400 font-medium">île</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Le Tréma */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-3xs">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">ë</span>
                          <h3 className="font-display font-bold text-xs text-[#002B5B]">Le Tréma</h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Sert à séparer deux voyelles consécutives pour qu'elles soient prononcées individuellement.
                        </p>
                        <div className="bg-slate-50 rounded-xl p-3 text-[11px] space-y-1.5 font-bold">
                          <div className="flex justify-between text-slate-700"><span>Noël</span><span className="text-slate-400 font-medium">No-el</span></div>
                          <div className="flex justify-between text-slate-700"><span>Naïf</span><span className="text-slate-400 font-medium">Na-if</span></div>
                        </div>
                      </div>

                      {/* La Cédille */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-3xs">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black">ç</span>
                          <h3 className="font-display font-bold text-xs text-[#002B5B]">La Cédille</h3>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Uniquement sur le <strong>Ç</strong>. Elle transforme le son dur "K" en son doux "S" devant les voyelles A, O, U.
                        </p>
                        <div className="bg-slate-50 rounded-xl p-3 text-[11px] space-y-1.5 font-bold">
                          <div className="flex justify-between text-slate-700"><span>Français</span><span className="text-slate-400 font-medium">Soft S</span></div>
                          <div className="flex justify-between text-slate-700"><span>Garçon</span><span className="text-slate-400 font-medium">Soft S</span></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Prêt pour l'examen ? indicator circle */}
                  <div className="bg-[#002B5B] text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-2">
                      <h3 className="font-display font-black text-lg">Prêt pour l'examen ?</h3>
                      <p className="text-xs text-slate-200 leading-relaxed max-w-md">
                        Votre score moyen actuel vous donne un indice de préparation estimé pour le WAEC. S'entraîner à l'aide de nos examens blancs augmente vos chances d'obtenir la note A1 absolue en français !
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-center shrink-0 space-y-3 bg-white/5 rounded-2xl p-4 border border-white/10 w-full md:w-56 text-center">
                      <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" className="stroke-white/10 fill-none" strokeWidth="6" />
                          <circle cx="32" cy="32" r="28" className="stroke-amber-400 fill-none" strokeWidth="6" strokeDasharray="175" strokeDashoffset="44" />
                        </svg>
                        <span className="absolute font-sans font-black text-xs text-white">75%</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-amber-400 font-bold block leading-none mb-1">Indice de préparation WAEC</span>
                        <button 
                          onClick={() => {
                            const qb = document.getElementById("mini-quiz-block");
                            if (qb) qb.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs mt-2"
                        >
                          S'entraîner maintenant
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* WAEC Tip */}
                  <div className="bg-[#FFFCE8] border-2 border-[#FFD214] rounded-2xl p-5 md:p-6 shadow-3xs">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 fill-amber-500 text-amber-500" />
                      <h4 className="font-display font-black text-xs uppercase tracking-widest text-[#A67C00] font-mono">
                        Astuce de l'Examen WAEC d'Élite
                      </h4>
                    </div>
                    <p className="text-xs md:text-sm leading-relaxed text-[#5F4500] font-bold">
                      {activeArticle.content.waecTip}
                    </p>
                  </div>

                  {/* Continuer mon apprentissage */}
                  <div className="pt-8 border-t border-slate-100 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Continuer mon apprentissage
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        onClick={() => {
                          const nextArt = ARTICLES_DATA.find(a => a.id === "er-ir-re-verbs");
                          if (nextArt) handleOpenArticle(nextArt);
                        }}
                        className="w-full text-left p-4 rounded-xl border border-slate-200/60 hover:border-blue-500/40 hover:shadow-2xs transition-all flex items-center justify-between group bg-slate-50/20 cursor-pointer"
                      >
                        <div>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Bases</span>
                          <span className="text-xs font-extrabold text-[#002B5B] group-hover:text-blue-600 transition-colors">Consonnes Françaises</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <div className="w-full text-left p-4 rounded-xl border border-slate-200/60 bg-slate-50/20 flex items-center justify-between group">
                        <div>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block font-mono">Prononciation</span>
                          <span className="text-xs font-extrabold text-slate-400">Guide Audio</span>
                        </div>
                        <Volume2 className="w-4 h-4 text-slate-300" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Main Article Header */}
                  <h1 className="font-display font-black text-2xl md:text-4xl text-[#002B5B] leading-tight tracking-tight mb-4">
                    {activeArticle.title}
                  </h1>
                  
                  <div className="w-full h-1 bg-linear-to-r from-blue-500 via-amber-400 to-rose-400 rounded-full mb-8" />

                  {/* Intro Text */}
                  <div className="text-slate-700 text-sm md:text-base leading-relaxed font-medium mb-8 bg-slate-50/50 border border-slate-100 rounded-2xl p-5 italic">
                    {activeArticle.content.introduction}
                  </div>

                  {/* Content Sections */}
                  <div className="space-y-8 mb-10 text-slate-800">
                    {activeArticle.content.sections.map((sec, sIdx) => (
                      <div key={sIdx} className="space-y-3.5">
                        <h2 className="font-display font-black text-lg md:text-xl text-[#002B5B] tracking-tight">
                          {sec.title}
                        </h2>
                        {sec.paragraphs.map((p, pIdx) => (
                          <p key={pIdx} className="text-xs md:text-sm leading-relaxed text-slate-600 font-medium">
                            {p}
                          </p>
                        ))}
                        {sec.list && (
                          <ul className="list-disc pl-5 space-y-1.5 text-xs md:text-sm text-slate-600 font-medium">
                            {sec.list.map((item, lIdx) => (
                              <li key={lIdx} className="pl-1 leading-relaxed">
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}
                        {sec.exampleTable && (
                          <div className="border border-slate-100 rounded-xl overflow-hidden shadow-2xs mt-4">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-[#002B5B] text-white uppercase font-mono font-bold tracking-widest text-[9px]">
                                <tr>
                                  <th className="py-2.5 px-4">Expression Française</th>
                                  <th className="py-2.5 px-4">Équivalent Anglais (WAEC Focus)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-medium text-slate-600 bg-white">
                                {sec.exampleTable.map((row, rIdx) => (
                                  <tr key={rIdx} className="hover:bg-slate-50/55 transition-colors">
                                    <td className="py-2.5 px-4 font-bold text-[#002B5B]">{row.left}</td>
                                    <td className="py-2.5 px-4">{row.right}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* High Contrast WAEC Tips Section */}
                  <div className="bg-[#FFFCE8] border-2 border-[#FFD214] rounded-2xl p-5 md:p-6 mb-12 shadow-2xs">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-5 h-5 fill-amber-500 text-amber-500" />
                      <h4 className="font-display font-black text-xs uppercase tracking-widest text-[#A67C00] font-mono">
                        Astuce de l'Examen WAEC d'Élite
                      </h4>
                    </div>
                    <p className="text-xs md:text-sm leading-relaxed text-[#5F4500] font-bold">
                      {activeArticle.content.waecTip}
                    </p>
                  </div>
                </>
              )}

              {/* INTERACTIVE MINI-QUIZ ZONE */}
              <div className="bg-linear-to-b from-[#f8fafc] to-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm">
                
                {/* Quiz Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-blue-100 text-blue-700 rounded-lg shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="font-display font-black text-sm text-[#002B5B]">
                        Mini-Quiz de Validation
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                        Vérifiez vos acquis et gagnez +{activeArticle.xpReward} XP !
                      </p>
                    </div>
                  </div>

                  {!quizFinished && (
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-md">
                      Q {quizIndex + 1} / {activeArticle.content.miniQuiz.length}
                    </span>
                  )}
                </div>

                {/* Quiz Active Question */}
                {!quizFinished ? (
                  <div className="space-y-6">
                    <p className="text-xs md:text-sm font-bold text-[#002B5B] leading-relaxed">
                      {activeArticle.content.miniQuiz[quizIndex].question}
                    </p>

                    <div className="space-y-2.5">
                      {activeArticle.content.miniQuiz[quizIndex].options.map((opt, oIdx) => {
                        const isSelected = selectedOption === opt;
                        const isCorrect = opt === activeArticle.content.miniQuiz[quizIndex].correctAnswer;
                        
                        let optionClass = "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50";
                        if (isSelected) {
                          if (isAnswered) {
                            optionClass = isCorrect
                              ? "bg-emerald-50 border-emerald-400 text-emerald-800"
                              : "bg-rose-50 border-rose-400 text-rose-800";
                          } else {
                            optionClass = "bg-blue-50 border-blue-400 text-blue-800";
                          }
                        } else if (isAnswered && isCorrect) {
                          optionClass = "bg-emerald-50 border-emerald-400 text-emerald-800";
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(opt)}
                            disabled={isAnswered}
                            className={`w-full text-left p-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${optionClass}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && isCorrect && (
                              <Check className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanations block */}
                    {isAnswered && (
                      <div className={`p-4 rounded-xl text-xs font-semibold border ${
                        selectedOption === activeArticle.content.miniQuiz[quizIndex].correctAnswer
                          ? "bg-emerald-50/50 border-emerald-100 text-emerald-800"
                          : "bg-rose-50/50 border-rose-100 text-rose-800"
                      }`}>
                        <p className="font-bold uppercase tracking-wider text-[9px] mb-1 font-mono">
                          {selectedOption === activeArticle.content.miniQuiz[quizIndex].correctAnswer ? "Excellent !" : "Explication :"}
                        </p>
                        <p className="leading-relaxed">
                          {activeArticle.content.miniQuiz[quizIndex].explanation}
                        </p>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex justify-end">
                      {!isAnswered ? (
                        <button
                          onClick={handleSubmitAnswer}
                          disabled={!selectedOption}
                          className={`px-6 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                            selectedOption
                              ? "bg-[#002B5B] hover:bg-blue-900 text-white shadow-sm"
                              : "bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed"
                          }`}
                        >
                          Valider la réponse
                        </button>
                      ) : (
                        <button
                          onClick={handleNextQuizQuestion}
                          className="bg-[#002B5B] hover:bg-blue-900 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1"
                        >
                          {quizIndex < activeArticle.content.miniQuiz.length - 1 ? "Question Suivante" : "Finaliser l'apprentissage"}
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* QUIZ FINISHED CELEBRATION */
                  <div className="text-center py-6 space-y-5">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-2xs">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-lg text-[#002B5B] mb-1">
                        Félicitations, Apprentissage Validé ! 🎉
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
                        Vous avez terminé le cours et répondu avec succès aux questions de validation. Votre score est de <strong>{quizScore} / {activeArticle.content.miniQuiz.length}</strong>.
                      </p>
                    </div>

                    <div className="bg-[#FFFCE8] border border-[#FFEB85] px-5 py-3 rounded-2xl max-w-xs mx-auto inline-flex items-center gap-2 shadow-3xs">
                      <div className="w-6 h-6 rounded-full bg-[#FFD214] flex items-center justify-center text-white shrink-0 shadow-xs">
                        <Star className="w-3.5 h-3.5 fill-white text-[#FFD214]" />
                      </div>
                      <span className="font-sans text-xs font-extrabold text-[#A67C00]">
                        +{xpEarnedThisSession} XP ajoutés à votre compte !
                      </span>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <button
                        onClick={handleCloseArticle}
                        className="w-full sm:w-auto bg-[#002B5B] hover:bg-blue-900 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        Retourner aux cours
                      </button>
                      <button
                        onClick={() => {
                          setQuizIndex(0);
                          setSelectedOption(null);
                          setIsAnswered(false);
                          setQuizScore(0);
                          setQuizFinished(false);
                          setXpEarnedThisSession(0);
                        }}
                        className="w-full sm:w-auto bg-slate-50 hover:bg-slate-100 text-[#002B5B] border border-slate-200 font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer"
                      >
                        Refaire le mini-quiz
                      </button>
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
