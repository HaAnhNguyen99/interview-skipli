import type { Task, TaskStatus } from "@/types/task";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASEURL;

const taskAPI = axios.create({
  baseURL: baseURL,
});

const getAuthConfig = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const createTask = (token: string, task: Task) =>
  taskAPI.post("/create-task", task, getAuthConfig(token));

export const getTasks = (token: string) =>
  taskAPI.get("/get-tasks", getAuthConfig(token));

export const getTask = (token: string, taskId: string) =>
  taskAPI.get(`/get-task/${taskId}`, getAuthConfig(token));

export const deleteTask = (token: string, taskId: string) =>
  taskAPI.delete(`/delete-task/${taskId}`, getAuthConfig(token));

export const updateTask = (token: string, taskId: string, task: Task) =>
  taskAPI.put(`/update-task/${taskId}`, task, getAuthConfig(token));

//* Employee dashboard
export const getEmployeeTasks = (token: string, employeeId: string) =>
  taskAPI.get(`/task-dashboard/${employeeId}`, getAuthConfig(token));

export const updateEmployeeTask = (
  token: string,
  taskId: string,
  status: TaskStatus
) => taskAPI.put(`/task-dashboard/${taskId}`, { status }, getAuthConfig(token));
