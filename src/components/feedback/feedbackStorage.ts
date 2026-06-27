export interface FeedbackEntry {
  id: string;
  category: 'bug' | 'feature' | 'data' | 'other';
  message: string;
  contact?: string;
  createdAt: string;
  page: string;
}

const STORAGE_KEY = 'dta_feedback';

export function getAllFeedback(): FeedbackEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FeedbackEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveFeedback(entry: Omit<FeedbackEntry, 'id' | 'createdAt'>): FeedbackEntry {
  const all = getAllFeedback();
  const newEntry: FeedbackEntry = {
    ...entry,
    id: `fb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  all.unshift(newEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  return newEntry;
}

export function clearFeedback(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportFeedbackAsJson(): string {
  return JSON.stringify(getAllFeedback(), null, 2);
}
