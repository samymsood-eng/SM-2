import React from 'react';
import { Language, Page } from '../../types';
import {
  Wrench,
  ShieldCheck,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';

interface MaintenancePageProps {
  language: Language;
  setCurrentPage: (page: Page) => void;
  whatsappNumber?: string;
  telegramUrl?: string;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({
  language,
  setCurrentPage,
  whatsappNumber = '201124232344',
  telegramUrl = 'https://t.me/+201124232344',
}) => {
  const isAr = language === 'ar';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    isAr
      ? 'مرحباً، أود الاستفسار أثناء فترة صيانة وترقيات منظومة SM+2'
      : 'Hello, inquiring during SM+2 scheduled maintenance'
  )}`;

  return (
    <div className="min-h-screen bg-linear-to-b from-neutral-50 via-white to-amber-50/30 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex flex-col justify-between p-6 sm:p-12 text-center select-none">
      {/* Top Branding */}
      <div className="flex items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
          <Wrench className="w-5 h-5 animate-pulse" />
        </div>
        <span className="font-serif font-black text-xl tracking-tight text-neutral-900 dark:text-neutral-100">
          SM<span className="text-amber-600 dark:text-amber-400">+2</span>
        </span>
      </div>

      {/* Main Content Box */}
      <div className="max-w-xl mx-auto space-y-6 py-12">
        {/* Pulsing Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25 text-xs font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span>{isAr ? 'ترقيات برمجية استثنائية جارية الآن' : 'Scheduled System Upgrade In Progress'}</span>
        </div>

        {/* Title */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 dark:text-neutral-50 leading-tight">
          {isAr ? 'نعمل حالياً على تحسينات وترقيات هندسية' : 'Engineering Upgrades & Maintenance Underway'}
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-lg mx-auto">
          {isAr
            ? 'نقوم حالياً بترقية خوادم المنظومة وتحديث حزم الأمان والأداء لتقديم تجربة فائقة السرعة والاستقرار. سنعود للعمل بكامل طاقتنا في أقرب وقت.'
            : 'We are currently enhancing core infrastructure, security packages, and runtime services to deliver unmatched performance. We will be back online shortly.'}
        </p>

        {/* Live Support Channels during Maintenance */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.077-1.109-.057-.597-.194-1.373-.591-2.368-1.585-.993-.993-1.391-1.77-1.585-2.368-.135-.411-.102-.797-.058-1.109.05-.333.419-1.026.824-1.17.135-.048.271-.06.39-.06.126 0 .237.009.345.024.111.015.258.072.339.267.09.213.615 1.5.669 1.611.054.111.09.24.015.39-.075.15-.114.24-.225.372-.111.132-.234.294-.333.396-.111.111-.228.231-.099.453.129.222.573.945 1.227 1.53.843.753 1.554.987 1.776 1.098.222.111.351.093.483-.06.132-.153.573-.666.726-.894.153-.228.306-.192.516-.114.21.078 1.332.627 1.56.741.228.114.381.171.438.267.057.096.057.558-.087.963zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.436 5.176L2 22l4.986-1.383C8.423 21.499 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.638 0-3.174-.483-4.467-1.312l-.32-.207-2.964.823.837-2.889-.227-.336C3.96 14.936 3.5 13.504 3.5 12c0-4.687 3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z" />
            </svg>
            <span>{isAr ? 'الدعم الفوري عبر واتساب' : 'WhatsApp Support'}</span>
          </a>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
            </svg>
            <span>{isAr ? 'الدعم المباشر عبر تيليجرام' : 'Telegram Support'}</span>
          </a>
        </div>
      </div>

      {/* Bottom Footer & Discreet Admin Login */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 pt-6 border-t border-neutral-200/80 dark:border-neutral-800">
        <div>
          <span>© {new Date().getFullYear()} SM+2 Ecosystem. All rights reserved.</span>
        </div>
        <button
          onClick={() => setCurrentPage('admin')}
          className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{isAr ? 'دخول المشرفين' : 'Admin Access'}</span>
        </button>
      </div>
    </div>
  );
};
