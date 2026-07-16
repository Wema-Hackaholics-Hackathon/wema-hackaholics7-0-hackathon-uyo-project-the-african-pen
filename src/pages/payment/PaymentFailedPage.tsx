import React from 'react'
import { useNavigate } from 'react-router-dom'
import { XCircle, ArrowLeft } from 'lucide-react'

export const PaymentFailedPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 right-0 h-2 bg-brand-coral" />
        
        <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center text-brand-coral mx-auto mb-6 shadow-sm">
          <XCircle className="w-10 h-10 fill-rose-500/10" />
        </div>

        <h2 className="text-3xl font-extrabold text-[#002B5B] font-display tracking-tight">
          Échec du Paiement
        </h2>
        <p className="text-slate-500 text-sm mt-3 leading-relaxed font-medium">
          Nous n'avons pas pu valider votre transaction. Veuillez vérifier vos coordonnées bancaires ou essayer une autre méthode de paiement.
        </p>

        <button
          onClick={() => navigate('/payment')}
          className="w-full bg-[#002B5B] hover:bg-blue-800 text-white font-extrabold text-sm py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 cursor-pointer mt-6"
        >
          Réessayer le paiement
        </button>

        <button
          onClick={() => navigate('/plan-selection')}
          className="w-full text-center text-xs font-bold text-slate-400 hover:text-[#002B5B] mt-4 transition-all"
        >
          Retourner aux plans
        </button>
      </div>
    </div>
  )
}

export default PaymentFailedPage
