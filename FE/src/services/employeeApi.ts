// src/services/apiClient.ts
import axios from "axios";

const employeeAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
console.log("Employee API Base URL:", import.meta.env.VITE_API_URL);

export default employeeAPI;
