"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function GameDefaultRedirect() {
  const params = useParams();
  const router = useRouter();

  // TO-DO: Implement redirecting to lobby or play dependent on phase
  useEffect(() => {
    router.replace(`/game/${params.code}/lobby`);
  }, [params.code, router]);

  return null;
}
