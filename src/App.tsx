/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Page,
  Language,
  Theme,
  Product,
  DocSection,
  DownloadFile,
  ChangelogEntry,
  AdminUser,
  EmailSubscriber,
  NotificationLog,
  SupportTicket,
  GitHubSettings,
  LicenseRequest,
} from './types';
import {
  initialProducts,
  initialDocs,
  initialDownloads,
  initialChangelogs,
  initialAdminUsers,
  initialSubscribers,
  initialNotificationLogs,
  initialSupportTickets,
  initialGitHubSettings,
  initialLicenseRequests,
} from './data/initialData';
import {
  subscribeProducts,
  subscribeDownloads,
  subscribeChangelogs,
  subscribeDocs,
  subscribeAdminUsers,
  subscribeSubscribers,
  subscribeSupportTickets,
  subscribeGitHubSettings,
  saveProductToCloud,
  deleteProductFromCloud,
  saveDownloadToCloud,
  deleteDownloadFromCloud,
  saveChangelogToCloud,
  saveDocToCloud,
  deleteDocFromCloud,
  saveAdminUserToCloud,
  saveSubscriberToCloud,
  saveTicketToCloud,
  saveGitHubSettingsToCloud,
  subscribeLicenseRequests,
  saveLicenseRequestToCloud,
  deleteLicenseRequestFromCloud,
} from './lib/firestoreService';
import {
  NotificationStatus,
  getNotificationStatus,
  requestNotificationPermission,
  isWebNotificationSupported,
  showWebNotification,
  notifyNewRelease,
} from './lib/webNotifications';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { SalesPage } from './components/pages/SalesPage';
import { DownloadsPage } from './components/pages/DownloadsPage';
import { DeveloperSupportPage } from './components/pages/DeveloperSupportPage';
import { LicenseActivationPage } from './components/pages/LicenseActivationPage';
const AdminDashboard = React.lazy(() =>
  import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
import { GitHubModal } from './components/modals/GitHubModal';
import { ScrollToTop } from './components/ScrollToTop';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

export default function App() {
  // --- STATE WITH LOCAL STORAGE PERSISTENCE ---
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const saved = localStorage.getItem('sm2_current_page') as Page;
    if (saved === ('docs' as Page)) return 'home';
    return saved || 'home';
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('sm2_lang') as Language;
    if (saved === 'ar' || saved === 'en') return saved;
    // Auto-detect browser language on user's first visit
    if (typeof navigator !== 'undefined') {
      const browserLang = (
        navigator.language ||
        (navigator.languages && navigator.languages[0]) ||
        ''
      ).toLowerCase();
      if (browserLang.startsWith('en')) {
        return 'en';
      }
      if (browserLang.startsWith('ar')) {
        return 'ar';
      }
    }
    return 'ar';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('sm2_theme') as Theme;
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [notificationStatus, setNotificationStatus] = useState<NotificationStatus>(() => {
    return getNotificationStatus();
  });

  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('sm2_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('sm2_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [docs, setDocs] = useState<DocSection[]>(() => {
    const saved = localStorage.getItem('sm2_docs');
    return saved ? JSON.parse(saved) : initialDocs;
  });

  const [downloads, setDownloads] = useState<DownloadFile[]>(() => {
    const saved = localStorage.getItem('sm2_downloads');
    return saved ? JSON.parse(saved) : initialDownloads;
  });

  const [changelogs, setChangelogs] = useState<ChangelogEntry[]>(() => {
    const saved = localStorage.getItem('sm2_changelogs');
    return saved ? JSON.parse(saved) : initialChangelogs;
  });

  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('sm2_admin_users');
    if (saved) {
      try {
        const parsed: AdminUser[] = JSON.parse(saved);
        return parsed.map((u) => {
          if (!u.password) {
            const init = initialAdminUsers.find((i) => i.id === u.id || i.email === u.email);
            return { ...u, password: init?.password || 'SM2@Admin2026' };
          }
          return u;
        });
      } catch {
        return initialAdminUsers;
      }
    }
    return initialAdminUsers;
  });

  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>(() => {
    const saved = localStorage.getItem('sm2_subscribers');
    return saved ? JSON.parse(saved) : initialSubscribers;
  });

  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>(() => {
    const saved = localStorage.getItem('sm2_notif_logs');
    return saved ? JSON.parse(saved) : initialNotificationLogs;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('sm2_tickets');
    return saved ? JSON.parse(saved) : initialSupportTickets;
  });

  const [githubSettings, setGithubSettings] = useState<GitHubSettings>(() => {
    const saved = localStorage.getItem('sm2_github_settings');
    return saved ? JSON.parse(saved) : initialGitHubSettings;
  });

  const [licenseRequests, setLicenseRequests] = useState<LicenseRequest[]>(() => {
    const saved = localStorage.getItem('sm2_licenses');
    return saved ? JSON.parse(saved) : initialLicenseRequests;
  });

  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);

  // --- REAL-TIME FIRESTORE SUBSCRIPTIONS ---
  useEffect(() => {
    const unsubProducts = subscribeProducts((items) => setProducts(items));
    const unsubDownloads = subscribeDownloads((items) => setDownloads(items));
    const unsubChangelogs = subscribeChangelogs((items) => setChangelogs(items));
    const unsubDocs = subscribeDocs((items) => setDocs(items));
    const unsubAdminUsers = subscribeAdminUsers((items) => setAdminUsers(items));
    const unsubSubscribers = subscribeSubscribers((items) => setSubscribers(items));
    const unsubTickets = subscribeSupportTickets((items) => setSupportTickets(items));
    const unsubGithub = subscribeGitHubSettings((settings) => setGithubSettings(settings));
    const unsubLicenses = subscribeLicenseRequests((items) => setLicenseRequests(items));

    return () => {
      unsubProducts();
      unsubDownloads();
      unsubChangelogs();
      unsubDocs();
      unsubAdminUsers();
      unsubSubscribers();
      unsubTickets();
      unsubGithub();
      unsubLicenses();
    };
  }, []);

  // --- SYNC EFFECTS ---
  useEffect(() => {
    localStorage.setItem('sm2_current_page', currentPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('sm2_lang', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    localStorage.setItem('sm2_theme', theme);
    const root = document.documentElement;
    const body = document.body;
    const metaCs = document.getElementById('meta-color-scheme');
    const metaTc = document.getElementById('meta-theme-color');

    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      body.classList.add('dark');
      if (metaCs) metaCs.setAttribute('content', 'dark');
      if (metaTc) metaTc.setAttribute('content', '#0a0a0a');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      body.classList.remove('dark');
      if (metaCs) metaCs.setAttribute('content', 'light');
      if (metaTc) metaTc.setAttribute('content', '#fafafa');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('sm2_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sm2_docs', JSON.stringify(docs));
  }, [docs]);

  useEffect(() => {
    localStorage.setItem('sm2_downloads', JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    localStorage.setItem('sm2_changelogs', JSON.stringify(changelogs));
  }, [changelogs]);

  useEffect(() => {
    localStorage.setItem('sm2_admin_users', JSON.stringify(adminUsers));
  }, [adminUsers]);

  useEffect(() => {
    localStorage.setItem('sm2_licenses', JSON.stringify(licenseRequests));
  }, [licenseRequests]);

  useEffect(() => {
    localStorage.setItem('sm2_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  useEffect(() => {
    localStorage.setItem('sm2_notif_logs', JSON.stringify(notificationLogs));
  }, [notificationLogs]);

  useEffect(() => {
    localStorage.setItem('sm2_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem('sm2_github_settings', JSON.stringify(githubSettings));
  }, [githubSettings]);

  // --- ACTIONS ---
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogin = (user: AdminUser) => {
    setCurrentUser(user);
    localStorage.setItem('sm2_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sm2_user');
  };

  const handleSubscribeEmail = (email: string) => {
    if (!email || subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
      return true;
    }
    const newSub: EmailSubscriber = {
      id: `sub-${Date.now()}`,
      email,
      subscribedAt: new Date().toISOString().split('T')[0],
      categories: ['all', 'releases'],
      status: 'active',
    };
    saveSubscriberToCloud(newSub);
    setSubscribers((prev) => [newSub, ...prev]);
    return true;
  };

  const handleAddTicket = (
    ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'replies'>
  ): SupportTicket => {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      ticketNumber: `SM2-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      replies: [
        {
          id: `rep-${Date.now()}`,
          sender: 'فريق الاستجابة الآلية SM+2',
          isStaff: true,
          text: 'تم استلام تذكرتك وتعيينها لمهندس متخصص. سنتواصل معك عبر البريد الإلكتروني في غضون وقت قصير.',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        },
      ],
    };
    saveTicketToCloud(newTicket);
    setSupportTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const handleAddChangelog = (entry: ChangelogEntry) => {
    saveChangelogToCloud(entry);
    setChangelogs((prev) => [entry, ...prev]);
  };

  const handleUpdateProducts = (newProducts: Product[]) => {
    const currentIds = new Set(newProducts.map((p) => p.id));
    products.forEach((p) => {
      if (!currentIds.has(p.id)) {
        deleteProductFromCloud(p.id);
      }
    });
    newProducts.forEach((p) => {
      saveProductToCloud(p);
    });
    setProducts(newProducts);
  };

  const handleToggleNotifications = async () => {
    if (!isWebNotificationSupported()) {
      alert(language === 'ar' ? 'متصفحك الحالي لا يدعم إشعارات الويب' : 'Web notifications are not supported in this browser');
      return;
    }
    const result = await requestNotificationPermission();
    setNotificationStatus(result);
    if (result === 'granted') {
      showWebNotification(
        language === 'ar' ? '🔔 تم تفعيل إشعارات SM+2 بنجاح' : '🔔 SM+2 Web Notifications Activated',
        {
          body: language === 'ar'
            ? 'ستتلقى الآن تنبيهات مباشرة عند توفر إصدارات برمجية أو تحديثات جديدة للمنصة.'
            : 'You will now receive instant desktop alerts on any new software releases and updates.',
        }
      );
    }
  };

  const handleUpdateDownloads = (newDownloads: DownloadFile[]) => {
    const currentIds = new Set(newDownloads.map((d) => d.id));
    downloads.forEach((d) => {
      if (!currentIds.has(d.id)) {
        deleteDownloadFromCloud(d.id);
      }
    });
    newDownloads.forEach((d) => {
      saveDownloadToCloud(d);
    });

    // If new release was added, trigger real-time browser notification
    if (newDownloads.length > downloads.length && notificationStatus === 'granted') {
      const newest = newDownloads[0];
      if (newest) {
        notifyNewRelease({
          title: newest.title,
          version: newest.version,
          fileName: newest.fileName,
          language,
        });
      }
    }

    setDownloads(newDownloads);
  };

  const handleUpdateDocs = (newDocs: DocSection[]) => {
    const currentIds = new Set(newDocs.map((d) => d.id));
    docs.forEach((d) => {
      if (!currentIds.has(d.id)) {
        deleteDocFromCloud(d.id);
      }
    });
    newDocs.forEach((d) => {
      saveDocToCloud(d);
    });
    setDocs(newDocs);
  };

  const handleUpdateUsers = (newUsers: AdminUser[]) => {
    newUsers.forEach((u) => {
      saveAdminUserToCloud(u);
    });
    setAdminUsers(newUsers);
  };

  const handleUpdateGithubSettings = (newSettings: GitHubSettings) => {
    saveGitHubSettingsToCloud(newSettings);
    setGithubSettings(newSettings);
  };

  const handleAddLicenseRequest = (newReq: LicenseRequest) => {
    saveLicenseRequestToCloud(newReq);
    setLicenseRequests((prev) => [newReq, ...prev.filter((r) => r.id !== newReq.id)]);
  };

  const handleUpdateLicenseRequest = (updatedReq: LicenseRequest) => {
    saveLicenseRequestToCloud(updatedReq);
    setLicenseRequests((prev) => prev.map((r) => (r.id === updatedReq.id ? updatedReq : r)));
  };

  const handleDeleteLicenseRequest = (reqId: string) => {
    deleteLicenseRequestFromCloud(reqId);
    setLicenseRequests((prev) => prev.filter((r) => r.id !== reqId));
  };

  const handleSendNotification = (subject: string, version: string, messageBody: string) => {
    const newLog: NotificationLog = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      subject,
      version,
      recipientsCount: subscribers.length,
      status: 'sent',
      messageBody,
    };
    setNotificationLogs((prev) => [newLog, ...prev]);

    // Also broadcast web notification to current browser session
    showWebNotification(`🔔 ${subject} (${version})`, {
      body: messageBody,
      tag: `broadcast-${version}`,
      onClickUrl: '#downloads',
    });
  };

  const handleAddReview = (
    productId: string,
    reviewData: { author: string; rating: number; comment: string }
  ) => {
    const newReview = {
      id: `rev-${Date.now()}`,
      productId,
      author: reviewData.author || (language === 'ar' ? 'مهندس برمجيات' : 'Software Engineer'),
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString().split('T')[0],
      verifiedBuyer: true,
    };

    const updated = products.map((p) => {
      if (p.id === productId) {
        const existing = p.reviews || [];
        const reviews = [newReview, ...existing];
        const avg = Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;
        const updatedProd = {
          ...p,
          reviews,
          rating: avg,
        };
        saveProductToCloud(updatedProd);
        return updatedProd;
      }
      return p;
    });
    setProducts(updated);
  };

  return (
    <div
      id="sm2-app-root"
      className={`min-h-screen flex flex-col relative overflow-x-hidden bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}
    >
      {/* Dynamic Ambient Background Glows - Provides Rich Modern Visual Depth on Mobile and Desktop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none" aria-hidden="true">
        {/* Amber / Gold Engineering Glow (Top Right) */}
        <div className="absolute -top-24 sm:-top-32 -right-20 sm:-right-32 w-72 sm:w-96 md:w-[34rem] h-72 sm:h-96 md:h-[34rem] rounded-full bg-gradient-to-br from-amber-500/15 to-amber-600/5 dark:from-amber-500/20 dark:to-transparent blur-3xl opacity-80 dark:opacity-70 animate-pulse" style={{ animationDuration: '8s' }} />
        {/* Emerald / Cyan High-Tech Glow (Top Left) */}
        <div className="absolute top-28 sm:top-20 -left-20 sm:-left-32 w-64 sm:w-80 md:w-[30rem] h-64 sm:h-80 md:h-[30rem] rounded-full bg-gradient-to-tr from-emerald-500/15 to-teal-500/5 dark:from-emerald-500/20 dark:to-transparent blur-3xl opacity-75 dark:opacity-60" />
        {/* Blue / Violet Enterprise Glow (Mid Center) */}
        <div className="absolute top-1/2 right-4 sm:right-1/4 w-60 sm:w-80 md:w-[28rem] h-60 sm:h-80 md:h-[28rem] rounded-full bg-gradient-to-br from-blue-500/10 to-indigo-500/5 dark:from-blue-500/15 dark:to-transparent blur-3xl opacity-60 dark:opacity-50" />
        {/* Bottom Ambient Glow */}
        <div className="absolute -bottom-28 sm:-bottom-40 left-1/4 w-80 sm:w-96 md:w-[32rem] h-80 sm:h-96 md:h-[32rem] rounded-full bg-gradient-to-t from-amber-500/10 to-emerald-500/5 dark:from-amber-500/15 dark:to-transparent blur-3xl opacity-70" />
      </div>

      {/* Top Header */}
      <div className="relative z-20">
        <Header
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          toggleTheme={toggleTheme}
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenGithubModal={() => setIsGithubModalOpen(true)}
          notificationStatus={notificationStatus}
          onToggleNotifications={handleToggleNotifications}
        />
      </div>

      {/* Main Content Router */}
      <main className="relative z-10 flex-1">
        {currentPage === 'home' && (
          <HomePage
            downloads={downloads}
            changelogs={changelogs}
            products={products}
            subscribers={subscribers}
            githubSettings={githubSettings}
            language={language}
            theme={theme}
            setCurrentPage={setCurrentPage}
            onSubscribeEmail={handleSubscribeEmail}
            onOpenGithubModal={() => setIsGithubModalOpen(true)}
          />
        )}

        {currentPage === 'sales' && (
          <SalesPage
            products={products}
            language={language}
            setCurrentPage={setCurrentPage}
            onSelectDownload={(url) => {
              setCurrentPage('downloads');
            }}
            onAddReview={handleAddReview}
          />
        )}

        {currentPage === 'downloads' && (
          <DownloadsPage
            downloads={downloads}
            changelogs={changelogs}
            language={language}
            onSubscribeEmail={handleSubscribeEmail}
            notificationStatus={notificationStatus}
            onToggleNotifications={handleToggleNotifications}
          />
        )}

        {currentPage === 'developer' && (
          <DeveloperSupportPage
            tickets={supportTickets}
            language={language}
            onAddTicket={handleAddTicket}
            onOpenGithubModal={() => setIsGithubModalOpen(true)}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === 'licenses' && (
          <LicenseActivationPage
            products={products}
            licenseRequests={licenseRequests}
            onSubmitLicenseRequest={handleAddLicenseRequest}
            githubSettings={githubSettings}
            language={language}
          />
        )}

        {currentPage === 'admin' && (
          <React.Suspense
            fallback={
              <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  {language === 'ar' ? 'جارٍ تحميل لوحة الإدارة...' : 'Loading Admin Dashboard...'}
                </p>
              </div>
            }
          >
            <AdminDashboard
              currentUser={currentUser}
              onLogin={handleLogin}
              onLogout={handleLogout}
              adminUsers={adminUsers}
              onUpdateUsers={handleUpdateUsers}
              products={products}
              onUpdateProducts={handleUpdateProducts}
              docs={docs}
              onUpdateDocs={handleUpdateDocs}
              downloads={downloads}
              onUpdateDownloads={handleUpdateDownloads}
              changelogs={changelogs}
              onAddChangelog={handleAddChangelog}
              subscribers={subscribers}
              notificationLogs={notificationLogs}
              onSendNotification={handleSendNotification}
              githubSettings={githubSettings}
              onUpdateGithubSettings={handleUpdateGithubSettings}
              language={language}
              licenseRequests={licenseRequests}
              onUpdateLicenseRequest={handleUpdateLicenseRequest}
              onAddLicenseRequest={handleAddLicenseRequest}
              onDeleteLicenseRequest={handleDeleteLicenseRequest}
            />
          </React.Suspense>
        )}
      </main>

      {/* Footer */}
      <Footer
        language={language}
        setCurrentPage={setCurrentPage}
        onSubscribeEmail={handleSubscribeEmail}
        onOpenGithubModal={() => setIsGithubModalOpen(true)}
      />

      {/* GitHub Repository Quick Modal */}
      <GitHubModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
        githubSettings={githubSettings}
        downloads={downloads}
        language={language}
      />

      {/* Floating WhatsApp Support Button */}
      <FloatingWhatsApp language={language} />

      {/* Floating Scroll to Top Button */}
      <ScrollToTop language={language} />
    </div>
  );
}
