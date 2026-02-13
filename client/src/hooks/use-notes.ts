import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "../lib/queryClient";

type Note = {
  id: number;
  title: string;
  content: string;
  tags?: string | null;
  category?: string | null;
  isPinned: boolean;
  isFavorite: boolean;
  color?: string | null;
  linkedNoteIds?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export function useNotes() {
  return useQuery({
    queryKey: ["/api/notes"],
    queryFn: getQueryFn<Note[]>({ on401: "returnNull" }),
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Note>) => {
      const res = await apiRequest("/api/notes", "POST", data);
      if (!res.ok) {
        // إذا كانت الاستجابة غير ناجحة (مثل خطأ 400 أو 500)
        const errorData = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(errorData.message || "Failed to create note");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
    },
    // --- أضفنا هذا الجزء ---
    onError: (error) => {
      console.error("Error creating note:", error);
      alert(`Failed to create note: ${error.message}`);
    },
    // ----------------------
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Note> & { id: number }) => {
      const res = await apiRequest(`/api/notes/${id}`, "PATCH", data);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(errorData.message || "Failed to update note");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
    },
    // --- أضفنا هذا الجزء ---
    onError: (error) => {
      console.error("Error updating note:", error);
      alert(`Failed to update note: ${error.message}`);
    },
    // ----------------------
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest(`/api/notes/${id}`, "DELETE");
       if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(errorData.message || "Failed to delete note");
      }
      // لا يوجد .json() في طلبات DELETE عادةً
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
    },
    onError: (error) => {
      console.error("Error deleting note:", error);
      alert(`Failed to delete note: ${error.message}`);
    },
  });
}
