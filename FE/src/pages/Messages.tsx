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
const SOCKETID = "http://localhost:4000";
const MANAGER_PHONE = import.meta.env.VITE_MANAGER_PHONE;

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { selectedEmployee } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  const socket = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const fromID =
    user?.role === "manager" ? user?.phoneNumber : user?.employeeId;
  const toID = user?.role === "manager" ? selectedEmployee?.id : MANAGER_PHONE;

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const input = inputRef.current?.value;
    if (!input || !fromID || !toID) return;

    try {
      socket.current?.emit("send_message", {
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
    socket.current = io(SOCKETID);

    const handleReceiveMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.current?.on("connect", () => {
      if (fromID) socket.current?.emit("join", fromID);
    });

    socket.current?.on("receive_message", handleReceiveMessage);

    fetchMessages();

    return () => {
      if (socket.current) {
        console.log("Disconnecting socket");
        socket.current?.off("receive_message");
        socket.current?.disconnect();
      }
    };
  }, [fetchMessages, fromID]);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [messages]);

  console.log(messages);

  if (!selectedEmployee && user?.role === "manager") return <></>;
  return (
    <div className="flex flex-col gap-2" ref={scrollRef}>
      <div className="mt-4">
        {messages.map((msg, id) => (
          <div key={id}>
            <strong>{msg.from === fromID ? "You" : "Manager"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input type="text" ref={inputRef} placeholder="Type your message" />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
};

export default Messages;
