"use client";

import { Button } from "@/components/Button";
import { Frame } from "@/components/frame";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  return (
    <div className="page-wrapper">
      <div className="landing-page">
        <Frame>
          <div>404 — Venturing uncharted territory.</div>
          <Button onClick={goHome}>Take me back</Button>
        </Frame>
      </div>
    </div>
  );
}
