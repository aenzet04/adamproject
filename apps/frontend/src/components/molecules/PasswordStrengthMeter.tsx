'use client';

import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  if (!password) return null;

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const criteria = [
    { label: 'Min 8 Karakter', valid: hasMinLength },
    { label: 'Huruf Besar (A-Z)', valid: hasUppercase },
    { label: 'Huruf Kecil (a-z)', valid: hasLowercase },
    { label: 'Angka (0-9)', valid: hasNumber },
    { label: 'Simbol Khusus (!@#$)', valid: hasSymbol },
  ];

  const validCount = criteria.filter((c) => c.valid).length;
  const strengthText =
    validCount === 5 ? 'Sangat Kuat (Enterprise)' : validCount >= 3 ? 'Sedang' : 'Lemah';
  const strengthColor =
    validCount === 5
      ? 'text-emerald-400 bg-emerald-950 border-emerald-800'
      : validCount >= 3
      ? 'text-amber-400 bg-amber-950 border-amber-800'
      : 'text-rose-400 bg-rose-950 border-rose-800';

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2 text-[11px] animate-fadeInScale">
      <div className="flex justify-between items-center">
        <span className="text-slate-400 font-semibold">Tingkat Keamanan Sandi:</span>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${strengthColor}`}>
          {strengthText}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-800/80 font-mono">
        {criteria.map((c, idx) => (
          <div
            key={idx}
            className={`flex items-center space-x-1.5 transition-colors ${
              c.valid ? 'text-emerald-400 font-bold' : 'text-slate-500'
            }`}
          >
            <span>{c.valid ? '✓' : '○'}</span>
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
