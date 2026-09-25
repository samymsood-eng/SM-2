import React from 'react';
import { Language } from '../types';

interface FloatingWhatsAppProps {
  language: Language;
  phoneNumber?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  language,
  phoneNumber = '201124232344',
}) => {
  const greeting =
    language === 'ar'
      ? 'مرحباً، أود الاستفسار بخصوص برمجيات وتراخيص منظومة SM+2'
      : 'Hello, I have an inquiry regarding SM+2 software & licensing';

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(greeting)}`;

  return (
    <aside
      aria-label={language === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp Support'}
      className="fixed bottom-6 start-6 z-40 flex items-center gap-3 pointer-events-none group"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={language === 'ar' ? 'تواصل معنا فوراً عبر واتساب' : 'Chat with us on WhatsApp'}
        className="pointer-events-auto relative flex items-center justify-center w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-2xl hover:scale-108 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
      >
        {/* Subtle breathing ripple glow */}
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-30 animate-ping pointer-events-none" />

        {/* WhatsApp Icon */}
        <svg
          className="w-7 h-7 fill-current relative z-10"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.077-1.109-.057-.597-.194-1.373-.591-2.368-1.585-.993-.993-1.391-1.77-1.585-2.368-.135-.411-.102-.797-.058-1.109.05-.333.419-1.026.824-1.17.135-.048.271-.06.39-.06.126 0 .237.009.345.024.111.015.258.072.339.267.09.213.615 1.5.669 1.611.054.111.09.24.015.39-.075.15-.114.24-.225.372-.111.132-.234.294-.333.396-.111.111-.228.231-.099.453.129.222.573.945 1.227 1.53.843.753 1.554.987 1.776 1.098.222.111.351.093.483-.06.132-.153.573-.666.726-.894.153-.228.306-.192.516-.114.21.078 1.332.627 1.56.741.228.114.381.171.438.267.057.096.057.558-.087.963zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.436 5.176L2 22l4.986-1.383C8.423 21.499 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.638 0-3.174-.483-4.467-1.312l-.32-.207-2.964.823.837-2.889-.227-.336C3.96 14.936 3.5 13.504 3.5 12c0-4.687 3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z" />
        </svg>

        {/* Online Indicator Badge */}
        <span className="absolute top-0 end-0 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-white dark:border-neutral-900" />
      </a>

      {/* Floating Hover Card */}
      <div className="pointer-events-none opacity-0 -translate-x-2 rtl:translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 hidden sm:flex items-center">
        <div className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold shadow-lg whitespace-nowrap border border-neutral-700/40">
          <span>{language === 'ar' ? 'تواصل سريع عبر واتساب' : 'Quick WhatsApp Support'}</span>
        </div>
      </div>
    </aside>
  );
};
