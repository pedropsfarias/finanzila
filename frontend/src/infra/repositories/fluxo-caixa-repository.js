import { apiClient } from "../http/api-client.js";

export const fluxoCaixaRepository = {
  list() {
    return apiClient.request("/fluxo-caixa");
  },
  create(payload) {
    return apiClient.request("/fluxo-caixa", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  importFromXlsx(payload) {
    return apiClient.request("/fluxo-caixa/import", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }
};
