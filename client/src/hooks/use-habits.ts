import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

type HabitLog = {
  id: number;
  habitId: number;
  date: string;
  value: number;
  createdAt?: string | null;
};

type Habit = {
  id: number;
  userId: number;
  title: string;
  category?: string | null;
  type: string;
  createdAt?: string | null;
  logs: HabitLog[];
};

export function useHabits() {
  return useQuery<Habit[]>({
    queryKey: ["/api/habits"],
  });
}

export function useCreateHabit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { title: string; category?: string; type: "boolean" | "number" }) => {
      const res = await apiRequest("POST", "/api/habits", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
    },
  });
}

export function useDeleteHabit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/habits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
    },
  });
}

export function useLogHabit() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { habitId: number; date: string; value: number }) => {
      const res = await apiRequest("POST", `/api/habits/${data.habitId}/log`, {
        date: data.date,
        value: data.value,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
    },
  });
}
