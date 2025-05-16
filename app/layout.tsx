import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@/styles/style.css";
import "@/styles/layout.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ErrorBarProvider } from "./context/ErrorBarContext";

export const metadata: Metadata = {
  title: "SpyQuest",
  description: "sopra-fs25-template-client",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ErrorBarProvider>
            {children}
          </ErrorBarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
