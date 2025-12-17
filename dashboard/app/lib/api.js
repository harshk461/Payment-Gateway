export const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function apiFetch(path, options = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("merchant_token")
      : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "API Error");
  }

  return res.json();
}

export async function apiAdminFetch(path, options = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("admin_token")
      : null;

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "API Error");
  }

  return res.json();
}
