import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, ShieldAlert, ArrowLeft, Calendar, Clock } from 'lucide-react'

export default function ExamResultsPage() {
  const navigate = useNavigate()

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate('/examens')}
          className="p-2 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          title="Retour aux Examens"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold text-[#002B5B] font-display tracking-tight">
            Résultats d'Examen Blanc
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Vos copies de proctoring évaluées</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Mock Exam Result Card */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-blue-500" />
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full">
                Examen Terminé & Corrigé
              </span>
              <h3 className="text-lg font-black text-[#002B5B]">WAEC Simulé — Session Complète</h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">Date: 10 Juillet 2026</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-[#FFFCE8] border border-[#FFEB85] text-[#A67C00] px-4 py-2.5 rounded-2xl font-mono text-center shadow-3xs">
                <span className="text-[10px] font-bold block leading-none">Score Final</span>
                <strong className="text-lg font-black tracking-tight">85%</strong>
              </div>
              <div className="bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2.5 rounded-2xl font-mono text-center shadow-3xs">
                <span className="text-[10px] font-bold block leading-none">Grade Officiel</span>
                <strong className="text-lg font-black tracking-tight">A1 (Excellent)</strong>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-50 mt-6 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 border border-slate-100/50 p-4 rounded-2xl text-center">
              <span className="text-slate-400 font-bold block mb-1">Section A (Grammaire)</span>
              <strong className="text-slate-800 text-sm font-black">90 / 100</strong>
            </div>
            <div className="bg-slate-50 border border-slate-100/50 p-4 rounded-2xl text-center">
              <span className="text-slate-400 font-bold block mb-1">Section B (Compréhension)</span>
              <strong className="text-slate-800 text-sm font-black">80 / 100</strong>
            </div>
            <div className="bg-slate-50 border border-slate-100/50 p-4 rounded-2xl text-center">
              <span className="text-slate-400 font-bold block mb-1">Section C (Oral)</span>
              <strong className="text-slate-800 text-sm font-black">85 / 100</strong>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl text-xs md:text-sm text-slate-600 leading-relaxed mt-6">
            <strong className="text-[#002B5B] block mb-1">Commentaires de l'Évaluation :</strong>
            Excellent travail ! Votre orthographe est très soignée et la construction syntaxique respecte parfaitement les consignes du WAEC. Les infractions de proctoring enregistrées étaient de 0/3.
          </div>
        </div>
      </div>
    </div>
  )
}
