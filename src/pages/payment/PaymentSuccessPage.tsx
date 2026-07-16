import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ArrowRight } from 'lucide-react'
import confetti from 'canvas-confetti'

export const PaymentSuccessPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-green-400 to-teal-500" />
        
        <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6 shadow-sm">
          <CheckCircle className="w-10 h-10 fill-emerald-500/10" />
        </div>

        <h2 className="text-3xl font-extrabold text-[#002B5B] font-display tracking-tight">
          Abonnement Réussi !
        </h2>
        <p className="text-slate-500 text-sm mt-3 leading-relaxed font-medium">
          Félicitations ! Votre paiement de <strong>₦5,000</strong> a été approuvé. Votre Pass Premium La Plume est maintenant actif.
        </p>

        <div className="bg-emerald-50/30 border border-dashed border-emerald-150 rounded-2xl p-4 my-6 text-xs text-emerald-800 font-bold">
          Abonné à : Cohorte 1 · Validité : 90 Jours
        </div>

        <button
          onClick={() => navigate('/onboarding')}
          className="w-full bg-[#002B5B] hover:bg-blue-800 text-white font-extrabold text-sm py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer"
        >
          Commencer l'Intégration
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default PaymentSuccessPage
