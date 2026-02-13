import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getQueryFn } from "../lib/queryClient";

type RecoveryProfile = {
  id: number;
  userId: number;
  addictionType: string;
  sobrietyStartDate: string;
  motivation?: string | null;
  triggers?: string | null;
  supportContacts?: string | null;
  dailyGoal?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type RecoveryCheckIn = {
  id: number;
  profileId: number;
  date: string;
  isClean: boolean;
  mood: number;
  urgeIntensity?: number | null;
  triggersEncountered?: string | null;
  copingStrategiesUsed?: string | null;
  gratitude?: string | null;
  notes?: string | null;
  createdAt?: string | null;
};

type CopingStrategy = {
  id: number;
  profileId: number;
  title: string;
  description?: string | null;
  category?: string | null;
  effectiveness?: number | null;
  timesUsed: number;
  createdAt?: string | null;
};

export function useRecoveryProfile() {
  return useQuery({
    queryKey: ["/api/recovery/profile"],
    queryFn: getQueryFn<RecoveryProfile>({ on401: "returnNull" }),
  });
}

export function useCreateRecoveryProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<RecoveryProfile>) => {
      const res = await fetch("/api/recovery/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create profile");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recovery/profile"] });
    },
  });
}

export function useUpdateRecoveryProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<RecoveryProfile> & { id: number }) => {
      const res = await fetch(`/api/recovery/profile/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update profile");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recovery/profile"] });
    },
  });
}

export function useRecoveryCheckIns(profileId?: number) {
  return useQuery({
    queryKey: [`/api/recovery/check-ins/${profileId}`],
    queryFn: getQueryFn<RecoveryCheckIn[]>({ on401: "returnNull" }),
    enabled: !!profileId,
  });
}

export function useCreateCheckIn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ profileId, ...data }: Partial<RecoveryCheckIn> & { profileId: number }) => {
      const res = await fetch(`/api/recovery/check-ins/${profileId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create check-in");
      }
      
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/recovery/check-ins/${variables.profileId}`] });
    },
  });
}

export function useCopingStrategies(profileId?: number) {
  return useQuery({
    queryKey: [`/api/recovery/coping-strategies/${profileId}`],
    queryFn: getQueryFn<CopingStrategy[]>({ on401: "returnNull" }),
    enabled: !!profileId,
  });
}

export function useCreateCopingStrategy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ profileId, ...data }: Partial<CopingStrategy> & { profileId: number }) => {
      const res = await fetch(`/api/recovery/coping-strategies/${profileId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create strategy");
      }
      
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/recovery/coping-strategies/${variables.profileId}`] });
    },
  });
}

export function useUpdateCopingStrategy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, profileId, ...data }: Partial<CopingStrategy> & { id: number; profileId: number }) => {
      const res = await fetch(`/api/recovery/coping-strategies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update strategy");
      }
      
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/recovery/coping-strategies/${variables.profileId}`] });
    },
  });
}

export function useDeleteCopingStrategy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, profileId }: { id: number; profileId: number }) => {
      const res = await fetch(`/api/recovery/coping-strategies/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete strategy");
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/recovery/coping-strategies/${variables.profileId}`] });
    },
  });
}