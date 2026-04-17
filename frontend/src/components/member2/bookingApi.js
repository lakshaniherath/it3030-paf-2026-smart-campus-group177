import axios from "axios";

const bookingApi = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

// Attach stored auth token and user email on every request
bookingApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  if (user.email) config.headers["X-User-Email"] = user.email;
  return config;
});

export default bookingApi;
