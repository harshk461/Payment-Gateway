"use client";

import useSWR from "swr";
import { apiAdminFetch } from "../lib/api";

export function useAdminMerchants({ page = 1, size = 10, status = "all", search = "" }) {
  const query = `/admin/merchants?page=${page}&size=${size}&status=${status}&search=${search}`;

  const { data, error, isLoading, mutate } = useSWR(query, apiAdminFetch, {
    revalidateOnFocus: false,
  });

  return {
    merchants: data?.merchants || [],
    total: data?.total || 0,
    loading: isLoading,
    error,
    refresh: mutate,
  };
}

const BASE = "/admin/merchants"

/* -------------------------- Fetch Merchant Details ------------------------- */
export async function fetchMerchantById(id) {
  return apiAdminFetch(`${BASE}/${id}`);
}

/* --------------------------- SWR Hook (optional) --------------------------- */
export function useMerchantDetails(id) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `${BASE}/${id}` : null,
    apiAdminFetch,
    { refreshInterval: 15_000 } // auto-refresh every 15s
  );

  return {
    merchant: data,
    loading: isLoading,
    error,
    refresh: mutate,
  };
}

/* ----------------------------- Suspend merchant ---------------------------- */
export async function suspendMerchant(id) {
  return apiAdminFetch(`${BASE}/${id}/suspend`, {
    method: "POST",
  });
}

/* ----------------------------- Activate merchant --------------------------- */
export async function activateMerchant(id) {
  return apiAdminFetch(`${BASE}/${id}/activate`, {
    method: "POST",
  });
}

/* --------------------------- Regenerate API Keys --------------------------- */
export async function regenerateMerchantKeys(id) {
  return apiAdminFetch(`${BASE}/${id}/regenerate`, {
    method: "POST",
  });
}

/* ------------------------------ Reset Webhook ------------------------------ */
export async function resetWebhookUrl(
  id,
  webhookUrl
) {
  return apiAdminFetch(`${BASE}/${id}/webhook`, {
    method: "PUT",
    body: JSON.stringify({ webhookUrl }),
  });
}

/* --------------------------- Shadow Mode Token ----------------------------- */
export async function generateShadowModeToken(id) {
  const result = await apiAdminFetch(`${BASE}/${id}/shadow`, {
    method: "POST",
  });

  return result.token;
}
