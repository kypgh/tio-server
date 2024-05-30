import mysql from "mysql";
import { NULLPOINT_PROXY_API_KEY, NULLPOINT_PROXY_HOST } from "../config/envs";
import axios from "axios";

const npProxyAxios = axios.create({
  baseURL: NULLPOINT_PROXY_HOST,
  headers: {
    "x-api-key": NULLPOINT_PROXY_API_KEY,
  },
});

const nullpointService = {
  /**
   *
   * @param {{email:string}} param0
   * @returns {Promise<"client" | "clientId" | "pending" | "not">}
   */
  checkIsClient: async ({ email, entity }) => {
    return npProxyAxios
      .get("/isEmailUser", {
        params: {
          email,
          brand: entity,
        },
      })
      .then((res) => res.data);
  },
};

export default nullpointService;
