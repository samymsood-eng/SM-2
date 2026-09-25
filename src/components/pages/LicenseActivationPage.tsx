import React, { useState } from 'react';
import {
  KeyRound,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Clock,
  Send,
  AlertCircle,
  HelpCircle,
  Search,
  Check,
} from 'lucide-react';
import { Language, LicenseRequest, LicenseDuration, Product, GitHubSettings } from '../../types';
import {
  buildNewLicenseRequestTelegramMessage,
  formatDurationLabel,
  sendTelegramNotification,
} from '../../services/telegramService';

interface LicenseActivationPageProps {
  products: Product[];
  licenseRequests: LicenseRequest[];
  onSubmitLicenseRequest: (req: LicenseRequest) => void;
  githubSettings?: GitHubSettings;
  language: Language;
}

// Helper function for HWID validation
export function validateHwid(hwid: string): {
  isValid: boolean;
  messageAr: string;
  messageEn: string;
  status: 'empty' | 'invalid' | 'valid';
} {
  const clean = hwid.trim();
  if (!clean) {
    return { isValid: false, messageAr: '', messageEn: '', status: 'empty' };
  }
  if (clean.length < 10) {
    return {
      isValid: false,
      messageAr: 'البصمة قصيرة جداً (يجب أن تتكون من 10 خانات على الأقل مستخرجة من البرنامج)',
      messageEn: 'Hardware ID too short (must be at least 10 characters)',
      status: 'invalid',
    };
  }
  if (!/^[A-Za-z0-9\-_:.]+$/.test(clean)) {
    return {
      isValid: false,
      messageAr: 'البصمة تحتوي على رموز غير صالحة أو مسافات. المسموح فقط: أحرف، أرقام، ورموز (-_:.)',
      messageEn: 'Contains invalid characters or spaces. Only alphanumeric and (-_:.) allowed',
      status: 'invalid',
    };
  }
  if (/^(.)\1+$/.test(clean)) {
    return {
      isValid: false,
      messageAr: 'البصمة المدخلة غير صحيحة (نمط متكرر وهمي)',
      messageEn: 'Invalid Hardware ID (repeated dummy character pattern)',
      status: 'invalid',
    };
  }
  return {
    isValid: true,
    messageAr: 'صيغة البصمة صحيحة ومطابقة للوحة الأم والمعالج ✓',
    messageEn: 'Valid Hardware ID format verified ✓',
    status: 'valid',
  };
}

// Calculate default expiration date based on duration
export function calculateExpirationDate(duration: LicenseDuration): string | undefined {
  if (duration === 'lifetime') return undefined;
  const now = new Date();
  if (duration === 'trial_1m') now.setMonth(now.getMonth() + 1);
  else if (duration === 'trial_2m') now.setMonth(now.getMonth() + 2);
  else if (duration === 'trial_3m') now.setMonth(now.getMonth() + 3);
  else if (duration === 'sub_6m') now.setMonth(now.getMonth() + 6);
  else if (duration === 'sub_1y') now.setFullYear(now.getFullYear() + 1);
  return now.toISOString().split('T')[0];
}

export const LicenseActivationPage: React.FC<LicenseActivationPageProps> = ({
  products,
  licenseRequests,
  onSubmitLicenseRequest,
  githubSettings,
  language,
}) => {
  // Form fields
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.name || 'SM-2 Core Engine Studio');
  const [hardwareId, setHardwareId] = useState('');
  const [requestType, setRequestType] = useState<'trial' | 'paid'>('trial');
  const [duration, setDuration] = useState<LicenseDuration>('trial_1m');
  const [paymentRef, setPaymentRef] = useState('');

  // Status & Search state
  const [searchRequestId, setSearchRequestId] = useState('');
  const [searchedRequest, setSearchedRequest] = useState<LicenseRequest | null | undefined>(undefined);
  const [submittedRequest, setSubmittedRequest] = useState<LicenseRequest | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showHwidHelp, setShowHwidHelp] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Real-time validation
  const hwidValidation = validateHwid(hardwareId);

  // Handle Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim() || !hardwareId.trim()) return;
    if (!hwidValidation.isValid) return;

    setSubmitting(true);
    const newId = `LIC-${Math.floor(10000 + Math.random() * 90000)}`;
    const effectiveDuration = requestType === 'trial' ? 'trial_1m' : duration;
    const effectiveType = requestType === 'trial' ? 'trial' : (duration === 'lifetime' ? 'lifetime' : 'annual');
    const calculatedExpiry = calculateExpirationDate(effectiveDuration);

    const newRequest: LicenseRequest = {
      id: newId,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      productName: selectedProduct,
      hardwareId: hardwareId.trim().toUpperCase(),
      duration: effectiveDuration,
      licenseType: effectiveType,
      expiresAt: calculatedExpiry,
      paymentReference: requestType === 'paid' ? paymentRef.trim() : undefined,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    // Save to Local/Cloud state
    onSubmitLicenseRequest(newRequest);
    setSubmittedRequest(newRequest);

    // Send Telegram Notification if enabled
    if (githubSettings?.enableTelegramNotifications && githubSettings?.telegramBotToken && githubSettings?.telegramChatId) {
      const msg = buildNewLicenseRequestTelegramMessage(newRequest);
      await sendTelegramNotification(msg, {
        botToken: githubSettings.telegramBotToken,
        chatId: githubSettings.telegramChatId,
        enabled: githubSettings.enableTelegramNotifications,
      });
    }

    setSubmitting(false);
  };

  // Search existing request
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRequestId.trim()) return;
    const cleanId = searchRequestId.trim().toUpperCase();
    const found = licenseRequests.find(
      (r) => r.id.toUpperCase() === cleanId || r.hardwareId.toUpperCase() === cleanId
    );
    setSearchedRequest(found || null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  return (
    <div className="py-10 px-4 max-w-6xl mx-auto space-y-10">
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <KeyRound className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'نظام حماية وتفعيل التراخيص المعتمدة' : 'Hardware-Locked License Portal'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
          {language === 'ar' ? 'بوابة تفعيل التراخيص وبصمة الأجهزة' : 'Hardware ID & License Activation Hub'}
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
          {language === 'ar'
            ? 'تعتمد برمجياتنا نظام أمان مشفر مرتبطاً ببصمة المعالج واللوحة الأم (Motherboard + CPU). أدخل بصمة جهازك لاستلام سيريال التفعيل المخصص لحاسوبك حصراً.'
            : 'Our software utilizes cryptographic machine locking tied to your hardware fingerprint. Submit your Machine ID to receive your custom licensed serial key.'}
        </p>
      </div>

      {/* Main Grid: Form + Search Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Request Form */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <div className="flex items-center gap-2 font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100">
              <Cpu className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>{language === 'ar' ? 'تقديم طلب ترخيص جديد' : 'Submit Activation Request'}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowHwidHelp(!showHwidHelp)}
              className="text-xs text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'كيف أحصل على البصمة؟' : 'How to get Machine ID?'}</span>
            </button>
          </div>

          {/* HWID Help Box */}
          {showHwidHelp && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{language === 'ar' ? 'طريقة استخراج بصمة جهازك بسهولة:' : 'How to copy your Machine Fingerprint:'}</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-neutral-700 dark:text-neutral-300">
                <li>{language === 'ar' ? 'قم بتشغيل البرنامج المثبت على حاسوبك.' : 'Launch the installed software.'}</li>
                <li>{language === 'ar' ? 'ستظهر لك نافذة التفعيل وبها حقل (Hardware ID / كود البصمة).' : 'The activation dialog will display your Hardware ID.'}</li>
                <li>{language === 'ar' ? 'انقر على زر "نسخ الكود" ثم الصقه في الحقل المخصص أدناه.' : 'Click "Copy ID" and paste it in the field below.'}</li>
              </ol>
            </div>
          )}

          {submittedRequest ? (
            /* Success confirmation card */
            <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-emerald-900 dark:text-emerald-200 text-base">
                    {language === 'ar' ? 'تم استلام طلب التفعيل بنجاح!' : 'Request Submitted Successfully!'}
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    {language === 'ar'
                      ? 'تم إرسال إشعار للمشرف وسيتم استخراج السيريال المخصص لبصمة جهازك وتزويدك به سريعاً.'
                      : 'An alert has been dispatched to the administrators. Your hardware-locked key will be verified promptly.'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white dark:bg-neutral-900 rounded-lg border border-emerald-200 dark:border-emerald-900 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">{language === 'ar' ? 'رقم الطلب الخاص بك:' : 'Request Code:'}</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                    {submittedRequest.id}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">{language === 'ar' ? 'بصمة الجهاز المسجلة:' : 'Hardware Fingerprint:'}</span>
                  <span className="font-mono text-[11px] text-neutral-700 dark:text-neutral-300 truncate max-w-[200px]">
                    {submittedRequest.hardwareId}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedRequest(null);
                    setHardwareId('');
                    setPaymentRef('');
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors"
                >
                  {language === 'ar' ? 'تقديم طلب لجهاز آخر' : 'Submit for Another Device'}
                </button>
              </div>
            </div>
          ) : (
            /* Submission Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-neutral-800 dark:text-neutral-200">
                    {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: أحمد محمود' : 'e.g. John Doe'}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-amber-600"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-neutral-800 dark:text-neutral-200">
                    {language === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-amber-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium mb-1 text-neutral-800 dark:text-neutral-200">
                    {language === 'ar' ? 'رقم الهاتف / الواتساب (للاستلام السريع)' : 'Phone / WhatsApp'}
                  </label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+966 50..."
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-amber-600"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-neutral-800 dark:text-neutral-200">
                    {language === 'ar' ? 'البرنامج المراد تفعيله' : 'Target Software'}
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-amber-600"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.name}>
                        {language === 'ar' ? p.name : p.nameEn || p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hardware ID / Machine Fingerprint */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-medium text-neutral-800 dark:text-neutral-200">
                    {language === 'ar' ? 'بصمة الجهاز المستخرجة من البرنامج (Hardware ID) *' : 'Hardware ID (Motherboard + CPU Fingerprint) *'}
                  </label>
                  {hardwareId.trim() && (
                    <span
                      className={`text-[11px] font-medium flex items-center gap-1 ${
                        hwidValidation.isValid
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {hwidValidation.isValid ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'بصمة صالحة' : 'Valid HWID'}</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'بصمة غير صالحة' : 'Invalid HWID'}</span>
                        </>
                      )}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={hardwareId}
                    onChange={(e) => setHardwareId(e.target.value)}
                    placeholder="BFEBFBFF000906EA-MB-X570-..."
                    className={`w-full pl-3 pr-10 py-2.5 rounded-xl border bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono text-xs focus:outline-none transition-colors uppercase ${
                      hardwareId.trim()
                        ? hwidValidation.isValid
                          ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          : 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-amber-500/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const text = await navigator.clipboard.readText();
                        if (text) setHardwareId(text.trim());
                      } catch {
                        // ignore permission error
                      }
                    }}
                    title={language === 'ar' ? 'لصق من الحافظة' : 'Paste from clipboard'}
                    className="absolute right-2 top-2 text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer p-1"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {hardwareId.trim() ? (
                  <p
                    className={`text-[11px] mt-1.5 flex items-center gap-1.5 ${
                      hwidValidation.isValid
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    <span>{language === 'ar' ? hwidValidation.messageAr : hwidValidation.messageEn}</span>
                  </p>
                ) : (
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block mt-1">
                    {language === 'ar'
                      ? 'السيريال المستخرج سيعمل فقط على هذا الجهاز بشكل حصري ولا يمكن تشغيله على جهاز آخر.'
                      : 'The generated key will be strictly tied to this hardware signature.'}
                  </span>
                )}
              </div>

              {/* License Mode Selection: Trial vs Paid */}
              <div className="space-y-2 pt-2">
                <label className="block font-medium text-neutral-800 dark:text-neutral-200">
                  {language === 'ar' ? 'نوع الترخيص المطلوب:' : 'License Plan Type:'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setRequestType('trial');
                      setDuration('trial_1m');
                    }}
                    className={`p-3 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
                      requestType === 'trial'
                        ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 ring-1 ring-amber-600'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div className="font-semibold">{language === 'ar' ? 'فترة تجريبية مجانية' : 'Free Trial'}</div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      {language === 'ar' ? 'شهر واحد لتجربة البرنامج' : '1 Month Evaluation'}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRequestType('paid');
                      setDuration('sub_1y');
                    }}
                    className={`p-3 rounded-xl border text-left rtl:text-right transition-all cursor-pointer ${
                      requestType === 'paid'
                        ? 'border-amber-600 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 ring-1 ring-amber-600'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div className="font-semibold">{language === 'ar' ? 'ترخيص تجاري مدفوع' : 'Commercial License'}</div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      {language === 'ar' ? 'سنة كاملة أو مدى الحياة' : '1 Year or Lifetime'}
                    </div>
                  </button>
                </div>
              </div>

              {/* Paid Options */}
              {requestType === 'paid' && (
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <div>
                    <label className="block font-medium mb-1 text-neutral-800 dark:text-neutral-200">
                      {language === 'ar' ? 'مدة الترخيص المدفوع' : 'Duration'}
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value as LicenseDuration)}
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                    >
                      <option value="sub_6m">{language === 'ar' ? 'اشتراك 6 أشهر' : '6 Months'}</option>
                      <option value="sub_1y">{language === 'ar' ? 'اشتراك سنة كاملة (موصى به)' : '1 Year (Standard)'}</option>
                      <option value="lifetime">{language === 'ar' ? 'ترخيص دائم مدى الحياة (Lifetime)' : 'Lifetime Perpetual'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium mb-1 text-neutral-800 dark:text-neutral-200">
                      {language === 'ar' ? 'رقم الحوالة أو كود الفاتورة / إيصال الدفع *' : 'Payment / Invoice Reference *'}
                    </label>
                    <input
                      type="text"
                      required={requestType === 'paid'}
                      value={paymentRef}
                      onChange={(e) => setPaymentRef(e.target.value)}
                      placeholder="PAY-XXXXXX / VISA / STC Pay / إيصال"
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting || !hwidValidation.isValid}
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? (language === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : (language === 'ar' ? 'إرسال طلب استخراج السيريال' : 'Submit Activation Request')}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Check Request Status & Info */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status Tracker Box */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 font-serif text-base font-bold text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <Search className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{language === 'ar' ? 'الاستعلام عن حالة الطلب والسيريال' : 'Check Key Status'}</span>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {language === 'ar'
                ? 'إذا قدمت طلباً مسبقاً، أدخل رقم الطلب (مثل LIC-89241) أو بصمة جهازك لعرض السيريال ونسخه مباشرة.'
                : 'Enter your Request Code or Hardware ID to retrieve your generated serial key.'}
            </p>

            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                required
                value={searchRequestId}
                onChange={(e) => setSearchRequestId(e.target.value)}
                placeholder="LIC-XXXXX"
                className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono text-xs uppercase"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-semibold transition-colors cursor-pointer"
              >
                {language === 'ar' ? 'استعلام' : 'Search'}
              </button>
            </form>

            {/* Search Result Display */}
            {searchedRequest !== undefined && (
              <div className="pt-2">
                {searchedRequest === null ? (
                  <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{language === 'ar' ? 'لم يتم العثور على طلب بهذا الكود أو البصمة.' : 'No request found for this ID.'}</span>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                        {searchedRequest.id}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          searchedRequest.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                            : searchedRequest.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                        }`}
                      >
                        {searchedRequest.status === 'active'
                          ? (language === 'ar' ? 'مفعل وجاهز' : 'Active')
                          : searchedRequest.status === 'pending'
                          ? (language === 'ar' ? 'قيد المراجعة' : 'Pending Verification')
                          : (language === 'ar' ? 'مرفوض' : 'Rejected')}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-neutral-600 dark:text-neutral-300">
                      <div>
                        <b>{language === 'ar' ? 'البرنامج:' : 'Software:'}</b> {searchedRequest.productName}
                      </div>
                      <div>
                        <b>{language === 'ar' ? 'المدة:' : 'Plan:'}</b> {formatDurationLabel(searchedRequest.duration, language === 'ar' ? 'ar' : 'en')}
                      </div>
                    </div>

                    {searchedRequest.status === 'active' && searchedRequest.serialKey ? (
                      <div className="p-3 rounded-lg bg-emerald-100/60 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-900 dark:text-emerald-200">
                          <span>{language === 'ar' ? 'سيريال التفعيل المعتمد:' : 'Active Serial Key:'}</span>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(searchedRequest.serialKey!)}
                            className="text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-1 cursor-pointer text-[11px]"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{copiedKey ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ' : 'Copy')}</span>
                          </button>
                        </div>
                        <div className="p-2 rounded bg-white dark:bg-neutral-900 font-mono text-xs text-neutral-900 dark:text-neutral-100 break-all select-all font-bold text-center">
                          {searchedRequest.serialKey}
                        </div>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded bg-amber-100/50 dark:bg-amber-950/30 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{language === 'ar' ? 'طلبك قيد مراجعة المشرف لاستخراج السيريال لأداتك.' : 'Under review by administrators.'}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Security & Reliability Card */}
          <div className="bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-3 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="font-serif font-bold text-neutral-900 dark:text-neutral-100 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{language === 'ar' ? 'أمان التفعيل وسلامة الترخيص' : 'Machine-Lock Guarantees'}</span>
            </div>
            <p>
              {language === 'ar'
                ? 'يتم فحص بصمة الجهاز تشفيرياً (Cryptographic Hardware Binding) دون جمع أي بيانات شخصية أو سرية من حاسوبك، مما يضمن عمل البرنامج بكفاءة وسرعة فائقة أوفلاين.'
                : 'Hardware signatures are bound using zero-knowledge cryptographic hashes, ensuring total privacy and seamless offline operation.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
