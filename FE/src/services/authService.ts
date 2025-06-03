// src/services/authService.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const sendAccessCode = (phoneNumber: string) =>
  axios.post(baseURL + "create-new-access-code", { phoneNumber });

export const verifyAccessCode = (phoneNumber: string, accessCode: string) =>
  axios.post(baseURL + "validate-access-code", { phoneNumber, accessCode });
