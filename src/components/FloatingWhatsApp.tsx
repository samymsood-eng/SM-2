import React from 'react';
import { Language } from '../types';

interface FloatingWhatsAppProps {
  language: Language;
  phoneNumber?: string;
  telegramUrl?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  language,
  phoneNumber = '201124232344',
  telegramUrl = 'https://t.me/+201124232344',
}) => {
  const greeting =
    language === 'ar'
      ? 'مرحباً، أود الاستفسار بخصوص برمجيات وتراخيص منظومة SM+2'
      : 'Hello, I have an inquiry regarding SM+2 software & licensing';

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(greeting)}`;

  return (
    <aside
      aria-label={language === 'ar' ? 'قنوات الدعم والتواصل المباشر' : 'Live Support Channels'}
      className="fixed bottom-6 start-6 z-[100] flex flex-col items-center gap-2.5 pointer-events-none"
    >
      {/* 1. Telegram Floating Action Button */}
      <div className="relative flex items-center group pointer-events-auto">
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={language === 'ar' ? 'تواصل فوري عبر تيليجرام' : 'Chat with us on Telegram'}
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-sky-500 hover:bg-sky-600 text-white shadow-lg hover:shadow-xl hover:scale-108 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sky-400/40"
        >
          {/* Telegram Send/Paper-Plane Icon */}
          <svg
            className="w-6 h-6 fill-current relative z-10 -translate-x-0.5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
          </svg>
        </a>

        {/* Telegram Tooltip Card */}
        <div className="pointer-events-none opacity-0 -translate-x-2 rtl:translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 hidden sm:flex items-center absolute start-15">
          <div className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold shadow-lg whitespace-nowrap border border-neutral-700/40">
            <span>{language === 'ar' ? 'تواصل فوري عبر تيليجرام' : 'Quick Telegram Support'}</span>
          </div>
        </div>
      </div>

      {/* 2. WhatsApp Floating Action Button */}
      <div className="relative flex items-center group pointer-events-auto">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={language === 'ar' ? 'تواصل معنا فوراً عبر واتساب' : 'Chat with us on WhatsApp'}
          className="relative flex items-center justify-center w-13 h-13 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:shadow-2xl hover:scale-108 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
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

        {/* WhatsApp Tooltip Card */}
        <div className="pointer-events-none opacity-0 -translate-x-2 rtl:translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 hidden sm:flex items-center absolute start-16">
          <div className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold shadow-lg whitespace-nowrap border border-neutral-700/40">
            <span>{language === 'ar' ? 'تواصل سريع عبر واتساب' : 'Quick WhatsApp Support'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
