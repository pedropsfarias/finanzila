import { apiClient } from "../http/api-client.js";

export const carteirasRepository = {
  list() {
    return apiClient.request("/carteiras");
  },
  create(payload) {
    return apiClient.request("/carteiras", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },
  update(id, payload) {
    return apiClient.request(`/carteiras/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
  },
  remove(id) {
    return apiClient.request(`/carteiras/${id}`, {
      method: "DELETE"
    });
  }
};
