import store from "../store";
import axios from "axios";

const defaultTimeout = 40000;

const handleRequest = (config) => {
  const state: any = store.getState();
  console.log(state, "state");

  const accessToken = state.auth.token;

  const addToken = config.url !== "/api/admin/login";

  return {
    ...config,
    headers: {
      ...config.headers,
      "ngrok-skip-browser-warning": "true",
      ...(addToken && { Authorization: `Bearer ${accessToken}` }),
    },
  };
};

const createApiInstance = (baseURL, name = "") => {
  const api = axios.create({ baseURL, timeout: defaultTimeout });

  if (!baseURL) {
    throw new Error(
      `${name} baseURL not set during built. Please, set baseURL`
    );
  }

  api.interceptors.request.use(handleRequest);

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return error;
    }
  );

  return {
    instance: api,
  };
};

export default createApiInstance;
