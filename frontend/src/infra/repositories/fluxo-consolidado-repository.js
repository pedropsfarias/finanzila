import { apiClient } from "../http/api-client.js";

export const fluxoConsolidadoRepository = {
  list(params = {}) {
    const query = new URLSearchParams();
    if (params.mesReferencia) {
      query.set("mesReferencia", params.mesReferencia);
    }
    const suffix = query.toString();
    return apiClient.request(`/fluxo-consolidado${suffix ? `?${suffix}` : ""}`);
  },
  create(payload) {
    return apiClient.request("/fluxo-consolidado", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  update(id, payload) {
    return apiClient.request(`/fluxo-consolidado/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  },
  remove(id) {
    return apiClient.request(`/fluxo-consolidado/${id}`, {
      method: "DELETE"
    });
  },
  generate(payload) {
    return apiClient.request("/fluxo-consolidado/generate", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }
};
