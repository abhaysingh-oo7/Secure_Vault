// utils/cryptoUtils.js

// Convert string to ArrayBuffer
export async function str2ab(str) {
    return new TextEncoder().encode(str);
}

// Generate a random salt
export function generateSalt(length = 16) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array); // convert to regular array for storage
}

// Derive AES-GCM key from password and salt
export async function deriveKey(password, salt) {
    const enc = new TextEncoder();

    // Import raw password as key material
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    // Derive a key using PBKDF2
    const key = await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: new Uint8Array(salt), // use provided salt
            iterations: 100000,
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    return key;
}

// Encrypt data using AES-GCM
export async function encryptData(key, data) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const ciphertext = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        enc.encode(data)
    );

    return {
        iv: Array.from(iv), // convert to array for JSON storage
        ciphertext: Array.from(new Uint8Array(ciphertext)),
    };
}

// Decrypt data using AES-GCM
export async function decryptData(key, ivArr, cipherArr) {
    const iv = new Uint8Array(ivArr);
    const ciphertext = new Uint8Array(cipherArr);

    const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        ciphertext
    );

    return new TextDecoder().decode(decrypted);
}
