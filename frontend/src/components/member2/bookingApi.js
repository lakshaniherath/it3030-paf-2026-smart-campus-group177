import axios from "axios";

const bookingApi = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export default bookingApi;
