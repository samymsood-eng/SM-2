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
} from './data/initialData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { SalesPage } from './components/pages/SalesPage';
import { DownloadsPage } from './components/pages/DownloadsPage';
import { DeveloperSupportPage } from './components/pages/DeveloperSupportPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { GitHubModal } from './components/modals/GitHubModal';
import { ScrollToTop } from './components/ScrollToTop';

export default function App() {
  // --- STATE WITH LOCAL STORAGE PERSISTENCE ---
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const saved = localStorage.getItem('sm2_current_page') as Page;
    if (saved === ('docs' as Page)) return 'home';
    return saved || 'home';
  });

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('sm2_lang') as Language) || 'ar';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('sm2_theme') as Theme) || 'light';
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
    return saved ? JSON.parse(saved) : initialAdminUsers;
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

  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);

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
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      document.body.classList.remove('dark');
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
    setSupportTickets((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const handleAddChangelog = (entry: ChangelogEntry) => {
    setChangelogs((prev) => [entry, ...prev]);
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

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const existing = p.reviews || [];
          const updated = [newReview, ...existing];
          const avg = Math.round((updated.reduce((sum, r) => sum + r.rating, 0) / updated.length) * 10) / 10;
          return {
            ...p,
            reviews: updated,
            rating: avg,
          };
        }
        return p;
      })
    );
  };

  return (
    <div className={`min-h-screen flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors duration-200 ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Top Header */}
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
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            downloads={downloads}
            changelogs={changelogs}
            products={products}
            subscribers={subscribers}
            language={language}
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

        {currentPage === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            adminUsers={adminUsers}
            onUpdateUsers={setAdminUsers}
            products={products}
            onUpdateProducts={setProducts}
            docs={docs}
            onUpdateDocs={setDocs}
            downloads={downloads}
            onUpdateDownloads={setDownloads}
            changelogs={changelogs}
            onAddChangelog={handleAddChangelog}
            subscribers={subscribers}
            notificationLogs={notificationLogs}
            onSendNotification={handleSendNotification}
            githubSettings={githubSettings}
            onUpdateGithubSettings={setGithubSettings}
            language={language}
          />
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

      {/* Floating Scroll to Top Button */}
      <ScrollToTop language={language} />
    </div>
  );
}
