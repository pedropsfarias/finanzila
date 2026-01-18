import { apiClient } from "../http/api-client.js";

export const despesasRepository = {
  list() {
    return apiClient.request("/despesas");
  },
  create(payload) {
    return apiClient.request("/despesas", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  update(id, payload) {
    return apiClient.request(`/despesas/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  },
  remove(id) {
    return apiClient.request(`/despesas/${id}`, {
      method: "DELETE"
    });
  }
};
