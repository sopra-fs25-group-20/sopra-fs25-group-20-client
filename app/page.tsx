"use client";
import { ChatWindow } from "@/components/chatWindow";
// import { useRouter } from "next/navigation";

export default function Home() {
  // const router = useRouter();
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <ChatWindow />
    </div>
  );
}
