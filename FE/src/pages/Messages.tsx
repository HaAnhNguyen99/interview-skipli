import { getMessages, sendMessage } from "@/services/messageService";
import { Input } from "../components/commons/ui/input";
import { Button } from "../components/commons/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useUser } from "@/context/UserContext";
import type { Socket } from "socket.io-client";
import { useChat } from "@/context/ChatConText";

type Message = {
  from: string;
  to: string;
  content: string;
};
const API_URL = "http://localhost:4000";
const socket = io(API_URL);

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { selectedEmployee } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  const fromID =
    user?.role === "manager" ? user?.phoneNumber : user?.employeeId;
  const toID = user?.role === "manager" ? selectedEmployee?.id : "84968127409";

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const input = inputRef.current?.value;
    if (!input || !fromID || !toID) return;

    try {
      await sendMessage({ from: fromID, to: toID, content: input });
      socketRef.current?.emit("send_message", {
        from: fromID,
        to: toID,
        content: inputRef.current?.value,
      });
      // setMessages((prev) => [
      //   ...prev,
      //   { from: fromID, to: toID, content: input },
      // ]);
    } catch (error) {
      console.error(error);
      alert("Failed to send message");
    } finally {
      inputRef.current!.value = "";
    }
  };
  const fetchMessages = useCallback(async () => {
    if (!fromID || !toID) return;
    try {
      const res = await getMessages({ from: fromID, to: toID });
      setMessages(res.data?.messages ?? []);
    } catch (err) {
      console.error(err);
    }
  }, [fromID, toID]);

  useEffect(() => {
    if (!socket) return;

    fetchMessages();

    const handleReceiveMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("connect", () => {
      if (fromID) socket.emit("join", fromID);
    });

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message");
    };
  }, [fetchMessages]);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [messages]);

  console.log(messages);

  if (!selectedEmployee)
    return (
      <div className="flex flex-col gap-2">
        <h1>Select an employee to start chatting</h1>
      </div>
    );
  return (
    <div className="flex flex-col gap-2" ref={scrollRef}>
      <div className="mt-4">
        {messages.map((msg, id) => (
          <div key={id}>
            <strong>{msg.from === fromID ? "You" : "Them"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          type="text"
          ref={inputRef}
          placeholder="Type your message"
          disabled={!selectedEmployee}
        />
        <Button type="submit" disabled={!selectedEmployee}>
          Send
        </Button>
      </form>
    </div>
  );
};

export default Messages;
