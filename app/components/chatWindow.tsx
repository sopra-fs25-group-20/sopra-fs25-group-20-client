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

  const getColor = (from: string) =>
    from === stompApi.getNickname()
      ? "var(--user-color-1)"
      : "var(--user-color-2)";

  return (
    <div
      className="card-box d-flex flex-column"
      style={{ width: "350px", height: "532px" }}
    >
      <div className="flex-grow-1 overflow-auto mb-3">
        {messages.map((msg, index) => {
          const isYou = msg.nickname === stompApi.getNickname();
          const color = getColor(msg.nickname);
          return (
            <div
              key={index}
              className="d-flex align-items-start"
              style={{ color }}
            >
              <div
                style={{
                  backgroundColor: color,
                  width: "1em",
                  height: "1em",
                  borderRadius: isYou ? "5px" : "50%",
                  marginRight: "10px",
                  flexShrink: 0,
                  marginTop: "0.2em",
                }}
              />
              <div style={{ whiteSpace: "pre-wrap" }}>{msg.message}</div>
            </div>
          );
        })}
      </div>

      <div className="input-group">
        <input
          type="text"
          className="form-control"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type to room chat ..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button className="btn" onClick={sendMessage}>
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};
