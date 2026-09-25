import {
  Product,
  DocSection,
  DownloadFile,
  ChangelogEntry,
  AdminUser,
  EmailSubscriber,
  NotificationLog,
  SupportTicket,
  GitHubSettings,
  LicenseRequest,
} from '../types';

export const initialProducts: Product[] = [
  {
    id: 'sm2-core-engine',
    name: 'محرك واستوديو SM+2 الأساسي',
    nameEn: 'SM+2 Core Engine & Studio',
    tagline: 'بيئة العمل الشاملة لإدارة البرمجيات والمزامنة عالية السرعة',
    taglineEn: 'Comprehensive engineering runtime and high-velocity sync environment',
    description: 'المنصة الرئيسية للتحكم في المشاريع، فحص الأداء، وتحليل الملفات الثنائية مع واجهة مستخدم فنية كلاسيكية تمتاز بالخفة والسرعة الخارقة واستهلاك أدنى للموارد.',
    descriptionEn: 'The flagship workbench for project orchestration, runtime introspection, and binary release staging wrapped in an artistic classical interface with near-zero latency.',
    category: 'core',
    version: '2.4.0',
    price: 'مجاني للاستخدام الشخصي / $49 للترخيص المهني',
    license: 'MIT & Commercial Pro Dual-License',
    rating: 4.9,
    downloadsCount: 124500,
    images: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    ],
    features: [
      'معمارية كلاسيكية فائقة السرعة مبنية بلغة مجمعة عالية الأداء',
      'تكامل أصيل ومباشر مع مستودعات GitHub API لإدارة الإصدارات',
      'محرك تشفير محلي بضمانات أمان متطورة وخوارزمية SHA-256',
      'واجهة متعددة اللغات تدعم العربية (RTL) بشكل أصيل وكامل',
      'نظام إشعارات ذكي فوري للمشتركين عبر البريد الإلكتروني',
      'دعم كامل للعمل دون اتصال بالإنترنت (Offline-First Ready)',
    ],
    featuresEn: [
      'Classic high-performance native compiled architecture',
      'Native direct GitHub API integration for release staging',
      'Local cryptographic security engine with SHA-256 validation',
      'Multilingual interface with native Arabic RTL support',
      'Instant subscriber automated email notification dispatch',
      'Resilient Offline-First operation mode',
    ],
    systemRequirements: [
      'نظام تشغيل: Windows 10/11 (x64) أو macOS 12+ أو Linux Ubuntu 20.04+',
      'المعالج: Dual-core 1.8GHz أو أعلى (Intel, AMD, Apple M-Series)',
      'الذاكرة العشوائية: 2GB كحد أدنى (يوصى بـ 4GB)',
      'مساحة التخزين: 250MB مساحة حرة',
    ],
    downloadProvider: 'google_drive',
    downloadUrl: 'https://drive.google.com/file/d/1SM2_Core_Engine_Release_v2.4.0/view?usp=sharing',
    archivePassword: 'SM2@Engine2026',
    demoUrl: 'https://github.com',
    isFeatured: true,
    reviews: [
      {
        id: 'rev-1',
        productId: 'sm2-core-engine',
        author: 'م. سامي الجابري (Sami Al-Jabri)',
        rating: 5,
        comment: 'أداة خارقة السرعة! معمارية نظيفة جداً وخالية من التعقيدات الزائدة. تكامل GitHub API يوفر ساعات من العمل اليدوي أثناء نشر الإصدارات.',
        date: '2026-09-02',
        verifiedBuyer: true,
      },
      {
        id: 'rev-2',
        productId: 'sm2-core-engine',
        author: 'Sarah Jenkins',
        rating: 5,
        comment: 'The classic artistic UI combined with near-zero latency execution is refreshing. Binary inspection and SHA-256 validation worked flawlessly.',
        date: '2026-08-28',
        verifiedBuyer: true,
      },
      {
        id: 'rev-3',
        productId: 'sm2-core-engine',
        author: 'د. طارق المنصور',
        rating: 4,
        comment: 'الاستقرار ممتاز والتوثيق المرفق واضح ودقيق. نأمل في إضافة المزيد من الإضافات الجاهزة في التحديث القادم.',
        date: '2026-08-20',
        verifiedBuyer: true,
      }
    ],
  },
  {
    id: 'sm2-sync-shield',
    name: 'أداة SM+2 Shield للأمان والمزامنة',
    nameEn: 'SM+2 Sync & Security Shield',
    tagline: 'حماية وتشفير الملفات الثنائية ومزامنة سحابية خاصة',
    taglineEn: 'Binary asset protection, integrity signing, and private cloud sync',
    description: 'أداة برمجية ملحقة تضمن توقيع البرمجيات رقمياً، فحص التغييرات غير المصرح بها، وبناء حزم التثبيت المشفرة قبل رفعها إلى GitHub Releases.',
    descriptionEn: 'An accompanying tool for code-signing, binary integrity monitoring, and cryptographic packager for pre-flight GitHub release distribution.',
    category: 'security',
    version: '1.9.2',
    price: 'مجاني ومفتوح المصدر',
    license: 'Apache 2.0',
    rating: 4.8,
    downloadsCount: 42100,
    images: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    ],
    features: [
      'حساب بصمات الهاش الرقمي SHA-256 و MD5 بلمح البصر',
      'التحقق من صحة التوقيع الرقمي للملفات قبل التثبيت',
      'تشفير الحزم المتوافقة مع أجهزة الخوادم وسطح المكتب',
      'سجل تدقيق آلي لجميع عمليات الرفع والتحميل',
    ],
    featuresEn: [
      'Instant SHA-256 and MD5 cryptographic checksum generation',
      'Pre-install binary signature authenticity verification',
      'Cross-platform archive encryption engine',
      'Automated security audit logging for release uploads',
    ],
    systemRequirements: [
      'متوافق مع أنظمة Windows, macOS, Linux',
      'لا يتطلب صلاحيات مدير النظام للتشغيل المحمول (Portable)',
    ],
    downloadProvider: 'mega',
    downloadUrl: 'https://mega.nz/file/sm2_shield_security_bundle_v1.9.2#key-2026',
    archivePassword: 'Shield#Mega99',
    demoUrl: 'https://github.com',
    isFeatured: true,
    reviews: [
      {
        id: 'rev-4',
        productId: 'sm2-sync-shield',
        author: 'خالد العتيبي',
        rating: 5,
        comment: 'حساب تجزئة الهاش SHA-256 لحظي ودقيق جداً. أصبحت أعتمد عليها كخطوة إلزامية قبل نشر أي ملف ثنائي.',
        date: '2026-09-04',
        verifiedBuyer: true,
      },
      {
        id: 'rev-5',
        productId: 'sm2-sync-shield',
        author: 'Alexandre Roy',
        rating: 5,
        comment: 'Essential security tool for release packaging. Lightweight and runs without administrative elevation.',
        date: '2026-08-30',
        verifiedBuyer: true,
      }
    ],
  },
  {
    id: 'sm2-cli-pro',
    name: 'واجهة سطر الأوامر SM+2 CLI Pro',
    nameEn: 'SM+2 CLI Pro Tool',
    tagline: 'أداة سطر أوامر خفيفة للمطورين وأتمتة خطوط CI/CD',
    taglineEn: 'Lightweight developer CLI for automated pipelines and release workflows',
    description: 'أداة تيرمينال سريعة جداً تمكّنك من رفع الإصدارات، استدعاء GitHub API، واستخراج سجل التغييرات بشكل آلي بنقرة زر أو عبر نصوص Bash/PowerShell البرمجية.',
    descriptionEn: 'High-speed terminal client designed for release automation, GitHub API dispatch, and automated changelog synthesis inside CI/CD workflows.',
    category: 'tools',
    version: '2.1.0',
    price: 'مجاني للجميع',
    license: 'MIT',
    rating: 4.95,
    downloadsCount: 56800,
    images: [
      'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1200&q=80',
    ],
    features: [
      'حجم تنفيذي مستقل يقل عن 12 ميغابايت دون أي مكتبات خارجية',
      'أوامر أتمتة لرفع الإصدارات إلى GitHub بنقرة واحدة: `sm2 release create`',
      'توليد تلقائي لسجلات التغييرات بتنسيق Markdown احترافي',
      'إرسال إشعارات البريد الإلكتروني آلياً إلى قائمة المشتركين',
    ],
    featuresEn: [
      'Single standalone binary under 12MB with zero dependencies',
      'Single-command GitHub release publication: `sm2 release create`',
      'Automated markdown changelog compiler',
      'Webhook & automated email subscriber trigger integration',
    ],
    systemRequirements: [
      'يعمل على أي طرفية (Terminal / PowerShell / Bash / Zsh)',
    ],
    downloadUrl: '#download-sm2-cli',
    demoUrl: 'https://github.com',
    reviews: [
      {
        id: 'rev-6',
        productId: 'sm2-cli-pro',
        author: 'عمر القحطاني',
        rating: 5,
        comment: 'أداة CLI ممتازة وخفيفة، دمجتها في GitHub Actions واختصرت خط النشر التلقائي بنسبة 80%.',
        date: '2026-09-06',
        verifiedBuyer: true,
      }
    ],
  },
];

export const initialDocs: DocSection[] = [
  {
    id: 'doc-intro',
    slug: 'getting-started',
    title: 'دليل البدء السريع والتهيئة',
    titleEn: 'Getting Started & Initialization',
    category: 'الأساسيات',
    categoryEn: 'Basics',
    description: 'كيفية تثبيت وتشغيل برمجيات SM+2 لأول مرة وضبط الإعدادات الرئيسية.',
    descriptionEn: 'How to install, configure and run SM+2 software suite for the first time.',
    order: 1,
    content: `مرحباً بك في المنصة الهندسية الرسمية لـ **SM+2**. تم تصميم برمجياتنا لتكون فورية التشغيل وبسيطة الاستخدام مع قوة تقنية عالية.

### 1. التثبيت السريع
يمكنك تحميل الحزمة المتوافقة مع نظامك مباشرة من صفحة التحميل، أو استخدام أمر التثبيت السريع عبر الطرفية:

\`\`\`bash
# تثبيت عبر طرفية Linux / macOS
curl -fsSL https://releases.sm2.dev/install.sh | bash

# تثبيت أداة سطر الأوامر عبر Windows PowerShell
iwr -useb https://releases.sm2.dev/install.ps1 | iex
\`\`\`

### 2. التحقق من التثبيت
بمجرد اكتمال التثبيت، اكتب الأمر التالي في سطر الأوامر للتحقق من سلامة البيئة ورقم الإصدار:

\`\`\`bash
sm2 --version
# الناتج المتوقع: SM+2 Core Engine v2.4.0 (x86_64-release)
\`\`\`

### 3. التهيئة الأولى
قم بتشغيل معالج التهيئة الكلاسيكي لضبط تفضيلات اللغة، مسار التخزين، وربط مستودع GitHub:
\`\`\`bash
sm2 init
\`\`\``,
    contentEn: `Welcome to the official **SM+2** engineering platform. Our software is designed for immediate execution, artistic minimalism, and exceptional performance.

### 1. Quick Installation
Download your target binary directly from the Downloads page, or run our automated setup command:

\`\`\`bash
# Linux / macOS setup script
curl -fsSL https://releases.sm2.dev/install.sh | bash

# Windows PowerShell setup command
iwr -useb https://releases.sm2.dev/install.ps1 | iex
\`\`\`

### 2. Verification
Check the installed release runtime:
\`\`\`bash
sm2 --version
# Output: SM+2 Core Engine v2.4.0 (x86_64-release)
\`\`\`

### 3. Initialization
Run the setup wizard to set language preferences and link your GitHub repository:
\`\`\`bash
sm2 init
\`\`\``,
    codeSnippet: {
      language: 'bash',
      code: 'curl -fsSL https://releases.sm2.dev/install.sh | bash\nsm2 --version\nsm2 init',
    },
    lastUpdated: '2026-08-25',
  },
  {
    id: 'doc-github-api',
    slug: 'github-api-integration',
    title: 'تكامل GitHub API ورفع الإصدارات',
    titleEn: 'GitHub API Integration & Releases',
    category: 'التكامل والأتمتة',
    categoryEn: 'Integrations',
    description: 'ربط المنصة بحساب ومستودع GitHub لرفع الملفات، إنشاء Releases وإدارة الأصول تلقائياً.',
    descriptionEn: 'Connect SM+2 with your GitHub repository to upload files, generate releases, and automate changelogs.',
    order: 2,
    content: `يوفر نظام **SM+2** تكاملاً مباشراً مع واجهات **GitHub REST & GraphQL API**، مما يسمح بنشر الإصدارات الجديدة فور إعدادها ورفع أصول الملفات دون الحاجة للدخول اليدوي إلى المتصفح.

### إعداد مفتاح الوصول (Personal Access Token)
1. انتقل إلى حسابك في GitHub -> Settings -> Developer Settings -> Personal Access Tokens.
2. أنشئ رمزا جديداً بالصلاحيات التالية:
   - \`repo\` (صلاحية كاملة للمستودعات)
   - \`write:packages\` (لرفع الحزم إن لزم)
3. الصق المفتاح في تبويب **تكامل GitHub API** داخل لوحة تحكم SM+2 أو احفظه في متغير البيئة \`GITHUB_TOKEN\`.

### مثال لرفع إصدار تلقائي عبر الكود:

\`\`\`typescript
import { publishToGitHub } from '@sm2/github-client';

const release = await publishToGitHub({
  owner: 'your-username',
  repo: 'SM-2-releases',
  tag: 'v2.4.0',
  title: 'SM+2 Core Engine v2.4.0 Classical Release',
  body: 'سجل التغييرات التلقائي تم إنشاؤه بنجاح',
  draft: false,
  prerelease: false,
  files: ['./dist/SM2_Studio_Setup_x64.msi', './dist/SM2_macOS_Silicon.dmg']
});

console.log('GitHub Release URL:', release.html_url);
\`\`\`

### التحقق من حالة المزامنة
يمكنك مراجعة جميع الإصدارات المنشورة مباشرة من داخل لوحة التحكم مع روابط التحميل السريعة.`,
    contentEn: `The **SM+2** platform provides direct integration with **GitHub REST & GraphQL APIs**, enabling automated binary deployment and instant asset synchronization.

### Setting up your Personal Access Token (PAT)
1. Go to GitHub Settings -> Developer Settings -> Personal Access Tokens.
2. Grant the \`repo\` scope.
3. Add the token to the GitHub Integration tab inside SM+2 Admin or set \`GITHUB_TOKEN\` environment variable.

### Automated Release Code Sample:

\`\`\`typescript
import { publishToGitHub } from '@sm2/github-client';

const release = await publishToGitHub({
  owner: 'your-username',
  repo: 'SM-2-releases',
  tag: 'v2.4.0',
  title: 'SM+2 Core Engine v2.4.0 Classical Release',
  body: 'Automated changelog generated seamlessly',
  draft: false,
  prerelease: false,
  files: ['./dist/SM2_Studio_Setup_x64.msi', './dist/SM2_macOS_Silicon.dmg']
});

console.log('GitHub Release URL:', release.html_url);
\`\`\``,
    codeSnippet: {
      language: 'typescript',
      code: `import { publishToGitHub } from '@sm2/github-client';\n\nawait publishToGitHub({\n  owner: 'user',\n  repo: 'SM-2',\n  tag: 'v2.4.0',\n  files: ['./build/SM2_Setup.exe']\n});`,
    },
    lastUpdated: '2026-08-30',
  },
  {
    id: 'doc-email-notifications',
    slug: 'email-notifications-system',
    title: 'نظام الإشعارات الفورية عبر البريد',
    titleEn: 'Instant Email Notification System',
    category: 'إدارة المستخدمين والتواصل',
    categoryEn: 'Communications',
    description: 'آلية إرسال تنبيهات بريدية مباشرة وتلقائية لقائمة المشتركين عند صدور تحديث جديد للملفات.',
    descriptionEn: 'How automated notifications notify subscribers the instant new release assets are staged.',
    order: 3,
    content: `عند اعتماد ونشر أي إصدار جديد داخل SM+2، يقوم المحرك باستدعاء نظام الإشعارات الفورية لإرسال بريد إلكتروني أنيق بتصميم كلاسيكي إلى كافة المطورين والمشتركين النشطين.

### المتغيرات المدعومة في قوالب البريد:
- \`{{version}}\`: رقم الإصدار الجديد (مثل v2.4.0)
- \`{{product_name}}\`: اسم البرنامج أو الحزمة
- \`{{download_url}}\`: الرابط المباشر للتنزيل
- \`{{changelog}}\`: قائمة التعديلات والميزات الجديدة تلقائياً
- \`{{sha256}}\`: بصمة الأمان الرقمية

### تجربة الإرسال
يمكن للمشرفين تجربة إرسال بريد اختباري من خلال تبويب **إشعارات البريد التلقائية** في لوحة التحكم الإدارية.`,
    contentEn: `Whenever an authorized release is finalized, SM+2's notification subsystem dispatches a classic, responsive email alert to all subscribed developers.

### Supported Template Tokens:
- \`{{version}}\`: Version tag (e.g. v2.4.0)
- \`{{product_name}}\`: Name of software
- \`{{download_url}}\`: Direct binary mirror URL
- \`{{changelog}}\`: Synthesized bulleted release notes
- \`{{sha256}}\`: Cryptographic security checksum`,
    codeSnippet: {
      language: 'json',
      code: `{\n  "event": "release.published",\n  "version": "v2.4.0",\n  "subscribers_notified": 1420,\n  "delivery_status": "dispatched"\n}`,
    },
    lastUpdated: '2026-09-01',
  },
  {
    id: 'doc-security',
    slug: 'security-and-checksums',
    title: 'الأمان، الصلاحيات وبصمات SHA-256',
    titleEn: 'Security, Permissions & Cryptographic Signatures',
    category: 'الأمان والامتثال',
    categoryEn: 'Security',
    description: 'دليل التحقق من أمان الملفات، إدارة الصلاحيات ومصفوفة أدوار المشرفين.',
    descriptionEn: 'Verifying cryptographic binary integrity and supervisor permission policies.',
    order: 4,
    content: `تعتمد فلسفة **SM+2** على مبدأ التحقق الصفري للأصول البرمجية، حيث يتم إصدار بصمة SHA-256 فريدة لكل ملف.

### كيفية التحقق من بصمة الملف يدوياً:
\`\`\`bash
# على أنظمة Linux و macOS
shasum -a 256 SM2_Studio_Setup_x64.msi

# على أنظمة Windows عبر PowerShell
Get-FileHash .\\SM2_Studio_Setup_x64.msi -Algorithm SHA256
\`\`\`

قارن الناتج المعروض بالبصمة المعلنة في صفحة التحميل المباشر لضمان عدم تعرض الملف لأي تعديل أثناء النقل.`,
    contentEn: `SM+2 employs zero-trust cryptographic verification for all released artifacts. Every binary comes with a tamper-proof SHA-256 hash.

### Verification Commands:
\`\`\`bash
# Linux / macOS
shasum -a 256 SM2_Studio_Setup_x64.msi

# Windows PowerShell
Get-FileHash .\\SM2_Studio_Setup_x64.msi -Algorithm SHA256
\`\`\``,
    codeSnippet: {
      language: 'bash',
      code: 'Get-FileHash .\\SM2_Setup_v2.4.0.msi -Algorithm SHA256',
    },
    lastUpdated: '2026-09-02',
  },
];

export const initialDownloads: DownloadFile[] = [
  {
    id: 'dl-win-x64-installer',
    title: 'حزمة تثبيت Windows (x64 Installer)',
    titleEn: 'Windows x64 Installer (.msi)',
    version: '2.4.0',
    releaseDate: '2026-09-05',
    platform: 'windows',
    architecture: 'x64 (Intel / AMD)',
    fileName: 'SM2_Studio_Setup_v2.4.0_x64.msi',
    fileSize: '68.4 MB',
    directUrl: 'https://github.com/releases/download/v2.4.0/SM2_Studio_Setup_v2.4.0_x64.msi',
    sha256: '8f9e2b1a4c3d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
    isLatest: true,
    minOsVersion: 'Windows 10 Build 19041+',
    releaseNotes: 'إصدار مستقر يتضمن المحرك المحدث، دعم التزامن الفوري، وتحديث واجهة المستخدم الكلاسيكية.',
    releaseNotesEn: 'Stable release featuring updated engine core, real-time sync, and classic theme refinements.',
  },
  {
    id: 'dl-win-portable',
    title: 'نسخة Windows المحمولة (Portable ZIP)',
    titleEn: 'Windows Portable Archive (.zip)',
    version: '2.4.0',
    releaseDate: '2026-09-05',
    platform: 'windows',
    architecture: 'x64 / ARM64',
    fileName: 'SM2_Portable_v2.4.0.zip',
    fileSize: '54.2 MB',
    downloadProvider: 'google_drive',
    directUrl: 'https://drive.google.com/file/d/1SM2_Portable_Archive_x64/view?usp=sharing',
    archivePassword: 'SM2#Portable2026',
    sha256: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
    isLatest: true,
    minOsVersion: 'Windows 10 / 11',
    releaseNotes: 'تشغيل فوري دون الحاجة إلى تثبيت إداري أو تعديل سجلات النظام.',
    releaseNotesEn: 'Instant execution without administrative privileges or registry writes.',
  },
  {
    id: 'dl-mac-silicon',
    title: 'نسخة macOS لمعالجات Apple Silicon (M1/M2/M3/M4)',
    titleEn: 'macOS Apple Silicon (.dmg)',
    version: '2.4.0',
    releaseDate: '2026-09-05',
    platform: 'macos',
    architecture: 'ARM64 (Apple Silicon)',
    fileName: 'SM2_Studio_macOS_AppleSilicon_v2.4.0.dmg',
    fileSize: '62.1 MB',
    directUrl: 'https://github.com/releases/download/v2.4.0/SM2_Studio_macOS_AppleSilicon_v2.4.0.dmg',
    sha256: '9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    isLatest: true,
    minOsVersion: 'macOS Monterey 12.0+',
    releaseNotes: 'مبنية ومجمعة خصيصاً للاستفادة الكاملة من كفاءة معالجات آبل سيليكون وتوفير البطارية.',
    releaseNotesEn: 'Native compilation optimized for Apple Silicon performance and battery longevity.',
  },
  {
    id: 'dl-mac-intel',
    title: 'نسخة macOS لمعالجات Intel (x64 DMG)',
    titleEn: 'macOS Intel x64 (.dmg)',
    version: '2.4.0',
    releaseDate: '2026-09-05',
    platform: 'macos',
    architecture: 'x86_64',
    fileName: 'SM2_Studio_macOS_Intel_v2.4.0.dmg',
    fileSize: '65.8 MB',
    directUrl: 'https://github.com/releases/download/v2.4.0/SM2_Studio_macOS_Intel_v2.4.0.dmg',
    sha256: '1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e',
    isLatest: true,
    minOsVersion: 'macOS Big Sur 11.0+',
    releaseNotes: 'دعم كامل للأجهزة السابقة مع استقرار عالي.',
    releaseNotesEn: 'Full support for Intel Mac architectures.',
  },
  {
    id: 'dl-linux-appimage',
    title: 'حزمة Linux الشاملة (AppImage)',
    titleEn: 'Linux Universal (AppImage)',
    version: '2.4.0',
    releaseDate: '2026-09-05',
    platform: 'linux',
    architecture: 'x86_64',
    fileName: 'SM2_Studio_v2.4.0_x86_64.AppImage',
    fileSize: '71.0 MB',
    directUrl: 'https://github.com/releases/download/v2.4.0/SM2_Studio_v2.4.0_x86_64.AppImage',
    sha256: '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d',
    isLatest: true,
    minOsVersion: 'GLIBC 2.31+ (Ubuntu 20.04+, Fedora 34+, Arch)',
    releaseNotes: 'حزمة واحدة تعمل على كافة توزيعات لينكس دون تثبيت حزم مسبقة.',
    releaseNotesEn: 'Single universal bundle executing on any modern Linux distribution.',
  },
  {
    id: 'dl-android-apk',
    title: 'تطبيق ومكتبة SM+2 للهواتف (Android APK)',
    titleEn: 'Android Companion & Client (.apk)',
    version: '2.1.2',
    releaseDate: '2026-08-28',
    platform: 'android',
    architecture: 'Universal ARMv8 / x86_64',
    fileName: 'SM2_Mobile_Client_v2.1.2.apk',
    fileSize: '19.6 MB',
    directUrl: 'https://github.com/releases/download/v2.1.2/SM2_Mobile_Client_v2.1.2.apk',
    sha256: '3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c',
    isLatest: false,
    minOsVersion: 'Android 8.0 (API Level 26+)',
    releaseNotes: 'تطبيق للمراقبة عن بعد، تفقد حالة الخوادم، واستقبال إشعارات التحديث الفورية.',
    releaseNotesEn: 'Mobile companion for status monitoring and instantaneous release push notifications.',
  },
];

export const initialChangelogs: ChangelogEntry[] = [
  {
    id: 'cl-v240',
    version: 'v2.4.0',
    date: '2026-09-05',
    type: 'feature',
    title: 'إطلاق الإصدار الذهبي SM+2 مع دعم التزامن والتكامل المباشر',
    titleEn: 'Golden Release SM+2 with Direct Sync & GitHub API Bridge',
    changes: [
      'إضافة محرك التزامن فائق السرعة عبر GitHub Releases API.',
      'توفير نظام إشعارات البريد الإلكتروني الفوري للمشتركين فور اعتماد أي إصدار.',
      'تصميم واجهة مستخدم فنية كلاسيكية ذات تباين نقي وخطوط متناغمة.',
      'دعم الوضع الليلي والنهاري وحفظ التفضيلات تلقائياً في المتصفح.',
      'تحسين خوارزمية حساب بصمات SHA-256 لتكون أسرع بنسبة 40%.',
    ],
    changesEn: [
      'Added high-velocity synchronization engine via GitHub Releases API.',
      'Instant automated email notification dispatch for subscribed developers.',
      'Refined classic artistic design language with high typographic legibility.',
      'Adaptive Dark / Light theme with seamless state persistence.',
      '40% faster cryptographic SHA-256 checksum computation.',
    ],
    author: 'SM+2 Core Maintainers',
    githubCommit: '9c4f1e8',
  },
  {
    id: 'cl-v235',
    version: 'v2.3.5',
    date: '2026-08-18',
    type: 'fix',
    title: 'تحسينات في إدارة الذاكرة واستقرار المزامنة',
    titleEn: 'Memory Management & Sync Stability Improvements',
    changes: [
      'معالجة استهلاك الذاكرة في حزم macOS Apple Silicon عند فحص الملفات الضخمة.',
      'تحسين معالجة أخطاء اتصال شبكة GitHub API وإعادة المحاولة التلقائية.',
      'تحديث نصوص التوثيق وإضافة مراجع REST API كاملة.',
    ],
    changesEn: [
      'Resolved peak memory overhead on macOS Apple Silicon during large binary scans.',
      'Enhanced GitHub API network retry resilience with exponential backoff.',
      'Updated technical documentation with comprehensive REST endpoints.',
    ],
    author: 'SM+2 Core Maintainers',
    githubCommit: '5a2b3c1',
  },
  {
    id: 'cl-v220',
    version: 'v2.2.0',
    date: '2026-07-10',
    type: 'security',
    title: 'ترقية بروتوكولات التشفير وإدارة أدوار المشرفين',
    titleEn: 'Cryptographic Protocol Upgrades & Supervisor RBAC',
    changes: [
      'تطبيق مصفوفة أذونات وصلاحيات المشرفين (Super Admin, Editor, Support).',
      'تعزيز آليات منع التلاعب بملفات التثبيت قبل النشر.',
      'دعم تعدد اللغات (العربية، الإنجليزية، الفرنسية) مع اتجاه النصوص الأصيل RTL/LTR.',
    ],
    changesEn: [
      'Role-based access control matrix (Super Admin, Editor, Support, Member).',
      'Tamper-evident verification routines for pre-release bundles.',
      'Native multi-language localization (Arabic, English, French) with full RTL.',
    ],
    author: 'Security WG',
    githubCommit: '3d8e9a2',
  },
];

export const initialAdminUsers: AdminUser[] = [
  {
    id: 'usr-super-1',
    username: 'sm2_director',
    email: 'admin@sm2.dev',
    password: 'SM2@Admin2026',
    fullName: 'المشرف العام - المهندس سمير (SM+2 Lead)',
    role: 'super_admin',
    permissions: {
      canEditContent: true,
      canPublishRelease: true,
      canManageUsers: true,
      canSendNotifications: true,
      canConfigureGithub: true,
    },
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: '2025-01-10',
    lastLogin: '2026-09-08 22:40',
  },
  {
    id: 'usr-editor-2',
    username: 'omar_docs',
    email: 'omar@sm2.dev',
    password: 'SM2@Editor2026',
    fullName: 'عمر الفاروق - محرر التوثيق والمحتوى',
    role: 'editor',
    permissions: {
      canEditContent: true,
      canPublishRelease: false,
      canManageUsers: false,
      canSendNotifications: false,
      canConfigureGithub: false,
    },
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: '2025-03-15',
    lastLogin: '2026-09-07 14:15',
  },
  {
    id: 'usr-support-3',
    username: 'sara_support',
    email: 'sara@sm2.dev',
    password: 'SM2@Support2026',
    fullName: 'سارة المنصور - مهندسة الدعم الفني',
    role: 'support_agent',
    permissions: {
      canEditContent: false,
      canPublishRelease: false,
      canManageUsers: false,
      canSendNotifications: true,
      canConfigureGithub: false,
    },
    active: true,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    createdAt: '2025-06-01',
    lastLogin: '2026-09-08 09:12',
  },
];

export const initialSubscribers: EmailSubscriber[] = [
  {
    id: 'sub-1',
    email: 'hoc.plus1976@gmail.com',
    name: 'المشرف الرئيسي',
    subscribedAt: '2026-09-01',
    categories: ['all', 'security', 'windows', 'macos'],
    status: 'active',
  },
  {
    id: 'sub-2',
    email: 'dev.lead@enterprise.org',
    name: 'Tariq Hassan',
    subscribedAt: '2026-08-20',
    categories: ['all', 'releases'],
    status: 'active',
  },
  {
    id: 'sub-3',
    email: 'alex.code@github.io',
    name: 'Alexandre Dubois',
    subscribedAt: '2026-08-15',
    categories: ['releases', 'linux'],
    status: 'active',
  },
];

export const initialNotificationLogs: NotificationLog[] = [
  {
    id: 'notif-1',
    timestamp: '2026-09-05 18:30',
    subject: '[SM+2 Release] صدور الإصدار المستقر v2.4.0 مع دعم التزامن المباشر',
    version: 'v2.4.0',
    recipientsCount: 3840,
    status: 'sent',
    messageBody: 'يسر فريق SM+2 إشعاركم بصدور الإصدار المستقر v2.4.0 متضمناً حزم التثبيت لكافة الأنظمة، وسجل التغييرات الكامل.',
  },
  {
    id: 'notif-2',
    timestamp: '2026-08-18 11:20',
    subject: '[SM+2 Patch] تحديث استقرار v2.3.5 وتحديث مكتبات الأمان',
    version: 'v2.3.5',
    recipientsCount: 3620,
    status: 'sent',
    messageBody: 'تم نشر حزمة التحديث v2.3.5 لمعالجة تحسينات الأداء، يمكنك التنزيل فوراً من صفحة التحميل المباشر.',
  },
];

export const initialSupportTickets: SupportTicket[] = [
  {
    id: 'tkt-101',
    ticketNumber: 'SM2-8821',
    name: 'خالد عبد الله',
    email: 'khaled.eng@example.com',
    subject: 'استفسار حول أتمتة الرفع عبر GitHub Actions مع أداة CLI',
    category: 'technical',
    priority: 'high',
    status: 'in_progress',
    message: 'السلام عليكم، نود أتمتة عملية رفع الحزم إلى GitHub Releases عبر الـ Pipeline مباشرة. هل توفرون Action رسمي أو يمكن استدعاء sm2 release create مباشرة من الـ YAML؟',
    createdAt: '2026-09-08 19:15',
    replies: [
      {
        id: 'rep-1',
        sender: 'فريق الدعم الهندسي SM+2',
        isStaff: true,
        text: 'أهلاً بك مهندس خالد. نعم، يمكنك استخدام أداة sm2-cli مباشرة داخل أي خط سير عمل GitHub Actions. ستجد ملف إعداد نموذجي جاهزاً في توثيق البرمجيات.',
        timestamp: '2026-09-08 20:30',
      },
    ],
  },
  {
    id: 'tkt-102',
    ticketNumber: 'SM2-8819',
    name: 'Karim Bensalem',
    email: 'karim@tech.fr',
    subject: 'Signature SHA-256 verification on macOS Sequoia',
    category: 'bug',
    priority: 'medium',
    status: 'resolved',
    message: 'I verified the sha256 checksum on macOS and it matches perfectly, thank you for the seamless binary packaging.',
    createdAt: '2026-09-07 10:05',
    replies: [
      {
        id: 'rep-2',
        sender: 'SM+2 Support',
        isStaff: true,
        text: 'Thank you Karim for your feedback! We prioritize cryptographic integrity for all compiled builds.',
        timestamp: '2026-09-07 12:40',
      },
    ],
  },
];

export const initialGitHubSettings: GitHubSettings = {
  repoOwner: 'samymsood-eng',
  repoName: 'SM-2',
  branch: 'main',
  token: '',
  isConnected: true,
  lastSync: '2026-09-09 23:55',
  enableAutoRelease: true,
  webhookUrl: 'https://api.github.com/repos/samymsood-eng/SM-2',
  showGithubInHero: false,
  showGithubInFooter: false,
  enableTelegramNotifications: false,
};

export const initialLicenseRequests: LicenseRequest[] = [
  {
    id: 'LIC-89241',
    clientName: 'طارق عبد الله',
    clientEmail: 'tariq.pro@gmail.com',
    clientPhone: '+966551234567',
    productName: 'محرك واستوديو SM+2 الأساسي',
    hardwareId: 'BFEBFBFF000906EA-MB-X570-AORUS-MASTER-9941A',
    duration: 'trial_3m',
    status: 'pending',
    createdAt: '2026-09-17 14:20',
  },
  {
    id: 'LIC-94120',
    clientName: 'خالد المنصوري',
    clientEmail: 'khaled.almansoori@outlook.com',
    clientPhone: '+971509876543',
    productName: 'أداة المزامنة السحابية SM+2 Cloud Relay',
    hardwareId: '178BFBFF00800F12-ASUSTEK-PRIME-Z690P-8812B',
    duration: 'lifetime',
    paymentReference: 'PAY-STC-98210344',
    status: 'active',
    serialKey: 'SM2-LIFE-9941-A882-B129-2026',
    createdAt: '2026-09-16 11:05',
    activatedAt: '2026-09-16 11:30',
  },
];

