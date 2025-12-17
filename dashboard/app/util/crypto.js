export async function importAesKey(base64Key) {
  const raw = Uint8Array.from(atob(base64Key), (c) => c.charCodeAt(0));
  return await crypto.subtle.importKey("raw", raw, "AES-GCM", false, ["decrypt"]);
}

export async function decryptAES(ciphertextBase64, key, ivBase64) {
  const cipher = Uint8Array.from(atob(ciphertextBase64), (c) => c.charCodeAt(0));
  const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));

  const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, cipher);
  return new TextDecoder().decode(decrypted);
}
