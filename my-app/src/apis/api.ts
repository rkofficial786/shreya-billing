import createApiInstance from "./createApiInstance";

export const baseUrl = "http://localhost:5000";
// export const baseUrl = "https://backend.shreyacollection.in";
// export const baseUrl = "https://j34xcg09-5000.inc1.devtunnels.ms/";
// "https://badly-evident-guinea.ngrok-free.app";

const api = createApiInstance(baseUrl);

export default api.instance;
