import React, { useState } from 'react';
import { GitHubSettings, DownloadFile, Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Github,
  X,
  ExternalLink,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Terminal,
  GitBranch,
  Star,
  Layers,
} from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  githubSettings: GitHubSettings;
  downloads: DownloadFile[];
  language: Language;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({
  isOpen,
  onClose,
  githubSettings,
  downloads,
  language,
}) => {
  const [copiedClone, setCopiedClone] = useState(false);
  const t = translations[language];

  if (!isOpen) return null;

  const cloneCommand = `git clone https://github.com/${githubSettings.repoOwner}/${githubSettings.repoName}.git`;

  const handleCopyClone = () => {
    navigator.clipboard.writeText(cloneCommand);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2000);
  };

  return (
    <div
      id="github-repository-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl space-y-6 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {githubSettings.repoOwner} / {githubSettings.repoName}
              </h3>
              <p className="text-neutral-500 font-mono text-[11px]">
                Official GitHub Repository & Releases Mirror
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Repository Meta */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 text-center">
          <div>
            <div className="text-neutral-400 text-[10px] uppercase font-bold">Branch</div>
            <div className="font-mono font-bold text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-1">
              <GitBranch className="w-3 h-3 text-amber-600" />
              <span>{githubSettings.branch}</span>
            </div>
          </div>
          <div>
            <div className="text-neutral-400 text-[10px] uppercase font-bold">API Status</div>
            <div className="font-bold text-emerald-600 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Connected</span>
            </div>
          </div>
          <div>
            <div className="text-neutral-400 text-[10px] uppercase font-bold">Stars & Forks</div>
            <div className="font-mono font-bold text-amber-600 flex items-center justify-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              <span>2.4k stars</span>
            </div>
          </div>
        </div>

        {/* Clone command */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400">
            {language === 'ar' ? 'أمر استنساخ المستودع (Clone)' : 'Clone Repository Command'}
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-950 text-neutral-200 font-mono text-xs border border-neutral-800" dir="ltr">
            <span className="truncate">{cloneCommand}</span>
            <button
              onClick={handleCopyClone}
              className="text-neutral-400 hover:text-white p-1 ms-2"
              title="Copy"
            >
              {copiedClone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Latest GitHub Releases */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400">
            {language === 'ar' ? 'أحدث أصول الحزم المرفوعة (Releases Assets)' : 'Latest GitHub Release Assets'}
          </div>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            {downloads.slice(0, 4).map((dl) => (
              <div key={dl.id} className="p-3 flex items-center justify-between gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                <div className="space-y-0.5">
                  <div className="font-medium text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                    <span>{dl.fileName}</span>
                    <span className="text-[10px] font-mono px-1.5 rounded bg-neutral-200 dark:bg-neutral-800">
                      v{dl.version}
                    </span>
                  </div>
                  <div className="font-mono text-[10px] text-neutral-400">
                    {dl.fileSize} • {dl.platform}
                  </div>
                </div>
                <a
                  href={dl.directUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-3 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-medium"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
          <a
            href={`https://github.com/${githubSettings.repoOwner}/${githubSettings.repoName}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 hover:underline font-semibold"
          >
            <span>{language === 'ar' ? 'فتح المستودع في GitHub' : 'Open in GitHub.com'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
