"use client";

import useSWR from "swr";
import { decryptAES, importAesKey } from "../util/crypto";
import { apiFetch } from "../lib/api";

const AES_KEY = "OIZ0l9yF2p+1AJsbpiN0SYfVt0l7zmUsRjyo0YXJ8Rw=";

export function useApiKeys() {
  const { data, error, isLoading, mutate } = useSWR(
    "/settings/api-keys",
    async () => {
      const res = await apiFetch("/merchants/api-keys");

      const { publicKey:encryptedPublicKey, secretKey:encryptedSecretKey, iv } = res;

      const aesKey = await importAesKey(AES_KEY);

      const publicKey = await decryptAES(encryptedPublicKey, aesKey, iv);
      const secretKey = await decryptAES(encryptedSecretKey, aesKey, iv);

      return {
        publicKey,
        secretKey,
        secretKeyMasked: secretKey.slice(0, 6) + "•".repeat(20),
      };
    }
  );

  return {
    keys: data,
    loading: isLoading,
    error,
    refresh: () => mutate(),
  };
}

export async function regenerateSecretKey() {
  return await apiFetch("/merchants/regenerate", {
    method: "POST",
  });
}
