"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApi } from "@/hooks/useApi";
import { stompApi } from "@/api/stompApi";

export default function GameLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const apiService = useApi();
  const [loading, setLoading] = useState(true);
  const [validated, setValidated] = useState(false);

  const codeFromUrl = params.code as string;

  useEffect(() => {
    const validateGameRoom = async () => {
      try {
        const code = stompApi.getCode();
        const nickname = stompApi.getNickname();

        if (!code || code !== codeFromUrl) {
          router.push("/");
          return;
        }

        await apiService.post("/validate", { nickname, code });
        setValidated(true);
      } catch {
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    validateGameRoom();
  }, [codeFromUrl, router, apiService]);

  if (loading) return <div>Loading...</div>;
  if (!validated) return null;

  return <div className="page-wrapper">{children}</div>;
}
