import type { Message } from "@/types/message";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASEURL;

const messageAPI = axios.create({
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

export const sendMessage = async (token: string, message: Message) => {
  return messageAPI.post(`/messages`, message, getAuthConfig(token));
};

export const getMessages = async (token: string, { from, to }: Message) => {
  return messageAPI.get(`/messages`, {
    params: {
      from,
      to,
    },
    ...getAuthConfig(token),
  });
};
