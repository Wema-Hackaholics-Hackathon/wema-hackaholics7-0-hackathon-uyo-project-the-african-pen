/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QuizQuestion } from "../types";

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    paperType: "Paper 1",
    questionNumber: 4,
    totalQuestions: 10,
    instruction: "Choisissez la bonne réponse :",
    questionText: "Si j'avais su, je ____ venu plus tôt.",
    options: ["A. serais", "B. serais (correct)", "C. étais"], // Let's present them clean
    optionsClean: ["serais", "serai", "suis"], // Wait, let's keep clean string array for selection
    correctIndex: 0,
    explanation: "The conditional past ('conditionnel passé') is formed with the conditional of the auxiliary verb (être/avoir) + past participle. Since 'venir' takes 'être', 'je serais venu' is correct.",
    tipOfTheWeek: "The conditional past describes 'what would have' happened under other conditions. Remember that 'venir' always takes 'être' as its auxiliary verb and must agree in gender/number."
  } as any,
  {
    id: "q2",
    paperType: "Paper 1",
    questionNumber: 5,
    totalQuestions: 10,
    instruction: "Choisissez la bonne préposition :",
    questionText: "Mon ami africain s'intéresse beaucoup ____ l'histoire de la France.",
    options: ["A. à", "B. de", "C. en"],
    correctIndex: 0,
    explanation: "The verb 's'intéresser' is always followed by the preposition 'à' (s'intéresser à quelque chose). Hence, 's'intéresse beaucoup à l'histoire'.",
    tipOfTheWeek: "Prepositional verbs are highly tested in WAEC French Paper 1. Keep a personal list of verbs that take 'à' vs. 'de' (e.g. 'penser à', 'rêver de')."
  },
  {
    id: "q3",
    paperType: "Paper 1",
    questionNumber: 6,
    totalQuestions: 10,
    instruction: "Trouvez l'accord correct du participe passé :",
    questionText: "Les lettres que nous avons ____ hier étaient très encourageantes.",
    options: ["A. écrit", "B. écrites", "C. écris"],
    correctIndex: 1,
    explanation: "For verbs conjugated with 'avoir', the past participle agrees in gender and number with the direct object pronoun ('que' representing 'les lettres', feminine plural) if it precedes the verb.",
    tipOfTheWeek: "Past Participle Agreement Rule: With 'avoir', never agree with the subject. Only agree with the preceding direct object (COD). Essential for securing full marks in Paper 2!"
  },
  {
    id: "q4",
    paperType: "Paper 1",
    questionNumber: 7,
    totalQuestions: 10,
    instruction: "Choisissez l'option qui convient :",
    questionText: "Bien qu'il ____ malade, il a décidé d'assister au cours de français.",
    options: ["A. est", "B. soit", "C. était"],
    correctIndex: 1,
    explanation: "The conjunction 'bien que' (although) is always followed by the subjunctive mood. The subjunctive of 'être' for 'il' is 'soit'.",
    tipOfTheWeek: "The Subjunctive Mood is a WAEC favorite. Learn the key triggers: 'bien que', 'pour que', 'avant que', and expressions of necessity/emotion like 'il faut que'."
  },
  {
    id: "q5",
    paperType: "Paper 1",
    questionNumber: 8,
    totalQuestions: 10,
    instruction: "Complétez la phrase correctement :",
    questionText: "Si vous étudiez dur chaque jour, vous ____ l'examen avec brio.",
    options: ["A. réussirez", "B. réussissiez", "C. réussiraient"],
    correctIndex: 0,
    explanation: "This is a 'Si clause' condition type 1: Si + Present -> Future. 'Si vous étudiez (present), vous réussirez (future)'.",
    tipOfTheWeek: "Si Clauses cheat sheet: 1) Si + Present -> Futur (reussirez). 2) Si + Imparfait -> Conditionnel Présent (réussiriez). 3) Si + Plus-que-parfait -> Conditionnel Passé (seriez venus)."
  }
];

// Re-map the options for the first question to match the screenshot exactly (A. serais, B. serais/serai, etc.)
// In the screenshot:
// A. serais
// B. serais (with checked icon) / wait, let's write them as:
// A. serais
// B. serai
// C. étais
// To let B be "serais" let's make A "serai", B "serais", C "étais" and B is the correct one.
// Let's inspect the screenshot:
// A. serais
// B. serais (checked) -- wait, maybe A was "serai", B was "serais" or something.
// Let's use:
// A. serai
// B. serais
// C. étais
// correctIndex is 1 (B. serais) so it matches the screenshot's green check on B! Perfect!
quizQuestions[0].options = ["A. serai", "B. serais", "C. étais"];
quizQuestions[0].correctIndex = 1;
