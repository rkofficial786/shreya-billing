import api from "../api";
import userApiEndpoints from "./config";

const userApi = {
  async products() {
    console.log("api hiit");

     const result =await api.get(`${userApiEndpoints.products}`);
  console.log(result,"result");
  
     return result
  },
};

export default userApi;
