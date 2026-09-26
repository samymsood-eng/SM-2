import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  Product,
  DocSection,
  DownloadFile,
  ChangelogEntry,
  AdminUser,
  EmailSubscriber,
  SupportTicket,
  GitHubSettings,
  LicenseRequest,
} from '../types';
import {
  initialProducts,
  initialDownloads,
  initialDocs,
  initialChangelogs,
  initialAdminUsers,
  initialSubscribers,
  initialSupportTickets,
  initialGitHubSettings,
  initialLicenseRequests,
} from '../data/initialData';

// Real-time listener for products with automatic fallback & initial seed
export function subscribeProducts(onUpdate: (products: Product[]) => void) {
  const colRef = collection(db, 'products');

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Seed initial products to Firestore
        try {
          const batch = writeBatch(db);
          for (const item of initialProducts) {
            batch.set(doc(db, 'products', item.id), item);
          }
          await batch.commit();
        } catch (err) {
          console.warn('Firestore initial products seed skipped or offline:', err);
        }
        onUpdate(initialProducts);
      } else {
        const items: Product[] = [];
        snapshot.forEach((d) => items.push(d.data() as Product));
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Firestore products listener error, using local fallback:', error);
      const saved = localStorage.getItem('sm2_products');
      onUpdate(saved ? JSON.parse(saved) : initialProducts);
    }
  );

  return unsubscribe;
}

// Real-time listener for downloads
export function subscribeDownloads(onUpdate: (downloads: DownloadFile[]) => void) {
  const colRef = collection(db, 'downloads');

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          for (const item of initialDownloads) {
            batch.set(doc(db, 'downloads', item.id), item);
          }
          await batch.commit();
        } catch (err) {
          console.warn('Firestore downloads seed skipped:', err);
        }
        onUpdate(initialDownloads);
      } else {
        const items: DownloadFile[] = [];
        snapshot.forEach((d) => items.push(d.data() as DownloadFile));
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Firestore downloads listener error:', error);
      const saved = localStorage.getItem('sm2_downloads');
      onUpdate(saved ? JSON.parse(saved) : initialDownloads);
    }
  );

  return unsubscribe;
}

// Real-time listener for changelogs
export function subscribeChangelogs(onUpdate: (changelogs: ChangelogEntry[]) => void) {
  const colRef = collection(db, 'changelogs');

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          for (const item of initialChangelogs) {
            batch.set(doc(db, 'changelogs', item.id), item);
          }
          await batch.commit();
        } catch (err) {
          console.warn('Firestore changelogs seed skipped:', err);
        }
        onUpdate(initialChangelogs);
      } else {
        const items: ChangelogEntry[] = [];
        snapshot.forEach((d) => items.push(d.data() as ChangelogEntry));
        // Sort newest first
        items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Firestore changelogs listener error:', error);
      const saved = localStorage.getItem('sm2_changelogs');
      onUpdate(saved ? JSON.parse(saved) : initialChangelogs);
    }
  );

  return unsubscribe;
}

// Real-time listener for docs
export function subscribeDocs(onUpdate: (docs: DocSection[]) => void) {
  const colRef = collection(db, 'docs');

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          for (const item of initialDocs) {
            batch.set(doc(db, 'docs', item.id), item);
          }
          await batch.commit();
        } catch (err) {
          console.warn('Firestore docs seed skipped:', err);
        }
        onUpdate(initialDocs);
      } else {
        const items: DocSection[] = [];
        snapshot.forEach((d) => items.push(d.data() as DocSection));
        items.sort((a, b) => (a.order || 0) - (b.order || 0));
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Firestore docs listener error:', error);
      const saved = localStorage.getItem('sm2_docs');
      onUpdate(saved ? JSON.parse(saved) : initialDocs);
    }
  );

  return unsubscribe;
}

// Real-time listener for admin users
export function subscribeAdminUsers(onUpdate: (users: AdminUser[]) => void) {
  const colRef = collection(db, 'adminUsers');

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        // Check if we already have custom admin users saved in localStorage first!
        const saved = localStorage.getItem('sm2_admin_users');
        let usersToSeed = initialAdminUsers;
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
              usersToSeed = parsed;
            }
          } catch {
            usersToSeed = initialAdminUsers;
          }
        }
        try {
          const batch = writeBatch(db);
          for (const item of usersToSeed) {
            batch.set(doc(db, 'adminUsers', item.id), item);
          }
          await batch.commit();
        } catch (err) {
          console.warn('Firestore admin users seed skipped or offline:', err);
        }
        onUpdate(usersToSeed);
      } else {
        const items: AdminUser[] = [];
        // Read local storage to preserve custom passwords if Firestore doc omits it
        const saved = localStorage.getItem('sm2_admin_users');
        let localUsers: AdminUser[] = [];
        if (saved) {
          try {
            localUsers = JSON.parse(saved);
          } catch {}
        }

        snapshot.forEach((d) => {
          const u = d.data() as AdminUser;
          const localMatch = localUsers.find((i) => i.id === u.id || i.email.toLowerCase() === u.email.toLowerCase());
          const initMatch = initialAdminUsers.find((i) => i.id === u.id || i.email.toLowerCase() === u.email.toLowerCase());

          // Use the password from Firestore, or from local storage, or fallback to default
          const resolvedPassword = u.password || localMatch?.password || initMatch?.password || 'SM2@Admin2026';
          items.push({ ...u, password: resolvedPassword });
        });
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Firestore admin users listener error, using resilient local storage:', error);
      const saved = localStorage.getItem('sm2_admin_users');
      onUpdate(saved ? JSON.parse(saved) : initialAdminUsers);
    }
  );

  return unsubscribe;
}

// Real-time listener for subscribers
export function subscribeSubscribers(onUpdate: (subs: EmailSubscriber[]) => void) {
  const colRef = collection(db, 'subscribers');

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          for (const item of initialSubscribers) {
            batch.set(doc(db, 'subscribers', item.id), item);
          }
          await batch.commit();
        } catch (err) {
          console.warn('Firestore subscribers seed skipped:', err);
        }
        onUpdate(initialSubscribers);
      } else {
        const items: EmailSubscriber[] = [];
        snapshot.forEach((d) => items.push(d.data() as EmailSubscriber));
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Firestore subscribers listener error:', error);
      const saved = localStorage.getItem('sm2_subscribers');
      onUpdate(saved ? JSON.parse(saved) : initialSubscribers);
    }
  );

  return unsubscribe;
}

// Real-time listener for support tickets
export function subscribeSupportTickets(onUpdate: (tickets: SupportTicket[]) => void) {
  const colRef = collection(db, 'supportTickets');

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          for (const item of initialSupportTickets) {
            batch.set(doc(db, 'supportTickets', item.id), item);
          }
          await batch.commit();
        } catch (err) {
          console.warn('Firestore tickets seed skipped:', err);
        }
        onUpdate(initialSupportTickets);
      } else {
        const items: SupportTicket[] = [];
        snapshot.forEach((d) => items.push(d.data() as SupportTicket));
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Firestore tickets listener error:', error);
      const saved = localStorage.getItem('sm2_tickets');
      onUpdate(saved ? JSON.parse(saved) : initialSupportTickets);
    }
  );

  return unsubscribe;
}

// Real-time listener for settings
export function subscribeGitHubSettings(onUpdate: (settings: GitHubSettings) => void) {
  const docRef = doc(db, 'settings', 'github');

  const unsubscribe = onSnapshot(
    docRef,
    async (snapshot) => {
      if (!snapshot.exists()) {
        try {
          await setDoc(docRef, initialGitHubSettings);
        } catch (err) {
          console.warn('Firestore settings seed skipped:', err);
        }
        onUpdate(initialGitHubSettings);
      } else {
        onUpdate(snapshot.data() as GitHubSettings);
      }
    },
    (error) => {
      console.warn('Firestore settings listener error:', error);
      const saved = localStorage.getItem('sm2_github_settings');
      onUpdate(saved ? JSON.parse(saved) : initialGitHubSettings);
    }
  );

  return unsubscribe;
}

// --- CLOUD WRITE FUNCTIONS ---
export async function saveProductToCloud(product: Product): Promise<void> {
  try {
    await setDoc(doc(db, 'products', product.id), product);
  } catch (err) {
    console.error('Error saving product to Firestore:', err);
  }
}

export async function deleteProductFromCloud(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (err) {
    console.error('Error deleting product from Firestore:', err);
  }
}

export async function saveDownloadToCloud(download: DownloadFile): Promise<void> {
  try {
    await setDoc(doc(db, 'downloads', download.id), download);
  } catch (err) {
    console.error('Error saving download to Firestore:', err);
  }
}

export async function deleteDownloadFromCloud(downloadId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'downloads', downloadId));
  } catch (err) {
    console.error('Error deleting download from Firestore:', err);
  }
}

export async function saveChangelogToCloud(entry: ChangelogEntry): Promise<void> {
  try {
    await setDoc(doc(db, 'changelogs', entry.id), entry);
  } catch (err) {
    console.error('Error saving changelog to Firestore:', err);
  }
}

export async function saveDocToCloud(docSection: DocSection): Promise<void> {
  try {
    await setDoc(doc(db, 'docs', docSection.id), docSection);
  } catch (err) {
    console.error('Error saving doc to Firestore:', err);
  }
}

export async function deleteDocFromCloud(docId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'docs', docId));
  } catch (err) {
    console.error('Error deleting doc from Firestore:', err);
  }
}

export async function saveAdminUserToCloud(user: AdminUser): Promise<void> {
  try {
    await setDoc(doc(db, 'adminUsers', user.id), user);
  } catch (err) {
    console.error('Error saving admin user to Firestore:', err);
  }
}

export async function deleteAdminUserFromCloud(userId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'adminUsers', userId));
  } catch (err) {
    console.error('Error deleting admin user from Firestore:', err);
  }
}

export async function saveSubscriberToCloud(subscriber: EmailSubscriber): Promise<void> {
  try {
    await setDoc(doc(db, 'subscribers', subscriber.id), subscriber);
  } catch (err) {
    console.error('Error saving subscriber to Firestore:', err);
  }
}

export async function saveTicketToCloud(ticket: SupportTicket): Promise<void> {
  try {
    await setDoc(doc(db, 'supportTickets', ticket.id), ticket);
  } catch (err) {
    console.error('Error saving ticket to Firestore:', err);
  }
}

export async function saveGitHubSettingsToCloud(settings: GitHubSettings): Promise<void> {
  try {
    await setDoc(doc(db, 'settings', 'github'), settings);
  } catch (err) {
    console.error('Error saving github settings to Firestore:', err);
  }
}

// Real-time listener for license requests
export function subscribeLicenseRequests(onUpdate: (requests: LicenseRequest[]) => void) {
  const colRef = collection(db, 'licenses');

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(db);
          for (const item of initialLicenseRequests) {
            batch.set(doc(db, 'licenses', item.id), item);
          }
          await batch.commit();
        } catch (err) {
          console.warn('Firestore initial licenses seed skipped:', err);
        }
        onUpdate(initialLicenseRequests);
      } else {
        const items: LicenseRequest[] = [];
        snapshot.forEach((d) => items.push(d.data() as LicenseRequest));
        onUpdate(items);
      }
    },
    (error) => {
      console.warn('Firestore licenses listener error, using local fallback:', error);
      const saved = localStorage.getItem('sm2_licenses');
      onUpdate(saved ? JSON.parse(saved) : initialLicenseRequests);
    }
  );

  return unsubscribe;
}

export async function saveLicenseRequestToCloud(req: LicenseRequest): Promise<void> {
  try {
    await setDoc(doc(db, 'licenses', req.id), req);
  } catch (err) {
    console.error('Error saving license request to Firestore:', err);
  }
}

export async function deleteLicenseRequestFromCloud(reqId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'licenses', reqId));
  } catch (err) {
    console.error('Error deleting license request from Firestore:', err);
  }
}

