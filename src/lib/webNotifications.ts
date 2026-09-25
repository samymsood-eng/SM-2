/**
 * Web Notifications Engine for SM+2 Platform
 * Handles browser notification permissions, persistent preference,
 * and dispatching real-time alerts for software releases.
 */

export type NotificationStatus = 'granted' | 'denied' | 'default' | 'unsupported';

/**
 * Check if the current environment supports Web Notifications
 */
export function isWebNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current browser notification status
 */
export function getNotificationStatus(): NotificationStatus {
  if (!isWebNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission as NotificationStatus;
}

/**
 * Request permission from the user to display notifications
 */
export async function requestNotificationPermission(): Promise<NotificationStatus> {
  if (!isWebNotificationSupported()) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      localStorage.setItem('sm2_web_notifications_enabled', 'true');
    } else {
      localStorage.setItem('sm2_web_notifications_enabled', 'false');
    }
    return permission as NotificationStatus;
  } catch (error) {
    console.warn('Error requesting notification permission:', error);
    return Notification.permission as NotificationStatus;
  }
}

/**
 * Check if web notifications are active and enabled by user
 */
export function isWebNotificationEnabled(): boolean {
  if (!isWebNotificationSupported()) return false;
  return (
    Notification.permission === 'granted' &&
    localStorage.getItem('sm2_web_notifications_enabled') !== 'false'
  );
}

/**
 * Toggle web notification preference (if permission granted)
 */
export function setWebNotificationEnabled(enabled: boolean): void {
  localStorage.setItem('sm2_web_notifications_enabled', enabled ? 'true' : 'false');
}

/**
 * Display a native browser notification
 */
export function showWebNotification(
  title: string,
  options?: {
    body?: string;
    icon?: string;
    tag?: string;
    badge?: string;
    data?: any;
    onClickUrl?: string;
  }
): boolean {
  if (!isWebNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const iconUrl = options?.icon || '/logo.png';
    const notif = new Notification(title, {
      body: options?.body || '',
      icon: iconUrl,
      badge: options?.badge || iconUrl,
      tag: options?.tag || 'sm2-update',
      data: options?.data,
    });

    notif.onclick = () => {
      window.focus();
      if (options?.onClickUrl) {
        window.location.hash = options.onClickUrl;
      }
      notif.close();
    };

    return true;
  } catch (err) {
    console.warn('Failed to display web notification:', err);
    return false;
  }
}

/**
 * Send release update notification
 */
export function notifyNewRelease(release: {
  title: string;
  version: string;
  fileName: string;
  language: 'ar' | 'en';
}): boolean {
  const isAr = release.language === 'ar';
  const title = isAr
    ? `🔔 إصدار برمجي جديد: ${release.title} (${release.version})`
    : `🔔 New Software Release: ${release.title} (${release.version})`;

  const body = isAr
    ? `تم إطلاق الحزمة ${release.fileName} بنجاح. انقر الآن للتنزيل المباشر أو التحقق من التغييرات.`
    : `Binary package ${release.fileName} is now available. Click to download or view release notes.`;

  return showWebNotification(title, {
    body,
    tag: `release-${release.version}`,
    onClickUrl: '#downloads',
  });
}
