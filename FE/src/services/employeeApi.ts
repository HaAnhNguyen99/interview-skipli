// src/services/apiClient.ts
import type { EmployeeBase } from "@/types/employee";
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

// Get all employees
export const getAllEmployees = (token: string) =>
  employeeAPI.get("/get-all-employees", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Create employee
export const createEmployee = (token: string, employee: EmployeeBase) =>
  employeeAPI.post("/create-employee", employee, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Update employee
export const updateEmployee = (
  token: string,
  employeeId: string,
  employee: EmployeeBase
) =>
  employeeAPI.put(`/employee-update/${employeeId}`, employee, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Delete employee
export const deleteEmployee = (token: string, employeeId: string) =>
  employeeAPI.delete(`/employee-delete/${employeeId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
export default employeeAPI;
