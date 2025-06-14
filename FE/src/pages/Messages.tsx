import { getMessages } from "@/services/messageService";
import { Input } from "../components/commons/ui/input";
import { Button } from "../components/commons/ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useUser } from "@/context/UserContext";
import type { Socket } from "socket.io-client";
import { useChat } from "@/context/ChatConText";
import avt from "@/assets/avt.png";
import { formatTimestamp } from "@/lib/utils";

type Message = {
  from: string;
  to: string;
  content: string;
  timestamp: number;
};
const SOCKETID = "http://localhost:4000";
const MANAGER_PHONE = import.meta.env.VITE_MANAGER_PHONE;

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { selectedEmployee } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);
  const socket = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user, token } = useUser();
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
      const res = await getMessages(token, { from: fromID, to: toID });
      setMessages(res.data?.messages ?? []);
    } catch (err) {
      console.error(err);
    }
  }, [fromID, toID, token]);

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
        socket.current?.off("connect");
        socket.current?.off("receive_message");
        socket.current?.disconnect();
      }
    };
  }, [fetchMessages, fromID]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!selectedEmployee && user?.role === "manager") return <></>;
  return (
    <div className="flex flex-col gap-2 relative  h-[calc(100vh-150px)]">
      <div className="mt-4 flex-1 overflow-y-scroll" ref={scrollRef}>
        {messages.map((msg, id) => {
          const isOwnMessage = msg.from === fromID;

          return (
            <div
              key={id}
              className={`flex gap-2 items-center mb-5 ${
                isOwnMessage ? "justify-end text-right" : "justify-start"
              }`}>
              <div
                className={`flex gap-4 items-center ${
                  isOwnMessage ? "flex-row-reverse" : "flex-row"
                }`}>
                <strong>
                  {isOwnMessage ? (
                    <div className={`flex items-center  flex-col`}>
                      <div className="w-10 h-10 rounded-full bg-gray-200">
                        <img
                          src={user?.avatarUrl || avt}
                          alt="avatar"
                          className="w-full h-full rounded-full"
                        />
                      </div>
                      <span className="text-sm text-gray-400 font-medium">
                        You
                      </span>
                    </div>
                  ) : user?.role !== "manager" ? (
                    "Manager"
                  ) : (
                    <div className="flex flex-col">
                      <div className="w-10 h-10 rounded-full bg-gray-200">
                        <img
                          src={selectedEmployee?.avatarUrl || avt}
                          alt="avatar"
                          className="w-full h-full rounded-full"
                        />
                      </div>
                      <span>{selectedEmployee?.name}</span>
                    </div>
                  )}
                </strong>

                <div
                  className={`p-2 relative rounded-md ${
                    isOwnMessage ? "bg-blue-200" : "bg-gray-200"
                  }`}>
                  <div
                    className={`absolute top-2 ${
                      isOwnMessage ? "right-[-7px]" : "left-[-7px]"
                    } w-0 h-0 border-t-[10px] border-b-[10px] border-l-[10px] border-transparent rotate-180`}
                    style={{
                      borderLeftColor: isOwnMessage ? "#bfdbfe" : "#e5e7eb",
                      transform: isOwnMessage ? "rotate(180deg)" : "none",
                    }}></div>
                  <div>
                    {msg.content}
                    <p className="text-xs text-gray-400 font-medium">
                      {formatTimestamp(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2 p-4">
        <Input type="text" ref={inputRef} placeholder="Type your message" />
        <Button
          type="submit"
          className="active:scale-90 transition-all ease-in-out duration-300 hover:bg-blue-500 hover:text-white">
          Send
        </Button>
      </form>
    </div>
  );
};

export default Messages;
