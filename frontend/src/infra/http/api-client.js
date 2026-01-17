import { authStorage } from "./auth-storage.js";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const parseBody = async (response) => {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
};

export const apiClient = {
  async request(path, options = {}) {
    const headers = new Headers(options.headers ?? {});

    if (!headers.has("Content-Type") && options.body) {
      headers.set("Content-Type", "application/json");
    }

    const token = authStorage.getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers
    });

    if (response.status === 204) {
      return null;
    }

    const body = await parseBody(response);

    if (!response.ok) {
      const error = new Error(body?.message ?? "Erro ao processar a requisicao.");
      error.status = response.status;
      error.payload = body;
      throw error;
    }

    return body;
  }
};
