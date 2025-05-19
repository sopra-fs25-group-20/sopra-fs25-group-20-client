"use client";
import { useEffect, useState } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "@/types/chatMessage";
import { stompApi } from "@/api/stompApi";
import { Frame } from "./frame";
import { OverflowContainer } from "./overflowContainer";
import { HorizontalFlex } from "./horizontalFlex";
import { usePlayersStore } from "@/hooks/usePlayersStore";

export const Chat = () => {
  const ws = useChat();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredPlayers, setFilteredPlayers] = useState<string[]>([]);
  const [cursor, setCursor] = useState(0);
  const { players } = usePlayersStore();
  const myNickname = stompApi.getNickname();

  useEffect(() => {
    console.log("players:", players);
  }, [players]);

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
    setShowDropdown(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showDropdown) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((prev) => (prev + 1) % filteredPlayers.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((prev) => (prev - 1 + filteredPlayers.length) % filteredPlayers.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const atIndex = input.lastIndexOf("@");
        if (atIndex !== -1 && filteredPlayers[cursor]) {
          const selected = filteredPlayers[cursor];
          const newText = input.slice(0, atIndex + 1) + selected + " ";
          setInput(newText);
          setShowDropdown(false);
        } else {
          sendMessage();
        }
      }
    } else if (e.key === "Enter") {
      sendMessage();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    const atIndex = value.lastIndexOf("@");
    if (atIndex !== -1) {
      const query = value.slice(atIndex + 1).toLowerCase();
      const matching = players
        .map((p) => p.nickname)
        .filter(
          (name) =>
            name.toLowerCase().startsWith(query) &&
            name !== myNickname
        );
      setFilteredPlayers(matching);
      setCursor(0);
      setShowDropdown(matching.length > 0);
    } else {
      setShowDropdown(false);
    }
  };

  const getMessageIconShape = (from: string): string => {
    return from === stompApi.getNickname() ? "you" : "other";
  };

  return (
    <Frame className="chat">
      <OverflowContainer>
        {messages.map((msg, index) => (
          <div key={index} className="message" style={{ color: msg.color }}>
            <div
              className={getMessageIconShape(msg.nickname)}
              style={{ background: msg.color }}
            />
            <div>{msg.message}</div>
          </div>
        ))}
      </OverflowContainer>
      <HorizontalFlex>
        <div style={{ position: "relative", width: "100%" }}>
          <input
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type to chat ..."
            className="chat-input"
          />
          {showDropdown && (
            <div className="mention-dropdown">
              {filteredPlayers.map((nickname, i) => (
                <div
                  key={nickname}
                  className={`mention-item ${i === cursor ? "active" : ""}`}
                  onMouseDown={() => {
                    const atIndex = input.lastIndexOf("@");
                    const newText = input.slice(0, atIndex + 1) + nickname + " ";
                    setInput(newText);
                    setShowDropdown(false);
                  }}
                >
                  @{nickname}
                </div>
              ))}
            </div>
          )}
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="chat-send-button"
          viewBox="0 0 16 22"
          onClick={sendMessage}
        >
          <path d="M16 11L3.57352e-08 21.5L4.26667 11L9.53674e-07 0.499999L16 11Z" />
        </svg>
      </HorizontalFlex>
    </Frame>
  );
};
