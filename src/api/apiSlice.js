import axios from "axios";

export const useAxios = () => {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/",
    headers: { "Content-Type": "application/json" },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      if (localStorage.getItem("token")) {
        config.headers.Authorization = `Bearer ${localStorage.getItem(
          "token"
        )}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosInstance;
};
