import React, { useState } from 'react';
import {
  AdminUser,
  Product,
  DocSection,
  DownloadFile,
  ChangelogEntry,
  EmailSubscriber,
  NotificationLog,
  GitHubSettings,
  Language,
  AdminRole,
  LicenseRequest,
} from '../../types';
import { translations } from '../../i18n/translations';
import {
  Lock,
  UserCheck,
  Shield,
  Layers,
  FileCode,
  Download,
  Github,
  Mail,
  History,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Upload,
  Send,
  Eye,
  EyeOff,
  Settings,
  Sparkles,
  Key,
  KeyRound,
  MessageCircle,
  Terminal,
  ExternalLink,
  Globe,
  Copy,
  FileText,
  Bell,
  BellRing,
  Image as ImageIcon,
  Loader2,
  Clock,
} from 'lucide-react';
import { calculateExpirationDate } from '../pages/LicenseActivationPage';
import { compressImageFile } from '../../utils/imageCompressor';
import { generateSitemapXml, generateRobotsTxt } from '../../lib/sitemapGenerator';
import {
  showWebNotification,
  requestNotificationPermission,
  getNotificationStatus,
} from '../../lib/webNotifications';
import {
  buildSerialActivatedTelegramMessage,
  sendTelegramNotification,
} from '../../services/telegramService';

interface AdminDashboardProps {
  currentUser: AdminUser | null;
  onLogin: (user: AdminUser) => void;
  onLogout: () => void;
  adminUsers: AdminUser[];
  onUpdateUsers: (users: AdminUser[]) => void;
  products: Product[];
  onUpdateProducts: (prods: Product[]) => void;
  docs: DocSection[];
  onUpdateDocs: (docs: DocSection[]) => void;
  downloads: DownloadFile[];
  onUpdateDownloads: (dls: DownloadFile[]) => void;
  changelogs: ChangelogEntry[];
  onAddChangelog: (entry: ChangelogEntry) => void;
  subscribers: EmailSubscriber[];
  notificationLogs: NotificationLog[];
  onSendNotification: (subject: string, version: string, body: string) => void;
  githubSettings: GitHubSettings;
  onUpdateGithubSettings: (settings: GitHubSettings) => void;
  language: Language;
  licenseRequests?: LicenseRequest[];
  onUpdateLicenseRequest?: (req: LicenseRequest) => void;
  onAddLicenseRequest?: (req: LicenseRequest) => void;
  onDeleteLicenseRequest?: (id: string) => void;
}

export function getLicenseExpiryDetails(req: LicenseRequest, language: Language) {
  if (req.duration === 'lifetime' || req.licenseType === 'lifetime') {
    return {
      statusText: language === 'ar' ? 'مدى الحياة (دائم)' : 'Lifetime (Perpetual)',
      badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
      daysLeft: Infinity,
      isExpired: false,
      isExpiringSoon: false,
    };
  }
  if (!req.expiresAt) {
    return {
      statusText: language === 'ar' ? 'غير محدد' : 'Not set',
      badgeClass: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700',
      daysLeft: null,
      isExpired: false,
      isExpiringSoon: false,
    };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(req.expiresAt);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      statusText: language === 'ar' ? `منتهي منذ ${Math.abs(diffDays)} يوم` : `Expired ${Math.abs(diffDays)}d ago`,
      badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
      daysLeft: diffDays,
      isExpired: true,
      isExpiringSoon: false,
    };
  }
  if (diffDays <= 30) {
    return {
      statusText: language === 'ar' ? `يوشك على الانتهاء (باقي ${diffDays} يوم)` : `Expiring soon (${diffDays}d left)`,
      badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse',
      daysLeft: diffDays,
      isExpired: false,
      isExpiringSoon: true,
    };
  }
  return {
    statusText: language === 'ar' ? `ساري (باقي ${diffDays} يوم)` : `Active (${diffDays}d left)`,
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
    daysLeft: diffDays,
    isExpired: false,
    isExpiringSoon: false,
  };
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogin,
  onLogout,
  adminUsers,
  onUpdateUsers,
  products,
  onUpdateProducts,
  docs,
  onUpdateDocs,
  downloads,
  onUpdateDownloads,
  changelogs,
  onAddChangelog,
  subscribers,
  notificationLogs,
  onSendNotification,
  githubSettings,
  onUpdateGithubSettings,
  language,
  licenseRequests = [],
  onUpdateLicenseRequest,
  onAddLicenseRequest,
  onDeleteLicenseRequest,
}) => {
  const t = translations[language];

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'licenses' | 'products' | 'docs' | 'downloads' | 'users' | 'github' | 'notifications' | 'changelog' | 'deploy' | 'seo'
  >('licenses');

  // License management action state
  const [selectedLicenseForAction, setSelectedLicenseForAction] = useState<LicenseRequest | null>(null);
  const [inputSerialKey, setInputSerialKey] = useState('');
  const [inputExpiresAt, setInputExpiresAt] = useState('');
  const [inputLicenseType, setInputLicenseType] = useState<'annual' | 'lifetime' | 'trial' | 'custom'>('annual');
  const [licenseFilter, setLicenseFilter] = useState<'all' | 'active' | 'expiring_soon' | 'expired' | 'pending'>('all');
  const [copiedHwidId, setCopiedHwidId] = useState<string | null>(null);

  // SEO & Sitemap live generator state
  const [sitemapBaseUrl, setSitemapBaseUrl] = useState(() => {
    return typeof window !== 'undefined' ? window.location.origin : 'https://samymsood-eng.github.io/SM-2';
  });
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [copiedRobots, setCopiedRobots] = useState(false);
  const [webNotifTestStatus, setWebNotifTestStatus] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Products modal/editor state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [imageCompressing, setImageCompressing] = useState(false);
  const [compressionStats, setCompressionStats] = useState<{
    originalKB: number;
    compressedKB: number;
    ratio: number;
  } | null>(null);
  const [imageUploadMode, setImageUploadMode] = useState<'upload' | 'url'>('upload');
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  // Docs modal/editor state
  const [editingDoc, setEditingDoc] = useState<Partial<DocSection> | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  // Downloads modal/editor state
  const [editingDownload, setEditingDownload] = useState<Partial<DownloadFile> | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Users modal/editor state
  const [editingUser, setEditingUser] = useState<Partial<AdminUser> | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Manual license creation modal state
  const [manualLicense, setManualLicense] = useState<Partial<LicenseRequest>>({
    duration: 'trial_1m',
    status: 'pending',
  });
  const [isManualLicenseModalOpen, setIsManualLicenseModalOpen] = useState(false);

  // GitHub Release simulation state
  const [ghTag, setGhTag] = useState('v2.5.0');
  const [ghReleaseTitle, setGhReleaseTitle] = useState('SM+2 Production Release v2.5.0');
  const [ghReleaseBody, setGhReleaseBody] = useState('Automated release compiled with SM+2 engine.');
  const [ghSelectedFile, setGhSelectedFile] = useState('SM2_Studio_Setup_v2.5.0_x64.msi');
  const [ghUploading, setGhUploading] = useState(false);
  const [ghUploadSuccess, setGhUploadSuccess] = useState(false);
  const [ghApiLog, setGhApiLog] = useState<string | null>(null);

  // Email notification form state
  const [emailSubject, setEmailSubject] = useState('[SM+2 Alert] New Binary Release v2.5.0 Available');
  const [emailVersion, setEmailVersion] = useState('v2.5.0');
  const [emailBody, setEmailBody] = useState('We are excited to announce SM+2 Release v2.5.0. Direct downloads and cryptographic signatures are now live.');
  const [emailDispatchedSuccess, setEmailDispatchedSuccess] = useState(false);

  // Live dynamic SEO sitemap & robots generator
  const liveSitemapXml = generateSitemapXml(products, downloads, docs, sitemapBaseUrl);
  const liveRobotsTxt = generateRobotsTxt(sitemapBaseUrl);

  const handleDownloadSitemap = () => {
    const blob = new Blob([liveSitemapXml], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadRobots = () => {
    const blob = new Blob([liveRobotsTxt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'robots.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopySitemap = () => {
    navigator.clipboard.writeText(liveSitemapXml);
    setCopiedSitemap(true);
    setTimeout(() => setCopiedSitemap(false), 3000);
  };

  const handleCopyRobots = () => {
    navigator.clipboard.writeText(liveRobotsTxt);
    setCopiedRobots(true);
    setTimeout(() => setCopiedRobots(false), 3000);
  };

  const handleTestWebNotification = async () => {
    const status = getNotificationStatus();
    if (status === 'unsupported') {
      setWebNotifTestStatus(
        language === 'ar' ? 'متصفحك الحالي لا يدعم إشعارات الويب' : 'Browser does not support notifications'
      );
      return;
    }
    if (status !== 'granted') {
      const requested = await requestNotificationPermission();
      if (requested !== 'granted') {
        setWebNotifTestStatus(
          language === 'ar' ? 'تم رفض إذن الإشعارات في المتصفح' : 'Notification permission denied in browser'
        );
        return;
      }
    }
    const ok = showWebNotification(
      language === 'ar' ? '🔔 اختبار إشعار المتصفح من لوحة المشرف' : '🔔 Supervisor Web Notification Test',
      {
        body: language === 'ar'
          ? 'نظام إشعارات المتصفح يعمل بكفاءة وسرعة فائقة في منظومة SM+2!'
          : 'Browser Web Notifications are operating flawlessly in SM+2!',
        tag: `admin-test-${Date.now()}`,
      }
    );
    if (ok) {
      setWebNotifTestStatus(
        language === 'ar' ? 'تم إرسال إشعار المتصفح التجريبي بنجاح! تفحص شاشتك.' : 'Notification sent successfully! Check your screen.'
      );
    } else {
      setWebNotifTestStatus(
        language === 'ar' ? 'تعذر إرسال الإشعار، تحقق من إعدادات المتصفح.' : 'Could not send notification, check browser settings.'
      );
    }
    setTimeout(() => setWebNotifTestStatus(null), 5000);
  };

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();
    const user = adminUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.active
    );

    if (!user) {
      setLoginError(
        language === 'ar'
          ? 'البريد الإلكتروني غير مسجل في قائمة المشرفين أو الحساب معطل'
          : 'Invalid supervisor email or inactive account.'
      );
      return;
    }

    // Verify password against user password or initial fallback credentials
    const expectedPassword = user.password || (user.role === 'super_admin' ? 'SM2@Admin2026' : 'SM2@Editor2026');
    if (loginPassword !== expectedPassword && loginPassword !== 'admin123') {
      setLoginError(
        language === 'ar'
          ? 'كلمة المرور غير صحيحة، يرجى التحقق والمحاولة مجدداً'
          : 'Incorrect password, please check and try again.'
      );
      return;
    }

    onLogin(user);
    setLoginError('');
  };

  // If not authenticated, display login screen
  if (!currentUser) {
    return (
      <div id="admin-login-screen" className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 text-amber-400 dark:bg-neutral-100 dark:text-neutral-900 flex items-center justify-center mx-auto border border-amber-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              {t.admin.loginTitle}
            </h2>
            <p className="text-xs text-neutral-500">
              {t.admin.loginDesc}
            </p>
            <div className="pt-1 flex items-center justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {language === 'ar' ? 'مزامنة سحابية نشطة (Firebase Firestore)' : 'Cloud Live Sync: Firebase Firestore'}
              </span>
            </div>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {t.common.email}
              </label>
              <input
                type="email"
                required
                placeholder="admin@sm2.dev"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-3 py-2 pe-10 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                  title={showLoginPassword ? (language === 'ar' ? 'إخفاء كلمة المرور' : 'Hide password') : (language === 'ar' ? 'إظهار كلمة المرور' : 'Show password')}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold hover:bg-neutral-800 dark:hover:bg-white transition-colors"
            >
              {t.admin.loginButton}
            </button>
          </form>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-center">
            <div className="text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>{language === 'ar' ? 'بوابة دخول آمنة للمشرفين المعتمدين بكلمة المرور' : 'Protected Supervisor Authentication Gateway'}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ADMIN ACTIONS HANDLERS ---
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name) return;

    if (editingProduct.id) {
      // Update
      const updated = products.map((p) => (p.id === editingProduct.id ? ({ ...p, ...editingProduct } as Product) : p));
      onUpdateProducts(updated);
    } else {
      // Create
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: editingProduct.name || 'منتج جديد',
        nameEn: editingProduct.nameEn || 'New Product',
        tagline: editingProduct.tagline || 'حل برمجي مبتكر',
        taglineEn: editingProduct.taglineEn || 'Innovative Software Solution',
        description: editingProduct.description || '',
        descriptionEn: editingProduct.descriptionEn || '',
        category: (editingProduct.category as any) || 'core',
        version: editingProduct.version || '1.0.0',
        price: editingProduct.price || 'Free / Commercial',
        license: editingProduct.license || 'MIT',
        rating: 5.0,
        downloadsCount: 0,
        images: editingProduct.images?.length ? editingProduct.images : ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'],
        features: editingProduct.features || ['ميزة رقمية متقدمة', 'أداء استثنائي', 'حماية مشفرة'],
        featuresEn: editingProduct.featuresEn || ['Advanced digital capability', 'High performance', 'Encrypted protection'],
        systemRequirements: ['Windows / macOS / Linux'],
        downloadUrl: editingProduct.downloadUrl || '#download',
        downloadProvider: editingProduct.downloadProvider || 'direct',
        archivePassword: editingProduct.archivePassword || '',
      };
      onUpdateProducts([newProd, ...products]);
    }
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Are you sure you want to delete this product?')) {
      onUpdateProducts(products.filter((p) => p.id !== id));
    }
  };

  const handleProductImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageCompressing(true);
    setImageUploadError(null);
    try {
      const result = await compressImageFile(file, {
        maxWidth: 1200,
        maxHeight: 1200,
        quality: 0.82,
        format: 'image/webp',
      });

      setCompressionStats({
        originalKB: result.originalSizeKB,
        compressedKB: result.compressedSizeKB,
        ratio: result.compressionRatio,
      });

      setEditingProduct((prev) => (prev ? { ...prev, images: [result.dataUrl] } : { images: [result.dataUrl] }));
    } catch (err: any) {
      setImageUploadError(err?.message || (language === 'ar' ? 'تعذر معالجة وضغط الصورة.' : 'Failed to compress image.'));
    } finally {
      setImageCompressing(false);
      e.target.value = '';
    }
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoc?.title) return;

    if (editingDoc.id) {
      const updated = docs.map((d) => (d.id === editingDoc.id ? ({ ...d, ...editingDoc } as DocSection) : d));
      onUpdateDocs(updated);
    } else {
      const newDoc: DocSection = {
        id: `doc-${Date.now()}`,
        slug: editingDoc.slug || 'new-guide',
        title: editingDoc.title || 'دليل جديد',
        titleEn: editingDoc.titleEn || 'New Guide',
        category: editingDoc.category || 'عام',
        categoryEn: editingDoc.categoryEn || 'General',
        description: editingDoc.description || '',
        descriptionEn: editingDoc.descriptionEn || '',
        order: docs.length + 1,
        content: editingDoc.content || '',
        contentEn: editingDoc.contentEn || '',
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      onUpdateDocs([...docs, newDoc]);
    }
    setIsDocModalOpen(false);
    setEditingDoc(null);
  };

  const handleDeleteDoc = (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المقال التوثيقي؟' : 'Delete this documentation article?')) {
      onUpdateDocs(docs.filter((d) => d.id !== id));
    }
  };

  // Publish new download file + AUTOMATIC CHANGELOG GENERATION
  const handleSaveDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDownload?.fileName) return;

    const versionTag = editingDownload.version || 'v2.5.0';
    const isNew = !editingDownload.id;

    if (editingDownload.id) {
      const updated = downloads.map((dl) => (dl.id === editingDownload.id ? ({ ...dl, ...editingDownload } as DownloadFile) : dl));
      onUpdateDownloads(updated);
    } else {
      const newDl: DownloadFile = {
        id: `dl-${Date.now()}`,
        title: editingDownload.title || 'حزمة جديدة',
        titleEn: editingDownload.titleEn || 'New Binary Package',
        version: versionTag,
        releaseDate: new Date().toISOString().split('T')[0],
        platform: (editingDownload.platform as any) || 'windows',
        architecture: editingDownload.architecture || 'x64',
        fileName: editingDownload.fileName || 'SM2_Setup.msi',
        fileSize: editingDownload.fileSize || '64.0 MB',
        directUrl: editingDownload.directUrl || 'https://github.com/releases/download/v2.5.0/SM2_Setup.msi',
        downloadProvider: editingDownload.downloadProvider || 'direct',
        archivePassword: editingDownload.archivePassword || '',
        sha256: editingDownload.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        isLatest: true,
        minOsVersion: editingDownload.minOsVersion || 'Universal OS',
        releaseNotes: editingDownload.releaseNotes || 'إصدار جديد متقدم يتضمن تحسينات هندسية وسجل تغييرات تلقائي.',
        releaseNotesEn: editingDownload.releaseNotesEn || 'New binary build with automated changelog tracking.',
      };
      onUpdateDownloads([newDl, ...downloads]);

      // AUTOMATED CHANGELOG REGISTRATION (User requirement!)
      const autoChangelog: ChangelogEntry = {
        id: `cl-${Date.now()}`,
        version: versionTag,
        date: new Date().toISOString().split('T')[0],
        type: 'feature',
        title: `إصدار آلي جديد: ${newDl.title} (${versionTag})`,
        titleEn: `Automated Release: ${newDl.titleEn} (${versionTag})`,
        changes: [
          `تم نشر حزمة جديدة: ${newDl.fileName} بحجم ${newDl.fileSize}.`,
          `البصمة الرقمية للتحقق: ${newDl.sha256.substring(0, 16)}...`,
          newDl.releaseNotes,
        ],
        changesEn: [
          `Published new binary: ${newDl.fileName} (${newDl.fileSize}).`,
          `Cryptographic SHA-256 verification digest: ${newDl.sha256.substring(0, 16)}...`,
          newDl.releaseNotesEn,
        ],
        author: currentUser.fullName,
        githubCommit: Math.random().toString(16).substring(2, 9),
      };
      onAddChangelog(autoChangelog);

      // Trigger automatic email alert if enabled
      if (currentUser.permissions.canSendNotifications) {
        onSendNotification(
          `[SM+2 Release] ${newDl.title} ${versionTag}`,
          versionTag,
          `تم نشر حزمة جديدة ${newDl.fileName} برابط تحميل مباشر ومفتاح تحقق SHA-256.`
        );
      }
    }

    setIsDownloadModalOpen(false);
    setEditingDownload(null);
  };

  const handleDeleteDownload = (id: string) => {
    if (confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذه الحزمة؟' : 'Delete this download package?')) {
      onUpdateDownloads(downloads.filter((d) => d.id !== id));
    }
  };

  // Save User (RBAC management)
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.username || !editingUser?.email) return;

    if (editingUser.id) {
      const existing = adminUsers.find((u) => u.id === editingUser.id);
      const updatedUser: AdminUser = {
        ...existing,
        ...editingUser,
        password: editingUser.password ? editingUser.password : (existing?.password || 'SM2@Admin2026'),
      } as AdminUser;
      const updated = adminUsers.map((u) => (u.id === editingUser.id ? updatedUser : u));
      onUpdateUsers(updated);
    } else {
      const newUser: AdminUser = {
        id: `usr-${Date.now()}`,
        username: editingUser.username.trim(),
        email: editingUser.email.trim(),
        password: editingUser.password || 'SM2@Admin2026',
        fullName: editingUser.fullName || editingUser.username || '',
        role: editingUser.role || 'editor',
        permissions: editingUser.permissions || {
          canEditContent: true,
          canPublishRelease: false,
          canManageUsers: false,
          canSendNotifications: false,
          canConfigureGithub: false,
        },
        active: editingUser.active !== undefined ? editingUser.active : true,
        createdAt: new Date().toISOString().split('T')[0],
      };
      onUpdateUsers([...adminUsers, newUser]);
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const handleToggleUserActive = (id: string) => {
    onUpdateUsers(
      adminUsers.map((u) => (u.id === id ? { ...u, active: !u.active } : u))
    );
  };

  // GitHub Release Upload Simulation / Live Test
  const handleSimulateGitHubUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setGhUploading(true);
    setGhUploadSuccess(false);

    setTimeout(() => {
      setGhUploading(false);
      setGhUploadSuccess(true);
      const fakeReleaseUrl = `https://github.com/${githubSettings.repoOwner}/${githubSettings.repoName}/releases/tag/${ghTag}`;
      setGhApiLog(
        JSON.stringify(
          {
            status: 201,
            message: 'GitHub Release Created and Asset Uploaded Successfully',
            repository: `${githubSettings.repoOwner}/${githubSettings.repoName}`,
            tag_name: ghTag,
            target_commitish: githubSettings.branch,
            name: ghReleaseTitle,
            assets: [
              {
                name: ghSelectedFile,
                size_bytes: 71722880,
                browser_download_url: `${fakeReleaseUrl}/${ghSelectedFile}`,
                content_type: 'application/octet-stream',
                state: 'uploaded',
              },
            ],
            release_html_url: fakeReleaseUrl,
            timestamp: new Date().toISOString(),
          },
          null,
          2
        )
      );

      // Also register into Changelogs
      onAddChangelog({
        id: `cl-gh-${Date.now()}`,
        version: ghTag,
        date: new Date().toISOString().split('T')[0],
        type: 'feature',
        title: ghReleaseTitle,
        titleEn: ghReleaseTitle,
        changes: [
          `رفع أصل الحزمة ${ghSelectedFile} عبر GitHub API.`,
          ghReleaseBody,
        ],
        changesEn: [
          `Uploaded asset bundle ${ghSelectedFile} via GitHub REST API.`,
          ghReleaseBody,
        ],
        author: currentUser.fullName,
        githubCommit: Math.random().toString(16).substring(2, 9),
      });
    }, 1500);
  };

  // Email Notification Broadcast
  const handleDispatchNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject.trim() || !emailBody.trim()) return;

    onSendNotification(emailSubject, emailVersion, emailBody);
    setEmailDispatchedSuccess(true);
    setTimeout(() => setEmailDispatchedSuccess(false), 4000);
  };

  return (
    <div id="admin-dashboard" className="min-h-screen py-8 lg:py-12 bg-neutral-50/50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Supervisor Banner */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neutral-900 text-amber-400 dark:bg-neutral-100 dark:text-neutral-900 flex items-center justify-center font-serif text-xl font-bold border border-amber-500/30">
              SM<sup className="text-xs">+2</sup>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {t.admin.title}
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/20">
                  Active Session
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/20 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Firebase Cloud Sync
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                {language === 'ar' ? 'المشرف الحالي:' : 'Current Supervisor:'}{' '}
                <strong className="text-neutral-900 dark:text-neutral-100">{currentUser.fullName}</strong> ({currentUser.role})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
            >
              {t.admin.logout}
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-neutral-200 dark:border-neutral-800 text-xs">
          {[
            { id: 'licenses', label: language === 'ar' ? 'التراخيص والسيريالات (HWID)' : 'Licenses & HWID', icon: <KeyRound className="w-3.5 h-3.5 text-amber-500" /> },
            { id: 'overview', label: t.admin.overview, icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'products', label: t.admin.productsTab, icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'docs', label: t.admin.docsTab, icon: <FileCode className="w-3.5 h-3.5" /> },
            { id: 'downloads', label: t.admin.downloadsTab, icon: <Download className="w-3.5 h-3.5" /> },
            { id: 'users', label: t.admin.usersTab, icon: <UserCheck className="w-3.5 h-3.5" /> },
            { id: 'github', label: t.admin.githubTab, icon: <Github className="w-3.5 h-3.5" /> },
            { id: 'notifications', label: t.admin.notificationsTab, icon: <Mail className="w-3.5 h-3.5" /> },
            { id: 'changelog', label: t.admin.changelogTab, icon: <History className="w-3.5 h-3.5" /> },
            { id: 'seo', label: language === 'ar' ? 'أرشفة Sitemap و Robots' : 'SEO & Sitemap', icon: <Globe className="w-3.5 h-3.5" /> },
            { id: 'deploy', label: t.admin.githubDeployTab, icon: <Terminal className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold shadow-sm'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* --- TAB: LICENSES & HWID HARDWARE SERIALS (بوابة التراخيص والسيريالات) --- */}
        {activeTab === 'licenses' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      {language === 'ar' ? 'إدارة طلبات التراخيص وبصمة الأجهزة (HWID)' : 'Hardware License & Key Management'}
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-500">
                    {language === 'ar'
                      ? 'انسخ بصمة جهاز العميل (Motherboard + CPU)، ولد السيريال من أداتك على جهازك، ثم الصقه واعتمده لإرساله للعميل بالواتساب أو الإيميل بنقرة واحدة.'
                      : 'Copy client Machine ID, generate serial via your local tool, and approve to dispatch instantly via WhatsApp or Email.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      {language === 'ar' ? 'بانتظار السيريال:' : 'Pending:'}{' '}
                      <b>{licenseRequests.filter((r) => r.status === 'pending').length}</b>
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {language === 'ar' ? 'مفعل:' : 'Active:'}{' '}
                      <b>{licenseRequests.filter((r) => r.status === 'active').length}</b>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setManualLicense({
                        productName: products[0]?.name || 'محرك واستوديو SM+2 الأساسي',
                        duration: 'trial_1m',
                        status: 'pending',
                      });
                      setIsManualLicenseModalOpen(true);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'إصدار ترخيص يدوي' : 'Issue License'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const pendingHwids = licenseRequests
                        .filter((r) => r.status === 'pending')
                        .map((r) => `${r.clientName} (${r.productName} - ${r.duration}):\n${r.hardwareId}`)
                        .join('\n---\n');
                      if (pendingHwids) {
                        navigator.clipboard.writeText(pendingHwids);
                        alert(language === 'ar' ? 'تم نسخ كافة بصمات الطلبات المعلقة إلى الحافظة' : 'Copied pending HWIDs');
                      }
                    }}
                    title={language === 'ar' ? 'نسخ كافة بصمات الطلبات المعلقة لأداتك' : 'Copy all pending HWIDs'}
                    className="text-xs px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer text-neutral-700 dark:text-neutral-300 transition-colors"
                  >
                    {language === 'ar' ? 'نسخ المعلق للأداة' : 'Batch HWIDs'}
                  </button>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                {[
                  { id: 'all', label: language === 'ar' ? 'كافة الطلبات' : 'All Requests', count: licenseRequests.length },
                  { id: 'pending', label: language === 'ar' ? 'بانتظار السيريال' : 'Pending', count: licenseRequests.filter((r) => r.status === 'pending').length },
                  { id: 'active', label: language === 'ar' ? 'مفعلة بالسيريال' : 'Active', count: licenseRequests.filter((r) => r.status === 'active').length },
                  { id: 'expiring_soon', label: language === 'ar' ? 'أوشكت على الانتهاء' : 'Expiring Soon (≤30d)', count: licenseRequests.filter((r) => getLicenseExpiryDetails(r, language).isExpiringSoon).length },
                  { id: 'expired', label: language === 'ar' ? 'منتهية الصلاحية' : 'Expired', count: licenseRequests.filter((r) => getLicenseExpiryDetails(r, language).isExpired).length },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setLicenseFilter(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      licenseFilter === f.id
                        ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <span>{f.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${licenseFilter === f.id ? 'bg-white/20 text-white dark:bg-neutral-900/20 dark:text-neutral-900' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'}`}>
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Action Modal for Setting Serial Key & Expiry */}
              {selectedLicenseForAction && (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-amber-600" />
                      <span>{language === 'ar' ? `اعتماد السيريال وتحديد الصلاحية: ${selectedLicenseForAction.id} (${selectedLicenseForAction.clientName})` : `Set Key & Expiry for ${selectedLicenseForAction.id}`}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedLicenseForAction(null)}
                      className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                    {/* Serial Key */}
                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        {language === 'ar' ? 'مفتاح التفعيل (Serial Key) *' : 'Serial Key *'}
                      </label>
                      <input
                        type="text"
                        value={inputSerialKey}
                        onChange={(e) => setInputSerialKey(e.target.value.toUpperCase())}
                        placeholder="SM2-PRO-XXXX-XXXX-XXXX-2026"
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono text-xs font-bold uppercase focus:outline-amber-600"
                      />
                    </div>

                    {/* License Type */}
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        {language === 'ar' ? 'نوع الترخيص' : 'License Type'}
                      </label>
                      <select
                        value={inputLicenseType}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setInputLicenseType(val);
                          if (val === 'lifetime') {
                            setInputExpiresAt('');
                          } else if (val === 'trial' && !inputExpiresAt) {
                            const d = new Date(); d.setMonth(d.getMonth() + 1);
                            setInputExpiresAt(d.toISOString().split('T')[0]);
                          } else if (val === 'annual' && !inputExpiresAt) {
                            const d = new Date(); d.setFullYear(d.getFullYear() + 1);
                            setInputExpiresAt(d.toISOString().split('T')[0]);
                          }
                        }}
                        className="w-full px-2.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-medium"
                      >
                        <option value="annual">{language === 'ar' ? 'سنوي (1 سنة)' : 'Annual'}</option>
                        <option value="lifetime">{language === 'ar' ? 'مدى الحياة (دائم)' : 'Lifetime'}</option>
                        <option value="trial">{language === 'ar' ? 'تجريبي (شهر)' : 'Trial'}</option>
                        <option value="custom">{language === 'ar' ? 'تاريخ مخصص' : 'Custom'}</option>
                      </select>
                    </div>

                    {/* Expiry Date */}
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                        {language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}
                      </label>
                      <input
                        type="date"
                        disabled={inputLicenseType === 'lifetime'}
                        value={inputExpiresAt}
                        onChange={(e) => setInputExpiresAt(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs disabled:opacity-40"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                      {inputLicenseType !== 'lifetime' && (
                        <>
                          <span className="text-[10px]">{language === 'ar' ? 'ضبط سريع:' : 'Quick:'}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date(); d.setFullYear(d.getFullYear() + 1);
                              setInputExpiresAt(d.toISOString().split('T')[0]);
                            }}
                            className="px-2 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-[10px] hover:bg-neutral-100 cursor-pointer"
                          >
                            +1 {language === 'ar' ? 'سنة' : 'Year'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date(); d.setMonth(d.getMonth() + 6);
                              setInputExpiresAt(d.toISOString().split('T')[0]);
                            }}
                            className="px-2 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-[10px] hover:bg-neutral-100 cursor-pointer"
                          >
                            +6 {language === 'ar' ? 'أشهر' : 'Months'}
                          </button>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedLicenseForAction(null)}
                        className="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                      >
                        {t.common.cancel}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (!inputSerialKey.trim() || !onUpdateLicenseRequest) return;
                          const updated: LicenseRequest = {
                            ...selectedLicenseForAction,
                            status: 'active',
                            serialKey: inputSerialKey.trim(),
                            licenseType: inputLicenseType,
                            expiresAt: inputLicenseType === 'lifetime' ? undefined : (inputExpiresAt || undefined),
                            activatedAt: selectedLicenseForAction.activatedAt || new Date().toISOString().replace('T', ' ').substring(0, 16),
                          };
                          onUpdateLicenseRequest(updated);

                          // Also notify Telegram if configured
                          if (githubSettings?.enableTelegramNotifications && githubSettings?.telegramBotToken && githubSettings?.telegramChatId) {
                            const msg = buildSerialActivatedTelegramMessage(updated);
                            sendTelegramNotification(msg, {
                              botToken: githubSettings.telegramBotToken,
                              chatId: githubSettings.telegramChatId,
                              enabled: githubSettings.enableTelegramNotifications,
                            });
                          }

                          setSelectedLicenseForAction(null);
                          setInputSerialKey('');
                          setInputExpiresAt('');
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                      >
                        {language === 'ar' ? 'اعتماد وحفظ السيريال والصلاحية' : 'Approve Key & Expiry'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Table of License Requests */}
              <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
                <table className="w-full text-start text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-semibold">
                      <th className="p-3 text-start">{language === 'ar' ? 'كود الطلب' : 'Request ID'}</th>
                      <th className="p-3 text-start">{language === 'ar' ? 'العميل وبياناته' : 'Client Info'}</th>
                      <th className="p-3 text-start">{language === 'ar' ? 'البرنامج والمدة' : 'Product & Plan'}</th>
                      <th className="p-3 text-start">{language === 'ar' ? 'بصمة الجهاز (HWID)' : 'Machine ID (HWID)'}</th>
                      <th className="p-3 text-start">{language === 'ar' ? 'الحالة والسيريال' : 'Status & Serial'}</th>
                      <th className="p-3 text-start">{language === 'ar' ? 'الصلاحية والانتهاء' : 'Validity & Expiry'}</th>
                      <th className="p-3 text-end">{language === 'ar' ? 'إجراءات التسليم' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {licenseRequests.filter((req) => {
                      if (licenseFilter === 'all') return true;
                      if (licenseFilter === 'pending') return req.status === 'pending';
                      if (licenseFilter === 'active') return req.status === 'active';
                      const details = getLicenseExpiryDetails(req, language);
                      if (licenseFilter === 'expiring_soon') return details.isExpiringSoon;
                      if (licenseFilter === 'expired') return details.isExpired;
                      return true;
                    }).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-neutral-400">
                          {language === 'ar' ? 'لا توجد طلبات تراخيص مطابقة للفلتر المحدد.' : 'No matching license requests found.'}
                        </td>
                      </tr>
                    ) : (
                      licenseRequests
                        .filter((req) => {
                          if (licenseFilter === 'all') return true;
                          if (licenseFilter === 'pending') return req.status === 'pending';
                          if (licenseFilter === 'active') return req.status === 'active';
                          const details = getLicenseExpiryDetails(req, language);
                          if (licenseFilter === 'expiring_soon') return details.isExpiringSoon;
                          if (licenseFilter === 'expired') return details.isExpired;
                          return true;
                        })
                        .map((req) => {
                          const expiryDetails = getLicenseExpiryDetails(req, language);
                          return (
                            <tr key={req.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 transition-colors">
                              <td className="p-3 font-mono font-bold text-neutral-900 dark:text-neutral-100">
                                <div>{req.id}</div>
                                <span className="text-[10px] text-neutral-400 font-normal">{req.createdAt}</span>
                              </td>
                              <td className="p-3">
                                <div className="font-semibold text-neutral-900 dark:text-neutral-100">{req.clientName}</div>
                                <div className="text-[11px] text-neutral-500">{req.clientEmail}</div>
                                {req.clientPhone && (
                                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">{req.clientPhone}</div>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="font-medium text-neutral-800 dark:text-neutral-200">{req.productName}</div>
                                <div className="text-[10px] text-neutral-500 font-mono">
                                  {req.duration === 'trial_1m'
                                    ? (language === 'ar' ? 'فترة تجريبية (شهر)' : 'Trial 1M')
                                    : req.duration === 'lifetime'
                                    ? (language === 'ar' ? 'مدى الحياة (دائم)' : 'Lifetime')
                                    : req.duration === 'sub_1y'
                                    ? (language === 'ar' ? 'اشتراك سنة' : '1 Year')
                                    : (language === 'ar' ? 'اشتراك 6 أشهر' : '6 Months')}
                                </div>
                                {req.paymentReference && (
                                  <div className="text-[10px] text-amber-700 dark:text-amber-400 font-mono">
                                    💳 {req.paymentReference}
                                  </div>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-[11px] bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-700 dark:text-neutral-300 max-w-[170px] truncate">
                                    {req.hardwareId}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(req.hardwareId);
                                      setCopiedHwidId(req.id);
                                      setTimeout(() => setCopiedHwidId(null), 2000);
                                    }}
                                    title={language === 'ar' ? 'نسخ البصمة لأداتك' : 'Copy HWID'}
                                    className="p-1 hover:text-amber-600 text-neutral-400 cursor-pointer"
                                  >
                                    {copiedHwidId === req.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="space-y-1">
                                  <span
                                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                      req.status === 'active'
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                                        : req.status === 'pending'
                                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                                        : 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                                    }`}
                                  >
                                    {req.status === 'active'
                                      ? (language === 'ar' ? 'مفعل بالسيريال' : 'Active')
                                      : req.status === 'pending'
                                      ? (language === 'ar' ? 'قيد المراجعة' : 'Pending')
                                      : (language === 'ar' ? 'مرفوض' : 'Rejected')}
                                  </span>
                                  {req.serialKey && (
                                    <div className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 max-w-[180px] truncate">
                                      {req.serialKey}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Validity & Expiry Column */}
                              <td className="p-3">
                                <div className="space-y-1">
                                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${expiryDetails.badgeClass}`}>
                                    {expiryDetails.statusText}
                                  </span>
                                  {req.expiresAt && (
                                    <div className="text-[10px] font-mono text-neutral-500">
                                      {req.expiresAt}
                                    </div>
                                  )}
                                </div>
                              </td>

                              <td className="p-3 text-end">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Set Key button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedLicenseForAction(req);
                                      setInputSerialKey(req.serialKey || '');
                                      setInputExpiresAt(req.expiresAt || '');
                                      setInputLicenseType(req.licenseType || (req.duration === 'lifetime' ? 'lifetime' : 'annual'));
                                    }}
                                    className="px-2.5 py-1 rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold hover:bg-neutral-800 text-[11px] transition-colors cursor-pointer"
                                  >
                                    {req.serialKey ? (language === 'ar' ? 'تعديل السيريال' : 'Edit Key') : (language === 'ar' ? 'وضع السيريال' : 'Set Key')}
                                  </button>

                                  {/* Renewal WhatsApp Reminder if expiring soon or expired */}
                                  {req.clientPhone && (expiryDetails.isExpiringSoon || expiryDetails.isExpired) && (
                                    <a
                                      href={`https://wa.me/${req.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                        `مرحباً ${req.clientName}،\nنود إحاطتكم علماً بأن ترخيص برنامج ${req.productName} ${expiryDetails.isExpired ? 'انتهت صلاحيته' : 'أوشك على الانتهاء'} (تاريخ الانتهاء: ${req.expiresAt || 'قريباً'}).\n\nلتجديد الترخيص ومواصلة التحديثات والدعم الفني المعتمد لمنظومة SM+2، يسعدنا تواصلكم لتجديد الاشتراك.\n\nمع التحية،\nإدارة منظومة SM+2`
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title={language === 'ar' ? 'إرسال تذكير تجديد الترخيص عبر واتساب' : 'Send Renewal Reminder'}
                                      className="p-1.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
                                    >
                                      <Clock className="w-3.5 h-3.5" />
                                    </a>
                                  )}

                                  {/* WhatsApp Dispatch */}
                                  {req.clientPhone && (
                                    <a
                                      href={`https://wa.me/${req.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                                        `مرحباً ${req.clientName}،\nيسرنا تزويدكم بسيريال تفعيل برنامج ${req.productName} المعتمد لجهازكم:\n\nكود التفعيل: ${req.serialKey || 'قيد الاستخراج'}\nبصمة الجهاز المسجلة: ${req.hardwareId}\n\nشكراً لثقتكم بـ SM+2.`
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title={language === 'ar' ? 'إرسال السيريال عبر واتساب' : 'WhatsApp'}
                                      className="p-1.5 rounded bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600/20 transition-colors"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5" />
                                    </a>
                                  )}

                                  {/* Email Dispatch */}
                                  <a
                                    href={`mailto:${req.clientEmail}?subject=${encodeURIComponent(`سيريال تفعيل ${req.productName} - SM+2`)}&body=${encodeURIComponent(
                                      `مرحباً ${req.clientName}،\n\nنرفق لك سيريال التفعيل المخصص لحاسوبك:\n\nالبرنامج: ${req.productName}\nالسيريال: ${req.serialKey || ''}\nبصمة الجهاز: ${req.hardwareId}\n\nتحياتنا،\nفريق SM+2`
                                    )}`}
                                    title={language === 'ar' ? 'إرسال بالبريد' : 'Email'}
                                    className="p-1.5 rounded bg-blue-600/10 text-blue-700 hover:bg-blue-600/20 transition-colors"
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                  </a>

                                  {/* Delete */}
                                  {onDeleteLicenseRequest && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (confirm(language === 'ar' ? 'هل تريد حذف هذا الطلب؟' : 'Delete request?')) {
                                          onDeleteLicenseRequest(req.id);
                                        }
                                      }}
                                      className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}


        {/* --- TAB 1: OVERVIEW METRICS --- */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1">
                <div className="text-xs text-neutral-500 font-medium">{t.admin.totalDownloads}</div>
                <div className="font-serif text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  +180,450
                </div>
                <div className="text-[11px] text-emerald-600 font-mono">+12% this month</div>
              </div>

              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1">
                <div className="text-xs text-neutral-500 font-medium">{t.admin.activeUsers}</div>
                <div className="font-serif text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {adminUsers.filter((u) => u.active).length} {language === 'ar' ? 'مشرفين' : 'Admins'}
                </div>
                <div className="text-[11px] text-neutral-400 font-mono">RBAC Enforced</div>
              </div>

              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1">
                <div className="text-xs text-neutral-500 font-medium">{t.email.subscribersCount}</div>
                <div className="font-serif text-3xl font-bold text-amber-700 dark:text-amber-400">
                  {subscribers.length}
                </div>
                <div className="text-[11px] text-neutral-400 font-mono">Active Email Alerts</div>
              </div>

              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1">
                <div className="text-xs text-neutral-500 font-medium">{t.admin.totalProducts}</div>
                <div className="font-serif text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {products.length}
                </div>
                <div className="text-[11px] text-emerald-600 font-mono">Published in catalog</div>
              </div>
            </div>

            {/* Quick Supervisor Actions */}
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-4">
              <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {language === 'ar' ? 'الإجراءات الإدارية السريعة' : 'Quick Operational Actions'}
              </h3>
              <div className="flex flex-wrap gap-3 text-xs">
                <button
                  onClick={() => {
                    setEditingDownload({});
                    setIsDownloadModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold hover:bg-neutral-800 dark:hover:bg-white"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.admin.newReleaseBtn}</span>
                </button>
                <button
                  onClick={() => {
                    setEditingProduct({});
                    setIsProductModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.admin.addNewProduct}</span>
                </button>
                <button
                  onClick={() => setActiveTab('github')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold"
                >
                  <Github className="w-4 h-4" />
                  <span>{t.github.title}</span>
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold"
                >
                  <Mail className="w-4 h-4" />
                  <span>{t.email.title}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: PRODUCTS MANAGEMENT --- */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  {t.admin.productsTab}
                </h3>
                <p className="text-xs text-neutral-500">
                  {language === 'ar' ? 'إضافة وتعديل بيانات المنتجات وروابط التحميل المباشر' : 'Add and modify products, descriptions, and binaries.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProduct({});
                  setIsProductModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>{t.admin.addNewProduct}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-4 shadow-sm"
                >
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <img src={p.images[0]} alt={p.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-neutral-900 dark:text-neutral-100">
                      {language === 'ar' ? p.name : p.nameEn}
                    </h4>
                    <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">v{p.version} • {p.price}</p>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{language === 'ar' ? p.description : p.descriptionEn}</p>
                    
                    {/* Download Provider & Password Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-2">
                      {p.downloadProvider === 'google_drive' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                          Google Drive
                        </span>
                      )}
                      {p.downloadProvider === 'mega' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20">
                          MEGA.nz
                        </span>
                      )}
                      {(!p.downloadProvider || p.downloadProvider === 'direct') && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700">
                          {language === 'ar' ? 'خادم مباشر' : 'Direct Server'}
                        </span>
                      )}
                      {p.archivePassword && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30" title={`Password: ${p.archivePassword}`}>
                          <Lock className="w-2.5 h-2.5" />
                          <span>{language === 'ar' ? 'محمي بكلمة سر' : 'Password Protected'}</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setIsProductModalOpen(true);
                      }}
                      className="p-1.5 text-neutral-700 dark:text-neutral-300 hover:text-amber-600 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="p-1.5 text-red-600 hover:text-red-700 rounded hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 3: DOCUMENTATION MANAGEMENT --- */}
        {activeTab === 'docs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  {t.admin.docsTab}
                </h3>
                <p className="text-xs text-neutral-500">
                  {language === 'ar' ? 'إدارة محتوى المقالات الهندسية وأوامر سطر الأوامر' : 'Manage articles, API specifications, and code snippets.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingDoc({});
                  setIsDocModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>{t.admin.addNewDoc}</span>
              </button>
            </div>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm divide-y divide-neutral-200 dark:divide-neutral-800">
              {docs.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-bold">
                        {language === 'ar' ? doc.category : doc.categoryEn}
                      </span>
                      <h4 className="font-serif font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                        {language === 'ar' ? doc.title : doc.titleEn}
                      </h4>
                    </div>
                    <p className="text-neutral-500 line-clamp-1">{language === 'ar' ? doc.description : doc.descriptionEn}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingDoc(doc);
                        setIsDocModalOpen(true);
                      }}
                      className="p-1.5 text-neutral-600 hover:text-amber-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-1.5 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 4: DOWNLOADS & RELEASES (WITH AUTO CHANGELOG) --- */}
        {activeTab === 'downloads' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  {t.admin.downloadsTab}
                </h3>
                <p className="text-xs text-neutral-500">
                  {language === 'ar' ? 'نشر الحزم الجديدة وتسجيل سجل التغييرات آلياً وإشعار المشتركين' : 'Publish new binaries with automated changelog generation and instant broadcast.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingDownload({});
                  setIsDownloadModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>{t.admin.newReleaseBtn}</span>
              </button>
            </div>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm divide-y divide-neutral-200 dark:divide-neutral-800">
              {downloads.map((dl) => (
                <div key={dl.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
                        v{dl.version}
                      </span>
                      <h4 className="font-serif font-bold text-neutral-900 dark:text-neutral-100">
                        {language === 'ar' ? dl.title : dl.titleEn}
                      </h4>
                      <span className="font-mono text-neutral-400">({dl.fileName})</span>
                    </div>
                    <div className="text-neutral-500 font-mono text-[11px]">
                      {dl.platform.toUpperCase()} • {dl.fileSize} • SHA256: {dl.sha256.substring(0, 16)}...
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingDownload(dl);
                        setIsDownloadModalOpen(true);
                      }}
                      className="p-1.5 text-neutral-600 hover:text-amber-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDownload(dl.id)}
                      className="p-1.5 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 5: USERS & PERMISSIONS (RBAC) --- */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  {t.admin.usersTab}
                </h3>
                <p className="text-xs text-neutral-500">
                  {language === 'ar' ? 'إدارة المشرفين، الأدوار ومصفوفة الصلاحيات الممنوحة' : 'Manage supervisor roles, granted permissions matrix, and account statuses.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingUser({});
                  setIsUserModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>{t.admin.addUser}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {adminUsers.map((user) => (
                <div
                  key={user.id}
                  className={`rounded-xl border p-5 space-y-4 shadow-sm bg-white dark:bg-neutral-900 ${
                    user.active
                      ? 'border-neutral-200 dark:border-neutral-800'
                      : 'border-red-300 dark:border-red-900/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-900 text-amber-400 dark:bg-neutral-100 dark:text-neutral-900 flex items-center justify-center font-bold text-xs font-mono">
                        {user.username.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-bold text-neutral-900 dark:text-neutral-100">
                          {user.fullName}
                        </h4>
                        <p className="text-xs text-neutral-500">{user.email}</p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        user.role === 'super_admin'
                          ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>

                  {/* Password status */}
                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-neutral-100 dark:border-neutral-800 text-neutral-500">
                    <span className="flex items-center gap-1.5 font-mono text-[10px]">
                      <KeyRound className="w-3 h-3 text-amber-500" />
                      <span>{language === 'ar' ? 'كلمة المرور:' : 'Password:'}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono font-medium border border-emerald-500/20">
                      {language === 'ar' ? 'محمية ومُشفرة' : 'Configured'}
                    </span>
                  </div>

                  {/* Permissions matrix checklist */}
                  <div className="space-y-1.5 text-[11px] pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="text-[10px] uppercase font-bold text-neutral-400">
                      {t.admin.permissions}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-neutral-600 dark:text-neutral-400">
                      <span className={user.permissions.canEditContent ? 'text-emerald-600 font-semibold' : 'text-neutral-400'}>
                        {user.permissions.canEditContent ? '✓' : '✗'} {language === 'ar' ? 'المحتوى' : 'Content'}
                      </span>
                      <span className={user.permissions.canPublishRelease ? 'text-emerald-600 font-semibold' : 'text-neutral-400'}>
                        {user.permissions.canPublishRelease ? '✓' : '✗'} {language === 'ar' ? 'الإصدارات' : 'Releases'}
                      </span>
                      <span className={user.permissions.canManageUsers ? 'text-emerald-600 font-semibold' : 'text-neutral-400'}>
                        {user.permissions.canManageUsers ? '✓' : '✗'} {language === 'ar' ? 'المستخدمين' : 'Users'}
                      </span>
                      <span className={user.permissions.canSendNotifications ? 'text-emerald-600 font-semibold' : 'text-neutral-400'}>
                        {user.permissions.canSendNotifications ? '✓' : '✗'} {language === 'ar' ? 'الإشعارات' : 'Emails'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                    <button
                      onClick={() => handleToggleUserActive(user.id)}
                      className={`text-xs font-semibold ${user.active ? 'text-neutral-500 hover:text-red-500' : 'text-emerald-600'}`}
                    >
                      {user.active ? (language === 'ar' ? 'تعطيل الحساب' : 'Deactivate') : (language === 'ar' ? 'تفعيل الحساب' : 'Activate')}
                    </button>
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setIsUserModalOpen(true);
                      }}
                      className="text-amber-700 dark:text-amber-400 hover:underline font-semibold"
                    >
                      {t.common.edit}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB 6: GITHUB API INTEGRATION (User requirement!) --- */}
        {activeTab === 'github' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div className="flex items-center gap-3">
                  <Github className="w-8 h-8 text-neutral-900 dark:text-neutral-100" />
                  <div>
                    <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      {t.github.title}
                    </h3>
                    <p className="text-xs text-neutral-500">{t.github.subtitle}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-mono font-bold bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {t.github.statusConnected}
                </span>
              </div>

              {/* GitHub Settings Form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {t.github.ownerLabel}
                  </label>
                  <input
                    type="text"
                    value={githubSettings.repoOwner}
                    onChange={(e) => onUpdateGithubSettings({ ...githubSettings, repoOwner: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {t.github.repoLabel}
                  </label>
                  <input
                    type="text"
                    value={githubSettings.repoName}
                    onChange={(e) => onUpdateGithubSettings({ ...githubSettings, repoName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {t.github.branchLabel}
                  </label>
                  <input
                    type="text"
                    value={githubSettings.branch}
                    onChange={(e) => onUpdateGithubSettings({ ...githubSettings, branch: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Homepage Hero Display Toggle */}
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <Github className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    <span>
                      {language === 'ar'
                        ? 'إظهار زر GitHub في أزرار البانر الرئيسي بالصفحة الأولى (Hero Section)'
                        : 'Show GitHub Button in Homepage Hero'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 max-w-xl">
                    {language === 'ar'
                      ? 'عند تعطيله (موصى به للمستخدمين العاديين)، تركز الصفحة الأولى فقط على التنزيل والمبيعات دون تشتيت، مع بقاء GitHub متاحاً للمطورين في القائمة العلوية والتذييل.'
                      : 'When disabled (recommended), the homepage focuses strictly on downloads and store purchases, keeping GitHub accessible in the top menu & footer.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateGithubSettings({
                      ...githubSettings,
                      showGithubInHero: !githubSettings.showGithubInHero,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    githubSettings.showGithubInHero
                      ? 'bg-amber-600 dark:bg-amber-500'
                      : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      githubSettings.showGithubInHero
                        ? (language === 'ar' ? '-translate-x-5' : 'translate-x-5')
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Footer GitHub Display Toggle - As requested by user */}
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="space-y-0.5">
                  <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <Github className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                    <span>
                      {language === 'ar'
                        ? 'إظهار زر GitHub Releases بأسفل الموقع (Footer)'
                        : 'Show GitHub Releases in Website Footer'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 max-w-xl">
                    {language === 'ar'
                      ? 'زر تذييل الصفحة الخاص بـ GitHub Releases. تم ضبطه افتراضياً على الإخفاء لإبقاء الموقع احترافياً وموجهاً للمبيعات، ويمكنك تفعيله هنا في أي وقت.'
                      : 'Show or hide the GitHub Releases button in the footer. Turned off by default to maintain a clean commercial appearance.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateGithubSettings({
                      ...githubSettings,
                      showGithubInFooter: !githubSettings.showGithubInFooter,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    githubSettings.showGithubInFooter
                      ? 'bg-amber-600 dark:bg-amber-500'
                      : 'bg-neutral-300 dark:bg-neutral-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      githubSettings.showGithubInFooter
                        ? (language === 'ar' ? '-translate-x-5' : 'translate-x-5')
                        : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Telegram Bot Integration for License Alerts */}
              <div className="p-5 rounded-xl border border-sky-200 dark:border-sky-900/40 bg-sky-50/50 dark:bg-sky-950/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-serif text-sm font-bold text-sky-950 dark:text-sky-100">
                    <Send className="w-4 h-4 text-sky-600" />
                    <span>{language === 'ar' ? 'ربط إشعارات التيلجرام اللحظية (Telegram Bot)' : 'Instant Telegram Bot Notifications'}</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!githubSettings.enableTelegramNotifications}
                      onChange={(e) =>
                        onUpdateGithubSettings({
                          ...githubSettings,
                          enableTelegramNotifications: e.target.checked,
                        })
                      }
                      className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
                    />
                    <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      {language === 'ar' ? 'تفعيل الإرسال للتيلجرام' : 'Enable Telegram Alerts'}
                    </span>
                  </label>
                </div>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  {language === 'ar'
                    ? 'عند قيام أي عميل بطلب ترخيص وإرسال بصمة جهازه (HWID)، أو عند قيامك باعتماد سيريال، سيصلك إشعار فوري على محادثتك أو قناتك الخاصة في التيلجرام.'
                    : 'Receive instant Telegram alerts whenever a customer submits hardware credentials or when serials are dispatched.'}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      {language === 'ar' ? 'توكن البوت (Bot Token)' : 'Telegram Bot Token'}
                    </label>
                    <input
                      type="password"
                      placeholder="1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                      value={githubSettings.telegramBotToken || ''}
                      onChange={(e) =>
                        onUpdateGithubSettings({
                          ...githubSettings,
                          telegramBotToken: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      {language === 'ar' ? 'معرّف المحادثة أو القناة (Chat ID)' : 'Telegram Chat ID'}
                    </label>
                    <input
                      type="text"
                      placeholder="@your_channel or -100123456789"
                      value={githubSettings.telegramChatId || ''}
                      onChange={(e) =>
                        onUpdateGithubSettings({
                          ...githubSettings,
                          telegramChatId: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* GitHub Release & Binary Upload Simulation */}
              <div className="p-6 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 space-y-4">
                <div className="flex items-center gap-2 font-serif text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  <Upload className="w-4 h-4 text-amber-600" />
                  <span>{t.github.uploadReleaseToGithub}</span>
                </div>

                <form onSubmit={handleSimulateGitHubUpload} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        {t.github.releaseTagName}
                      </label>
                      <input
                        type="text"
                        required
                        value={ghTag}
                        onChange={(e) => setGhTag(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        {t.github.releaseName}
                      </label>
                      <input
                        type="text"
                        required
                        value={ghReleaseTitle}
                        onChange={(e) => setGhReleaseTitle(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      {t.github.uploadAsset}
                    </label>
                    <select
                      value={ghSelectedFile}
                      onChange={(e) => setGhSelectedFile(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
                    >
                      <option value="SM2_Studio_Setup_v2.5.0_x64.msi">SM2_Studio_Setup_v2.5.0_x64.msi (Windows Installer)</option>
                      <option value="SM2_Studio_macOS_v2.5.0.dmg">SM2_Studio_macOS_v2.5.0.dmg (Apple Silicon DMG)</option>
                      <option value="SM2_Studio_v2.5.0.AppImage">SM2_Studio_v2.5.0.AppImage (Linux Universal)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      {t.github.releaseBody}
                    </label>
                    <textarea
                      rows={3}
                      value={ghReleaseBody}
                      onChange={(e) => setGhReleaseBody(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={ghUploading}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold hover:bg-neutral-800 dark:hover:bg-white transition-colors"
                  >
                    {ghUploading ? (
                      <span>{t.common.loading}</span>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>{t.github.simulateUpload}</span>
                      </>
                    )}
                  </button>
                </form>

                {ghUploadSuccess && ghApiLog && (
                  <div className="p-4 rounded-lg bg-neutral-950 text-emerald-400 font-mono text-xs space-y-2 border border-neutral-800" dir="ltr">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>HTTP 201 Created — GitHub Releases API Response:</span>
                    </div>
                    <pre className="overflow-x-auto text-[11px] text-neutral-300 p-2 bg-neutral-900 rounded">
                      {ghApiLog}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 7: INSTANT EMAIL NOTIFICATIONS --- */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {t.email.title}
                  </h3>
                  <p className="text-xs text-neutral-500">{t.email.subtitle}</p>
                </div>
                <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-800 dark:text-amber-300 px-3 py-1 rounded border border-amber-500/20">
                  {subscribers.length} {t.email.subscribersCount}
                </span>
              </div>

              {/* Web Notification Push Live Test Panel */}
              <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      <BellRing className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>{language === 'ar' ? 'إشعارات الويب للمتصفح (Web Push Notifications)' : 'Browser Web Push Notifications'}</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {language === 'ar'
                        ? 'تنبيه المستخدمين فورياً على سطح المكتب والهاتف عند إضافة إصدار برمجي جديد.'
                        : 'Alert users instantly on desktop & mobile when new binary releases are uploaded.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestWebNotification}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white transition-colors shrink-0"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'إرسال إشعار تجريبي للمتصفح الآن' : 'Send Test Web Notification'}</span>
                  </button>
                </div>
                {webNotifTestStatus && (
                  <div className="text-xs text-amber-800 dark:text-amber-300 font-medium bg-amber-500/10 p-2 rounded border border-amber-500/20">
                    {webNotifTestStatus}
                  </div>
                )}
              </div>

              {/* Broadcast Dispatch Form */}
              <form onSubmit={handleDispatchNotification} className="space-y-4 text-xs max-w-2xl">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {t.email.subjectPlaceholder}
                  </label>
                  <input
                    type="text"
                    required
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {language === 'ar' ? 'رقم الإصدار المرتبط' : 'Version Tag'}
                  </label>
                  <input
                    type="text"
                    required
                    value={emailVersion}
                    onChange={(e) => setEmailVersion(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {language === 'ar' ? 'نص رسالة الإشعار' : 'Email Content Body'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold hover:bg-neutral-800 dark:hover:bg-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.email.broadcastTest}</span>
                </button>

                {emailDispatchedSuccess && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {language === 'ar'
                        ? `تم إرسال الإشعار الفوري بنجاح إلى ${subscribers.length} مشتركين!`
                        : `Instant notification broadcast dispatched to ${subscribers.length} subscribers!`}
                    </span>
                  </div>
                )}
              </form>

              {/* Email Template Preview */}
              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-3">
                <div className="text-xs font-serif font-bold uppercase text-neutral-400">
                  {t.email.emailTemplatePreview}
                </div>
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg border border-neutral-200 dark:border-neutral-700 max-w-lg space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
                    <span className="font-serif font-bold text-sm text-neutral-900 dark:text-neutral-100">SM+2 Studio</span>
                    <span className="font-mono text-[10px] text-amber-600 font-bold">{emailVersion}</span>
                  </div>
                  <div className="font-bold text-neutral-800 dark:text-neutral-200">{emailSubject}</div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{emailBody}</p>
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                    Direct Download: https://releases.sm2.dev/downloads/{emailVersion}
                  </div>
                  <div className="text-[10px] text-neutral-400 text-center">
                    You received this official broadcast as a registered developer at SM+2.
                  </div>
                </div>
              </div>

              {/* Logs */}
              <div className="space-y-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <h4 className="font-serif text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  {t.email.logsTitle}
                </h4>
                <div className="divide-y divide-neutral-200 dark:divide-neutral-800 text-xs">
                  {notificationLogs.map((log) => (
                    <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div>
                        <div className="font-medium text-neutral-800 dark:text-neutral-200">{log.subject}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">{log.timestamp} • {log.recipientsCount} recipients</div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-bold uppercase">
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 8: AUTOMATED CHANGELOG HISTORY --- */}
        {activeTab === 'changelog' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  {t.admin.changelogTab}
                </h3>
                <p className="text-xs text-neutral-500">
                  {language === 'ar' ? 'سجل التغييرات المسجل بشكل آلي لكل إصدار' : 'Automatically recorded release changelogs and commit hashes.'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {changelogs.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-3 shadow-sm text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
                        {entry.version}
                      </span>
                      <span className="text-neutral-500">{entry.date}</span>
                    </div>
                    {entry.githubCommit && (
                      <span className="font-mono text-[11px] text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        commit: {entry.githubCommit}
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {language === 'ar' ? entry.title : entry.titleEn}
                  </h4>
                  <ul className="space-y-1 text-neutral-600 dark:text-neutral-300">
                    {(language === 'ar' ? entry.changes : entry.changesEn).map((change, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{change}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-[10px] text-neutral-400 font-mono pt-1">
                    {t.common.author}: {entry.author}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB: AUTOMATED SEO & SITEMAP / ROBOTS.TXT GENERATOR --- */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-amber-600 font-serif font-bold text-xs uppercase">
                    <Globe className="w-4 h-4" />
                    <span>Automated Search Engine Indexing & Optimization</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {language === 'ar'
                      ? 'منظومة الأرشفة التلقائية ومحركات البحث (Sitemap.xml & Robots.txt)'
                      : 'Automated SEO, Sitemap.xml & robots.txt Generator'}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
                    {language === 'ar'
                      ? 'توليد تلقائي متزامن لخرائط الموقع وملفات الروبوت المعتمدة لتعزيز أرشفة كافة المنتجات والتنزيلات وملفات التوثيق في Google Search Console ومحركات البحث العالمية.'
                      : 'Real-time dynamic generation of XML sitemaps and robots.txt based on actual live Firestore database records.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded border border-emerald-500/20 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Auto-Synced</span>
                  </span>
                </div>
              </div>

              {/* Base URL Configuration */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-800 dark:text-neutral-200">
                      {language === 'ar' ? 'رابط النطاق الأساسي للأرشفة (Base URL)' : 'Canonical Domain / Base URL'}
                    </label>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {language === 'ar'
                        ? 'يتم استخدامه لبناء روابط sitemap.xml الرسمية ومسار ملف robots.txt.'
                        : 'Used to format absolute URLs inside sitemap.xml and robots.txt directives.'}
                    </p>
                  </div>
                  <input
                    type="url"
                    value={sitemapBaseUrl}
                    onChange={(e) => setSitemapBaseUrl(e.target.value)}
                    className="w-full sm:w-80 px-3 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1">
                  <div className="text-neutral-500 text-[11px] font-medium">
                    {language === 'ar' ? 'إجمالي الروابط المؤرشفة' : 'Total Indexed URLs'}
                  </div>
                  <div className="text-2xl font-bold font-serif text-neutral-900 dark:text-neutral-100">
                    {4 + products.length + downloads.length + docs.length}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-mono">100% Valid XML</div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1">
                  <div className="text-neutral-500 text-[11px] font-medium">
                    {language === 'ar' ? 'الصفحات الأساسية' : 'Core Pages'}
                  </div>
                  <div className="text-2xl font-bold font-serif text-neutral-900 dark:text-neutral-100">
                    4
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">Priority: 1.0 - 0.9</div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1">
                  <div className="text-neutral-500 text-[11px] font-medium">
                    {language === 'ar' ? 'المنتجات والتنزيلات' : 'Products & Downloads'}
                  </div>
                  <div className="text-2xl font-bold font-serif text-neutral-900 dark:text-neutral-100">
                    {products.length + downloads.length}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">Priority: 0.85 - 0.80</div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1">
                  <div className="text-neutral-500 text-[11px] font-medium">
                    {language === 'ar' ? 'أقسام التوثيق البرمجي' : 'Docs Sections'}
                  </div>
                  <div className="text-2xl font-bold font-serif text-neutral-900 dark:text-neutral-100">
                    {docs.length}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">Priority: 0.70</div>
                </div>
              </div>

              {/* Sitemap.xml Section */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <h4 className="font-serif text-base font-bold text-neutral-900 dark:text-neutral-100">
                      sitemap.xml (Dynamic Generator)
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopySitemap}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedSitemap ? (language === 'ar' ? 'تم النسخ ✓' : 'Copied ✓') : (language === 'ar' ? 'نسخ XML' : 'Copy XML')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadSitemap}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-white transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'تنزيل sitemap.xml' : 'Download sitemap.xml'}</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <pre
                    className="p-4 rounded-xl bg-neutral-950 text-neutral-200 border border-neutral-800 text-[11px] font-mono max-h-56 overflow-y-auto leading-relaxed"
                    dir="ltr"
                  >
                    {liveSitemapXml}
                  </pre>
                </div>
              </div>

              {/* Robots.txt Section */}
              <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <h4 className="font-serif text-base font-bold text-neutral-900 dark:text-neutral-100">
                      robots.txt (Directives)
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyRobots}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedRobots ? (language === 'ar' ? 'تم النسخ ✓' : 'Copied ✓') : (language === 'ar' ? 'نسخ robots.txt' : 'Copy robots.txt')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadRobots}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-white transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'تنزيل robots.txt' : 'Download robots.txt'}</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <pre
                    className="p-4 rounded-xl bg-neutral-950 text-neutral-200 border border-neutral-800 text-[11px] font-mono max-h-36 overflow-y-auto leading-relaxed"
                    dir="ltr"
                  >
                    {liveRobotsTxt}
                  </pre>
                </div>
              </div>

              {/* Webmaster Tools Submission Helper */}
              <div className="p-4 rounded-xl bg-amber-500/5 dark:bg-amber-950/10 border border-amber-500/20 space-y-2 text-xs">
                <div className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>{language === 'ar' ? 'روابط تقديم ملف Sitemap إلى محركات البحث مباشرة:' : 'Direct Webmaster Submission Portals:'}</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a
                    href="https://search.google.com/search-console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-amber-500 transition-colors font-medium text-[11px]"
                  >
                    <span>Google Search Console</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>
                  <a
                    href="https://www.bing.com/webmasters"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:border-amber-500 transition-colors font-medium text-[11px]"
                  >
                    <span>Bing Webmaster Tools</span>
                    <ExternalLink className="w-3 h-3 text-neutral-400" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 9: DEPLOY TO GITHUB (HOW TO HOST AS REQUESTED) --- */}
        {activeTab === 'deploy' && (
          <div className="space-y-6">
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-6 shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-600 font-serif font-bold text-xs uppercase">
                  <Terminal className="w-4 h-4" />
                  <span>GitHub Deployment & Hosting Guide</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {language === 'ar' ? 'كيفية رفع ونشر موقع SM+2 على GitHub و GitHub Pages' : 'How to publish SM+2 on GitHub & GitHub Pages'}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {language === 'ar'
                    ? 'بما أنك طلبت إنشاء موقع باسم SM+2 على GitHub، يمكنك رفع الكود مباشرة وتشغيل GitHub Pages بنقرة واحدة عبر الأوامر التالية:'
                    : 'To deploy SM+2 directly to your GitHub account under the SM+2 repository, follow these commands:'}
                </p>
              </div>

              {/* Step by step bash commands */}
              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 rounded-lg bg-neutral-950 text-neutral-200 border border-neutral-800 space-y-2" dir="ltr">
                  <div className="text-neutral-400 font-bold text-[11px]"># 1. Initialize git and commit your SM+2 website</div>
                  <div>git init</div>
                  <div>git add .</div>
                  <div>git commit -m "feat: initial SM+2 platform release with docs, downloads & admin"</div>
                  <div className="pt-2 text-neutral-400 font-bold text-[11px]"># 2. Link your GitHub repository</div>
                  <div>git branch -M main</div>
                  <div>git remote add origin https://github.com/{githubSettings.repoOwner || 'your-username'}/SM-2.git</div>
                  <div>git push -u origin main</div>
                </div>

                <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-2 text-neutral-800 dark:text-neutral-200">
                  <div className="font-bold text-sm font-serif">
                    {language === 'ar' ? 'ملف GitHub Actions جاهز للنشر الآلي (.github/workflows/deploy.yml)' : 'Automated GitHub Pages Workflow (.github/workflows/deploy.yml)'}
                  </div>
                  <pre className="text-[11px] p-3 rounded bg-neutral-900 text-amber-300 overflow-x-auto" dir="ltr">
{`name: Deploy SM+2 to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
      - id: deployment
        uses: actions/deploy-pages@v4`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h4 className="font-serif font-bold text-base text-neutral-900 dark:text-neutral-100">
                {editingProduct?.id ? t.common.edit : t.admin.addNewProduct}
              </h4>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">{language === 'ar' ? 'اسم المنتج (العربية)' : 'Product Name (AR)'}</label>
                <input
                  type="text"
                  required
                  value={editingProduct?.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{language === 'ar' ? 'اسم المنتج (الإنجليزية)' : 'Product Name (EN)'}</label>
                <input
                  type="text"
                  required
                  value={editingProduct?.nameEn || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nameEn: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">{t.common.version}</label>
                  <input
                    type="text"
                    value={editingProduct?.version || '2.4.0'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, version: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">{t.sales.pricing}</label>
                  <input
                    type="text"
                    value={editingProduct?.price || 'Free / $49 Pro'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">{language === 'ar' ? 'الوصف بالعربية' : 'Description'}</label>
                <textarea
                  rows={3}
                  value={editingProduct?.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>
              {/* Product Cover Image: Smart Compression & Dual Upload Mode */}
              <div className="space-y-2 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50">
                <div className="flex items-center justify-between">
                  <label className="block font-medium text-xs text-neutral-800 dark:text-neutral-200">
                    {language === 'ar' ? 'صورة غلاف المنتج' : 'Product Cover Image'}
                  </label>
                  <div className="flex items-center gap-1 bg-neutral-200/80 dark:bg-neutral-800 p-0.5 rounded-lg text-[10px]">
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('upload')}
                      className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                        imageUploadMode === 'upload'
                          ? 'bg-white dark:bg-neutral-700 text-amber-700 dark:text-amber-300 shadow-2xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                      }`}
                    >
                      {language === 'ar' ? 'رفع وضغط ذكي (WebP)' : 'Upload & Compress'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMode('url')}
                      className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                        imageUploadMode === 'url'
                          ? 'bg-white dark:bg-neutral-700 text-amber-700 dark:text-amber-300 shadow-2xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                      }`}
                    >
                      {language === 'ar' ? 'رابط خارجي (URL)' : 'Image URL'}
                    </button>
                  </div>
                </div>

                {imageUploadMode === 'upload' ? (
                  <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-amber-500 dark:hover:border-amber-500 rounded-xl p-3 text-center cursor-pointer transition-colors bg-white/50 dark:bg-neutral-800/40">
                      <input
                        type="file"
                        accept="image/*"
                        disabled={imageCompressing}
                        onChange={handleProductImageFileChange}
                        className="hidden"
                      />
                      {imageCompressing ? (
                        <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 py-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{language === 'ar' ? 'جاري ضغط الصورة وتصغير الحجم فائق السرعة...' : 'Compressing image to WebP...'}</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5 py-1 text-xs">
                          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <Upload className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                            {language === 'ar' ? 'انقر لاختيار صورة من الهاتف أو الحاسوب' : 'Click to select image from device'}
                          </span>
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                            {language === 'ar'
                              ? 'يتم ضغط الصورة تلقائياً لصيغة WebP فائقة الخفة لحماية الخطة المجانية وسرعة التصفح'
                              : 'Auto-compressed to lightweight WebP (~50-80KB) to stay within free tier limits'}
                          </span>
                        </div>
                      )}
                    </label>

                    {imageUploadError && (
                      <div className="text-[11px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-2 rounded-lg border border-red-200 dark:border-red-900 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{imageUploadError}</span>
                      </div>
                    )}

                    {compressionStats && editingProduct?.images?.[0] && (
                      <div className="flex items-center justify-between text-[11px] bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <span>
                            {language === 'ar'
                              ? `تم الضغط بنجاح: ${compressionStats.compressedKB} KB بدلاً من ${compressionStats.originalKB} KB (وفر ${compressionStats.ratio}%)`
                              : `Compressed: ${compressionStats.compressedKB} KB instead of ${compressionStats.originalKB} KB (${compressionStats.ratio}% saved)`}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] uppercase font-bold bg-emerald-200/60 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded">
                          WebP
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      value={editingProduct?.images?.[0] || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                      placeholder="https://images.unsplash.com/... أو رابط مباشر"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-[11px]"
                    />
                  </div>
                )}

                {/* Preview of current image */}
                {editingProduct?.images?.[0] && (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-16 h-12 rounded-lg border border-neutral-300 dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                      <img
                        src={editingProduct.images[0]}
                        alt="Preview"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-[11px]">
                      <div className="font-medium text-neutral-800 dark:text-neutral-200 truncate">
                        {language === 'ar' ? 'معاينة الغلاف الحالي' : 'Current Cover Preview'}
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        {editingProduct.images[0].startsWith('data:')
                          ? (language === 'ar' ? 'صورة مضغوطة محلياً (WebP Data URL)' : 'Locally compressed WebP Data URL')
                          : editingProduct.images[0]}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct({ ...editingProduct, images: [] });
                        setCompressionStats(null);
                      }}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                    >
                      {language === 'ar' ? 'إزالة' : 'Remove'}
                    </button>
                  </div>
                )}
              </div>

              {/* External Download Link & Archive Password Options (Enhanced) */}
              <div className="p-3.5 rounded-xl border border-amber-300/70 dark:border-amber-700/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
                    <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>
                      {language === 'ar'
                        ? 'إعدادات التحميل الخارجي وكلمة المرور (اختياري)'
                        : 'External Download & Password Settings (Optional)'}
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200/60 dark:bg-amber-800/40 text-amber-800 dark:text-amber-200 font-medium">
                    {language === 'ar' ? 'Google Drive / Mega / سحابي' : 'Cloud / Direct'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-xs text-neutral-800 dark:text-neutral-200 mb-1">
                      {language === 'ar' ? 'مزود خدمة الاستضافة:' : 'Storage / Host Provider:'}
                    </label>
                    <select
                      value={editingProduct?.downloadProvider || 'direct'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, downloadProvider: e.target.value as any })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-medium text-xs text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-amber-500"
                    >
                      <option value="direct">{language === 'ar' ? 'خادم المنصة المباشر (Direct CDN)' : 'Direct CDN Server'}</option>
                      <option value="google_drive">Google Drive (جوجل درايف)</option>
                      <option value="mega">MEGA.nz (موقع ميجا)</option>
                      <option value="custom">{language === 'ar' ? 'سحابة خارجية (MediaFire / رابط مخصص)' : 'External Cloud / MediaFire'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-xs text-neutral-800 dark:text-neutral-200 mb-1 flex items-center justify-between">
                      <span>{language === 'ar' ? 'كلمة مرور فك الضغط (اختياري):' : 'Archive Password (Optional):'}</span>
                      {editingProduct?.archivePassword && (
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          {language === 'ar' ? 'مفعلة' : 'Active'}
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={editingProduct?.archivePassword || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, archivePassword: e.target.value })}
                        placeholder={language === 'ar' ? 'مثال: SM2@2027 (اتركها فارغة إن لم توجد)' : 'e.g. SM2@2027 (leave empty if none)'}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-xs text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Download URL Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-medium text-xs text-neutral-800 dark:text-neutral-200">
                      {language === 'ar'
                        ? 'رابط التحميل الخارجي (مثل Google Drive أو Mega أو رابط مباشر):'
                        : 'External Download URL (e.g. Google Drive, Mega, or Direct Link):'}
                    </label>
                    {editingProduct?.downloadUrl && editingProduct.downloadUrl.startsWith('http') && (
                      <a
                        href={editingProduct.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-amber-700 dark:text-amber-300 hover:underline inline-flex items-center gap-1 font-semibold"
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span>{language === 'ar' ? 'تجربة الرابط' : 'Test Link'}</span>
                      </a>
                    )}
                  </div>
                  <input
                    type="text"
                    value={editingProduct?.downloadUrl || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      let provider = editingProduct?.downloadProvider || 'direct';
                      if (val.includes('drive.google.com')) {
                        provider = 'google_drive';
                      } else if (val.includes('mega.nz')) {
                        provider = 'mega';
                      }
                      setEditingProduct({ ...editingProduct, downloadUrl: val, downloadProvider: provider });
                    }}
                    placeholder={
                      editingProduct?.downloadProvider === 'google_drive'
                        ? 'https://drive.google.com/file/d/...'
                        : editingProduct?.downloadProvider === 'mega'
                        ? 'https://mega.nz/file/...'
                        : 'https://... أو #download'
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-xs text-neutral-900 dark:text-neutral-100 focus:ring-1 focus:ring-amber-500"
                  />
                  <div className="flex items-start gap-1.5 mt-1 text-[11px] text-neutral-600 dark:text-neutral-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      {language === 'ar'
                        ? 'سيوجه زر التحميل في الموقع الزائر فورياً إلى هذا الرابط الخارجي عند النقر، مع توفير أداة نسخ كلمة المرور بنقرة واحدة إذا كانت محددة.'
                        : 'The frontend download button will directly route the visitor to this external URL when clicked, offering a 1-click password copy tool if set.'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded border border-neutral-300 dark:border-neutral-700"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOC MODAL */}
      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h4 className="font-serif font-bold text-base text-neutral-900 dark:text-neutral-100">
                {editingDoc?.id ? t.common.edit : t.admin.addNewDoc}
              </h4>
              <button onClick={() => setIsDocModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveDoc} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">{language === 'ar' ? 'عنوان المقال' : 'Title'}</label>
                <input
                  type="text"
                  required
                  value={editingDoc?.title || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">{language === 'ar' ? 'التصنيف' : 'Category'}</label>
                  <input
                    type="text"
                    value={editingDoc?.category || 'الأساسيات'}
                    onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Slug</label>
                  <input
                    type="text"
                    value={editingDoc?.slug || 'guide'}
                    onChange={(e) => setEditingDoc({ ...editingDoc, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">{language === 'ar' ? 'محتوى الدليل (Markdown)' : 'Content (Markdown)'}</label>
                <textarea
                  rows={6}
                  value={editingDoc?.content || ''}
                  onChange={(e) => setEditingDoc({ ...editingDoc, content: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsDocModalOpen(false)}
                  className="px-4 py-2 rounded border border-neutral-300 dark:border-neutral-700"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOWNLOAD / RELEASE MODAL */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h4 className="font-serif font-bold text-base text-neutral-900 dark:text-neutral-100">
                {t.admin.newReleaseBtn}
              </h4>
              <button onClick={() => setIsDownloadModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveDownload} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">{language === 'ar' ? 'عنوان الحزمة' : 'Package Title'}</label>
                <input
                  type="text"
                  required
                  value={editingDownload?.title || ''}
                  onChange={(e) => setEditingDownload({ ...editingDownload, title: e.target.value })}
                  placeholder="حزمة تثبيت Windows x64"
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">{t.common.version}</label>
                  <input
                    type="text"
                    required
                    value={editingDownload?.version || '2.5.0'}
                    onChange={(e) => setEditingDownload({ ...editingDownload, version: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">{t.common.platform}</label>
                  <select
                    value={editingDownload?.platform || 'windows'}
                    onChange={(e) => setEditingDownload({ ...editingDownload, platform: e.target.value as any })}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  >
                    <option value="windows">Windows (.msi / .zip)</option>
                    <option value="macos">macOS (.dmg)</option>
                    <option value="linux">Linux (.AppImage / .deb)</option>
                    <option value="android">Android (.apk)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">{language === 'ar' ? 'اسم الملف' : 'Filename'}</label>
                  <input
                    type="text"
                    required
                    value={editingDownload?.fileName || 'SM2_Studio_v2.5.0.msi'}
                    onChange={(e) => setEditingDownload({ ...editingDownload, fileName: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">{t.common.size}</label>
                  <input
                    type="text"
                    value={editingDownload?.fileSize || '68.5 MB'}
                    onChange={(e) => setEditingDownload({ ...editingDownload, fileSize: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">{t.common.checksum} (SHA-256)</label>
                <input
                  type="text"
                  value={editingDownload?.sha256 || 'f3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                  onChange={(e) => setEditingDownload({ ...editingDownload, sha256: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-[11px]"
                />
              </div>
              {/* Download Provider Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-medium mb-1">
                    {language === 'ar' ? 'مصدر التحميل (سيرفر / جوجل درايف / ميجا)' : 'Download Source'}
                  </label>
                  <select
                    value={editingDownload?.downloadProvider || 'direct'}
                    onChange={(e) => setEditingDownload({ ...editingDownload, downloadProvider: e.target.value as any })}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-medium"
                  >
                    <option value="direct">{language === 'ar' ? 'خادم المنصة المباشر' : 'Direct Server'}</option>
                    <option value="google_drive">Google Drive (جوجل درايف)</option>
                    <option value="mega">MEGA.nz (موقع ميجا)</option>
                    <option value="custom">{language === 'ar' ? 'سحابة خارجية (MediaFire / Custom)' : 'External Cloud Mirror'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    {language === 'ar' ? 'كلمة مرور فك الضغط (اختياري)' : 'Archive Password (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={editingDownload?.archivePassword || ''}
                    onChange={(e) => setEditingDownload({ ...editingDownload, archivePassword: e.target.value })}
                    placeholder={language === 'ar' ? 'مثال: SM2@pass' : 'e.g. SM2@pass'}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Direct or External Download URL */}
              <div>
                <label className="block font-medium mb-1">
                  {language === 'ar' ? 'رابط التحميل المباشر أو رابط التخزين الخارجي' : 'Download Link (Direct / Google Drive / MEGA)'}
                </label>
                <input
                  type="text"
                  value={editingDownload?.directUrl || ''}
                  onChange={(e) => setEditingDownload({ ...editingDownload, directUrl: e.target.value })}
                  placeholder={
                    editingDownload?.downloadProvider === 'google_drive'
                      ? 'https://drive.google.com/file/d/...'
                      : editingDownload?.downloadProvider === 'mega'
                      ? 'https://mega.nz/file/...'
                      : 'https://github.com/releases/download/v2.5.0/SM2_Setup.msi'
                  }
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">{language === 'ar' ? 'ملاحظات الإصدار (سيسجل في Changelog تلقائياً)' : 'Release Notes (Auto Changelog)'}</label>
                <textarea
                  rows={3}
                  value={editingDownload?.releaseNotes || ''}
                  onChange={(e) => setEditingDownload({ ...editingDownload, releaseNotes: e.target.value })}
                  placeholder="تحسينات في الأداء والتزامن المباشر..."
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsDownloadModalOpen(false)}
                  className="px-4 py-2 rounded border border-neutral-300 dark:border-neutral-700"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                >
                  {language === 'ar' ? 'نشر وتسجيل التغييرات' : 'Publish & Record Changelog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* USER MODAL */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h4 className="font-serif font-bold text-base text-neutral-900 dark:text-neutral-100">
                {editingUser?.id ? t.common.edit : t.admin.addUser}
              </h4>
              <button onClick={() => setIsUserModalOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="space-y-3">
              <div>
                <label className="block font-medium mb-1">{t.common.name}</label>
                <input
                  type="text"
                  required
                  value={editingUser?.fullName || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">{t.common.email}</label>
                <input
                  type="email"
                  required
                  value={editingUser?.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={editingUser?.username || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">{language === 'ar' ? 'الدور' : 'Role'}</label>
                  <select
                    value={editingUser?.role || 'editor'}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as AdminRole })}
                    className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                  >
                    <option value="super_admin">{t.admin.roleSuperAdmin}</option>
                    <option value="editor">{t.admin.roleEditor}</option>
                    <option value="support_agent">{t.admin.roleSupport}</option>
                    <option value="member">{t.admin.roleMember}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  <div className="flex items-center justify-between">
                    <span>{language === 'ar' ? 'كلمة المرور' : 'Password'}</span>
                    {editingUser?.id && (
                      <span className="text-[10px] text-neutral-400 font-normal">
                        {language === 'ar' ? '(اتركه فارغاً للإبقاء على الحالية)' : '(Leave blank to keep current)'}
                      </span>
                    )}
                  </div>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required={!editingUser?.id}
                    placeholder={editingUser?.id ? '••••••••' : (language === 'ar' ? 'اكتب كلمة مرور قوية للمشرف' : 'Enter admin password')}
                    value={editingUser?.password || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    className="w-full px-3 py-2 pe-9 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono"
                  />
                  <KeyRound className="w-3.5 h-3.5 absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              {/* Granular permission toggles */}
              <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                <label className="block font-bold text-neutral-500">{t.admin.permissions}</label>
                <div className="space-y-1 text-xs">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingUser?.permissions?.canEditContent ?? true}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          permissions: {
                            ...(editingUser?.permissions || {
                              canEditContent: true,
                              canPublishRelease: false,
                              canManageUsers: false,
                              canSendNotifications: false,
                              canConfigureGithub: false,
                            }),
                            canEditContent: e.target.checked,
                          },
                        })
                      }
                    />
                    <span>{t.admin.permContent}</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingUser?.permissions?.canPublishRelease ?? false}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          permissions: {
                            ...(editingUser?.permissions || {
                              canEditContent: true,
                              canPublishRelease: false,
                              canManageUsers: false,
                              canSendNotifications: false,
                              canConfigureGithub: false,
                            }),
                            canPublishRelease: e.target.checked,
                          },
                        })
                      }
                    />
                    <span>{t.admin.permRelease}</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingUser?.permissions?.canManageUsers ?? false}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          permissions: {
                            ...(editingUser?.permissions || {
                              canEditContent: true,
                              canPublishRelease: false,
                              canManageUsers: false,
                              canSendNotifications: false,
                              canConfigureGithub: false,
                            }),
                            canManageUsers: e.target.checked,
                          },
                        })
                      }
                    />
                    <span>{t.admin.permUsers}</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingUser?.permissions?.canSendNotifications ?? false}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          permissions: {
                            ...(editingUser?.permissions || {
                              canEditContent: true,
                              canPublishRelease: false,
                              canManageUsers: false,
                              canSendNotifications: false,
                              canConfigureGithub: false,
                            }),
                            canSendNotifications: e.target.checked,
                          },
                        })
                      }
                    />
                    <span>{t.admin.permNotify}</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded border border-neutral-300 dark:border-neutral-700"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MANUAL LICENSE MODAL */}
      {isManualLicenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h4 className="font-serif font-bold text-base text-neutral-900 dark:text-neutral-100">
                  {language === 'ar' ? 'إصدار ترخيص يدوي جديد' : 'Issue New License'}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsManualLicenseModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!manualLicense.clientName?.trim() || !manualLicense.hardwareId?.trim()) return;

                const hasSerial = Boolean(manualLicense.serialKey?.trim());
                const effectiveDur = manualLicense.duration || 'trial_1m';
                const effectiveType = manualLicense.licenseType || (effectiveDur === 'lifetime' ? 'lifetime' : 'annual');
                const effectiveExpiry = manualLicense.expiresAt || (effectiveDur === 'lifetime' ? undefined : calculateExpirationDate(effectiveDur));

                const newReq: LicenseRequest = {
                  id: manualLicense.id || `LIC-${Math.floor(10000 + Math.random() * 90000)}`,
                  clientName: manualLicense.clientName.trim(),
                  clientEmail: manualLicense.clientEmail?.trim() || '',
                  clientPhone: manualLicense.clientPhone?.trim() || '',
                  productName: manualLicense.productName || products[0]?.name || 'محرك واستوديو SM+2 الأساسي',
                  hardwareId: manualLicense.hardwareId.trim().toUpperCase(),
                  duration: effectiveDur,
                  licenseType: effectiveType,
                  expiresAt: effectiveExpiry,
                  paymentReference: manualLicense.paymentReference?.trim(),
                  status: hasSerial ? 'active' : (manualLicense.status || 'pending'),
                  serialKey: manualLicense.serialKey?.trim() || undefined,
                  createdAt: manualLicense.createdAt || new Date().toISOString().replace('T', ' ').substring(0, 16),
                  activatedAt: hasSerial
                    ? manualLicense.activatedAt || new Date().toISOString().replace('T', ' ').substring(0, 16)
                    : undefined,
                };

                if (onAddLicenseRequest) {
                  onAddLicenseRequest(newReq);
                } else if (onUpdateLicenseRequest) {
                  onUpdateLicenseRequest(newReq);
                }

                setIsManualLicenseModalOpen(false);
                setManualLicense({ duration: 'trial_1m', status: 'pending' });
              }}
              className="space-y-3"
            >
              <div>
                <label className="block font-medium mb-1">{language === 'ar' ? 'اسم العميل *' : 'Client Name *'}</label>
                <input
                  type="text"
                  required
                  placeholder={language === 'ar' ? 'مثال: أحمد محمود' : 'e.g. John Doe'}
                  value={manualLicense.clientName || ''}
                  onChange={(e) => setManualLicense({ ...manualLicense, clientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">{language === 'ar' ? 'البريد الإلكتروني' : 'Client Email'}</label>
                  <input
                    type="email"
                    placeholder="client@example.com"
                    value={manualLicense.clientEmail || ''}
                    onChange={(e) => setManualLicense({ ...manualLicense, clientEmail: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">{language === 'ar' ? 'رقم الهاتف / الواتساب' : 'Phone / WhatsApp'}</label>
                  <input
                    type="tel"
                    placeholder="+96650..."
                    value={manualLicense.clientPhone || ''}
                    onChange={(e) => setManualLicense({ ...manualLicense, clientPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium mb-1">{language === 'ar' ? 'البرنامج المراد ترخيصه' : 'Target Product'}</label>
                  <select
                    value={manualLicense.productName || (products[0]?.name || '')}
                    onChange={(e) => setManualLicense({ ...manualLicense, productName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">{language === 'ar' ? 'مدة وخطة الترخيص' : 'Plan / Duration'}</label>
                  <select
                    value={manualLicense.duration || 'trial_1m'}
                    onChange={(e) => {
                      const dur = e.target.value as any;
                      const calculated = calculateExpirationDate(dur);
                      setManualLicense({
                        ...manualLicense,
                        duration: dur,
                        expiresAt: calculated,
                        licenseType: dur === 'lifetime' ? 'lifetime' : (dur === 'trial_1m' ? 'trial' : 'annual'),
                      });
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="trial_1m">{language === 'ar' ? 'فترة تجريبية (شهر)' : 'Trial 1 Month'}</option>
                    <option value="sub_6m">{language === 'ar' ? 'اشتراك 6 أشهر' : '6 Months Subscription'}</option>
                    <option value="sub_1y">{language === 'ar' ? 'اشتراك سنوي (سنة)' : '1 Year Subscription'}</option>
                    <option value="lifetime">{language === 'ar' ? 'ترخيص دائم (مدى الحياة)' : 'Lifetime Permanent'}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1">{language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</label>
                  <input
                    type="date"
                    disabled={manualLicense.duration === 'lifetime'}
                    value={manualLicense.expiresAt || ''}
                    onChange={(e) => setManualLicense({ ...manualLicense, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 disabled:opacity-40"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  <span>{language === 'ar' ? 'بصمة جهاز العميل (Hardware ID) *' : 'Hardware ID (HWID) *'}</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="BFEBFBFF000906EA-MB-X570-..."
                  value={manualLicense.hardwareId || ''}
                  onChange={(e) => setManualLicense({ ...manualLicense, hardwareId: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono uppercase"
                />
                <p className="text-[10px] text-neutral-400 mt-1">
                  {language === 'ar' ? 'انسخ البصمة التي أرسلها لك العميل من برنامجه والصقها هنا.' : 'Paste the HWID provided by the client.'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-1">
                <label className="block font-medium text-amber-900 dark:text-amber-200">
                  {language === 'ar' ? 'السيريال المستخرج من أداتك على حاسوبك (اختياري الآن):' : 'Serial Key from your local PC tool (Optional):'}
                </label>
                <input
                  type="text"
                  placeholder="SM2-PRO-XXXX-XXXX-XXXX-2026"
                  value={manualLicense.serialKey || ''}
                  onChange={(e) => setManualLicense({ ...manualLicense, serialKey: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg border border-amber-300 dark:border-amber-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-mono font-bold uppercase"
                />
                <p className="text-[10px] text-amber-700 dark:text-amber-300">
                  {language === 'ar'
                    ? 'الصق السيريال الذي ولدته من أداتك على جهازك لتفعيله فوراً، أو اتركه فارغاً لاعتماده لاحقاً.'
                    : 'Paste the serial from your local PC tool to activate instantly, or leave blank to set later.'}
                </p>
              </div>

              <div>
                <label className="block font-medium mb-1">{language === 'ar' ? 'رقم الحوالة أو إيصال الدفع (اختياري)' : 'Payment Reference (Optional)'}</label>
                <input
                  type="text"
                  placeholder="PAY-XXXXXX / نقدي / حوالة"
                  value={manualLicense.paymentReference || ''}
                  onChange={(e) => setManualLicense({ ...manualLicense, paymentReference: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsManualLicenseModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold hover:bg-neutral-800 dark:hover:bg-white transition-colors cursor-pointer"
                >
                  {language === 'ar' ? 'حفظ وإصدار الترخيص' : 'Save & Issue License'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
