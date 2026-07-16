/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Globe, Languages, Lightbulb, Loader2, ArrowRight, BookOpen } from "lucide-react";
import { ChatMessage } from "../types";

export default function AiTutorChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      role: "assistant",
      content: "Bonjour Amara ! Je suis ravi de vous aider aujourd'hui. Prêt à pratiquer votre français pour dominer l'examen du WAEC ?",
      translation: "Hello Amara! I am delighted to help you today. Ready to practice your French to dominate the WAEC exam?",
      vocab: [
        { word: "Ravi", translation: "Delighted / Glad" },
        { word: "Prêt", translation: "Ready" },
        { word: "Dominer", translation: "To dominate / master" }
      ],
      timestamp: "11:15"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTranslation, setShowTranslation] = useState<{ [key: string]: boolean }>({ m1: false });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const toggleTranslation = (id: string) => {
    setShowTranslation(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text || text.trim() === "") return;

    // Add user message
    const userMsg: ChatMessage = {
      id: "u-" + Date.now(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setLoading(true);

    try {
      // Build API history payload
      const apiHistory = messages.concat(userMsg).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiHistory }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Expected JSON response but received non-JSON payload");
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: "a-" + Date.now(),
        role: "assistant",
        content: data.reply,
        translation: data.translation,
        vocab: data.vocab,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      // Fallback
      setMessages(prev => [...prev, {
        id: "error-" + Date.now(),
        role: "assistant",
        content: "Désolé, j'ai eu une petite panne de connexion. Pouvez-vous répéter ?",
        translation: "Sorry, I had a small connection issue. Can you repeat?",
        timestamp: "Now"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const starters = [
    "Présente-toi, s'il te plaît !",
    "Donnez-moi un conseil pour l'oral du WAEC.",
    "Comment dire 'My goal is to score an A1' en français ?",
    "Faisons un petit jeu de rôle d'examen."
  ];

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-12 animate-fade-in">
      
      {/* Header */}
      <div className="text-center mb-8">
        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono font-bold uppercase px-3 py-1 rounded-full inline-flex items-center gap-1">
          <Languages className="w-3.5 h-3.5" />
          Tuteur d'IA Interactif
        </span>
        <h2 className="font-display text-2xl md:text-3xl font-extrabold text-brand-blue tracking-tight mt-2">
          Chattez avec La Plume Tutor
        </h2>
        <p className="text-slate-500 text-xs md:text-sm max-w-lg mx-auto mt-1">
          Pratiquez votre expression écrite, apprenez de nouvelles expressions idiomatiques et gagnez en aisance pour l'épreuve orale.
        </p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden flex flex-col h-[600px]">
        
        {/* Chat Active Profile */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center gap-3">
          <div className="relative">
            <div className="bg-brand-blue text-white p-2.5 rounded-xl">
              <Sparkles className="w-5 h-5 text-brand-yellow" />
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-50" />
          </div>
          <div>
            <span className="font-display font-bold text-sm md:text-base text-brand-blue block">La Plume AI Tutor</span>
            <span className="text-[10px] text-slate-400 block font-mono font-bold uppercase">En ligne · Prêt pour WAEC</span>
          </div>
        </div>

        {/* Message Panel */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/35">
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1 animate-fade-in`}
              >
                {/* Bubble Container */}
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3.5 shadow-xs ${
                    isUser 
                      ? "bg-brand-blue text-white rounded-br-none" 
                      : "bg-white text-slate-800 border border-slate-100 rounded-bl-none"
                  }`}
                >
                  {/* Content */}
                  <p className="text-xs md:text-sm leading-relaxed font-semibold">{msg.content}</p>

                  {/* Translation block */}
                  {!isUser && msg.translation && showTranslation[msg.id] && (
                    <p className="text-[11px] md:text-xs text-brand-blue-light/80 italic mt-2.5 border-t border-slate-100 pt-2.5 font-medium animate-slide-up">
                      {msg.translation}
                    </p>
                  )}

                  {/* Vocab block */}
                  {!isUser && msg.vocab && msg.vocab.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100/80 flex flex-wrap gap-1.5">
                      {msg.vocab.map((v, idx) => (
                        <div 
                          key={idx}
                          className="bg-amber-50 hover:bg-amber-100/75 text-[10px] text-amber-900 border border-amber-100 rounded-lg px-2 py-0.5 font-medium transition-all"
                          title="Cliquez pour traduire"
                        >
                          <strong className="font-bold">{v.word}</strong>: {v.translation}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sub info */}
                <div className="flex items-center gap-2 px-1 text-[10px] text-slate-400 font-mono font-medium">
                  <span>{msg.timestamp}</span>
                  {!isUser && msg.translation && (
                    <button 
                      onClick={() => toggleTranslation(msg.id)} 
                      className="text-brand-blue hover:underline font-bold flex items-center gap-0.5"
                    >
                      <Globe className="w-3 h-3" />
                      {showTranslation[msg.id] ? "Masquer" : "Traduire"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {loading && (
            <div className="flex items-center gap-2 text-slate-400 font-mono text-xs font-semibold pl-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-blue" />
              <span>Le tuteur d'IA réfléchit...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Starters */}
        <div className="bg-slate-50/50 border-t border-slate-100 px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {starters.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(s)}
              disabled={loading}
              className="bg-white hover:bg-slate-50 text-slate-600 hover:text-brand-blue border border-slate-100 text-[10px] md:text-xs font-semibold px-3 py-1.5 rounded-xl shrink-0 transition-all cursor-pointer"
            >
              {s}
            </button>
          ))}
        </div>

        {/* TextInput Box */}
        <div className="bg-white border-t border-slate-100 p-4">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="flex items-center gap-2"
          >
            <input
              id="chat-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Écrivez votre message en français ici..."
              disabled={loading}
              className="flex-1 bg-slate-50 border border-slate-100 focus:border-brand-blue focus:bg-white focus:outline-hidden rounded-xl px-4 py-3 text-xs md:text-sm text-slate-800 transition-all font-semibold"
            />
            <button
              id="btn-send-message"
              type="submit"
              disabled={loading || !inputText.trim()}
              className={`p-3 rounded-xl shadow-md transition-all shrink-0 ${
                loading || !inputText.trim()
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-brand-blue hover:bg-brand-blue-light text-white hover:shadow-lg transform active:translate-y-0"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
