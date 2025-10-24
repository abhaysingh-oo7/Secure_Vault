// const API_BASE = 'https://secure-vault-qbam.onrender.com/api/auth'; // local backend
const API_BASE = import.meta.env.VITE_API_URL;

export async function login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    return res.json();
}

export async function register(email, password, kdfSalt) {
    const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, kdfSalt }),
    });
    return res.json();
}
