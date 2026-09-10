import React, { useState } from 'react';
import { SupportTicket, Language, Page } from '../../types';
import { translations } from '../../i18n/translations';
import {
  Send,
  CheckCircle2,
  Activity,
  Github,
  PhoneCall,
  MessageCircle,
  SendHorizontal,
  Mail,
  Facebook,
  ExternalLink,
  ShieldCheck,
  Code2,
  Sparkles,
  Cpu,
  Clock4,
  Copy,
  Check,
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
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);

  const t = translations[language];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChannel(id);
    setTimeout(() => setCopiedChannel(null), 2500);
  };

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
    <div id="developer-support-page" className="min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/20 text-xs font-semibold text-amber-700 dark:text-amber-400 font-mono">
            <Code2 className="w-3.5 h-3.5 text-amber-600 stroke-[1.75]" />
            <span>{language === 'ar' ? 'هندسة النظم والدعم الفني المباشر' : 'Systems Engineering & Core Support'}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            {language === 'ar' ? 'الدعم الفني والمهندس المطور' : 'Technical Support & Lead Engineer'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto">
            {language === 'ar'
              ? 'تواصل فوري ومباشر مع مهندس البرمجيات، أو استعرض قنوات الدعم المباشرة وتذاكر الخدمة الفنية.'
              : 'Direct communication with the lead software engineer and official support channels.'}
          </p>
        </div>

        {/* Lead Engineer Spotlight Card - Sami Masoud */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          {/* Subtle decorative accent */}
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-amber-500/40 via-amber-500 to-amber-600/40" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Lead Info & Monogram */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-full overflow-hidden border-2 border-amber-500/40 shadow-sm shrink-0 bg-neutral-950 ring-2 ring-amber-500/20">
                  <img
                    src="./logo.png"
                    alt="SM+2 Official Emblem"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      if (target.nextElementSibling) {
                        (target.nextElementSibling as HTMLElement).style.display = 'flex';
                      }
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center font-serif text-xl font-black text-amber-400">
                    SM<sup className="text-xs">+2</sup>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
                      {language === 'ar' ? 'م. سامي مسعود' : 'Eng. Sami Masoud'}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{language === 'ar' ? 'متاح للدعم' : 'Online'}</span>
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 stroke-[1.75]" />
                    <span>{language === 'ar' ? 'مهندس برمجيات ومؤسس مشروع SM+2' : 'Lead Software Engineer & Architect'}</span>
                  </p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl">
                {language === 'ar'
                  ? 'مطور ومصمم منظومة SM+2 للبرمجيات. يسعدنا تقديم الاستشارات البرمجية، الدعم الفني المباشر، وتخصيص الحلول والأنظمة للمؤسسات والمطورين عبر قنوات التواصل الفورية.'
                  : 'Architect and lead developer of SM+2 platform. Ready to assist with technical support, architecture inquiries, and custom development.'}
              </p>

              {/* Badges / Values without heavy backgrounds */}
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-neutral-600 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800/80">
                <div className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[1.75]" />
                  <span>{language === 'ar' ? 'دعم رسمي معتمد' : 'Official Support'}</span>
                </div>
                <span className="text-neutral-300 dark:text-neutral-700">•</span>
                <div className="inline-flex items-center gap-1.5">
                  <Clock4 className="w-4 h-4 text-amber-600 dark:text-amber-400 stroke-[1.75]" />
                  <span>{language === 'ar' ? 'استجابة سريعة' : 'Fast Response'}</span>
                </div>
                <span className="text-neutral-300 dark:text-neutral-700">•</span>
                <div className="inline-flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400 stroke-[1.75]" />
                  <span>{language === 'ar' ? 'هندسة مخصصة' : 'Custom Engineering'}</span>
                </div>
              </div>
            </div>

            {/* Direct Connect Quick Actions with Pure Artistic Transparent Icons */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                  {language === 'ar' ? 'قنوات التواصل الفوري والمباشر' : 'Direct Connect Channels'}
                </h3>
                <span className="text-[11px] text-neutral-500">
                  {language === 'ar' ? 'انقر للاتصال أو المراسلة فوراً' : 'Tap to initiate'}
                </span>
              </div>

              {/* Grid of Channels */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* 1. Phone Call */}
                <a
                  href="tel:+201287615566"
                  id="direct-call-btn"
                  title={language === 'ar' ? 'اتصال هاتفي مباشر' : 'Direct Phone Call'}
                  className="group flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 hover:border-amber-500/50 hover:shadow-xs transition-all duration-200 hover:-translate-y-0.5"
                >
                  <PhoneCall className="w-6 h-6 text-amber-600 dark:text-amber-400 stroke-[1.75] transition-transform duration-200 group-hover:scale-110" />
                  <span className="mt-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {language === 'ar' ? 'اتصال مباشر' : 'Phone Call'}
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    {language === 'ar' ? 'انقر للاتصال' : 'Click to call'}
                  </span>
                </a>

                {/* 2. WhatsApp */}
                <a
                  href="https://wa.me/201124232344"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="direct-whatsapp-btn"
                  title="WhatsApp Chat"
                  className="group flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 hover:border-emerald-500/50 hover:shadow-xs transition-all duration-200 hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400 stroke-[1.75] transition-transform duration-200 group-hover:scale-110" />
                  <span className="mt-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {language === 'ar' ? 'واتساب' : 'WhatsApp'}
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    {language === 'ar' ? 'محادثة فورية' : 'Instant Chat'}
                  </span>
                </a>

                {/* 3. Telegram */}
                <a
                  href="https://t.me/+201124232344"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="direct-telegram-btn"
                  title="Telegram Chat"
                  className="group flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 hover:border-sky-500/50 hover:shadow-xs transition-all duration-200 hover:-translate-y-0.5"
                >
                  <SendHorizontal className="w-6 h-6 text-sky-600 dark:text-sky-400 stroke-[1.75] transition-transform duration-200 group-hover:scale-110" />
                  <span className="mt-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {language === 'ar' ? 'تيليجرام' : 'Telegram'}
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    {language === 'ar' ? 'مراسلة مشفرة' : 'Direct Message'}
                  </span>
                </a>

                {/* 4. Gmail */}
                <a
                  href="mailto:SamyMsood@Gmail.com?subject=SM%2B2%20Support%20Inquiry"
                  id="direct-gmail-btn"
                  title="Gmail: SamyMsood@Gmail.com"
                  className="group flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 hover:border-rose-500/50 hover:shadow-xs transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Mail className="w-6 h-6 text-rose-600 dark:text-rose-400 stroke-[1.75] transition-transform duration-200 group-hover:scale-110" />
                  <span className="mt-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    Gmail
                  </span>
                  <span className="text-[10px] text-neutral-500 truncate max-w-full">
                    SamyMsood
                  </span>
                </a>

                {/* 5. Hotmail */}
                <a
                  href="mailto:Samy_Msood@Hotmail.com?subject=SM%2B2%20Engineering%20Inquiry"
                  id="direct-hotmail-btn"
                  title="Hotmail: Samy_Msood@Hotmail.com"
                  className="group flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 hover:border-blue-500/50 hover:shadow-xs transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400 stroke-[1.75] transition-transform duration-200 group-hover:scale-110" />
                  <span className="mt-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Hotmail
                  </span>
                  <span className="text-[10px] text-neutral-500 truncate max-w-full">
                    Samy_Msood
                  </span>
                </a>

                {/* 6. Facebook */}
                <a
                  href="https://web.facebook.com/samy.msood"
                  target="_blank"
                  rel="noopener noreferrer"
                  id="direct-facebook-btn"
                  title="Facebook Profile: samy.msood"
                  className="group flex flex-col items-center justify-center p-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 hover:border-indigo-500/50 hover:shadow-xs transition-all duration-200 hover:-translate-y-0.5"
                >
                  <Facebook className="w-6 h-6 text-indigo-600 dark:text-indigo-400 stroke-[1.75] transition-transform duration-200 group-hover:scale-110" />
                  <span className="mt-2 text-xs font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Facebook
                  </span>
                  <span className="text-[10px] text-neutral-500 flex items-center gap-0.5">
                    <span>samy.msood</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Support Ticket Section & Systems Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Support Form / Ticket Tracker */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {t.developer.openTicket}
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {t.developer.ticketDesc}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTicketTab('new')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeTicketTab === 'new'
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {language === 'ar' ? 'تذكرة جديدة' : 'Open Ticket'}
                </button>
                <button
                  onClick={() => setActiveTicketTab('list')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeTicketTab === 'list'
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-xs font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {t.developer.recentTickets} ({tickets.length})
                </button>
              </div>
            </div>

            {/* Form or Tickets List */}
            {activeTicketTab === 'new' ? (
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-7 shadow-xs">
                {submittedTicket ? (
                  <div className="p-6 rounded-xl border border-emerald-500/30 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto stroke-[1.5]" />
                    <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      {t.developer.ticketSuccess}
                      <span className="font-mono text-amber-700 dark:text-amber-400 ms-1">
                        {submittedTicket.ticketNumber}
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                      {language === 'ar'
                        ? 'تم تسجيل تذكرتك بنجاح برقم التتبع أعلاه. تم إرسال إشعار للمهندس سامي مسعود وسيتم التواصل معك على الفور.'
                        : 'Your ticket has been logged and assigned directly to engineering. We will reply promptly.'}
                    </p>
                    <button
                      onClick={() => {
                        setSubmittedTicket(null);
                        setActiveTicketTab('list');
                      }}
                      className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-white transition-colors"
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
                          placeholder={language === 'ar' ? 'الاسم أو المؤسسة' : 'Your name / Company'}
                          className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
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
                          className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
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
                          className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="technical">مشكلة تقنية برمجية / Technical Issue</option>
                          <option value="bug">إبلاغ عن خطأ برمجي / Bug Report</option>
                          <option value="license">ترخيص وشراء تراخيص / License Inquiry</option>
                          <option value="feature_request">طلب ميزة مخصصة / Feature Request</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                          {t.developer.ticketPriority}
                        </label>
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="low">عادية / Low</option>
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
                        className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                        {t.developer.ticketMessage} *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t.developer.ticketMessage}
                        className="w-full px-3 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-bold hover:bg-neutral-800 dark:hover:bg-white transition-colors"
                    >
                      <Send className="w-3.5 h-3.5 stroke-[1.75]" />
                      <span>{t.developer.submitTicket}</span>
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 sm:p-5 space-y-3 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
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

                    {ticket.replies.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        {ticket.replies.map((reply) => (
                          <div
                            key={reply.id}
                            className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-1 text-xs"
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
          </div>

          {/* Side Column: GitHub Repo + Direct Contact Clipboard */}
          <div className="space-y-5">
            {/* Direct Connect Quick Reference Card */}
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <Code2 className="w-4 h-4 text-amber-600 stroke-[1.75]" />
                <span>{language === 'ar' ? 'نسخ بيانات التواصل' : 'Copy Contact Data'}</span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Copy Phone / WhatsApp / Telegram */}
                <div className="flex items-center justify-between p-2 rounded-md border border-neutral-200/80 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-3.5 h-3.5 text-amber-600 stroke-[1.75]" />
                    <span className="font-mono text-neutral-700 dark:text-neutral-300">01287615566</span>
                  </div>
                  <button
                    onClick={() => handleCopy('01287615566', 'phone')}
                    className="p-1 rounded text-neutral-500 hover:text-amber-600 transition-colors"
                    title={language === 'ar' ? 'نسخ الرقم' : 'Copy number'}
                  >
                    {copiedChannel === 'phone' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 rounded-md border border-neutral-200/80 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600 stroke-[1.75]" />
                    <span className="font-mono text-neutral-700 dark:text-neutral-300">01124232344</span>
                  </div>
                  <button
                    onClick={() => handleCopy('01124232344', 'whatsapp')}
                    className="p-1 rounded text-neutral-500 hover:text-emerald-600 transition-colors"
                    title={language === 'ar' ? 'نسخ رقم واتساب/تيلجرام' : 'Copy WhatsApp'}
                  >
                    {copiedChannel === 'whatsapp' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Copy Gmail */}
                <div className="flex items-center justify-between p-2 rounded-md border border-neutral-200/80 dark:border-neutral-800">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-rose-600 stroke-[1.75] shrink-0" />
                    <span className="font-mono text-neutral-700 dark:text-neutral-300 truncate">SamyMsood@Gmail.com</span>
                  </div>
                  <button
                    onClick={() => handleCopy('SamyMsood@Gmail.com', 'gmail')}
                    className="p-1 rounded text-neutral-500 hover:text-rose-600 transition-colors shrink-0"
                    title={language === 'ar' ? 'نسخ الجيميل' : 'Copy Gmail'}
                  >
                    {copiedChannel === 'gmail' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Copy Hotmail */}
                <div className="flex items-center justify-between p-2 rounded-md border border-neutral-200/80 dark:border-neutral-800">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-blue-600 stroke-[1.75] shrink-0" />
                    <span className="font-mono text-neutral-700 dark:text-neutral-300 truncate">Samy_Msood@Hotmail.com</span>
                  </div>
                  <button
                    onClick={() => handleCopy('Samy_Msood@Hotmail.com', 'hotmail')}
                    className="p-1 rounded text-neutral-500 hover:text-blue-600 transition-colors shrink-0"
                    title={language === 'ar' ? 'نسخ الهوتميل' : 'Copy Hotmail'}
                  >
                    {copiedChannel === 'hotmail' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Live System & GitHub Status */}
            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-serif font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                  <Activity className="w-3.5 h-3.5 text-emerald-600 stroke-[1.75]" />
                  <span>{t.developer.apiStatus}</span>
                </div>
                <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>99.98%</span>
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-md border border-neutral-200/70 dark:border-neutral-800">
                  <span>GitHub Releases</span>
                  <span className="text-emerald-600 font-mono font-bold">Operational</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-md border border-neutral-200/70 dark:border-neutral-800">
                  <span>Direct Mirror CDN</span>
                  <span className="text-emerald-600 font-mono font-bold">14ms ping</span>
                </div>
              </div>

              <button
                onClick={onOpenGithubModal}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-white transition-colors"
              >
                <Github className="w-3.5 h-3.5 stroke-[1.75]" />
                <span>{t.developer.communityGithub}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

