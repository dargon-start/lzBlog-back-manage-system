import localCache from "@/utils/cache";
import LzRequest from "./request/index";
let lzRequest = new LzRequest({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 5000,
  interceptors: {
    requestInterceptor: (config) => {
      //携带token
      const userInfo = localCache.getCache("end_userInfo");
      if (userInfo) {
        if (config.headers) {
          config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
      }

      return config;
    },
  },
});

export default lzRequest;
