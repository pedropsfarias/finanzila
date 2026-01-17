const TOKEN_KEY = "finanzila.token";
const EXPIRES_AT_KEY = "finanzila.token.expiresAt";

export const authStorage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  getExpiresAt() {
    const value = localStorage.getItem(EXPIRES_AT_KEY);
    return value ? Number(value) : 0;
  },
  setAuth({ token, expiresAt }) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
  },
  isTokenValid() {
    const token = this.getToken();
    const expiresAt = this.getExpiresAt();
    const valid = Boolean(token) && expiresAt > Date.now();

    if (!valid) {
      this.clear();
    }

    return valid;
  }
};
