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
  }
};
