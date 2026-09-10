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
} from 'lucide-react';

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
}) => {
  const [activeDropdown, setActiveDropdown] = useState<'software' | 'developer' | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSoftwareOpen, setMobileSoftwareOpen] = useState(true);
  const [mobileDevOpen, setMobileDevOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const t = translations[language];

  // Close dropdowns on click outside or Escape
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
    <header
      ref={headerRef}
      id="main-header"
      className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-neutral-900/95 border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Monogram */}
          <div className="flex items-center gap-4">
            <button
              id="brand-logo-btn"
              onClick={() => {
                setCurrentPage('home');
                setActiveDropdown(null);
              }}
              className="flex items-center gap-3.5 group text-start focus:outline-none"
            >
              <div className="relative flex items-center justify-center w-11 h-11 rounded-lg bg-neutral-900 text-amber-400 dark:bg-neutral-100 dark:text-neutral-900 border border-amber-500/30 shadow-sm transition-transform duration-200 group-hover:scale-105">
                <span className="font-serif text-xl font-black tracking-tight leading-none">
                  SM<sup className="text-xs text-amber-500 dark:text-amber-600 font-sans ml-0.5">+2</sup>
                </span>
                <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                    SM+2
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold tracking-wider uppercase rounded bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                    v2.4
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium tracking-normal hidden md:block">
                  {t.siteSub}
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation with Dropdown Menus */}
          <nav id="desktop-navigation" className="hidden lg:flex items-center gap-1.5">
            {/* Direct Home Link */}
            <button
              id="nav-link-home"
              onClick={() => {
                setCurrentPage('home');
                setActiveDropdown(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                currentPage === 'home'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t.nav.home}</span>
            </button>

            {/* Dropdown 1: Software & Direct Downloads */}
            <div className="relative">
              <button
                id="nav-dropdown-software-btn"
                onClick={() => toggleDropdown('software')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isSoftwareActive
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold border border-neutral-300 dark:border-neutral-700'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
                aria-expanded={activeDropdown === 'software'}
              >
                <ShoppingBag className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{t.nav.softwareMenu}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                    activeDropdown === 'software' ? 'rotate-180 text-amber-600' : ''
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
                    className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-start transition-colors ${
                      currentPage === 'sales'
                        ? 'bg-neutral-100 dark:bg-neutral-800/80 font-semibold'
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className="p-2 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
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
                    className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-start transition-colors mt-1 ${
                      currentPage === 'downloads'
                        ? 'bg-neutral-100 dark:bg-neutral-800/80 font-semibold'
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5">
                      <Download className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
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
                </div>
              )}
            </div>

            {/* Dropdown 2: Developer & Support Services */}
            <div className="relative">
              <button
                id="nav-dropdown-dev-btn"
                onClick={() => toggleDropdown('developer')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isDevActive
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold border border-neutral-300 dark:border-neutral-700'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
                aria-expanded={activeDropdown === 'developer'}
              >
                <LifeBuoy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{t.nav.devMenu}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
                    activeDropdown === 'developer' ? 'rotate-180 text-amber-600' : ''
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
                    className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-start transition-colors ${
                      currentPage === 'developer'
                        ? 'bg-neutral-100 dark:bg-neutral-800/80 font-semibold'
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className="p-2 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5">
                      <LifeBuoy className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
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
                    className="w-full flex items-start gap-3 p-2.5 rounded-lg text-start transition-colors mt-1 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  >
                    <div className="p-2 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
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

            {/* Admin Console Direct Link - ONLY visible when admin is authenticated */}
            {currentUser && (
              <button
                id="nav-link-admin"
                onClick={() => {
                  setCurrentPage('admin');
                  setActiveDropdown(null);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  currentPage === 'admin'
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm font-semibold'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>{t.nav.admin}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold">
                  {language === 'ar' ? 'مشرف' : 'Admin'}
                </span>
              </button>
            )}
          </nav>

          {/* Right Utility Controls: Language, Theme, Profile (GitHub removed for visitors) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                id="language-switcher-btn"
                onClick={() => {
                  setActiveDropdown(null);
                  setLangDropdownOpen(!langDropdownOpen);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-expanded={langDropdownOpen}
              >
                <Globe className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-400" />
                <span>{currentLangObj.flag}</span>
                <span className="hidden sm:inline font-sans">{currentLangObj.code.toUpperCase()}</span>
                <ChevronDown
                  className={`w-3 h-3 opacity-60 transition-transform duration-200 ${
                    langDropdownOpen ? 'rotate-180' : ''
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
                      className={`w-full flex items-center justify-between px-3 py-2 text-start transition-colors ${
                        language === lang.code
                          ? 'bg-amber-500/10 text-amber-900 dark:text-amber-300 font-semibold'
                          : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
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

            {/* Dark/Light Mode Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t.nav.themeLight : t.nav.themeDark}
              className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-neutral-700 transition-transform duration-200 hover:-rotate-12" />
              )}
            </button>

            {/* Supervisor Session Status Badge (If logged in) */}
            {currentUser && (
              <div className="hidden xl:flex items-center gap-2 pe-1 ps-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
                <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs font-bold font-mono">
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
              className="lg:hidden p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu Organized with Compact Sections */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 pt-3 pb-6 shadow-2xl animate-in slide-in-from-top-3 duration-200"
        >
          <div className="flex flex-col gap-2">
            {/* Home Link */}
            <button
              id="mobile-nav-home"
              onClick={() => {
                setCurrentPage('home');
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'home'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t.nav.home}</span>
            </button>

            {/* Software Group Accordion */}
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <button
                onClick={() => setMobileSoftwareOpen(!mobileSoftwareOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800/40 text-sm font-semibold text-neutral-800 dark:text-neutral-200"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  <span>{t.nav.softwareMenu}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mobileSoftwareOpen ? 'rotate-180 text-amber-600' : ''
                  }`}
                />
              </button>

              {mobileSoftwareOpen && (
                <div className="p-2 space-y-1 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    onClick={() => {
                      setCurrentPage('sales');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium ${
                      currentPage === 'sales'
                        ? 'bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span>{t.nav.sales}</span>
                    <span className="text-[10px] font-bold text-amber-600">★ 4.9</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPage('downloads');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium ${
                      currentPage === 'downloads'
                        ? 'bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span>{t.nav.downloads}</span>
                    <span className="text-[10px] font-mono text-emerald-600">v2.4.0</span>
                  </button>
                </div>
              )}
            </div>

            {/* Developer Group Accordion */}
            <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
              <button
                onClick={() => setMobileDevOpen(!mobileDevOpen)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-neutral-50 dark:bg-neutral-800/40 text-sm font-semibold text-neutral-800 dark:text-neutral-200"
              >
                <div className="flex items-center gap-2">
                  <LifeBuoy className="w-4 h-4 text-amber-600" />
                  <span>{t.nav.devMenu}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    mobileDevOpen ? 'rotate-180 text-amber-600' : ''
                  }`}
                />
              </button>

              {mobileDevOpen && (
                <div className="p-2 space-y-1 bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    onClick={() => {
                      setCurrentPage('developer');
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium ${
                      currentPage === 'developer'
                        ? 'bg-amber-500/10 text-amber-900 dark:text-amber-300 font-bold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <span>{t.nav.developer}</span>
                    <span className="text-[10px] text-emerald-600">Active</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentPage('downloads');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  >
                    <span>{t.nav.changelogMenu}</span>
                    <span className="text-[10px] text-blue-600 font-mono">v2.4.0</span>
                  </button>
                </div>
              )}
            </div>

            {/* Admin Console Link - ONLY when authenticated */}
            {currentUser && (
              <button
                id="mobile-nav-admin"
                onClick={() => {
                  setCurrentPage('admin');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === 'admin'
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4" />
                  <span>{t.nav.admin}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-300 font-bold">
                  {language === 'ar' ? 'مشرف' : 'Admin'}
                </span>
              </button>
            )}
          </div>

          {/* Supervisor active session in mobile */}
          {currentUser && (
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-500 dark:text-neutral-400">
                {language === 'ar' ? 'جلسة المشرف:' : 'Logged in as:'}{' '}
                <strong className="text-neutral-800 dark:text-neutral-200">{currentUser.fullName}</strong>
              </span>
              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-red-600 dark:text-red-400 font-semibold text-xs"
              >
                {t.admin.logout}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
