import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
    baseURL: process.env.REACT_APP_APIURL,
    withCredentials: true,
    timeout: 20000,
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.msg ||
      error?.response?.data?.error ||
      (error?.request && "Server not responding") ||
      error?.message ||
      "Something went wrong";

    error.customMessage = message;

    // GLOBAL ERROR TOAST
    if (!error.config?.skipErrorToast) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;