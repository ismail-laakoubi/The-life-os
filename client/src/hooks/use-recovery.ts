import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

// --- تعريف أنواع البيانات (Types) ---
export type RecoveryProfile = {
  id: number;
  userId: number;
  addictionType: string;
  sobrietyStartDate: string;
  motivation?: string | null;
  dailyGoal?: string | null;
};

export type CheckIn = {
  id: number;
  profileId: number;
  date: string;
  isClean: boolean;
  mood: number;
  urgeIntensity?: number | null;
  gratitude?: string | null;
  notes?: string | null;
};

export type CopingStrategy = {
  id: number;
  profileId: number;
  title: string;
  description?: string | null;
  category: string;
  effectiveness: number;
  timesUsed: number;
};

// --- دالة موحدة لمعالجة الأخطاء ---
const handleMutationError = (error: Error, action: string) => {
  console.error(`Error ${action}:`, error);
  alert(`Failed to ${action}: ${error.message}`);
};

// --- Hooks for Recovery Profile ---
export function useRecoveryProfile() {
  return useQuery<RecoveryProfile | null>({
    queryKey: ["recoveryProfile"],
    queryFn: async () => {
      try {
        const res = await apiRequest("/api/recovery/profile", "GET");
        return res.json();
      } catch (error: any) {
        if (error.message.includes("404")) {
          return null;
        }
        throw error;
      }
    },
  });
}

export function useCreateRecoveryProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<RecoveryProfile, 'id' | 'userId'>) => {
      const res = await apiRequest("/api/recovery/profile", "POST", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recoveryProfile"] });
    },
    onError: (error: Error) => handleMutationError(error, "create profile"),
  });
}

export function useUpdateRecoveryProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<RecoveryProfile> & { id: number }) => {
      const res = await apiRequest(`/api/recovery/profile/${data.id}`, "PATCH", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recoveryProfile"] });
    },
    onError: (error: Error) => handleMutationError(error, "update profile"),
  });
}

// --- Hooks for Check-Ins ---
export function useRecoveryCheckIns(profileId?: number) {
  return useQuery<CheckIn[]>({
    queryKey: ["recoveryCheckIns", profileId],
    queryFn: async ({ queryKey }) => {
      const [, pid] = queryKey;
      if (!pid) return [];
      const res = await apiRequest(`/api/recovery/check-ins?profileId=${pid}`, "GET");
      return res.json();
    },
    enabled: !!profileId,
  });
}

export function useCreateCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<CheckIn, 'id'>) => {
      const res = await apiRequest("/api/recovery/check-ins", "POST", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["recoveryCheckIns", data.profileId] });
    },
    onError: (error: Error) => handleMutationError(error, "create check-in"),
  });
}

// ====================================================================
// --- Hooks for Coping Strategies (هذا هو الجزء الذي كان ناقصًا) ---
// ====================================================================
export function useCopingStrategies(profileId?: number) {
    return useQuery<CopingStrategy[]>({
        queryKey: ["copingStrategies", profileId],
        queryFn: async ({ queryKey }) => {
            const [, pid] = queryKey;
            if (!pid) return [];
            const res = await apiRequest(`/api/recovery/strategies?profileId=${pid}`, "GET");
            return res.json();
        },
        enabled: !!profileId,
    });
}

export function useCreateCopingStrategy() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Omit<CopingStrategy, 'id' | 'timesUsed' | 'effectiveness'> & { effectiveness?: number }) => {
            const res = await apiRequest("/api/recovery/strategies", "POST", data);
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["copingStrategies", data.profileId] });
        },
        onError: (error: Error) => handleMutationError(error, "create coping strategy"),
    });
}

export function useUpdateCopingStrategy() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<CopingStrategy> & { id: number; profileId: number }) => {
            const res = await apiRequest(`/api/recovery/strategies/${data.id}`, "PATCH", data);
            return res.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["copingStrategies", data.profileId] });
        },
        onError: (error: Error) => handleMutationError(error, "update coping strategy"),
    });
}

export function useDeleteCopingStrategy() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, profileId }: { id: number; profileId: number }) => {
            await apiRequest(`/api/recovery/strategies/${id}`, "DELETE");
            return { profileId };
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["copingStrategies", data.profileId] });
        },
        onError: (error: Error) => handleMutationError(error, "delete coping strategy"),
    });
}
