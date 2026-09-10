import React, { useState, useEffect } from 'react';
import { DownloadFile, ChangelogEntry, Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Download,
  ShieldCheck,
  Copy,
  Check,
  Monitor,
  Apple,
  Terminal,
  Smartphone,
  Layers,
  History,
  Mail,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Info,
} from 'lucide-react';

interface DownloadsPageProps {
  downloads: DownloadFile[];
  changelogs: ChangelogEntry[];
  language: Language;
  onSubscribeEmail: (email: string) => boolean;
}

export const DownloadsPage: React.FC<DownloadsPageProps> = ({
  downloads,
  changelogs,
  language,
  onSubscribeEmail,
}) => {
  const [copiedShaId, setCopiedShaId] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [showChangelogModal, setShowChangelogModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [detectedOs, setDetectedOs] = useState<'windows' | 'macos' | 'linux' | 'android'>('windows');

  const t = translations[language];

  useEffect(() => {
    // Detect OS safely
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes('mac')) {
      setDetectedOs('macos');
    } else if (userAgent.includes('linux') && !userAgent.includes('android')) {
      setDetectedOs('linux');
    } else if (userAgent.includes('android')) {
      setDetectedOs('android');
    } else {
      setDetectedOs('windows');
    }
  }, []);

  const handleCopySha = (id: string, hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedShaId(id);
    setTimeout(() => setCopiedShaId(null), 2000);
  };

  const handleDownloadClick = (file: DownloadFile) => {
    // Trigger download simulation with notification
    const element = document.createElement('a');
    const fileContent = `SM+2 Official Binary Release\nPackage: ${file.fileName}\nVersion: ${file.version}\nSHA-256: ${file.sha256}\nBuilt: ${file.releaseDate}\nEngine: SM+2 Studio\nVerified: Cryptographically Signed by SM+2 Maintainers.`;
    const blob = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(blob);
    element.download = file.fileName.endsWith('.txt') ? file.fileName : `${file.fileName}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const ok = onSubscribeEmail(emailInput.trim());
    if (ok) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const recommendedFile = downloads.find((d) => d.platform === detectedOs && d.isLatest) || downloads[0];

  const filteredDownloads = selectedPlatform === 'all'
    ? downloads
    : downloads.filter((d) => d.platform === selectedPlatform);

  const getPlatformIcon = (plat: string) => {
    switch (plat) {
      case 'windows':
        return <Monitor className="w-4 h-4 text-blue-500" />;
      case 'macos':
        return <Apple className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />;
      case 'linux':
        return <Terminal className="w-4 h-4 text-amber-500" />;
      case 'android':
        return <Smartphone className="w-4 h-4 text-emerald-500" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <div id="downloads-page" className="min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Title & Mission */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-500/20 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Cryptographically Signed & SHA-256 Validated</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            {t.downloads.title}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            {t.downloads.subtitle}
          </p>

          <div className="flex justify-center gap-3 pt-2">
            <button
              id="view-changelog-modal-btn"
              onClick={() => setShowChangelogModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <History className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.common.viewChangelog} ({changelogs[0]?.version || 'v2.4.0'})</span>
            </button>
          </div>
        </div>

        {/* Recommended Download Hero Card */}
        {recommendedFile && (
          <section
            id="recommended-download-card"
            className="rounded-xl border-2 border-neutral-900 dark:border-neutral-100 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-lg max-w-3xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.downloads.recommendedForYou}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {language === 'ar' ? recommendedFile.title : recommendedFile.titleEn}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  <span>{recommendedFile.fileName}</span>
                  <span>•</span>
                  <span>{recommendedFile.fileSize}</span>
                  <span>•</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{t.common.verified}</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 pt-1">
                  {language === 'ar' ? recommendedFile.releaseNotes : recommendedFile.releaseNotesEn}
                </p>
              </div>

              <div className="shrink-0 flex flex-col gap-2">
                <button
                  id={`hero-download-btn-${recommendedFile.id}`}
                  onClick={() => handleDownloadClick(recommendedFile)}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white text-sm font-bold shadow-md transition-transform hover:scale-102"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.common.downloadNow}</span>
                </button>
                <div className="text-[10px] text-center text-neutral-400 font-mono">
                  {recommendedFile.minOsVersion}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Platform Filter Buttons */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-4">
          <span className="text-xs font-semibold text-neutral-400 me-2">{t.common.filter}:</span>
          {[
            { id: 'all', label: t.downloads.allPlatforms, icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'windows', label: 'Windows', icon: <Monitor className="w-3.5 h-3.5" /> },
            { id: 'macos', label: 'macOS', icon: <Apple className="w-3.5 h-3.5" /> },
            { id: 'linux', label: 'Linux', icon: <Terminal className="w-3.5 h-3.5" /> },
            { id: 'android', label: 'Android', icon: <Smartphone className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedPlatform(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedPlatform === tab.id
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Complete Release Binaries Table / Cards */}
        <div className="space-y-4">
          <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-between text-xs font-semibold text-neutral-500">
              <span>{language === 'ar' ? 'حزم التثبيت والملفات الرسمية' : 'Official Distribution Packages'}</span>
              <span className="font-mono">SHA-256 Digest Required</span>
            </div>

            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredDownloads.map((file) => {
                const title = language === 'ar' ? file.title : file.titleEn;
                const notes = language === 'ar' ? file.releaseNotes : file.releaseNotesEn;
                const isCopied = copiedShaId === file.id;

                return (
                  <div
                    key={file.id}
                    id={`download-row-${file.id}`}
                    className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    {/* File Meta */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                          {getPlatformIcon(file.platform)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif text-base font-bold text-neutral-900 dark:text-neutral-100">
                              {title}
                            </h4>
                            {file.isLatest && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/20">
                                Latest
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 font-mono">
                            {file.fileName} • {file.fileSize} • {file.architecture}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        {notes}
                      </p>

                      {/* SHA-256 Checksum with Copy */}
                      <div className="flex items-center gap-2 text-[11px] font-mono bg-neutral-100 dark:bg-neutral-800/80 px-2.5 py-1 rounded max-w-xl text-neutral-600 dark:text-neutral-400">
                        <span className="font-bold text-neutral-400 uppercase">SHA-256:</span>
                        <span className="truncate flex-1" title={file.sha256}>
                          {file.sha256}
                        </span>
                        <button
                          onClick={() => handleCopySha(file.id, file.sha256)}
                          className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white p-1"
                          title={t.common.copy}
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="shrink-0 flex items-center gap-3">
                      <button
                        id={`dl-btn-${file.id}`}
                        onClick={() => handleDownloadClick(file)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white text-xs font-semibold shadow-sm transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{t.common.downloadNow}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Instant Email Notifications Signup Banner */}
        <section
          id="release-email-signup-banner"
          className="rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/10 p-6 sm:p-8 space-y-4"
        >
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <div className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold font-serif uppercase">
              <Mail className="w-4 h-4" />
              <span>{t.downloads.notifyNewReleases}</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {language === 'ar' ? 'ابقَ على اطلاع فوري بكل إصدار برمجي جديد' : 'Instant Email Notifications on Every New Release'}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {t.downloads.notifyDesc}
            </p>

            <form onSubmit={handleSubscribe} className="pt-2 max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder={t.downloads.enterEmail}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white transition-colors"
                >
                  {t.common.subscribe}
                </button>
              </div>
              {subscribed && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 pt-2 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.common.subscribedSuccess}</span>
                </div>
              )}
            </form>
          </div>
        </section>
      </div>

      {/* Automated Changelog Modal */}
      {showChangelogModal && (
        <div
          id="changelog-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  {t.common.viewChangelog} - SM+2 Release History
                </h3>
              </div>
              <button
                onClick={() => setShowChangelogModal(false)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-xs px-2 py-1 rounded"
              >
                {t.common.close}
              </button>
            </div>

            <div className="space-y-6">
              {changelogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
                        {log.version}
                      </span>
                      <span className="text-xs text-neutral-500">{log.date}</span>
                    </div>
                    {log.githubCommit && (
                      <span className="font-mono text-[10px] text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        commit: {log.githubCommit}
                      </span>
                    )}
                  </div>

                  <h4 className="font-serif text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {language === 'ar' ? log.title : log.titleEn}
                  </h4>

                  <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                    {(language === 'ar' ? log.changes : log.changesEn).map((change, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
