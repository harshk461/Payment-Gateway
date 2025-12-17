"use client";

import useSWR from "swr";
import { apiFetch } from "../lib/api";

// ---- FETCH PROFILE ----
export function useMerchantProfile() {
  const { data, error, isLoading, mutate } = useSWR(
    "/merchants/me",
    apiFetch
  );

  return {
    profile: data,
    loading: isLoading,
    error,
    refresh: mutate,
  };
}

// ---- UPDATE PROFILE ----
export async function updateMerchantProfile(payload) {
  return apiFetch("/merchants/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
