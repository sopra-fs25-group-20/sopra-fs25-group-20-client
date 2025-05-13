"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createAuthPage } from "@/components/createAuthPage";
import Link from "next/link";

function Login() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      router.replace("/profile");
    }
  }, []);

  return createAuthPage({
    title: "Login",
    buttonLabel: "Login",
    submitEndpoint: "/login",
    successRedirect: "/profile",
    errorMessages: {
      401: "Invalid username or password.",
      400: "Invalid input. Please check your form.",
    },
    footer: (
      <>
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-gray-500 hover:underline cursor-pointer">
          Register
        </Link>
      </>
    ),
  })();
}

export default Login;
