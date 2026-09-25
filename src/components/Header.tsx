import React, { useState, useEffect, useRef } from 'react';
import {
  Page,
  Language,
  Theme,
  AdminUser,
} from '../types';
import { translations } from '../i18n/translations';
import {
  Shield,
  Download,
  ShoppingBag,
  LifeBuoy,
  Lock,
  KeyRound,
  Sun,
  Moon,
  Globe,
  Github,
  Menu,
  X,
  ChevronDown,
  Home,
  Activity,
  Star,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  PhoneCall,
  Bell,
  BellRing,
} from 'lucide-react';
import { NotificationStatus } from '../lib/webNotifications';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  currentUser: AdminUser | null;
  onLogout: () => void;
  onOpenGithubModal: () => void;
  notificationStatus?: NotificationStatus;
  onToggleNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  setCurrentPage,
  language,
  setLanguage,
  theme,
  toggleTheme,
  currentUser,
  onLogout,
  onOpenGithubModal,
  notificationStatus,
  onToggleNotifications,
}) => {
  const [activeDropdown, setActiveDropdown] = useState<'software' | 'developer' | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSoftwareOpen, setMobileSoftwareOpen] = useState(true);
  const [mobileDevOpen, setMobileDevOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const t = translations[language];

  // Close dropdowns on click outside or Escape and manage body scroll on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setLangDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setLangDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const toggleDropdown = (menu: 'software' | 'developer') => {
    setLangDropdownOpen(false);
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const isSoftwareActive = currentPage === 'sales' || currentPage === 'downloads';
  const isDevActive = currentPage === 'developer';

  const languagesList: { code: Language; label: string; flag: string; dir: 'rtl' | 'ltr' }[] = [
    { code: 'ar', label: 'العربية (Arabic)', flag: '🇸🇦', dir: 'rtl' },
    { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
    { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
  ];

  const currentLangObj = languagesList.find((l) => l.code === language) || languagesList[0];

  return (
    <>
    <header
      ref={headerRef}
      id="main-header"
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-neutral-900/95 border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between h-13 sm:h-14">
          {/* Brand Logo & Monogram */}
          <div className="flex items-center gap-2.5">
            <button
              id="brand-logo-btn"
              onClick={() => {
                setCurrentPage('home');
                setActiveDropdown(null);
              }}
              className="flex items-center gap-2 sm:gap-2.5 group text-start focus:outline-none"
            >
              <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-amber-500/40 shadow-sm transition-transform duration-200 group-hover:scale-105 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 ring-1 ring-amber-500/30 shrink-0">
                <img
                  src="/logo.png"
                  alt="SM+2 Logo"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.getAttribute('data-tried-rel') !== 'true') {
                      target.setAttribute('data-tried-rel', 'true');
                      target.src = './logo.png';
                      return;
                    }
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      (target.nextElementSibling as HTMLElement).classList.remove('hidden');
                      (target.nextElementSibling as HTMLElement).classList.add('flex');
                    }
                  }}
                />
                <div className="hidden items-center justify-center w-full h-full font-serif font-black text-xs sm:text-sm text-amber-400 bg-neutral-900">
                  <span>SM</span>
                  <sup className="text-[9px] text-amber-500 font-sans ml-0.5">+2</sup>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900 z-10" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 via-amber-700 to-neutral-800 dark:from-white dark:via-amber-300 dark:to-neutral-200 bg-clip-text text-transparent leading-none">
                    SM+2
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[8px] font-mono font-semibold tracking-wider uppercase rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 leading-none">
                    v2.4
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium tracking-normal hidden md:block leading-none mt-0.5">
                  {t.siteSub}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation with Dropdown Menus */}
          <nav id="desktop-navigation" className="hidden lg:flex items-center gap-1">
            {/* Direct Home Link */}
            <button
              id="nav-link-home"
              onClick={() => {
                setCurrentPage('home');
                setActiveDropdown(null);
              }}
              className={`relative group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 ${
                currentPage === 'home'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm font-semibold'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80'
              }`}
            >
              <Home className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${currentPage === 'home' ? '' : 'group-hover:text-amber-600 dark:group-hover:text-amber-400'}`} />
              <span className="relative">
                {t.nav.home}
                {/* Subtle animated underline indicator on hover */}
                {currentPage !== 'home' && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-center rounded-full opacity-80" />
                )}
              </span>
            </button>

            {/* Dropdown 1: Software & Direct Downloads */}
            <div className="relative">
              <button
                id="nav-dropdown-software-btn"
                onClick={() => toggleDropdown('software')}
                className={`relative group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 ${
                  isSoftwareActive
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-amber-700 dark:text-amber-400 font-semibold border border-neutral-300/80 dark:border-neutral-700 shadow-xs'
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80'
                }`}
                aria-expanded={activeDropdown === 'software'}
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 transition-transform duration-200 group-hover:scale-110" />
                <span className="relative">
                  {t.nav.softwareMenu}
                  <span className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500 transition-transform duration-200 ease-out origin-center rounded-full ${
                    isSoftwareActive ? 'scale-x-100 opacity-90' : 'scale-x-0 group-hover:scale-x-100 opacity-80'
                  }`} />
                </span>
                <ChevronDown
                  className={`w-3 h-3 opacity-60 transition-transform duration-200 ${
                    activeDropdown === 'software' ? 'rotate-180 text-amber-600' : 'group-hover:translate-y-0.5 group-hover:text-amber-600'
                  }`}
                />
              </button>

              {/* Software Popover */}
              {activeDropdown === 'software' && (
                <div
                  id="dropdown-menu-software"
                  className="absolute start-0 mt-2 w-80 rounded-xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-2 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 mb-1">
                    {t.nav.softwareMenuDesc}
                  </div>

                  {/* Sales Showcase Link */}
                  <button
                    id="dropdown-item-sales"
                    onClick={() => {
                      setCurrentPage('sales');
                      setActiveDropdown(null);
                    }}
                    className={`group w-full flex items-start gap-3 p-2.5 rounded-lg text-start transition-all duration-150 ${
                      currentPage === 'sales'
                        ? 'bg-neutral-100 dark:bg-neutral-800/80 font-semibold'
                        : 'hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70 hover:translate-x-0.5 rtl:hover:-translate-x-0.5'
                    }`}
                  >
                    <div className="p-2 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110 group-hover:bg-amber-500/20">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                          {t.nav.sales}
                        </span>
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>4.9</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        {t.nav.salesDesc}
                      </p>
                    </div>
                  </button>

                  {/* Direct Downloads Link */}
                  <button
                    id="dropdown-item-downloads"
                    onClick={() => {
                      setCurrentPage('downloads');
                      setActiveDropdown(null);
                    }}
                    className={`group w-full flex items-start gap-3 p-2.5 rounded-lg text-start transition-all duration-150 mt-1 ${
                      currentPage === 'downloads'
                        ? 'bg-neutral-100 dark:bg-neutral-800/80 font-semibold'
                        : 'hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70 hover:translate-x-0.5 rtl:hover:-translate-x-0.5'
                    }`}
                  >
                    <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110 group-hover:bg-emerald-500/20">
                      <Download className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                          {t.nav.downloads}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                          v2.4.0
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        {t.nav.downloadsDesc}
                      </p>
                    </div>
                  </button>

                  {/* Hardware License Activation Link in Dropdown */}
                  <button
                    id="dropdown-item-licenses"
                    onClick={() => {
                      setCurrentPage('licenses');
                      setActiveDropdown(null);
                    }}
                    className={`group w-full flex items-start gap-3 p-2.5 rounded-lg text-start transition-all duration-150 mt-1 ${
                      currentPage === 'licenses'
                        ? 'bg-neutral-100 dark:bg-neutral-800/80 font-semibold'
                        : 'hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70 hover:translate-x-0.5 rtl:hover:-translate-x-0.5'
                    }`}
                  >
                    <div className="p-2 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110 group-hover:bg-amber-500/20">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                          {language === 'ar' ? 'تفعيل التراخيص وبصمة الجهاز' : 'Hardware License Activation'}
                        </span>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300">
                          HWID
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        {language === 'ar'
                          ? 'استخراج سيريالات الأجهزة المربوطة بالمعالج واللوحة الأم'
                          : 'Cryptographic hardware-bound key licensing portal'}
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Direct Top-Level Navbar Link: License Activation Portal */}
            <button
              id="nav-link-licenses-top"
              onClick={() => {
                setCurrentPage('licenses');
                setActiveDropdown(null);
              }}
              className={`relative group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 ${
                currentPage === 'licenses'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm font-semibold'
                  : 'text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80'
              }`}
            >
              <KeyRound className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${currentPage === 'licenses' ? '' : 'text-amber-600 dark:text-amber-400'}`} />
              <span className="relative">
                {language === 'ar' ? 'تفعيل التراخيص' : 'Licenses'}
                {currentPage !== 'licenses' && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-center rounded-full opacity-80" />
                )}
              </span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold">
                HWID
              </span>
            </button>

            {/* Dropdown 2: Developer & Support Services */}
            <div className="relative">
              <button
                id="nav-dropdown-dev-btn"
                onClick={() => toggleDropdown('developer')}
                className={`relative group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 ${
                  isDevActive
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-amber-700 dark:text-amber-400 font-semibold border border-neutral-300/80 dark:border-neutral-700 shadow-xs'
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80'
                }`}
                aria-expanded={activeDropdown === 'developer'}
              >
                <LifeBuoy className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 transition-transform duration-200 group-hover:scale-110" />
                <span className="relative">
                  {t.nav.devMenu}
                  <span className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500 transition-transform duration-200 ease-out origin-center rounded-full ${
                    isDevActive ? 'scale-x-100 opacity-90' : 'scale-x-0 group-hover:scale-x-100 opacity-80'
                  }`} />
                </span>
                <ChevronDown
                  className={`w-3 h-3 opacity-60 transition-transform duration-200 ${
                    activeDropdown === 'developer' ? 'rotate-180 text-amber-600' : 'group-hover:translate-y-0.5 group-hover:text-amber-600'
                  }`}
                />
              </button>

              {/* Developer Popover */}
              {activeDropdown === 'developer' && (
                <div
                  id="dropdown-menu-developer"
                  className="absolute start-0 mt-2 w-80 rounded-xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-2 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 mb-1">
                    {t.nav.devMenuDesc}
                  </div>

                  {/* Support Portal Link */}
                  <button
                    id="dropdown-item-developer"
                    onClick={() => {
                      setCurrentPage('developer');
                      setActiveDropdown(null);
                    }}
                    className={`group w-full flex items-start gap-3 p-2.5 rounded-lg text-start transition-all duration-150 ${
                      currentPage === 'developer'
                        ? 'bg-neutral-100 dark:bg-neutral-800/80 font-semibold'
                        : 'hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70 hover:translate-x-0.5 rtl:hover:-translate-x-0.5'
                    }`}
                  >
                    <div className="p-2 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110 group-hover:bg-amber-500/20">
                      <LifeBuoy className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                          {t.nav.developer}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Active</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        {t.nav.developerDesc}
                      </p>
                    </div>
                  </button>

                  {/* Automated Changelog Link */}
                  <button
                    id="dropdown-item-changelog"
                    onClick={() => {
                      setCurrentPage('downloads');
                      setActiveDropdown(null);
                    }}
                    className="group w-full flex items-start gap-3 p-2.5 rounded-lg text-start transition-all duration-150 mt-1 hover:bg-neutral-100/70 dark:hover:bg-neutral-800/70 hover:translate-x-0.5 rtl:hover:-translate-x-0.5"
                  >
                    <div className="p-2 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110 group-hover:bg-blue-500/20">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                          {t.nav.changelogMenu}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-800 dark:text-blue-300">
                          Auto-Log
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed">
                        {t.nav.changelogMenuDesc}
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Admin Console Link - Visible only when authenticated */}
            {currentUser && (
              <button
                id="nav-link-admin"
                onClick={() => {
                  setCurrentPage('admin');
                  setActiveDropdown(null);
                }}
                className={`relative group flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 ${
                  currentPage === 'admin'
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm font-semibold'
                    : 'text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80'
                }`}
              >
                <Lock className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110" />
                <span className="relative">
                  {t.nav.admin}
                  {currentPage !== 'admin' && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out origin-center rounded-full opacity-80" />
                  )}
                </span>
                <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold transition-transform duration-200 group-hover:scale-105">
                  {language === 'ar' ? 'مشرف' : 'Admin'}
                </span>
              </button>
            )}
          </nav>

          {/* Right Utility Controls: Language, Theme, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                id="language-switcher-btn"
                onClick={() => {
                  setActiveDropdown(null);
                  setLangDropdownOpen(!langDropdownOpen);
                }}
                className="group flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-2xs hover:shadow-xs"
                aria-expanded={langDropdownOpen}
              >
                <Globe className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400 transition-transform duration-200 group-hover:rotate-45" />
                <span className="transition-transform duration-200 group-hover:scale-110">{currentLangObj.flag}</span>
                <span className="hidden sm:inline font-sans text-[11px] font-semibold">{currentLangObj.code.toUpperCase()}</span>
                <ChevronDown
                  className={`w-3 h-3 opacity-60 transition-transform duration-200 ${
                    langDropdownOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'
                  }`}
                />
              </button>

              {langDropdownOpen && (
                <div
                  id="language-dropdown-menu"
                  className="absolute end-0 mt-2 w-48 rounded-xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800 py-1.5 z-50 text-xs animate-in fade-in duration-150"
                >
                  <div className="px-3 py-1.5 text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider border-b border-neutral-100 dark:border-neutral-800 mb-1">
                    {language === 'ar' ? 'اختر لغة المنصة' : 'Platform Language'}
                  </div>
                  {languagesList.map((lang) => (
                    <button
                      key={lang.code}
                      id={`lang-select-${lang.code}`}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-start transition-all duration-150 ${
                        language === lang.code
                          ? 'bg-amber-500/10 text-amber-900 dark:text-amber-300 font-semibold'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:ps-3.5'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {language === lang.code && <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark/Light Mode Universal Toggle */}
            <button
              type="button"
              id="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? t.nav.themeLight : t.nav.themeDark}
              aria-label={theme === 'dark' ? t.nav.themeLight : t.nav.themeDark}
              className="inline-flex items-center justify-center p-2 sm:p-1.5 min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 rounded-lg sm:rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-2xs hover:shadow-xs cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-amber-400 transition-transform duration-300 hover:rotate-90 hover:scale-110" />
              ) : (
                <Moon className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-neutral-700 dark:text-neutral-300 transition-transform duration-300 hover:-rotate-45 hover:scale-110" />
              )}
            </button>

            {/* Browser Web Notifications Toggle */}
            {onToggleNotifications && (
              <button
                type="button"
                id="web-notifications-btn"
                onClick={onToggleNotifications}
                title={
                  notificationStatus === 'granted'
                    ? language === 'ar'
                      ? 'إشعارات المتصفح مفعلة (انقر للاختبار والتأكيد)'
                      : 'Web notifications active (Click to test)'
                    : language === 'ar'
                    ? 'تفعيل إشعارات المتصفح للإصدارات الجديدة'
                    : 'Enable browser notifications for new releases'
                }
                aria-label="Toggle Web Notifications"
                className={`relative inline-flex items-center justify-center p-2 sm:p-1.5 min-w-[36px] min-h-[36px] sm:min-w-0 sm:min-h-0 rounded-lg sm:rounded-md border transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-2xs hover:shadow-xs cursor-pointer ${
                  notificationStatus === 'granted'
                    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/40 shadow-amber-500/10'
                    : 'border-neutral-300 dark:border-neutral-700 bg-white/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                {notificationStatus === 'granted' ? (
                  <BellRing className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                ) : (
                  <Bell className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                )}
                {notificationStatus === 'granted' && (
                  <span className="absolute -top-0.5 -end-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
                )}
              </button>
            )}

            {/* Supervisor Session Status Badge (If logged in) */}
            {currentUser && (
              <div className="hidden xl:flex items-center gap-2 pe-1 ps-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
                <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[10px] font-bold font-mono">
                  {currentUser.username.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-xs text-neutral-800 dark:text-neutral-200 font-medium">
                  {currentUser.role === 'super_admin'
                    ? language === 'ar'
                      ? 'مشرف رئيسي'
                      : 'Super Admin'
                    : currentUser.username}
                </div>
                <button
                  onClick={onLogout}
                  id="quick-logout-btn"
                  className="text-[11px] text-red-600 dark:text-red-400 hover:underline px-1 font-semibold"
                >
                  {t.admin.logout}
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              id="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>

      {/* Mobile Drawer Menu with Backdrop Overlay — rendered OUTSIDE header to avoid z-index stacking context trap */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[999] lg:hidden flex">
          {/* Backdrop Overlay */}
          <div
            id="mobile-drawer-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm transition-opacity duration-300"
          />

          {/* Slide-over Drawer Panel with Guaranteed Solid Opaque Background */}
          <div
            id="mobile-navigation-drawer"
            className="relative ms-auto w-full max-w-xs sm:max-w-sm h-full bg-white dark:bg-neutral-950 shadow-2xl border-s border-neutral-200 dark:border-neutral-800 flex flex-col justify-between overflow-y-auto z-10"
          >
            {/* Drawer Header with Title and Close Button */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-neutral-100 dark:bg-neutral-900">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center w-8 h-8 rounded-full overflow-hidden border border-amber-500/40 bg-neutral-900 ring-1 ring-amber-500/20 shrink-0">
                  <img
                    src="/logo.png"
                    alt="SM+2 Logo"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.getAttribute('data-tried-rel') !== 'true') {
                        target.setAttribute('data-tried-rel', 'true');
                        target.src = './logo.png';
                        return;
                      }
                      target.style.display = 'none';
                      if (target.nextElementSibling) {
                        (target.nextElementSibling as HTMLElement).classList.remove('hidden');
                        (target.nextElementSibling as HTMLElement).classList.add('flex');
                      }
                    }}
                  />
                  <div className="hidden items-center justify-center w-full h-full font-serif font-black text-xs text-amber-400 bg-neutral-900">
                    <span>SM</span>
                  </div>
                </div>
                <div>
                  <span className="font-serif text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    SM+2
                  </span>
                  <span className="ms-1.5 px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                    v2.4
                  </span>
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Navigation Links */}
            <div className="p-4 space-y-3.5 flex-1 overflow-y-auto">
              {/* Home Link */}
              <button
                id="mobile-nav-home"
                onClick={() => {
                  setCurrentPage('home');
                  setMobileMenuOpen(false);
                }}
                className={`w-full min-h-[48px] flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
                  currentPage === 'home'
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home className={`w-4 h-4 shrink-0 ${currentPage === 'home' ? 'text-white' : 'text-amber-600 dark:text-amber-400'}`} />
                  <span className="text-sm font-semibold">{t.nav.home}</span>
                </div>
                {currentPage === 'home' && <span className="w-2 h-2 rounded-full bg-white shrink-0" />}
              </button>

              {/* Direct Downloads Link - Prominently Visible on Mobile */}
              <button
                id="mobile-nav-downloads-direct"
                onClick={() => {
                  setCurrentPage('downloads');
                  setMobileMenuOpen(false);
                }}
                className={`w-full min-h-[48px] flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
                  currentPage === 'downloads'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Download className={`w-4 h-4 shrink-0 ${currentPage === 'downloads' ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}`} />
                  <span className="text-sm font-semibold">{t.nav.downloads}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                    currentPage === 'downloads' ? 'bg-white/20 text-white' : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                  }`}>
                    v2.4.0
                  </span>
                  {currentPage === 'downloads' && <span className="w-2 h-2 rounded-full bg-white shrink-0" />}
                </div>
              </button>

              {/* Direct License Activation Link - Prominently Visible on Mobile */}
              <button
                id="mobile-nav-licenses-direct"
                onClick={() => {
                  setCurrentPage('licenses');
                  setMobileMenuOpen(false);
                }}
                className={`w-full min-h-[48px] flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
                  currentPage === 'licenses'
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : 'text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <KeyRound className={`w-4 h-4 shrink-0 ${currentPage === 'licenses' ? 'text-white' : 'text-amber-600 dark:text-amber-400'}`} />
                  <span className="text-sm font-semibold">{language === 'ar' ? 'تفعيل التراخيص وبصمة الأجهزة' : 'License & HWID Activation'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                    currentPage === 'licenses' ? 'bg-white/20 text-white' : 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                  }`}>
                    HWID
                  </span>
                  {currentPage === 'licenses' && <span className="w-2 h-2 rounded-full bg-white shrink-0" />}
                </div>
              </button>

              {/* Software Group Accordion */}
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-50/50 dark:bg-neutral-800/20">
                <button
                  type="button"
                  onClick={() => setMobileSoftwareOpen(!mobileSoftwareOpen)}
                  className="w-full min-h-[48px] flex items-center justify-between px-4 py-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 transition-colors active:bg-neutral-100 dark:active:bg-neutral-800"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>{t.nav.softwareMenu}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      mobileSoftwareOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>

                {mobileSoftwareOpen && (
                  <div className="p-2.5 space-y-2 bg-white dark:bg-neutral-900 border-t border-neutral-200/60 dark:border-neutral-800">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage('sales');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] ${
                        currentPage === 'sales'
                          ? 'bg-amber-500/15 text-amber-900 dark:text-amber-300 font-bold border border-amber-500/30'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="font-semibold">{t.nav.sales}</span>
                      </div>
                      <span className="text-[11px] font-bold text-amber-600">★ 4.9</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage('downloads');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] ${
                        currentPage === 'downloads'
                          ? 'bg-amber-500/15 text-amber-900 dark:text-amber-300 font-bold border border-amber-500/30'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Download className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold">{t.nav.downloads}</span>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-600 font-bold">v2.4.0</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Developer Group Accordion */}
              <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-50/50 dark:bg-neutral-800/20">
                <button
                  type="button"
                  onClick={() => setMobileDevOpen(!mobileDevOpen)}
                  className="w-full min-h-[48px] flex items-center justify-between px-4 py-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 transition-colors active:bg-neutral-100 dark:active:bg-neutral-800"
                >
                  <div className="flex items-center gap-3">
                    <LifeBuoy className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>{t.nav.devMenu}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      mobileDevOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>

                {mobileDevOpen && (
                  <div className="p-2.5 space-y-2 bg-white dark:bg-neutral-900 border-t border-neutral-200/60 dark:border-neutral-800">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage('developer');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all active:scale-[0.98] ${
                        currentPage === 'developer'
                          ? 'bg-amber-500/15 text-amber-900 dark:text-amber-300 font-bold border border-amber-500/30'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <LifeBuoy className="w-4 h-4 text-amber-600 shrink-0" />
                        <span className="font-semibold">{t.nav.developer}</span>
                      </div>
                      <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Active</span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentPage('downloads');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-2.5">
                        <Activity className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-semibold">{t.nav.changelogMenu}</span>
                      </div>
                      <span className="text-[11px] text-blue-600 font-mono font-bold">Auto-Log</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Admin Console Link - Authenticated only */}
              {currentUser && (
                <button
                  type="button"
                  id="mobile-nav-admin"
                  onClick={() => {
                    setCurrentPage('admin');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full min-h-[48px] flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
                    currentPage === 'admin'
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="font-semibold">{t.nav.admin}</span>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-900 dark:text-amber-300 font-bold">
                    {language === 'ar' ? 'مشرف' : 'Admin'}
                  </span>
                </button>
              )}
            </div>

            {/* Mobile Drawer Footer: Language, Theme & Supervisor Status */}
            <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-4">
              {/* Quick Language Toggle in Drawer */}
              <div>
                <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-2">
                  {language === 'ar' ? 'اللغة الحالية' : 'Language'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {languagesList.map((lang) => (
                    <button
                      type="button"
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`min-h-[44px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
                        language === lang.code
                          ? 'border-amber-500 bg-amber-500/15 text-amber-900 dark:text-amber-300 font-bold shadow-xs'
                          : 'border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 bg-white dark:bg-neutral-900'
                      }`}
                    >
                      <span className="text-sm">{lang.flag}</span>
                      <span>{lang.code.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Theme Switch */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  {theme === 'dark' ? (language === 'ar' ? 'الوضع الداكن' : 'Dark Mode') : (language === 'ar' ? 'الوضع النهاري' : 'Light Mode')}
                </span>
                <button
                  type="button"
                  id="mobile-drawer-theme-toggle"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTheme();
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 min-h-[40px] rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 active:scale-95 transition-all shadow-xs"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{language === 'ar' ? 'نهاري' : 'Light'}</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0" />
                      <span>{language === 'ar' ? 'ليلي' : 'Dark'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Supervisor active session in mobile */}
              {currentUser && (
                <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <span className="text-neutral-500 dark:text-neutral-400 truncate max-w-[170px]">
                    <strong className="text-neutral-800 dark:text-neutral-200">{currentUser.fullName}</strong>
                  </span>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-red-600 dark:text-red-400 font-semibold text-xs hover:underline"
                  >
                    {t.admin.logout}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
