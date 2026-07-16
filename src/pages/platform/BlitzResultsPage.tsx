import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, Clock, ArrowLeft, Calendar } from 'lucide-react'

export default function BlitzResultsPage() {
  const navigate = useNavigate()
  const [attempts, setAttempts] = useState<any[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("blitz_attempts")
    if (stored) {
      setAttempts(JSON.parse(stored))
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => navigate('/blitz')}
          className="p-2 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          title="Retour au Blitz"
        >
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
        <div>
          <h2 className="text-2xl font-extrabold text-[#002B5B] font-display tracking-tight">
            Historique du Blitz
          </h2>
          <p className="text-slate-400 text-xs mt-0.5">Vos scores de défis chronométrés</p>
        </div>
      </div>

      {attempts.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 mx-auto mb-4">
            <Trophy className="w-8 h-8" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Aucune tentative enregistrée pour le moment.</p>
          <button 
            onClick={() => navigate('/blitz')}
            className="mt-4 bg-[#002B5B] text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-blue-800 transition-all cursor-pointer"
          >
            Lancer un défi
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {attempts.map((att, idx) => (
            <div key={idx} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-[#A67C00] border border-amber-100 shadow-3xs font-black">
                  {att.score}%
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-800">{att.essayPrompt || "Session d'évaluation générale"}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase mt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {att.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {att.timeSpent?.total || "00:15:00"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="bg-blue-50 text-blue-700 border border-blue-100 text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                  {att.grade || "B2 (Très Bien)"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
