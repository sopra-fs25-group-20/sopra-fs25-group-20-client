"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ErrorBarProvider } from "@/context/ErrorBarContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function ClientLayout(
  { children }: { children: React.ReactNode },
) {
  return (
    <ThemeProvider>
      <ErrorBarProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ErrorBarProvider>
    </ThemeProvider>
  );
}
