import axios from "axios";
import storageService from "../services/StorageService";
import swalService from "../services/SwalService";
import authService from "../services/AuthService";
import { noAuthList } from "./noAuthList";

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Interceptors
// Add a request interceptor
axiosClient.interceptors.request.use(
    function (config) {
        if (config.data instanceof FormData) {
            config.headers["Content-Type"] = "multipart/form-data";
        } else {
            config.headers["Content-Type"] = "application/json";
        }

        if (!noAuthList.includes(config.url)) {
            config.headers["Authorization"] = `Basic ${import.meta.env.VITE_AUTHEN_TOKEN}`;
        }

        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        /// Logout if the token has expired
        if (error.response && error.response.status === 401) {
            if (authService.isLogin()) {
                storageService.clear();
                swalService.showMessageToHandle(
                    "Session Expired",
                    "Your session has expired. Please login again.",
                    "error",
                    () => authService.logout()
                );
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
