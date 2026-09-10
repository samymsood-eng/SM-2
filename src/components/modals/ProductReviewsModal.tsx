import React, { useState } from 'react';
import { Product, Language } from '../../types';
import { translations } from '../../i18n/translations';
import {
  X,
  Star,
  MessageSquare,
  CheckCircle2,
  Send,
  User,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

interface ProductReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  language: Language;
  onAddReview: (productId: string, review: { author: string; rating: number; comment: string }) => void;
}

export const ProductReviewsModal: React.FC<ProductReviewsModalProps> = ({
  isOpen,
  onClose,
  product,
  language,
  onAddReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [authorName, setAuthorName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen || !product) return null;

  const t = translations[language];
  const reviews = product.reviews || [];
  const productName = language === 'ar' ? product.name : product.nameEn;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddReview(product.id, {
      author: authorName.trim() || (language === 'ar' ? 'مهندس برمجيات' : 'Software Engineer'),
      rating,
      comment: commentText.trim(),
    });

    setSubmittedSuccess(true);
    setAuthorName('');
    setCommentText('');
    setRating(5);

    setTimeout(() => {
      setSubmittedSuccess(false);
    }, 4000);
  };

  return (
    <div
      id="product-reviews-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {t.sales.userReviewsTitle}
              </h3>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                <span>{productName}</span>
                <span>•</span>
                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{product.rating.toFixed(1)}</span>
                </div>
                <span>({reviews.length} {t.sales.reviewsCount})</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          {/* Submit Review Form */}
          <div className="p-4 sm:p-5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-neutral-100">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>{t.sales.addReviewTitle}</span>
            </div>

            {submittedSuccess ? (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{t.sales.reviewSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Interactive Star Rating Selector */}
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {t.sales.ratingLabel}
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((starVal) => {
                      const isFilled = (hoverRating !== null ? hoverRating : rating) >= starVal;
                      return (
                        <button
                          key={starVal}
                          type="button"
                          onClick={() => setRating(starVal)}
                          onMouseEnter={() => setHoverRating(starVal)}
                          onMouseLeave={() => setHoverRating(null)}
                          className="p-1 focus:outline-none transition-transform hover:scale-110"
                          title={`${starVal} / 5`}
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              isFilled
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-neutral-300 dark:text-neutral-700'
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs font-bold font-mono text-amber-700 dark:text-amber-400 ms-2">
                      {hoverRating !== null ? hoverRating : rating} / 5
                    </span>
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {t.sales.authorLabel}
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder={language === 'ar' ? 'الاسم أو معرّف المطور' : 'Your name or handle'}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Comment Field */}
                <div>
                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {language === 'ar' ? 'نص المراجعة والتقييم' : 'Review Feedback'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={t.sales.commentPlaceholder}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{t.sales.submitReview}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Existing Reviews List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
              {t.sales.reviews} ({reviews.length})
            </h4>

            {reviews.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-500 dark:text-neutral-400 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800">
                {t.sales.noReviewsYet}
              </div>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 text-xs font-bold">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                          {rev.author}
                        </span>
                        {rev.verifiedBuyer && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            <ShieldCheck className="w-3 h-3" />
                            <span>{language === 'ar' ? 'مطور معتمد' : 'Verified'}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < rev.rating ? 'fill-current text-amber-500' : 'text-neutral-300 dark:text-neutral-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-mono text-neutral-400">
                          {rev.date}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
};
