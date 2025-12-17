"use client";

import useSWR from "swr";
import { apiFetch } from "../lib/api";

export function usePaymentDetails(id) {
  const shouldFetch = !!id; // Avoid fetching until id exists

  const { data, error, isLoading } = useSWR(
    shouldFetch ? `/dashboard/payments/${id}` : null,
    apiFetch
  );

  return {
    payment: data || null,
    loading: isLoading,
    error,
  };
}
