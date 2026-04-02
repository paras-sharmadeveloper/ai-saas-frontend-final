import axios from "axios";
const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const Axios = axios.create({
  baseURL: isLocal
    ? "http://localhost:8000/api"
    : "https://api.hyperiontech.com.au/api", // Backend API
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

Axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ❌ Handle Global Errors
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - redirect to login");
      // optional: redirect user
    }

    return Promise.reject(error);
  },
);

export default Axios;
