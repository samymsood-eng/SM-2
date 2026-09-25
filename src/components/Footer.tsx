import React, { useRef } from 'react';
import { Language, Page } from '../types';
import { translations } from '../i18n/translations';
import { Github, ShieldCheck, ArrowUpRight, Bell, Radio } from 'lucide-react';

interface FooterProps {
  language: Language;
  setCurrentPage: (page: Page) => void;
  onSubscribeEmail?: (email: string) => boolean;
  onOpenGithubModal: () => void;
  showGithubInFooter?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  setCurrentPage,
  onOpenGithubModal,
  showGithubInFooter = false,
}) => {
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

  return (
    <footer
      id="main-footer"
      className="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-6">
          {/* Brand & Editorial Manifesto */}
          <div className="sm:col-span-2 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-7 h-7 rounded-full overflow-hidden border border-amber-500/40 bg-neutral-900 ring-1 ring-amber-500/20 shadow-xs shrink-0">
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
                <div className="hidden items-center justify-center w-full h-full font-sans font-black text-xs text-amber-400 bg-neutral-900">
                  <span>SM</span>
                  <sup className="text-[8px] text-amber-500 ml-0.5">+2</sup>
                </div>
              </div>
              <span className="font-sans text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                SM+2
              </span>
            </div>
            <p className="text-[11px] leading-relaxed max-w-sm text-neutral-600 dark:text-neutral-400">
              {t.tagline}
            </p>
            <div className="flex items-center gap-2 pt-0.5">
              {showGithubInFooter && (
                <button
                  id="footer-github-btn"
                  onClick={onOpenGithubModal}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-200 text-[11px] font-medium text-neutral-800 dark:text-neutral-200 transition-colors bg-white/60 dark:bg-neutral-800/60"
                >
                  <Github className="w-3 h-3" />
                  <span>GitHub Releases</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              )}
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono font-medium border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                <span>SHA-256</span>
              </div>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="space-y-2">
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              {language === 'ar' ? 'صفحات المنصة' : 'Navigation'}
            </h4>
            <ul className="space-y-1 text-[11px]">
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
              <li>
                <button
                  onClick={() => setCurrentPage('licenses')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400"
                >
                  <span>{language === 'ar' ? 'تفعيل التراخيص وبصمة الأجهزة' : 'License Activation'}</span>
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold">HWID</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Technical Specs & OS Support */}
          <div className="space-y-2">
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              {language === 'ar' ? 'الأنظمة المدعومة' : 'Platforms'}
            </h4>
            <ul className="space-y-1 text-[11px]">
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

          {/* Release Alerts & Notification Status */}
          <div className="space-y-2">
            <h4 className="font-sans text-[11px] font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              {language === 'ar' ? 'إشعارات التحديث' : 'Release Alerts'}
            </h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              {t.downloads.notifyDesc}
            </p>
            <div className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/60 text-[11px] space-y-1.5 shadow-2xs">
              <div className="flex items-center gap-1.5 font-medium text-amber-700 dark:text-amber-400">
                <Radio className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400 animate-pulse" />
                <span>{language === 'ar' ? 'بث فوري للتحديثات البرمجية' : 'Live Update Broadcasts'}</span>
              </div>
              <p className="text-[10px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                {language === 'ar'
                  ? 'يتم إشعار المستخدمين تلقائياً عبر تنبيهات المتصفح وقنوات GitHub الرسمية عند إصدار أي تحديث جديد أو تصحيح أمني.'
                  : 'Automated release alerts and security advisories are broadcast directly via browser push and GitHub releases.'}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Compact, Slim & Balanced */}
        <div className="mt-5 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span>© 2027 SM+2 Project.</span>
            <span>•</span>
            <span>{language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] text-amber-700 dark:text-amber-400">
              v2.4.0
            </span>
            <span>•</span>
            <button
              id="footer-admin-portal-btn"
              type="button"
              onClick={handleAdminPortalClick}
              className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors text-[11px] select-none focus:outline-none cursor-pointer"
            >
              {language === 'ar' ? 'بوابة الإدارة' : 'Admin Portal'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
