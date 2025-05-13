"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyProfilePage() {
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      router.push(`/profile/${username}`);
    } else {
      router.push("/404");
    }
  }, [router]);

  return <div>Redirecting...</div>;
}
