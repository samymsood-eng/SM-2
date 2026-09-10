import React, { useState } from 'react';
import { Language, Page } from '../types';
import { translations } from '../i18n/translations';
import { Github, Mail, ShieldCheck, Heart, ArrowUpRight, CheckCircle2, Lock } from 'lucide-react';

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
  const t = translations[language];

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Editorial Manifesto */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-900 text-amber-400 dark:bg-neutral-100 dark:text-neutral-900 border border-amber-500/30 font-serif font-black text-lg">
                SM<sup className="text-xs ml-0.5 text-amber-500">+2</sup>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                SM+2
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm text-neutral-600 dark:text-neutral-400">
              {t.tagline}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                id="footer-github-btn"
                onClick={onOpenGithubModal}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-200 text-xs font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Releases</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </button>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-medium border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SHA-256 Verified</span>
              </div>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              {language === 'ar' ? 'صفحات المنصة' : 'Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
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
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              {language === 'ar' ? 'الأنظمة المدعومة' : 'Platforms'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>Windows 10 / 11 (MSI & ZIP)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>macOS Apple Silicon (M1-M4)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>macOS Intel x64</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>Linux Universal (AppImage & Deb)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>Android Companion App</span>
              </li>
            </ul>
          </div>

          {/* Instant Email Notifications Subscription (User requirement!) */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              {language === 'ar' ? 'إشعارات التحديث الفورية' : 'Instant Release Alerts'}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {t.downloads.notifyDesc}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  id="footer-email-input"
                  type="email"
                  required
                  placeholder={t.downloads.enterEmail}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 w-full"
                />
                <button
                  id="footer-subscribe-btn"
                  type="submit"
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white transition-colors whitespace-nowrap"
                >
                  {t.common.subscribe}
                </button>
              </div>
              {subscribed && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 pt-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t.common.subscribedSuccess}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar with Classic Border */}
        <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} SM+2 Project.</span>
            <span>•</span>
            <span>{language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] text-amber-700 dark:text-amber-400">
              SM+2 Core Release: v2.4.0
            </span>
            <span>•</span>
            <button
              onClick={() => setCurrentPage('admin')}
              className="inline-flex items-center gap-1.5 opacity-50 hover:opacity-100 hover:text-amber-700 dark:hover:text-amber-400 transition-opacity"
              title={language === 'ar' ? 'دخول المشرف' : 'Admin Sign-in'}
            >
              <Lock className="w-3 h-3" />
              <span>{language === 'ar' ? 'بوابة الإدارة' : 'Admin Portal'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
