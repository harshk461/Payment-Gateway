"use client";

import useSWR from "swr";
import { apiFetch } from "../lib/api";

export function usePayments({ page = 1, status = "all", query = "" }) {
  const params = new URLSearchParams({
    page: page.toString(),
    status,
    search: query,
  });

  const { data, error, isLoading } = useSWR(
    `/dashboard/payments?${params.toString()}`,
    apiFetch,
    {
      revalidateOnFocus: true,
    }
  );

  return {
    payments: data?.payments || [],
    total: data?.total || 0,
    loading: isLoading,
    error,
  };
}
