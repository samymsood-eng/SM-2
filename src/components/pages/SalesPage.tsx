import React, { useState } from 'react';
import { Product, Language, Page } from '../../types';
import { translations } from '../../i18n/translations';
import { ProductReviewsModal } from '../modals/ProductReviewsModal';
import { ProductSlider } from '../ProductSlider';
import {
  Download,
  Star,
  Check,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Cpu,
  Eye,
  X,
  CreditCard,
  HeartHandshake,
  MessageSquare,
  PlusCircle,
  Lock,
  Copy,
} from 'lucide-react';

interface SalesPageProps {
  products: Product[];
  language: Language;
  setCurrentPage: (page: Page) => void;
  onSelectDownload: (url: string) => void;
  onAddReview?: (productId: string, review: { author: string; rating: number; comment: string }) => void;
}

export const SalesPage: React.FC<SalesPageProps> = ({
  products,
  language,
  setCurrentPage,
  onSelectDownload,
  onAddReview,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [purchaseModalProduct, setPurchaseModalProduct] = useState<Product | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [reviewsModalProduct, setReviewsModalProduct] = useState<Product | null>(null);
  const [downloadModalProduct, setDownloadModalProduct] = useState<Product | null>(null);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const t = translations[language];
  const isRtl = language === 'ar';

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setActiveImageIndex(0);
  };

  const handleCopyPassword = (pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2500);
  };

  const handleProductDownloadAction = (product: Product) => {
    // If the product has an archive password, open the official gateway modal so the visitor can view & copy the password
    if (product.archivePassword) {
      setDownloadModalProduct(product);
      return;
    }

    // If an external download URL is available (Google Drive, MEGA, or valid web URL), direct the visitor immediately!
    if (
      product.downloadUrl &&
      (product.downloadUrl.startsWith('http://') || product.downloadUrl.startsWith('https://')) &&
      !product.downloadUrl.includes('example.com')
    ) {
      window.open(product.downloadUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    // If designated as cloud provider without full URL or needs explicit staging
    if (product.downloadProvider === 'google_drive' || product.downloadProvider === 'mega') {
      setDownloadModalProduct(product);
    } else {
      onSelectDownload(product.downloadUrl);
      setCurrentPage('downloads');
    }
  };

  const handleLaunchDownload = (product: Product) => {
    if (product.archivePassword) {
      navigator.clipboard.writeText(product.archivePassword);
      setCopiedPassword(true);
    }

    if (
      product.downloadUrl &&
      (product.downloadUrl.startsWith('http://') || product.downloadUrl.startsWith('https://'))
    ) {
      window.open(product.downloadUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Simulate direct file download
      const element = document.createElement('a');
      const fileContent = `SM+2 Software Release\nProduct: ${product.name}\nVersion: ${product.version}\nProvider: ${product.downloadProvider || 'direct'}\nPassword: ${product.archivePassword || 'None'}\nDownloaded from SM+2 Integrated Platform.`;
      const blob = new Blob([fileContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(blob);
      element.download = `${product.name.replace(/\s+/g, '_')}_v${product.version}.zip.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleSimulatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setPurchaseSuccess(true);
    setTimeout(() => {
      setPurchaseSuccess(false);
      setPurchaseModalProduct(null);
    }, 2500);
  };

  const handleReviewSubmission = (
    productId: string,
    review: { author: string; rating: number; comment: string }
  ) => {
    if (onAddReview) {
      onAddReview(productId, review);
    }
    // Update local modal state if active
    if (selectedProduct && selectedProduct.id === productId) {
      const newRev = {
        id: `rev-${Date.now()}`,
        productId,
        author: review.author,
        rating: review.rating,
        comment: review.comment,
        date: new Date().toISOString().split('T')[0],
        verifiedBuyer: true,
      };
      const updatedRevs = [newRev, ...(selectedProduct.reviews || [])];
      const avg = Math.round((updatedRevs.reduce((a, b) => a + b.rating, 0) / updatedRevs.length) * 10) / 10;
      setSelectedProduct({
        ...selectedProduct,
        reviews: updatedRevs,
        rating: avg,
      });
    }
  };

  return (
    <div id="sales-showcase-page" className="min-h-screen py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section: Classic, Artistic & Refined */}
        <section className="relative text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-300 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{t.sales.badge}</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight leading-[1.15]">
            {t.sales.heroTitle}
          </h1>

          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-normal">
            {t.sales.heroDesc}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              id="hero-explore-downloads-btn"
              onClick={() => setCurrentPage('downloads')}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white text-sm font-semibold shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{t.common.downloadNow}</span>
              {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
            <button
              id="hero-explore-docs-btn"
              onClick={() => setCurrentPage('developer')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-neutral-200 text-neutral-800 dark:text-neutral-200 text-sm font-semibold transition-colors"
            >
              <span>{t.nav.developer}</span>
            </button>
          </div>

          {/* Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8 border-t border-neutral-200 dark:border-neutral-800 max-w-xl mx-auto">
            <div className="p-3">
              <div className="font-serif text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                100%
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                {language === 'ar' ? 'مفتوح المصدر وخالٍ من التتبع' : 'Zero-Telemetry Open Core'}
              </div>
            </div>
            <div className="p-3">
              <div className="font-serif text-2xl font-bold text-amber-700 dark:text-amber-400">
                4.9 / 5
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                {t.sales.satisfactionRate}
              </div>
            </div>
            <div className="p-3 col-span-2 sm:col-span-1">
              <div className="font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                <span className="tabular-nums">+180K</span>
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                {t.sales.downloadsGlobal}
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Showcase Slider Section (عرض شرائح تفاعلي للمنتجات) */}
        <section id="interactive-slider-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {language === 'ar' ? 'العرض الحي التفاعلي للبرمجيات' : 'Interactive Software Highlights'}
              </h2>
            </div>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {language === 'ar' ? 'تبديل تلقائي وتصفح للصور والمميزات' : 'Auto-sliding features & gallery'}
            </span>
          </div>

          <ProductSlider
            products={products}
            language={language}
            onSelectProduct={openProductDetails}
            onDirectDownload={onSelectDownload}
            setCurrentPage={setCurrentPage}
          />
        </section>

        {/* Products Showcase Grid (صفحة عرض المبيعات) */}
        <section id="products-catalog-section" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {t.sales.featuredProducts}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {t.sales.exploreCatalog}
              </p>
            </div>
            <span className="text-xs font-mono text-amber-700 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded border border-amber-500/20 self-start md:self-auto">
              SM+2 Architecture Catalog
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const name = language === 'ar' ? product.name : product.nameEn;
              const tagline = language === 'ar' ? product.tagline : product.taglineEn;
              const desc = language === 'ar' ? product.description : product.descriptionEn;
              const features = language === 'ar' ? product.features : product.featuresEn;

              return (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  className="group rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden flex flex-col justify-between hover:border-neutral-400 dark:hover:border-neutral-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div>
                    {/* Visual Screenshot / Gallery Header */}
                    <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <img
                        src={product.images[0]}
                        alt={name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-3 start-3">
                        <span className="px-2.5 py-1 rounded text-[11px] font-mono font-semibold bg-neutral-900/80 text-white backdrop-blur-sm border border-neutral-700">
                          v{product.version}
                        </span>
                      </div>
                      <div className="absolute top-3 end-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReviewsModalProduct(product);
                          }}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-sm transition-transform active:scale-95"
                          title={t.sales.viewReviews}
                        >
                          <Star className="w-3 h-3 fill-current" />
                          <span>{product.rating.toFixed(1)}</span>
                          <span className="opacity-75">({product.reviews?.length || 0})</span>
                        </button>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                          {name}
                        </h3>
                        <p className="text-xs text-amber-700 dark:text-amber-400 font-medium mt-0.5">
                          {tagline}
                        </p>
                      </div>

                      <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                        {desc}
                      </p>

                      {/* Feature Checklist */}
                      <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                        {features.slice(0, 3).map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Call-To-Action Footer */}
                  <div className="p-6 pt-0 space-y-4">
                    <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-semibold text-neutral-400 dark:text-neutral-500">
                          {t.sales.pricing}
                        </div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                          {product.price}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        {product.downloadProvider === 'google_drive' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold border border-blue-500/20">
                            Google Drive
                          </span>
                        )}
                        {product.downloadProvider === 'mega' && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-700 dark:text-red-300 font-bold border border-red-500/20">
                            MEGA.nz
                          </span>
                        )}
                        {(!product.downloadProvider || product.downloadProvider === 'direct') && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                            CDN
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                          {product.license}
                        </span>
                      </div>
                    </div>

                    {/* Archive Password Preview (if configured by admin) */}
                    {product.archivePassword && (
                      <div className="p-2.5 rounded-lg bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                          <Lock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span className="text-[11px] font-medium">{language === 'ar' ? 'باسورد فك الضغط:' : 'Archive Pass:'}</span>
                          <span className="font-mono font-bold text-amber-800 dark:text-amber-300 select-all">{product.archivePassword}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyPassword(product.archivePassword!)}
                          className="px-2 py-1 rounded hover:bg-amber-500/20 text-[10px] font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1"
                          title={language === 'ar' ? 'نسخ الباسورد' : 'Copy Password'}
                        >
                          <Copy className="w-3 h-3" />
                          <span>{language === 'ar' ? 'نسخ' : 'Copy'}</span>
                        </button>
                      </div>
                    )}

                    {/* Action Buttons: Details, Reviews, Download */}
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          id={`view-details-${product.id}`}
                          onClick={() => openProductDetails(product)}
                          className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t.common.learnMore}</span>
                        </button>

                        <button
                          id={`view-reviews-${product.id}`}
                          onClick={() => setReviewsModalProduct(product)}
                          className="flex items-center justify-center gap-1 px-2.5 py-2 rounded-lg border border-amber-300/60 dark:border-amber-700/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-semibold text-amber-800 dark:text-amber-300 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                          <span>{t.sales.reviews} ({product.reviews?.length || 0})</span>
                        </button>
                      </div>

                      <button
                        id={`download-prod-${product.id}`}
                        onClick={() => handleProductDownloadAction(product)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white text-xs font-semibold shadow-sm transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>
                          {product.downloadProvider === 'google_drive'
                            ? (language === 'ar' ? 'تحميل عبر Google Drive' : 'Download via Google Drive')
                            : product.downloadProvider === 'mega'
                            ? (language === 'ar' ? 'تحميل عبر MEGA.nz' : 'Download via MEGA')
                            : t.sales.directDownload}
                        </span>
                      </button>
                    </div>

                    {/* Purchase / Enterprise Quote Option */}
                    <button
                      id={`quote-btn-${product.id}`}
                      onClick={() => setPurchaseModalProduct(product)}
                      className="w-full text-center text-xs text-amber-700 dark:text-amber-400 hover:underline py-1 font-medium"
                    >
                      {t.sales.requestCustomQuote}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Customer Trust & Editorial Review Section */}
        <section className="p-8 sm:p-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="flex items-center justify-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <blockquote className="font-serif text-lg sm:text-xl text-neutral-800 dark:text-neutral-200 italic leading-relaxed">
              {language === 'ar'
                ? '«إن تجربة SM+2 أعادت تعريف مفهوم الأدوات البرمجية النظيفة. واجهة كلاسيكية رصينة، سرعة استثنائية دون ثقل أطر العمل التجارية المعقدة، وربط تلقائي سلس مع GitHub Releases وإشعارات البريد.»'
                : '"SM+2 has redefined our development cadence. The timeless classical interface, zero-latency execution, and seamless GitHub release staging with instant subscriber broadcasts make it our team’s core standard."'}
            </blockquote>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              <strong className="text-neutral-900 dark:text-neutral-100">
                {language === 'ar' ? 'د. مروان التميمي' : 'Dr. Marwan Al-Tamimi'}
              </strong>
              {' '}- {language === 'ar' ? 'رئيس المعمارية السحابية ونظم النشر' : 'Lead Architect, Cloud Systems'}
            </div>
          </div>
        </section>
      </div>

      {/* Deep Product Detail & Screenshot Gallery Modal */}
      {selectedProduct && (
        <div
          id="product-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 end-4 p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div>
              <div className="inline-block text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 mb-2">
                SM+2 Release v{selectedProduct.version}
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                {language === 'ar' ? selectedProduct.name : selectedProduct.nameEn}
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1 font-medium">
                {language === 'ar' ? selectedProduct.tagline : selectedProduct.taglineEn}
              </p>
            </div>

            {/* Gallery Carousal */}
            <div className="space-y-3">
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={selectedProduct.images[activeImageIndex] || selectedProduct.images[0]}
                  alt="Screenshot"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              {selectedProduct.images.length > 1 && (
                <div className="flex gap-2">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-16 w-24 rounded overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx ? 'border-amber-500' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {language === 'ar' ? 'الوصف الهندسي الشامل' : 'Technical Architecture & Overview'}
              </h4>
              <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {language === 'ar' ? selectedProduct.description : selectedProduct.descriptionEn}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {t.sales.features}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(language === 'ar' ? selectedProduct.features : selectedProduct.featuresEn).map((f, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-neutral-800 dark:text-neutral-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* System Requirements */}
            <div className="space-y-2 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-neutral-100">
                <Cpu className="w-4 h-4 text-amber-600" />
                <span>{t.sales.systemSpecs}</span>
              </div>
              <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                {selectedProduct.systemRequirements.map((req, i) => (
                  <li key={i}>• {req}</li>
                ))}
              </ul>
            </div>

            {/* Product Reviews & Rating Summary */}
            <div className="space-y-3 p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <span>{t.sales.userReviewsTitle}</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold ms-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{selectedProduct.rating.toFixed(1)}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setReviewsModalProduct(selectedProduct)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{t.sales.writeReview}</span>
                </button>
              </div>

              {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                <div className="space-y-2 pt-1">
                  {selectedProduct.reviews.slice(0, 2).map((rev) => (
                    <div
                      key={rev.id}
                      className="p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700/60 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100">{rev.author}</span>
                        <div className="flex items-center text-amber-500">
                          {[...Array(5)].map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-2.5 h-2.5 ${idx < rev.rating ? 'fill-current' : 'text-neutral-300 dark:text-neutral-700'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed line-clamp-2">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                  {selectedProduct.reviews.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setReviewsModalProduct(selectedProduct)}
                      className="text-xs text-amber-700 dark:text-amber-400 hover:underline font-medium"
                    >
                      {language === 'ar'
                        ? `عرض كافة المراجعات (${selectedProduct.reviews.length})`
                        : `View all ${selectedProduct.reviews.length} reviews`}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-xs text-neutral-500">{t.sales.noReviewsYet}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="text-start">
                <div className="text-xs text-neutral-400">{t.sales.pricing}</div>
                <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{selectedProduct.price}</div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium"
                >
                  {t.common.close}
                </button>
                <button
                  onClick={() => {
                    const prod = selectedProduct;
                    setSelectedProduct(null);
                    handleProductDownloadAction(prod);
                  }}
                  className="flex items-center justify-center gap-2 px-5 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.common.downloadNow}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Commercial License / Order Request Modal */}
      {purchaseModalProduct && (
        <div
          id="purchase-quote-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setPurchaseModalProduct(null)}
              className="absolute top-4 end-4 p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold font-serif uppercase">
                <CreditCard className="w-4 h-4" />
                <span>{language === 'ar' ? 'طلب ترخيص أو دعم مؤسسي' : 'Commercial License Request'}</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-neutral-900 dark:text-neutral-100">
                {language === 'ar' ? purchaseModalProduct.name : purchaseModalProduct.nameEn}
              </h3>
              <p className="text-xs text-neutral-500">
                {language === 'ar' ? 'احصل على مفتاح الترخيص الاحترافي مع دعم تقني مخصص وضمان SLA.' : 'Get a commercial key with dedicated support and SLA assurance.'}
              </p>
            </div>

            {purchaseSuccess ? (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-center space-y-2">
                <HeartHandshake className="w-8 h-8 mx-auto text-emerald-600" />
                <div className="font-bold text-sm">
                  {language === 'ar' ? 'تم استلام طلب الترخيص بنجاح!' : 'License request submitted successfully!'}
                </div>
                <div className="text-xs text-neutral-600 dark:text-neutral-400">
                  {language === 'ar' ? 'تم إرسال تفاصيل التفعيل ورابط التحميل المباشر إلى بريدك الإلكتروني.' : 'Activation credentials and direct download link sent to your email.'}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSimulatePurchase} className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {t.common.name}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={language === 'ar' ? 'الاسم الكامل أو اسم المؤسسة' : 'Full Name or Company'}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {t.common.email}
                  </label>
                  <input
                    type="email"
                    required
                    defaultValue="hoc.plus1976@gmail.com"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    {language === 'ar' ? 'نوع الترخيص المطلوب' : 'License Tier'}
                  </label>
                  <select className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-500">
                    <option value="pro">Pro Developer License (1 Seat)</option>
                    <option value="team">Team Engineering (5 Seats)</option>
                    <option value="enterprise">Enterprise Custom & Custom SLA</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold hover:bg-neutral-800 dark:hover:bg-white transition-colors"
                >
                  {language === 'ar' ? 'تأكيد وإصدار الترخيص الفوري' : 'Confirm & Issue Commercial License'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* External Download & Archive Password Gateway Modal */}
      {downloadModalProduct && (
        <div
          id="product-download-gateway-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 sm:p-7 shadow-2xl space-y-6">
            <button
              onClick={() => setDownloadModalProduct(null)}
              className="absolute top-4 end-4 p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400">
                  <Download className="w-4 h-4" />
                </span>
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                  {language === 'ar' ? 'بوابة التحميل المباشر المعتمدة' : 'Official Software Download Gateway'}
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {language === 'ar' ? downloadModalProduct.name : downloadModalProduct.nameEn}
              </h3>
              <p className="text-xs text-neutral-500 font-mono">
                Version {downloadModalProduct.version} • {downloadModalProduct.license}
              </p>
            </div>

            {/* Provider and Link Information */}
            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 font-medium">
                  {language === 'ar' ? 'مصدر استضافة الملف:' : 'Hosting Provider:'}
                </span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  {downloadModalProduct.downloadProvider === 'google_drive' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold border border-blue-500/20">
                      Google Drive Cloud
                    </span>
                  )}
                  {downloadModalProduct.downloadProvider === 'mega' && (
                    <span className="px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-700 dark:text-red-300 font-bold border border-red-500/20">
                      MEGA.nz Secure Storage
                    </span>
                  )}
                  {(!downloadModalProduct.downloadProvider || downloadModalProduct.downloadProvider === 'direct' || downloadModalProduct.downloadProvider === 'custom') && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20">
                      Direct High-Speed CDN
                    </span>
                  )}
                </span>
              </div>

              {downloadModalProduct.downloadUrl && (
                <div className="text-[11px] font-mono text-neutral-500 truncate pt-1 border-t border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-400 mr-1 font-semibold">{language === 'ar' ? 'الرابط المباشر:' : 'URL:'}</span>
                  <span className="select-all" title={downloadModalProduct.downloadUrl}>{downloadModalProduct.downloadUrl}</span>
                </div>
              )}
            </div>

            {/* Archive Decompression Password Feature */}
            {downloadModalProduct.archivePassword ? (
              <div className="p-4 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                    <Lock className="w-4 h-4 text-amber-600" />
                    <span>{language === 'ar' ? 'كلمة مرور فك ضغط الملف (Archive Password)' : 'Decompression Password'}</span>
                  </div>
                  {copiedPassword && (
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {language === 'ar' ? '✓ تم النسخ إلى الحافظة' : '✓ Copied to clipboard'}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  {language === 'ar'
                    ? 'هذا الأرشيف محمي برمز أمان رسمي. انسخ الباسورد بالضغط على زر النسخ لاستخدامه عند استخراج الملفات:'
                    : 'This file archive is protected. Copy the password to extract files after download:'}
                </p>

                <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-amber-500/30 flex items-center justify-between gap-3">
                  <span className="font-mono text-base font-black text-amber-900 dark:text-amber-200 tracking-wider select-all">
                    {downloadModalProduct.archivePassword}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyPassword(downloadModalProduct.archivePassword!)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    {copiedPassword ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPassword ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ الباسورد' : 'Copy Password')}</span>
                  </button>
                </div>
              </div>
            ) : null}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDownloadModalProduct(null)}
                className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium"
              >
                {t.common.close}
              </button>

              <button
                type="button"
                onClick={() => handleLaunchDownload(downloadModalProduct)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white text-xs font-semibold shadow-md transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>
                  {downloadModalProduct.downloadProvider === 'google_drive'
                    ? (language === 'ar' ? 'فتح وتحميل من Google Drive' : 'Download via Google Drive')
                    : downloadModalProduct.downloadProvider === 'mega'
                    ? (language === 'ar' ? 'فتح وتحميل من MEGA.nz' : 'Download via MEGA.nz')
                    : (language === 'ar' ? 'بدء التحميل الآن' : 'Start Download Now')}
                </span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Reviews Modal */}
      <ProductReviewsModal
        isOpen={!!reviewsModalProduct}
        onClose={() => setReviewsModalProduct(null)}
        product={reviewsModalProduct}
        language={language}
        onAddReview={handleReviewSubmission}
      />
    </div>
  );
};
