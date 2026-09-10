import React, { useState } from 'react';
import { SupportTicket, Language, Page } from '../../types';
import { translations } from '../../i18n/translations';
import {
  LifeBuoy,
  Send,
  CheckCircle2,
  Clock,
  MessageSquare,
  Activity,
  Terminal,
  Github,
  Check,
  FileQuestion,
  UserCheck,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface DeveloperSupportPageProps {
  tickets: SupportTicket[];
  language: Language;
  onAddTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'replies'>) => SupportTicket;
  onOpenGithubModal: () => void;
  setCurrentPage: (page: Page) => void;
}

export const DeveloperSupportPage: React.FC<DeveloperSupportPageProps> = ({
  tickets,
  language,
  onAddTicket,
  onOpenGithubModal,
  setCurrentPage,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'technical' | 'license' | 'bug' | 'feature_request'>('technical');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [message, setMessage] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);
  const [activeTicketTab, setActiveTicketTab] = useState<'new' | 'list'>('new');

  const t = translations[language];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) return;

    const newTicket = onAddTicket({
      name,
      email,
      subject,
      category,
      priority,
      status: 'open',
      message,
    });

    setSubmittedTicket(newTicket);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div id="developer-support-page" className="min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-900 dark:text-amber-300 text-xs font-semibold border border-amber-500/20 font-mono">
            <LifeBuoy className="w-3.5 h-3.5 text-amber-600" />
            <span>SM+2 Developer Core & Engineering Support</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            {t.developer.title}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            {t.developer.subtitle}
          </p>
        </div>

        {/* Developer Philosophy & Team Bio Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Bio Column */}
          <div className="lg:col-span-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 text-amber-400 dark:bg-neutral-100 dark:text-neutral-900 flex items-center justify-center font-serif text-xl font-bold border border-amber-500/30">
                SM<sup className="text-xs">+2</sup>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  {t.developer.devProfile}
                </h3>
                <p className="text-xs text-neutral-500">Core Engineering Maintainers</p>
              </div>
            </div>

            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {t.developer.devBio}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 space-y-1">
                <div className="font-bold text-neutral-900 dark:text-neutral-100">
                  {language === 'ar' ? 'فلسفة التصميم' : 'Design Philosophy'}
                </div>
                <div className="text-neutral-500">
                  {language === 'ar' ? 'احترافي فني وبسيط كلاسيك' : 'Artistic, Classic & Lean'}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 space-y-1">
                <div className="font-bold text-neutral-900 dark:text-neutral-100">
                  {language === 'ar' ? 'أمان التوزيع' : 'Cryptographic Security'}
                </div>
                <div className="text-neutral-500">
                  SHA-256 Digest Zero-Trust
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 space-y-1">
                <div className="font-bold text-neutral-900 dark:text-neutral-100">
                  {language === 'ar' ? 'سرعة الاستجابة' : 'SLA Support'}
                </div>
                <div className="text-neutral-500">
                  {language === 'ar' ? 'خلال 4-8 ساعات عمل' : 'Within 4-8 business hours'}
                </div>
              </div>
            </div>
          </div>

          {/* Live System & API Status */}
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 space-y-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span>{t.developer.apiStatus}</span>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  {t.developer.operational}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-neutral-50 dark:bg-neutral-800">
                  <span>GitHub REST / Releases API</span>
                  <span className="text-emerald-600 font-mono font-bold">99.98%</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-neutral-50 dark:bg-neutral-800">
                  <span>Binary Mirror CDN</span>
                  <span className="text-emerald-600 font-mono font-bold">14ms ping</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-neutral-50 dark:bg-neutral-800">
                  <span>Instant Email Dispatcher</span>
                  <span className="text-emerald-600 font-mono font-bold">Active</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={onOpenGithubModal}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-white transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>{t.developer.communityGithub}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Support Ticket Section */}
        <section id="support-tickets-section" className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {t.developer.openTicket}
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {t.developer.ticketDesc}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTicketTab('new')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTicketTab === 'new'
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {language === 'ar' ? 'تذكرة جديدة' : 'Open Ticket'}
              </button>
              <button
                onClick={() => setActiveTicketTab('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTicketTab === 'list'
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                {t.developer.recentTickets} ({tickets.length})
              </button>
            </div>
          </div>

          {/* Form or Tickets List */}
          {activeTicketTab === 'new' ? (
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 shadow-sm max-w-3xl mx-auto space-y-6">
              {submittedTicket ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
                    {t.developer.ticketSuccess}
                    <span className="font-mono text-amber-700 dark:text-amber-400 ms-1">
                      {submittedTicket.ticketNumber}
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                    {language === 'ar'
                      ? 'تم تسجيل تذكرتك بنجاح وإرسال إشعار تأكيد إلى بريدك. سيتابع الفريق الفني معك في أقرب وقت.'
                      : 'Your ticket has been logged and a confirmation email dispatched. Our team will follow up promptly.'}
                  </p>
                  <button
                    onClick={() => {
                      setSubmittedTicket(null);
                      setActiveTicketTab('list');
                    }}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold"
                  >
                    <span>{language === 'ar' ? 'عرض التذكرة والردود' : 'View Ticket & Replies'}</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        {t.common.name} *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={language === 'ar' ? 'الاسم أو معرف GitHub' : 'Your name / GitHub handle'}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        {t.developer.ticketEmail} *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        {t.developer.ticketCategory}
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="technical">مشكلة تقنية / Technical Issue</option>
                        <option value="bug">إبلاغ عن خطأ / Bug Report</option>
                        <option value="license">ترخيص وتفعيل / License Inquiry</option>
                        <option value="feature_request">اقتراح ميزة / Feature Request</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        {t.developer.ticketPriority}
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as any)}
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="low">منخفضة / Low</option>
                        <option value="medium">متوسطة / Medium</option>
                        <option value="high">عالية / High</option>
                        <option value="urgent">عاجلة جداً / Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      {t.developer.ticketSubject} *
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={language === 'ar' ? 'ملخص موجز للمشكلة أو الاستفسار' : 'Summary of inquiry'}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      {t.developer.ticketMessage} *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={t.developer.ticketMessage}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold hover:bg-neutral-800 dark:hover:bg-white transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.developer.submitTicket}</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-4 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        #{ticket.ticketNumber}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-neutral-900 dark:text-neutral-100">
                        {ticket.subject}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`px-2 py-0.5 rounded font-mono font-semibold text-[11px] ${
                          ticket.status === 'resolved'
                            ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                            : 'bg-amber-500/10 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {ticket.status.toUpperCase()}
                      </span>
                      <span className="text-neutral-400 text-[11px]">{ticket.createdAt}</span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {ticket.message}
                  </p>

                  {/* Replies thread */}
                  {ticket.replies.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      {ticket.replies.map((reply) => (
                        <div
                          key={reply.id}
                          className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between font-medium">
                            <span className="text-amber-700 dark:text-amber-400 font-semibold">
                              {reply.sender}
                            </span>
                            <span className="text-neutral-400 text-[10px]">{reply.timestamp}</span>
                          </div>
                          <p className="text-neutral-700 dark:text-neutral-300">{reply.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
