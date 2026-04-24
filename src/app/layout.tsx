import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MeetingProvider } from "@/context/MeetingContext";
import ReduxProvider from "@/redux/ReduxProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MoM Transcriber",
  description: "Real-time Meeting Minutes Transcriber using AssemblyAI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={inter.className}>
        <ReduxProvider>
          <MeetingProvider>
            {children}
          </MeetingProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
