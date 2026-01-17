import { authStorage } from "./auth-storage.js";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const authService = {
  async login({ email, senha }) {
    const credentials = btoa(`${email}:${senha}`);
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`
      }
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(body?.message ?? "Falha ao autenticar.");
      error.status = response.status;
      throw error;
    }

    const expiresAt = body.expiresAt ?? Date.now() + 60 * 60 * 1000;
    authStorage.setAuth({ token: body.token, expiresAt });

    return body;
  },
  logout() {
    authStorage.clear();
  }
};
