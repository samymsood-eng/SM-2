import React, { useState, useRef } from 'react';
import { Language, Page } from '../types';
import { translations } from '../i18n/translations';
import { Github, ShieldCheck, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  language: Language;
  setCurrentPage: (page: Page) => void;
  onSubscribeEmail: (email: string) => boolean;
  onOpenGithubModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  setCurrentPage,
  onSubscribeEmail,
  onOpenGithubModal,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const adminClicksRef = useRef(0);
  const adminTimerRef = useRef<NodeJS.Timeout | null>(null);

  const t = translations[language];

  // Discreet 5-Click Secret Admin Portal Trigger (completely silent, no counter or hints displayed)
  const handleAdminPortalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    adminClicksRef.current += 1;

    if (adminTimerRef.current) {
      clearTimeout(adminTimerRef.current);
    }

    if (adminClicksRef.current >= 5) {
      adminClicksRef.current = 0;
      setCurrentPage('admin');
    } else {
      // Secret silent reset after 3 seconds of inactivity
      adminTimerRef.current = setTimeout(() => {
        adminClicksRef.current = 0;
      }, 3000);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const success = onSubscribeEmail(emailInput.trim());
    if (success) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer
      id="main-footer"
      className="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Brand & Editorial Manifesto */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-amber-500/40 bg-neutral-900 ring-1 ring-amber-500/20 shadow-sm shrink-0">
                <img
                  src="/logo.png"
                  alt="SM+2 Logo"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.getAttribute('data-tried-rel') !== 'true') {
                      target.setAttribute('data-tried-rel', 'true');
                      target.src = './logo.png';
                      return;
                    }
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).classList.remove('hidden');
                      (target.nextElementSibling as HTMLElement).classList.add('flex');
                    }
                  }}
                />
                <div className="hidden items-center justify-center w-full h-full font-serif font-black text-xs text-amber-400 bg-neutral-900">
                  <span>SM</span>
                  <sup className="text-[9px] text-amber-500 ml-0.5">+2</sup>
                </div>
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                SM+2
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-sm text-neutral-600 dark:text-neutral-400">
              {t.tagline}
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <button
                id="footer-github-btn"
                onClick={onOpenGithubModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-200 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Releases</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </button>
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono font-medium border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                <span>SHA-256</span>
              </div>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="space-y-2.5">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              {language === 'ar' ? 'صفحات المنصة' : 'Navigation'}
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors font-medium"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('sales')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  {t.nav.sales}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('downloads')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  {t.nav.downloads}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('developer')}
                  className="hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  {t.nav.developer}
                </button>
              </li>
            </ul>
          </div>

          {/* Technical Specs & OS Support */}
          <div className="space-y-2.5">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              {language === 'ar' ? 'الأنظمة المدعومة' : 'Platforms'}
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>Windows 10 / 11 (MSI & ZIP)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>macOS Apple Silicon (M1-M4)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>macOS Intel x64</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>Linux (AppImage & Deb)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>Android Companion</span>
              </li>
            </ul>
          </div>

          {/* Instant Email Notifications Subscription */}
          <div className="space-y-2.5">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              {language === 'ar' ? 'إشعارات التحديث' : 'Release Alerts'}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {t.downloads.notifyDesc}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-1.5">
              <div className="flex flex-col sm:flex-row gap-1.5">
                <input
                  id="footer-email-input"
                  type="email"
                  required
                  placeholder={t.downloads.enterEmail}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="px-2.5 py-1.5 text-xs rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 w-full"
                />
                <button
                  id="footer-subscribe-btn"
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white transition-colors whitespace-nowrap"
                >
                  {t.common.subscribe}
                </button>
              </div>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 pt-0.5 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{t.common.subscribedSuccess}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar with Classic Border */}
        <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span>© 2027 SM+2 Project.</span>
            <span>•</span>
            <span>{language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-amber-700 dark:text-amber-400">
              v2.4.0
            </span>
            <span>•</span>
            <button
              id="footer-admin-portal-btn"
              type="button"
              onClick={handleAdminPortalClick}
              className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors text-xs select-none focus:outline-none"
            >
              {language === 'ar' ? 'بوابة الإدارة' : 'Admin Portal'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
