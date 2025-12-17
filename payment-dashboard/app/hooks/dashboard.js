"use client";

import useSWR from "swr";
import { apiFetch } from "../lib/api";

// ---- Today Stats ----
export function useTodayStats() {
  const { data, error, isLoading } = useSWR(
    "/dashboard/stats/today",
    apiFetch,
    { refreshInterval: 10_000 } // auto refresh every 10 seconds
  );

  return {
    stats: data,
    loading: isLoading,
    error,
  };
}

// ---- Overall Stats ----
export function useOverallStats() {
  const { data, error, isLoading } = useSWR(
    "/dashboard/stats/overall",
    apiFetch
  );

  return {
    overall: data,
    loading: isLoading,
    error,
  };
}

// ---- Revenue Chart ----
export function useRevenueChart(range= "7d") {
  const { data, error, isLoading } = useSWR(
    `/dashboard/revenue?range=${range}`,
    apiFetch
  );

  return {
    chart: data,
    loading: isLoading,
    error,
  };
}

// ---- Today Performance ----
export function useTodayPerformance() {
  const { data, error, isLoading } = useSWR(
    "/dashboard/performance/today",
    apiFetch
  );

  return {
    performance: data,
    loading: isLoading,
    error,
  };
}

// ---- Recent Payments ----
export function useRecentPayments(limit = 10) {
  const { data, error, isLoading } = useSWR(
    `/dashboard/payments/recent?limit=${limit}`,
    apiFetch,
    { refreshInterval: 5_000 }
  );

  return {
    payments: data?.payments || [],
    loading: isLoading,
    error,
  };
}

// ---- Gateway Health ----
export function useGatewayHealth() {
  const { data, error, isLoading } = useSWR(
    "/dashboard/health",
    apiFetch,
    { refreshInterval: 15_000 }
  );

  return {
    health: data,
    loading: isLoading,
    error,
  };
}
