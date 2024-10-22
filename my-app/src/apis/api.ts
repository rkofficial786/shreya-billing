import createApiInstance from "./createApiInstance";

export const baseUrl = "https://backend.rajlaxmitextiles.com";
// "https://badly-evident-guinea.ngrok-free.app";

const api = createApiInstance(baseUrl);

export default api.instance;
