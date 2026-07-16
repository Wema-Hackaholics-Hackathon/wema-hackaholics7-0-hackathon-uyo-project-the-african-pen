import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, CreditCard, ArrowRight, Loader2 } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

export const ALATPaymentPage = () => {
  const navigate = useNavigate()
  const { setIsPremium } = useAuthStore()
  const [loading, setLoading] = useState(false)

  const handlePay = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setIsPremium(true)
      navigate('/payment/success')
    }, 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-amber-400 to-brand-coral" />
        
        <div className="text-center mb-6">
          <span className="bg-blue-50 text-[#002B5B] border border-blue-100 text-xs font-mono font-bold uppercase px-3 py-1 rounded-full inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />
            Pass Securisé ALAT / Paystack
          </span>
          <h2 className="text-2xl font-extrabold text-[#002B5B] font-display tracking-tight mt-3">
            Finalisez votre Abonnement
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Rejoignez l'élite de la Cohorte 1 et réussissez votre WAEC French.
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase font-mono mb-2">
            <span>Produit</span>
            <span>Tarif</span>
          </div>
          <div className="flex justify-between items-center text-[#002B5B] font-black">
            <span>Pass Premium La Plume Africa</span>
            <span className="text-brand-coral text-lg">₦5,000</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Accès complet de 90 jours à tous les cours, examens blancs, Blitz et tuteur IA.</p>
        </div>

        <button
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-[#002B5B] hover:bg-blue-800 text-white font-extrabold text-sm py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Traitement du paiement sécurisé...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Payer ₦5,000 maintenant
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>

        <button
          onClick={() => navigate('/plan-selection')}
          disabled={loading}
          className="w-full text-center text-xs font-bold text-slate-400 hover:text-[#002B5B] mt-4 transition-all"
        >
          Annuler et retourner aux plans
        </button>
      </div>
    </div>
  )
}

export default ALATPaymentPage
