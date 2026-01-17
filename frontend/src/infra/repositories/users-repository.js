import { apiClient } from "../http/api-client.js";

export const usersRepository = {
  list() {
    return apiClient.request("/users");
  },
  create(payload) {
    return apiClient.request("/users", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }
};
