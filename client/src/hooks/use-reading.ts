import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type ReadingItem = {
  id: number;
  userId: number;
  title: string;
  type: "book" | "movie" | "show" | "article" | string;
  status: "planned" | "in-progress" | "completed" | string;
  rating: number | null;
  notes: string | null;
  createdAt: string;
};

type ReadingSession = {
  id: number;
  userId: number;
  readingItemId: number;
  sessionDate: string; // YYYY-MM-DD
  durationMinutes: number;
  pagesRead: number;
  note: string | null;
  createdAt: string;
};

type ReadingNote = {
  id: number;
  userId: number;
  readingItemId: number | null;
  sessionId: number | null;
  kind: "note" | "highlight" | string;
  content: string;
  pageOrTime: string | null;
  createdAt: string;
};

type WeeklyStats = {
  minutes: number;
  pages: number;
  sessions: number;
  streakDays: number;
};

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(txt || `Request failed: ${res.status}`);
  }
  // 204 no content
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ---------- Items ----------
export function useReadingItems() {
  return useQuery({
    queryKey: ["reading", "items"],
    queryFn: () => api<ReadingItem[]>("/api/reading"),
  });
}

export function useCreateReadingItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      title: string;
      type?: "book" | "movie" | "show" | "article";
      status?: "planned" | "in-progress" | "completed";
      rating?: number | null;
      notes?: string | null;
    }) => api<ReadingItem>("/api/reading", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["reading", "items"] });
    },
  });
}

export function useUpdateReadingItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; updates: Partial<ReadingItem> }) =>
      api<ReadingItem>(`/api/reading/${args.id}`, { method: "PATCH", body: JSON.stringify(args.updates) }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["reading", "items"] });
    },
  });
}

export function useDeleteReadingItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api<void>(`/api/reading/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["reading", "items"] });
      // also refresh sessions/notes caches (in case UI currently open)
      await qc.invalidateQueries({ queryKey: ["reading", "sessions"] });
      await qc.invalidateQueries({ queryKey: ["reading", "notes"] });
    },
  });
}

// ---------- Sessions ----------
export function useReadingSessions(readingItemId?: number) {
  return useQuery({
    queryKey: ["reading", "sessions", { readingItemId: readingItemId ?? null }],
    queryFn: () => {
      const qs = readingItemId ? `?itemId=${encodeURIComponent(String(readingItemId))}` : "";
      return api<ReadingSession[]>(`/api/reading/sessions${qs}`);
    },
    enabled: !!readingItemId,
  });
}

export function useCreateReadingSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      readingItemId: number;
      sessionDate: string; // YYYY-MM-DD
      durationMinutes?: number;
      pagesRead?: number;
      note?: string;
    }) => api<ReadingSession>("/api/reading/sessions", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: async (_data, vars) => {
      await qc.invalidateQueries({ queryKey: ["reading", "sessions", { readingItemId: vars.readingItemId }] });
      await qc.invalidateQueries({ queryKey: ["reading", "stats"] });
      await qc.invalidateQueries({ queryKey: ["reading", "items"] });
    },
  });
}

export function useDeleteReadingSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; readingItemId: number }) =>
      api<void>(`/api/reading/sessions/${args.id}`, { method: "DELETE" }),
    onSuccess: async (_d, vars) => {
      await qc.invalidateQueries({ queryKey: ["reading", "sessions", { readingItemId: vars.readingItemId }] });
      await qc.invalidateQueries({ queryKey: ["reading", "notes", { readingItemId: vars.readingItemId }] });
      await qc.invalidateQueries({ queryKey: ["reading", "stats"] });
    },
  });
}

// ---------- Notes ----------
export function useReadingNotes(readingItemId?: number) {
  return useQuery({
    queryKey: ["reading", "notes", { readingItemId: readingItemId ?? null }],
    queryFn: () => {
      const qs = readingItemId ? `?itemId=${encodeURIComponent(String(readingItemId))}` : "";
      return api<ReadingNote[]>(`/api/reading/notes${qs}`);
    },
    enabled: !!readingItemId,
  });
}

export function useCreateReadingNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      readingItemId?: number;
      sessionId?: number;
      kind?: "note" | "highlight";
      content: string;
      pageOrTime?: string;
    }) => api<ReadingNote>("/api/reading/notes", { method: "POST", body: JSON.stringify(payload) }),
    onSuccess: async (_data, vars) => {
      if (vars.readingItemId) {
        await qc.invalidateQueries({ queryKey: ["reading", "notes", { readingItemId: vars.readingItemId }] });
      } else {
        await qc.invalidateQueries({ queryKey: ["reading", "notes"] });
      }
    },
  });
}

export function useDeleteReadingNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (args: { id: number; readingItemId: number }) =>
      api<void>(`/api/reading/notes/${args.id}`, { method: "DELETE" }),
    onSuccess: async (_d, vars) => {
      await qc.invalidateQueries({ queryKey: ["reading", "notes", { readingItemId: vars.readingItemId }] });
    },
  });
}

// ---------- Weekly Stats ----------
export function useReadingWeeklyStats(start: string, end: string, enabled: boolean) {
  return useQuery({
    queryKey: ["reading", "stats", { start, end }],
    queryFn: () => api<WeeklyStats>(`/api/reading/stats/weekly?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`),
    enabled,
  });
}

// ---------- Helpers ----------
export function useReadingHelpers() {
  return useMemo(() => {
    const pad = (n: number) => String(n).padStart(2, "0");

    const toYMD = (d: Date) => {
      const yyyy = d.getFullYear();
      const mm = pad(d.getMonth() + 1);
      const dd = pad(d.getDate());
      return `${yyyy}-${mm}-${dd}`;
    };

    const startOfWeekMonday = (d: Date) => {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      const day = x.getDay(); // 0 Sun..6 Sat
      const diff = (day + 6) % 7; // Monday=0
      x.setDate(x.getDate() - diff);
      return x;
    };

    const endOfWeekSunday = (d: Date) => {
      const s = startOfWeekMonday(d);
      const e = new Date(s);
      e.setDate(e.getDate() + 6);
      return e;
    };

    return { toYMD, startOfWeekMonday, endOfWeekSunday };
  }, []);
}
