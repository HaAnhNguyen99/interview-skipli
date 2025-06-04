// src/services/apiClient.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_BASEURL;

const employeeAPI = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setupEmployee = (
  token: string,
  employeeId: string,
  username: string,
  password: string
) =>
  employeeAPI.post("/setup-employee", {
    token,
    employeeId,
    username,
    password,
  });

export const loginEmployee = (username: string, password: string) =>
  employeeAPI.post("/login-employee", {
    username,
    password,
  });

export default employeeAPI;
