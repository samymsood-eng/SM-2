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
  Settings,
  Sparkles,
  Key,
  Terminal,
} from 'lucide-react';

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
}) => {
  const t = translations[language];

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'docs' | 'downloads' | 'users' | 'github' | 'notifications' | 'changelog' | 'deploy'
  >('overview');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@sm2.dev');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Products modal/editor state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Docs modal/editor state
  const [editingDoc, setEditingDoc] = useState<Partial<DocSection> | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  // Downloads modal/editor state
  const [editingDownload, setEditingDownload] = useState<Partial<DownloadFile> | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Users modal/editor state
  const [editingUser, setEditingUser] = useState<Partial<AdminUser> | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

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

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = adminUsers.find(
      (u) => u.email.toLowerCase() === loginEmail.toLowerCase() && u.active
    );
    if (user) {
      onLogin(user);
      setLoginError('');
    } else {
      setLoginError(language === 'ar' ? 'البريد أو الحساب غير معتمد أو معطل' : 'Invalid supervisor email or inactive account.');
    }
  };

  const handleDemoLogin = () => {
    const superAdmin = adminUsers[0];
    if (superAdmin) {
      onLogin(superAdmin);
      setLoginError('');
    }
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
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {language === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold hover:bg-neutral-800 dark:hover:bg-white transition-colors"
            >
              {t.admin.loginButton}
            </button>
          </form>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-center">
            <button
              onClick={handleDemoLogin}
              className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.admin.quickDemoLogin} (admin@sm2.dev)</span>
            </button>
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
        downloadUrl: '#download',
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
      const updated = adminUsers.map((u) => (u.id === editingUser.id ? ({ ...u, ...editingUser } as AdminUser) : u));
      onUpdateUsers(updated);
    } else {
      const newUser: AdminUser = {
        id: `usr-${Date.now()}`,
        username: editingUser.username || '',
        email: editingUser.email || '',
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
            { id: 'overview', label: t.admin.overview, icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'products', label: t.admin.productsTab, icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'docs', label: t.admin.docsTab, icon: <FileCode className="w-3.5 h-3.5" /> },
            { id: 'downloads', label: t.admin.downloadsTab, icon: <Download className="w-3.5 h-3.5" /> },
            { id: 'users', label: t.admin.usersTab, icon: <UserCheck className="w-3.5 h-3.5" /> },
            { id: 'github', label: t.admin.githubTab, icon: <Github className="w-3.5 h-3.5" /> },
            { id: 'notifications', label: t.admin.notificationsTab, icon: <Mail className="w-3.5 h-3.5" /> },
            { id: 'changelog', label: t.admin.changelogTab, icon: <History className="w-3.5 h-3.5" /> },
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
              <div>
                <label className="block font-medium mb-1">{language === 'ar' ? 'رابط صورة الغلاف' : 'Image URL'}</label>
                <input
                  type="url"
                  value={editingProduct?.images?.[0] || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 font-mono text-[11px]"
                />
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
    </div>
  );
};
