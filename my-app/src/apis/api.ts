import createApiInstance from "./createApiInstance";

export const baseUrl = "http://localhost:5000";
// "https://badly-evident-guinea.ngrok-free.app";

const api = createApiInstance(baseUrl);

export default api.instance;
