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

export const sendMessage = async ({
  from,
  to,
  content,
}: {
  from: string;
  to: string;
  content: string;
}) => {
  return messageAPI.post(`/messages`, {
    from,
    to,
    content,
  });
};

export const getMessages = async ({
  from,
  to,
}: {
  from: string;
  to: string;
}) => {
  return messageAPI.get(`/messages`, {
    params: {
      from,
      to,
    },
  });
};
