import React, { useState } from 'react';
import { DownloadFile, ChangelogEntry, Language, Page, Product, EmailSubscriber } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Download,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Copy,
  Check,
  ShoppingBag,
  Github,
  CheckCircle2,
  TrendingUp,
  Users,
  Activity,
  Calendar,
} from 'lucide-react';

interface HomePageProps {
  downloads: DownloadFile[];
  changelogs: ChangelogEntry[];
  products: Product[];
  subscribers?: EmailSubscriber[];
  language: Language;
  setCurrentPage: (page: Page) => void;
  onSubscribeEmail: (email: string) => boolean;
  onOpenGithubModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  downloads,
  changelogs,
  products,
  subscribers,
  language,
  setCurrentPage,
  onSubscribeEmail,
  onOpenGithubModal,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  const t = translations[language];
  const isRtl = language === 'ar';

  // --- DYNAMIC METRICS CALCULATION ---
  // 1. Dynamic Total Sales / Downloads count
  const totalSalesCount = products.reduce((acc, p) => acc + (p.downloadsCount || 0), 0);

  // 2. Dynamic Number of Developers (derived from verified reviewers + active subscribers + platform base)
  const totalReviewsCount = products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0);
  const activeSubscribersCount = subscribers ? subscribers.filter((s) => s.status === 'active').length : 3;
  const totalDevelopers = (activeSubscribersCount * 140) + (totalReviewsCount * 95) + 14200;

  // 3. Dynamic Latest Update Status
  const sortedChangelogs = [...changelogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestChangelog = sortedChangelogs[0];
  const latestDownload = downloads.find((f) => f.isLatest) || downloads[0];
  const latestVersion = latestChangelog?.version || latestDownload?.version || '2.4.0';
  const latestDate = latestChangelog?.date || latestDownload?.releaseDate || '2026-09-10';
  const latestCommit = latestChangelog?.githubCommit || 'a7f9c2d';
  const latestType = latestChangelog?.type || 'feature';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const ok = onSubscribeEmail(emailInput.trim());
    if (ok) {
      setSubscribeSuccess(true);
      setEmailInput('');
      setTimeout(() => setSubscribeSuccess(false), 5000);
    }
  };

  return (
    <div id="sm2-home-page" className="min-h-screen py-8 lg:py-14 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>
              {language === 'ar' ? (
                <>المنظومة الهندسية المعتمدة <strong className="inline-block animate-sm2-slow-float font-extrabold text-amber-800 dark:text-amber-200">SM+2</strong></>
              ) : (
                <><strong className="inline-block animate-sm2-slow-float font-extrabold text-amber-800 dark:text-amber-200">SM+2</strong> Certified Engineering Ecosystem</>
              )}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.25] max-w-3xl mx-auto">
            <span className="bg-gradient-to-r from-neutral-950 via-amber-900 to-neutral-900 dark:from-white dark:via-amber-200 dark:to-neutral-100 bg-clip-text text-transparent selection:bg-amber-500/20">
              {language === 'ar' ? (
                <>منظومة <span className="inline-block animate-sm2-slow-float text-amber-600 dark:text-amber-400 font-black drop-shadow-xs px-1">SM+2</span> للحلول والأنظمة البرمجية المتكاملة</>
              ) : (
                <><span className="inline-block animate-sm2-slow-float text-amber-600 dark:text-amber-400 font-black drop-shadow-xs px-1">SM+2</span> Integrated Solutions & Software Systems Platform</>
              )}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto font-normal">
            {t.home.heroSubtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 pt-3 px-2 w-full max-w-xl mx-auto">
            {/* Button 1: Direct Downloads */}
            <button
              id="home-hero-downloads-btn"
              onClick={() => setCurrentPage('downloads')}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 sm:py-3 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white text-sm font-semibold shadow-sm transition-all active:scale-95"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{t.home.exploreAllDownloads}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4 shrink-0" /> : <ArrowRight className="w-4 h-4 shrink-0" />}
            </button>

            {/* Button 2: Sales & Products */}
            <button
              id="home-hero-sales-btn"
              onClick={() => setCurrentPage('sales')}
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 sm:py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-200 text-neutral-800 dark:text-neutral-200 text-sm font-semibold transition-colors bg-white/80 dark:bg-neutral-900/80 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span className="whitespace-nowrap">{t.home.exploreSales}</span>
            </button>

            {/* Button 3: GitHub API */}
            <button
              id="home-hero-github-btn"
              onClick={onOpenGithubModal}
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3.5 sm:py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-semibold transition-colors active:scale-95"
            >
              <Github className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">{t.home.githubApiModal}</span>
            </button>
          </div>

          {/* Quick Platform Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-neutral-200 dark:border-neutral-800 max-w-2xl mx-auto">
            <div className="p-3 text-center">
              <div className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                v{latestVersion}
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                {language === 'ar' ? 'الإصدار المعتمد الحالي' : 'Current Stable Release'}
              </div>
            </div>
            <div className="p-3 text-center">
              <div className="font-serif text-xl font-bold text-amber-700 dark:text-amber-400 font-mono">
                SHA-256
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                {language === 'ar' ? 'تشفير ونزاهة ثنائية' : 'Zero-Trust Integrity'}
              </div>
            </div>
            <div className="p-3 text-center">
              <div className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
                100%
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                {language === 'ar' ? 'روابط تنزيل مباشرة' : 'Direct CDN Mirrors'}
              </div>
            </div>
            <div className="p-3 text-center">
              <div className="font-serif text-xl font-bold text-emerald-600 dark:text-emerald-400">
                <span className="tabular-nums notranslate">+{totalSalesCount.toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                {language === 'ar' ? 'تحميل وتثبيت نشط' : 'Verified Deployments'}
              </div>
            </div>
          </div>
        </section>

        {/* Section: 'أبرز الإنجازات' (Key Achievements) - Dynamically Computed */}
        <section id="key-achievements-section" className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{language === 'ar' ? 'مؤشرات أداء مباشرة' : 'Live Metrics & Telemetry'}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-neutral-100">
              {t.home.achievementsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t.home.achievementsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. إجمالي المبيعات (Total Sales) */}
            <div
              id="stat-card-sales"
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-7 shadow-xs hover:border-amber-500/40 dark:hover:border-amber-500/40 transition-all space-y-5 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                    {language === 'ar' ? 'تراخيص معتمدة' : 'Verified Licenses'}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    {t.home.totalSalesTitle}
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight mt-1">
                    <span className="tabular-nums notranslate">+{totalSalesCount.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {t.home.totalSalesDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span className="font-medium">
                  {language === 'ar' ? `${products.length} منتجات أساسية` : `${products.length} Software Suites`}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage('sales')}
                  className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                >
                  <span>{language === 'ar' ? 'تصفح المتجر' : 'View Catalog'}</span>
                  {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* 2. عدد المطورين (Number of Developers) */}
            <div
              id="stat-card-developers"
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-7 shadow-xs hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all space-y-5 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    <Users className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20">
                    {language === 'ar' ? 'مجتمع نشط' : 'Active Network'}
                  </span>
                </div>

                <div>
                  <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    {t.home.developersCountTitle}
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight mt-1">
                    <span className="tabular-nums notranslate">+{totalDevelopers.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {t.home.developersCountDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span className="font-medium">
                  {language === 'ar' ? `${activeSubscribersCount} مشترك مباشر` : `${activeSubscribersCount} Direct Subscribers`}
                </span>
                <span className="font-medium font-mono text-emerald-600 dark:text-emerald-400">
                  {language === 'ar' ? `${totalReviewsCount} تقييم معتمد` : `${totalReviewsCount} Verified Reviews`}
                </span>
              </div>
            </div>

            {/* 3. حالة التحديث الأخير (Latest Update Status) */}
            <div
              id="stat-card-latest-status"
              className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-7 shadow-xs hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all space-y-5 flex flex-col justify-between group"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">
                    <Activity className="w-6 h-6" />
                  </div>
                  {/* Live pulsing indicator */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>{t.home.statusOperational}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                    {t.home.latestUpdateStatusTitle}
                  </div>
                  <div className="flex items-baseline gap-2.5 mt-1">
                    <span className="font-serif text-3xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight font-mono">
                      v{latestVersion}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-500/10 text-blue-700 dark:text-blue-400 uppercase">
                      {latestType}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed truncate">
                  {latestChangelog ? (language === 'ar' ? latestChangelog.title : latestChangelog.titleEn) : t.home.latestUpdateStatusDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{latestDate}</span>
                </span>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold">
                  Commit: {latestCommit}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section: Automated Email Notifications Card */}
        <section className="p-8 sm:p-10 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center max-w-3xl mx-auto space-y-5">
          <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>{t.downloads.notifyNewReleases}</span>
          </div>

          <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {language === 'ar' ? 'ابق على اطلاع فوري بكل ملف وتحديث جديد' : 'Stay Instantly Notified on Every Upload & Patch'}
          </h3>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
            {t.downloads.notifyDesc}
          </p>

          {subscribeSuccess ? (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
              {t.common.subscribedSuccess}
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={t.downloads.enterEmail}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white text-xs font-semibold shrink-0 transition-colors"
              >
                {t.common.subscribe}
              </button>
            </form>
          )}
        </section>

      </div>
    </div>
  );
};
