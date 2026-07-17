import React, { useState } from 'react';
import { ShieldCheck, Loader2, Sparkles, X } from 'lucide-react';

interface ClaimModalProps {
  onClose: () => void;
  onSuccess: (studentName: string) => void;
}

export default function ClaimModal({ onClose, onSuccess }: ClaimModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dob: '',
    parentPhone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate the Python Flask backend communicating with Wema's Sandbox API
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess(`${formData.firstName} ${formData.lastName}`);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100 mb-3">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h3 className="font-display font-extrabold text-xl text-[#002B5B]">
              Claim Your 10,000 ₦ Reward!
            </h3>
            <p className="text-slate-500 text-xs mt-2 leading-relaxed max-w-sm mx-auto">
              To securely deliver your prize, we will help you set up a free, secure Wema Bank student account right here. It takes less than a minute.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amara"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-3 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#002B5B] focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Temi"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-3 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#002B5B] focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Your Phone Number
              </label>
              <input
                type="tel"
                required
                placeholder="e.g. 08012345678"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-4 py-3 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#002B5B] focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-4 py-3 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#002B5B] focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Parent/Guardian Phone
                </label>
                <input
                  type="tel"
                  required
                  placeholder="For minor verification"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  className="w-full px-4 py-3 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-100 rounded-xl focus:outline-hidden focus:border-[#002B5B] focus:bg-white transition-all"
                />
              </div>
            </div>
          </div>

          {/* Compliance Assurance Footer */}
          <div className="flex items-start gap-2 bg-slate-50 border border-slate-100 rounded-2xl p-4 mt-6">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 leading-normal font-medium">
              We care about your safety. Your account is processed securely through Wema Bank's official API rails, adhering strictly to standard Central Bank of Nigeria Tier-1 KYC guidelines.
            </p>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-6 bg-[#002B5B] hover:bg-blue-800 text-white font-extrabold text-xs py-4 rounded-2xl shadow-lg shadow-[#002B5B]/10 hover:shadow-[#002B5B]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Connecting with Wema Sandbox...
              </>
            ) : (
              "Create Account & Claim Winnings"
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
