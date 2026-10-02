import React, { useState } from 'react';
import { Product, Language } from '../../types';
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { convertImageUrl } from '../../utils/imageCompressor';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  language: Language;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  product,
  language,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !product) return null;

  const isAr = language === 'ar';
  const name = isAr ? product.name : product.nameEn;
  const tagline = isAr ? product.tagline : product.taglineEn;
  const currentUrl = window.location.origin + window.location.pathname;
  const productShareUrl = `${currentUrl}#product-${product.id}`;

  const shareText = isAr
    ? `🚀 *${name}* (الإصدار v${product.version})\n💡 ${tagline}\n💎 الفئة: ${product.category.toUpperCase()} | الترخيص: ${product.license}\n🔗 رابط المعاينة والتحميل:\n${productShareUrl}`
    : `🚀 *${name}* (Version v${product.version})\n💡 ${tagline}\n💎 Category: ${product.category.toUpperCase()} | License: ${product.license}\n🔗 Direct Link & Download:\n${productShareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productShareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `${name} - ${tagline}`,
          url: productShareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(productShareUrl)}&text=${encodeURIComponent(shareText)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                {isAr ? 'مشاركة هذا المنتج' : 'Share Product'}
              </h3>
              <p className="text-[11px] text-neutral-500">
                {isAr ? 'شارك الرابط المباشر مع زملائك أو عبر المنصات' : 'Share direct link with friends & channels'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Preview Card */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60">
          <div className="w-16 h-12 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-700 shrink-0">
            <img
              src={convertImageUrl(product.images?.[0] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80')}
              alt={name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
              {name}
            </h4>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium truncate">
              v{product.version} • {product.price}
            </p>
            <p className="text-[10px] text-neutral-500 truncate">
              {tagline}
            </p>
          </div>
        </div>

        {/* Social Share Buttons Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* WhatsApp */}
          <a
            href={whatsappShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.077-1.109-.057-.597-.194-1.373-.591-2.368-1.585-.993-.993-1.391-1.77-1.585-2.368-.135-.411-.102-.797-.058-1.109.05-.333.419-1.026.824-1.17.135-.048.271-.06.39-.06.126 0 .237.009.345.024.111.015.258.072.339.267.09.213.615 1.5.669 1.611.054.111.09.24.015.39-.075.15-.114.24-.225.372-.111.132-.234.294-.333.396-.111.111-.228.231-.099.453.129.222.573.945 1.227 1.53.843.753 1.554.987 1.776 1.098.222.111.351.093.483-.06.132-.153.573-.666.726-.894.153-.228.306-.192.516-.114.21.078 1.332.627 1.56.741.228.114.381.171.438.267.057.096.057.558-.087.963zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.436 5.176L2 22l4.986-1.383C8.423 21.499 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.638 0-3.174-.483-4.467-1.312l-.32-.207-2.964.823.837-2.889-.227-.336C3.96 14.936 3.5 13.504 3.5 12c0-4.687 3.813-8.5 8.5-8.5s8.5 3.813 8.5 8.5-3.813 8.5-8.5 8.5z" />
            </svg>
            <span>{isAr ? 'مشاركة عبر واتساب' : 'WhatsApp'}</span>
          </a>

          {/* Telegram */}
          <a
            href={telegramShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
            </svg>
            <span>{isAr ? 'مشاركة عبر تيليجرام' : 'Telegram'}</span>
          </a>
        </div>

        {/* Copy Link Input Section */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
            {isAr ? 'أو انسخ الرابط المباشر:' : 'Or copy direct link:'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={productShareUrl}
              className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 select-all"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isAr ? 'نسخ' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Native share button if supported */}
        {typeof navigator !== 'undefined' && 'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isAr ? 'خيارات مشاركة أخرى عبر هاتفك' : 'More share options on device'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
