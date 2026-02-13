import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "../lib/queryClient";
import { useLocation } from "wouter";

type User = {
  id: number;
  username: string;
  name: string;
  avatarUrl?: string | null;
};

export function useUser() {
  return useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const [_, setLocation] = useLocation();
  
  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setLocation("/dashboard");
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const [_, setLocation] = useLocation();
  
  return useMutation({
    mutationFn: async (data: { username: string; password: string; name: string }) => {
      const res = await apiRequest("POST", "/api/register", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      setLocation("/dashboard");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const [_, setLocation] = useLocation();
  
  return useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation("/auth");
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name?: string; avatarUrl?: string }) => {
      const res = await apiRequest("PATCH", "/api/user", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });
}