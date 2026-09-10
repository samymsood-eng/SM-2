import React, { useState } from 'react';
import { DownloadFile, ChangelogEntry, Language, Page, Product } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Download,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  FileCode,
  HardDrive,
  Copy,
  Check,
  Calendar,
  Layers,
  ShoppingBag,
  BookOpen,
  LifeBuoy,
  ExternalLink,
  Github,
  CheckCircle2,
  Terminal,
  Activity,
  Cpu,
} from 'lucide-react';

interface HomePageProps {
  downloads: DownloadFile[];
  changelogs: ChangelogEntry[];
  products: Product[];
  language: Language;
  setCurrentPage: (page: Page) => void;
  onSubscribeEmail: (email: string) => boolean;
  onOpenGithubModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  downloads,
  changelogs,
  products,
  language,
  setCurrentPage,
  onSubscribeEmail,
  onOpenGithubModal,
}) => {
  const [copiedSha, setCopiedSha] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  const t = translations[language];
  const isRtl = language === 'ar';

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSha(id);
    setTimeout(() => setCopiedSha(null), 2500);
  };

  const handleDownloadClick = (file: DownloadFile) => {
    setDownloadingId(file.id);
    // Trigger download via anchor
    const link = document.createElement('a');
    link.href = file.directUrl;
    link.setAttribute('download', file.fileName);
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloadingId(null);
    }, 2000);
  };

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

  // Get latest 4 uploads and latest 3 changelogs
  const latestUploads = [...downloads]
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, 4);

  const recentUpdates = [...changelogs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div id="sm2-home-page" className="min-h-screen py-8 lg:py-14 space-y-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section: Classic, Artistic, and Professional */}
        <section className="relative text-center max-w-4xl mx-auto space-y-6 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{t.home.heroBadge}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight leading-[1.18]">
            {t.home.heroTitle}
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto font-normal">
            {t.home.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-3">
            <button
              id="home-hero-downloads-btn"
              onClick={() => setCurrentPage('downloads')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white text-sm font-semibold shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{t.home.exploreAllDownloads}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>

            <button
              id="home-hero-sales-btn"
              onClick={() => setCurrentPage('sales')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-200 text-neutral-800 dark:text-neutral-200 text-sm font-semibold transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.nav.sales}</span>
            </button>

            <button
              id="home-hero-github-btn"
              onClick={onOpenGithubModal}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-semibold transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub API</span>
            </button>
          </div>

          {/* Architectural Trust Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-neutral-200 dark:border-neutral-800 max-w-2xl mx-auto">
            <div className="p-3 text-center">
              <div className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
                v2.4.0
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                {language === 'ar' ? 'الإصدار المعتمد الحالي' : 'Current Stable Release'}
              </div>
            </div>
            <div className="p-3 text-center">
              <div className="font-serif text-xl font-bold text-amber-700 dark:text-amber-400">
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
                +180K
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                {language === 'ar' ? 'تحميل عالمي نشط' : 'Verified Deployments'}
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Latest File Uploads (أحدث الملفات المرفوعة) */}
        <section id="latest-file-uploads-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {t.home.latestUploadsTitle}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {t.home.latestUploadsSubtitle}
              </p>
            </div>
            
            <button
              id="view-all-downloads-link"
              onClick={() => setCurrentPage('downloads')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
            >
              <span>{t.home.exploreAllDownloads}</span>
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestUploads.map((file) => {
              const title = language === 'ar' ? file.title : file.titleEn;
              const notes = language === 'ar' ? file.releaseNotes : file.releaseNotesEn;
              const isDownloading = downloadingId === file.id;

              return (
                <div
                  key={file.id}
                  id={`upload-item-${file.id}`}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 sm:p-6 shadow-sm hover:border-neutral-400 dark:hover:border-neutral-700 transition-all flex flex-col justify-between space-y-5 group"
                >
                  <div className="space-y-3">
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700">
                          <FileCode className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <h3 className="font-serif text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                            {title}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="font-mono">{file.fileName}</span>
                          </div>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 shrink-0">
                        v{file.version}
                      </span>
                    </div>

                    {/* Brief Description */}
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2">
                      {notes}
                    </p>

                    {/* Meta specs row */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                        {file.platform.toUpperCase()} ({file.architecture})
                      </span>
                      <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 font-mono">
                        {file.fileSize}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        <span>{file.releaseDate}</span>
                      </span>
                      {file.isLatest && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{t.common.verified}</span>
                        </span>
                      )}
                    </div>

                    {/* SHA-256 Checksum with One-click Copy */}
                    <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2 text-[11px]">
                      <div className="truncate font-mono text-neutral-600 dark:text-neutral-400">
                        <span className="font-bold text-neutral-500 mr-1">{t.home.shaLabel}</span>
                        <span className="select-all">{file.sha256}</span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(file.sha256, file.id)}
                        className="p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors shrink-0"
                        title={t.common.copy}
                      >
                        {copiedSha === file.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Direct Download Button */}
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-neutral-400">
                      {file.minOsVersion}
                    </div>

                    <button
                      id={`direct-dl-btn-${file.id}`}
                      onClick={() => handleDownloadClick(file)}
                      disabled={isDownloading}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
                      <span>{isDownloading ? t.common.loading : t.home.directDownloadFile}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Recent Updates & Changelogs (سجل التحديثات والتغييرات الأخيرة) */}
        <section id="recent-system-updates-section" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {t.home.latestUpdatesTitle}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {t.home.latestUpdatesSubtitle}
              </p>
            </div>

            <button
              onClick={() => setCurrentPage('downloads')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
            >
              <span>{t.common.viewChangelog}</span>
              {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="space-y-4">
            {recentUpdates.map((item) => {
              const title = language === 'ar' ? item.title : item.titleEn;
              const changes = language === 'ar' ? item.changes : item.changesEn;

              const badgeColors = {
                feature: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
                fix: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
                security: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
                performance: 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20',
              }[item.type];

              return (
                <div
                  key={item.id}
                  id={`update-log-${item.id}`}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 sm:p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
                        v{item.version}
                      </span>
                      <h3 className="font-serif text-base font-bold text-neutral-900 dark:text-neutral-100">
                        {title}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${badgeColors}`}>
                        {item.type.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.author}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-neutral-700 dark:text-neutral-300">
                    {changes.map((change, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{change}</span>
                      </li>
                    ))}
                  </ul>

                  {item.githubCommit && (
                    <div className="pt-2 flex items-center justify-end text-[11px] font-mono text-neutral-400">
                      <span>Commit: {item.githubCommit}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Core Architecture Pillars Navigation */}
        <section className="space-y-6">
          <div className="border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <h2 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {t.home.quickPillars}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sales Pillar */}
            <div
              onClick={() => setCurrentPage('sales')}
              className="cursor-pointer rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-3 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all shadow-sm group"
            >
              <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-amber-700 dark:text-amber-400 w-fit">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                {t.home.salesPillarTitle}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {t.home.salesPillarDesc}
              </p>
              <div className="pt-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                <span>{t.common.learnMore}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </div>
            </div>

            {/* Direct Downloads Pillar */}
            <div
              onClick={() => setCurrentPage('downloads')}
              className="cursor-pointer rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-3 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all shadow-sm group"
            >
              <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-amber-700 dark:text-amber-400 w-fit">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                {t.nav.downloads}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {t.nav.downloadsDesc}
              </p>
              <div className="pt-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                <span>{t.common.downloadNow}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </div>
            </div>

            {/* Support Pillar */}
            <div
              onClick={() => setCurrentPage('developer')}
              className="cursor-pointer rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-3 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all shadow-sm group"
            >
              <div className="p-3 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-amber-700 dark:text-amber-400 w-fit">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                {t.home.supportPillarTitle}
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {t.home.supportPillarDesc}
              </p>
              <div className="pt-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                <span>{t.nav.developer}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Automated Email Notifications Card */}
        <section className="p-8 sm:p-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center max-w-3xl mx-auto space-y-5">
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
