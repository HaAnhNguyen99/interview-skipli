// src/services/apiClient.ts
import axios from "axios";

const employeeAPI = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
  headers: {
    "Content-Type": "application/json",
  },
});
console.log("Employee API Base URL:", import.meta.env.VITE_BASEURL);
console.log(import.meta.env.VITE_SOME_KEY); // "123"

export default employeeAPI;
