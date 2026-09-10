import React, { useState, useEffect } from 'react';
import { Product, Language, Page } from '../types';
import { translations } from '../i18n/translations';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Star,
  CheckCircle2,
  Sparkles,
  Info,
  Layers,
  ShieldCheck,
  Zap,
  Play,
  Pause,
} from 'lucide-react';

interface ProductSliderProps {
  products: Product[];
  language: Language;
  onSelectProduct: (product: Product) => void;
  onDirectDownload: (downloadUrl: string) => void;
  setCurrentPage: (page: Page) => void;
}

export const ProductSlider: React.FC<ProductSliderProps> = ({
  products,
  language,
  onSelectProduct,
  onDirectDownload,
  setCurrentPage,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [activeImageSubIndex, setActiveImageSubIndex] = useState(0);
  const isRtl = language === 'ar';
  const t = translations[language];

  const currentProduct = products[currentIndex] || products[0];

  // Reset sub image index when slide changes
  useEffect(() => {
    setActiveImageSubIndex(0);
  }, [currentIndex]);

  // Auto-play timer (changes slide every 6 seconds if active)
  useEffect(() => {
    if (!isAutoPlaying || products.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, products.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  if (!currentProduct) return null;

  const name = language === 'ar' ? currentProduct.name : currentProduct.nameEn;
  const tagline = language === 'ar' ? currentProduct.tagline : currentProduct.taglineEn;
  const desc = language === 'ar' ? currentProduct.description : currentProduct.descriptionEn;
  const features = language === 'ar' ? currentProduct.features : currentProduct.featuresEn;
  const currentImage = currentProduct.images[activeImageSubIndex] || currentProduct.images[0];

  return (
    <div
      id="product-interactive-slider"
      className="relative rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-linear-to-br from-white via-neutral-50 to-amber-50/20 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-950 shadow-xl overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Top Banner Tag & Controls */}
      <div className="flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-800/40 text-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-semibold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{language === 'ar' ? 'عرض حي وتفاعلي للبرمجيات' : 'Interactive Software Showcase'}</span>
          </span>
          <span className="text-neutral-400 dark:text-neutral-600 hidden sm:inline">•</span>
          <span className="text-neutral-500 dark:text-neutral-400 font-mono hidden sm:inline">
            {currentIndex + 1} / {products.length}
          </span>
        </div>

        {/* Slide navigation buttons & auto-play toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors"
            title={isAutoPlaying ? (language === 'ar' ? 'إيقاف التبديل التلقائي' : 'Pause Autoplay') : (language === 'ar' ? 'تشغيل التبديل التلقائي' : 'Resume Autoplay')}
            aria-label="Toggle Autoplay"
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <div className="w-px h-3.5 bg-neutral-200 dark:bg-neutral-700 mx-0.5" />
          <button
            onClick={isRtl ? handleNext : handlePrev}
            className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-transform active:scale-95"
            aria-label="Previous Slide"
          >
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
          <button
            onClick={isRtl ? handlePrev : handleNext}
            className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-transform active:scale-95"
            aria-label="Next Slide"
          >
            {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Slide Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-6 sm:p-8 items-center">
        {/* Visual Showcase (Images & Gallery) - 7 cols on lg */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-video rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-900 group shadow-md">
            <img
              src={currentImage}
              alt={name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            {/* Version & License Floating Badges */}
            <div className="absolute top-3 start-3 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-neutral-900/85 text-white backdrop-blur-sm border border-neutral-700 shadow-xs">
                v{currentProduct.version}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/90 text-neutral-950 font-bold backdrop-blur-xs">
                {currentProduct.category.toUpperCase()}
              </span>
            </div>

            {/* Quick action buttons on visual */}
            <div className="absolute bottom-3 end-3 flex items-center gap-2">
              <button
                onClick={() => onSelectProduct(currentProduct)}
                className="px-3 py-1.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-900 text-white text-xs font-medium backdrop-blur-sm border border-neutral-700 flex items-center gap-1.5 transition-all shadow-md hover:scale-105"
              >
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'ar' ? 'تفاصيل ومعاينة' : 'Full Preview'}</span>
              </button>
            </div>
          </div>

          {/* Interactive Image Thumbnails Selector */}
          {currentProduct.images && currentProduct.images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {currentProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageSubIndex(idx)}
                  className={`relative w-20 sm:w-24 aspect-video rounded-lg overflow-hidden border-2 transition-all duration-200 shrink-0 ${
                    activeImageSubIndex === idx
                      ? 'border-amber-500 shadow-md scale-102 ring-2 ring-amber-500/20'
                      : 'border-neutral-200 dark:border-neutral-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 hover:bg-transparent" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Feature & Description Specs - 5 cols on lg */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Title & Rating */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {name}
                </h3>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300/60 dark:border-amber-700/60 text-xs font-semibold shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{currentProduct.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-400">
                {tagline}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-3">
              {desc}
            </p>

            {/* Key Architectural Features List */}
            <div className="space-y-2 pt-2 border-t border-neutral-200/80 dark:border-neutral-800">
              <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
                {t.sales.features}
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 text-xs">
                {features.slice(0, 3).map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2 text-neutral-700 dark:text-neutral-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-snug">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
              <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-400 dark:text-neutral-500 block">
                  {language === 'ar' ? 'التحميلات' : 'Downloads'}
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 font-mono text-xs">
                  +{currentProduct.downloadsCount.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700">
                <span className="text-neutral-400 dark:text-neutral-500 block">
                  {language === 'ar' ? 'الترخيص' : 'License'}
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs truncate block">
                  {currentProduct.license}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-200/80 dark:border-neutral-800">
            <button
              onClick={() => {
                setCurrentPage('downloads');
                onDirectDownload(currentProduct.downloadUrl);
              }}
              className="flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white text-xs font-semibold shadow-sm transition-all hover:scale-102 active:scale-98"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.sales.directDownload}</span>
            </button>

            <button
              onClick={() => onSelectProduct(currentProduct)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:border-amber-500 dark:hover:border-amber-400 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-amber-500/5 transition-all"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'المواصفات والتقييمات' : 'Specs & Reviews'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Slider Stepper Dots Indicator */}
      <div className="flex items-center justify-center gap-2 py-3 border-t border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-100/40 dark:bg-neutral-900/50">
        {products.map((p, idx) => {
          const pName = language === 'ar' ? p.name : p.nameEn;
          const isActive = idx === currentIndex;
          return (
            <button
              key={p.id}
              onClick={() => setCurrentIndex(idx)}
              className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all duration-300 text-[11px] ${
                isActive
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-900 dark:text-amber-200 font-semibold'
                  : 'hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500'
              }`}
              title={pName}
            >
              <span
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  isActive ? 'bg-amber-600 scale-125' : 'bg-neutral-300 dark:bg-neutral-600 group-hover:bg-neutral-400'
                }`}
              />
              <span className="hidden md:inline font-mono truncate max-w-[120px]">
                {pName}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
