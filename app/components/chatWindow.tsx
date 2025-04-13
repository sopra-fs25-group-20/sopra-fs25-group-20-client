"use client";
import { useEffect, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/types/chatMessage";
import { stompApi } from "@/api/stompApi";

export const ChatWindow = () => {
  const ws = useChat();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const handleMessage = (data: ChatMessage) => {
      setMessages((prev) => [
        ...prev,
        { nickname: data.nickname, message: data.message, color: data.color },
      ]);
    };

    ws.onMessage(handleMessage);
    return () => {
      ws.removeMessageHandler(handleMessage);
    };
  }, [ws]);

  const sendMessage = () => {
    if (!input.trim()) return;
    ws.send(input.trim());
    setInput("");
  };

  // Submit when user presses enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Get the shape of the icon in front of a message
  const getMessageIconShape = (from: string): string => {
    return from === stompApi.getNickname() ? "you" : "else";
  };

  return (
    <div className="frame chat">
      <div className="box overflow-auto">
        {messages.map((msg, index) => {
          return (
            <div key={index} className="message" style={{ color: msg.color }}>
              <div
                className={getMessageIconShape(msg.nickname)}
                style={{ background: msg.color }}
              ></div>
              <div>{msg.message}</div>
            </div>
          );
        })}
      </div>
      <div className="bar">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type to chat ..."
          className="input"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="symbol"
          viewBox="0 0 16 22"
          onClick={sendMessage}
        >
          <path d="M16 11L3.57352e-08 21.5L4.26667 11L9.53674e-07 0.499999L16 11Z" />
        </svg>
      </div>
    </div>
  );
};
