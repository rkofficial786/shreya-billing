import api from "../api";
import authApiEndpoint from "./config";

const authApi = {
  async login(payload) {
    return await api.post(`${authApiEndpoint.login}`, payload);
  },
  async register(payload) {
    return await api.post(`${authApiEndpoint.register}`, payload);
  },
  async checkAccount(email) {
    const result = await api.get(`${authApiEndpoint.checkAccount}/${email}`);
    return result;
  },

  async getCountries() {
    return await api.get(`${authApiEndpoint.getCountries}`);
  },

  async logoutUser() {
    return await api.get(`${authApiEndpoint.logout}`);
  },

  async verifyCertificate(payload) {
    return await api.post(`${authApiEndpoint.verifyCertificate}`, payload);
  },

  async verifyByOwner(param) {
    return await api.get(
      `${authApiEndpoint.verifyByOwner}/${param.previous_email}`
    );
  },
};

export default authApi;
