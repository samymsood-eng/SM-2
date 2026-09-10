export type Language = 'ar' | 'en' | 'fr';
export type Theme = 'light' | 'dark';
export type Page = 'home' | 'sales' | 'downloads' | 'developer' | 'admin';

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  verifiedBuyer?: boolean;
}

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  tagline: string;
  taglineEn: string;
  description: string;
  descriptionEn: string;
  category: 'core' | 'tools' | 'cloud' | 'security';
  version: string;
  price: string;
  license: string;
  rating: number;
  downloadsCount: number;
  images: string[];
  features: string[];
  featuresEn: string[];
  systemRequirements: string[];
  downloadUrl: string;
  demoUrl?: string;
  isFeatured?: boolean;
  reviews?: ProductReview[];
}

export interface DocSection {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  category: string;
  categoryEn: string;
  description: string;
  descriptionEn: string;
  order: number;
  content: string;
  contentEn: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  lastUpdated: string;
}

export interface DownloadFile {
  id: string;
  title: string;
  titleEn: string;
  version: string;
  releaseDate: string;
  platform: 'windows' | 'macos' | 'linux' | 'android' | 'cross-platform';
  architecture: string;
  fileName: string;
  fileSize: string;
  directUrl: string;
  sha256: string;
  isLatest: boolean;
  minOsVersion: string;
  releaseNotes: string;
  releaseNotesEn: string;
}

export interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  type: 'feature' | 'fix' | 'security' | 'performance';
  title: string;
  titleEn: string;
  changes: string[];
  changesEn: string[];
  author: string;
  githubCommit?: string;
}

export type AdminRole = 'super_admin' | 'editor' | 'support_agent' | 'member';

export interface AdminPermissions {
  canEditContent: boolean;
  canPublishRelease: boolean;
  canManageUsers: boolean;
  canSendNotifications: boolean;
  canConfigureGithub: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: AdminRole;
  permissions: AdminPermissions;
  active: boolean;
  avatarUrl?: string;
  createdAt: string;
  lastLogin?: string;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  categories: string[];
  status: 'active' | 'unsubscribed';
}

export interface NotificationLog {
  id: string;
  timestamp: string;
  subject: string;
  version: string;
  recipientsCount: number;
  status: 'sent' | 'scheduled' | 'draft';
  messageBody: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  name: string;
  email: string;
  subject: string;
  category: 'technical' | 'license' | 'bug' | 'feature_request';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  message: string;
  createdAt: string;
  replies: {
    id: string;
    sender: string;
    isStaff: boolean;
    text: string;
    timestamp: string;
  }[];
}

export interface GitHubSettings {
  repoOwner: string;
  repoName: string;
  branch: string;
  token: string;
  isConnected: boolean;
  lastSync?: string;
  enableAutoRelease: boolean;
  webhookUrl?: string;
}
