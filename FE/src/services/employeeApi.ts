import type { EmployeeBase } from "@/types/employee";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASEURL;

const employeeAPI = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthConfig = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
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

// Get all employees
export const getAllEmployees = (token: string) =>
  employeeAPI.get("/messages/employees", getAuthConfig(token));

// Create employee
export const createEmployee = (token: string, employee: EmployeeBase) =>
  employeeAPI.post("/create-employee", employee, getAuthConfig(token));

// Update employee
export const updateEmployee = (
  token: string,
  employeeId: string,
  employee: EmployeeBase
) =>
  employeeAPI.put(
    `/employee-update/${employeeId}`,
    employee,
    getAuthConfig(token)
  );

// Delete employee
export const deleteEmployee = (token: string, employeeId: string) =>
  employeeAPI.delete(`/employee-delete/${employeeId}`, getAuthConfig(token));

// Update employee profile
export const updateEmployeeProfile = (
  token: string,
  employeeId: string,
  employee: EmployeeBase
) =>
  employeeAPI.put(
    `/employee-update/${employeeId}`,
    employee,
    getAuthConfig(token)
  );

// Upload image
export const uploadImage = (token: string, payload: FormData) =>
  employeeAPI.post("/upload-image", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

// Update manager avatar
export const updateManagerAvatar = (token: string, payload: FormData) =>
  employeeAPI.post("/update-manager-avatar", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

export default employeeAPI;
