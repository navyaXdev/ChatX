
export async function deriveKey(passphrase, conversationId) {
  const encoder = new TextEncoder();

  const passphraseBytes = encoder.encode(passphrase);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passphraseBytes,
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(conversationId), 
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );

  return key;
}


// Encrypt a plaintext message using the derived AES-GCM key.
export async function encryptMessage(message, key) {
  const encoder = new TextEncoder();

  // Convert the message into bytes.
  const messageBytes = encoder.encode(message);

  // Generate a new random IV for this message.
  // AES-GCM requires a unique IV every time.
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Encrypt the message.
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    messageBytes
  );

  // Convert ciphertext to Base64 so it can be sent as JSON.
  const ciphertext = btoa(
    String.fromCharCode(...new Uint8Array(encryptedBuffer))
  );

  // Convert IV to Base64 too.
  const ivBase64 = btoa(
    String.fromCharCode(...iv)
  );

  return {
    ciphertext,
    iv: ivBase64,
  };
}