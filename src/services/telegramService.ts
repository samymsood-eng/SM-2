import { LicenseRequest } from '../types';

export interface TelegramConfig {
  botToken?: string;
  chatId?: string;
  enabled?: boolean;
}

export function formatDurationLabel(duration: string, lang: 'ar' | 'en' = 'ar'): string {
  switch (duration) {
    case 'trial_1m':
      return lang === 'ar' ? 'فترة تجريبية (شهر واحد)' : 'Trial (1 Month)';
    case 'trial_2m':
      return lang === 'ar' ? 'فترة تجريبية (شهران)' : 'Trial (2 Months)';
    case 'trial_3m':
      return lang === 'ar' ? 'فترة تجريبية (3 أشهر)' : 'Trial (3 Months)';
    case 'sub_3m':
      return lang === 'ar' ? 'اشتراك مدفوع (3 أشهر)' : 'Subscription (3 Months)';
    case 'sub_6m':
      return lang === 'ar' ? 'اشتراك مدفوع (6 أشهر)' : 'Subscription (6 Months)';
    case 'sub_1y':
      return lang === 'ar' ? 'اشتراك مدفوع (سنة كاملة)' : 'Subscription (1 Year)';
    case 'lifetime':
      return lang === 'ar' ? 'ترخيص دائم (مدى الحياة)' : 'Lifetime License';
    default:
      return duration;
  }
}

/**
 * Dispatches a formatted notification message to Telegram Bot / Admin Channel
 */
export async function sendTelegramNotification(
  message: string,
  config: TelegramConfig
): Promise<{ success: boolean; error?: string }> {
  if (!config.enabled || !config.botToken || !config.chatId) {
    return { success: false, error: 'Telegram bot token or chat ID is not configured.' };
  }

  const cleanToken = config.botToken.trim();
  const cleanChatId = config.chatId.trim();

  const url = `https://api.telegram.org/bot${cleanToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: cleanChatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      return {
        success: false,
        error: data.description || `HTTP ${response.status} from Telegram API`,
      };
    }

    return { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error while contacting Telegram API',
    };
  }
}

/**
 * Formats a clean, high-priority HTML Telegram alert for a new incoming license request
 */
export function buildNewLicenseRequestTelegramMessage(req: LicenseRequest): string {
  const durationLabel = formatDurationLabel(req.duration, 'ar');
  const paymentInfo = req.paymentReference
    ? `💳 <b>مرجع السداد/الفاتورة:</b> <code>${req.paymentReference}</code>\n`
    : '🆓 <b>نوع الطلب:</b> فترة تجريبية مجانية\n';

  return (
    `🔔 <b>طلب ترخيص وتفعيل جديد — SM-2 Engine</b>\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `🆔 <b>رقم الطلب:</b> <code>${req.id}</code>\n` +
    `👤 <b>اسم العميل:</b> ${req.clientName}\n` +
    `📧 <b>البريد:</b> ${req.clientEmail}\n` +
    (req.clientPhone ? `📱 <b>الهاتف/واتساب:</b> ${req.clientPhone}\n` : '') +
    `📦 <b>البرنامج:</b> <b>${req.productName}</b>\n` +
    `⏱️ <b>المدة المطلوبة:</b> ${durationLabel}\n` +
    paymentInfo +
    `💻 <b>بصمة الجهاز (HWID):</b>\n<code>${req.hardwareId}</code>\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `🕒 <b>التاريخ:</b> ${req.createdAt}\n` +
    `💡 <i>يمكنك نسخ البصمة وتوليد السيريال من أداتك واعتماده عبر لوحة تحكم المشرف.</i>`
  );
}

/**
 * Formats a clean Telegram message when a serial key has been activated
 */
export function buildSerialActivatedTelegramMessage(req: LicenseRequest): string {
  const durationLabel = formatDurationLabel(req.duration, 'ar');

  return (
    `✅ <b>تم إصدار وتفعيل السيريال بنجاح</b>\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `🆔 <b>رقم الطلب:</b> <code>${req.id}</code>\n` +
    `👤 <b>العميل:</b> ${req.clientName}\n` +
    `📦 <b>البرنامج:</b> ${req.productName} (${durationLabel})\n` +
    `🔑 <b>السيريال المعتمد:</b>\n<code>${req.serialKey || 'N/A'}</code>\n` +
    `━━━━━━━━━━━━━━━━━━━\n` +
    `🕒 <b>وقت التفعيل:</b> ${req.activatedAt || 'الآن'}`
  );
}
