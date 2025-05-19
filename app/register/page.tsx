"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createAuthPage } from "@/components/createAuthPage";
import Link from "next/link";

function Register() {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;
    if (token) {
      router.replace("/profile");
    }
  }, []);

  return createAuthPage({
    title: "Register",
    buttonLabel: "Register",
    submitEndpoint: "/register",
    successRedirect: "/profile",
    errorMessages: {
      409: "Username already exists.",
      400: "Invalid input. Please check your form.",
    },
    footer: (
      <>
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-gray-500 hover:underline cursor-pointer"
        >
          Login
        </Link>
      </>
    ),
  })();
}

export default Register;
