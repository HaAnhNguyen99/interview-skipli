import axios from "axios";

const baseURL = import.meta.env.VITE_BASEURL;

export const sendAccessCode = (phoneNumber: string) =>
  axios.post(baseURL + "create-new-access-code", { phoneNumber });

export const verifyAccessCode = (phoneNumber: string, accessCode: string) =>
  axios.post(baseURL + "validate-access-code", { phoneNumber, accessCode });

export const resendAccessCode = (phoneNumber: string) =>
  axios.post(baseURL + "resend-access-code", { phoneNumber });
