import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

axiosInstance.interceptors.request.use(async (config) => {
  return config;
});

axiosInstance.interceptors.response.use(
  async (response) => {
    return response.data;
  },
  async (error) => {
    console.log("error", error);

    return error;
  }
);

export default axiosInstance;
