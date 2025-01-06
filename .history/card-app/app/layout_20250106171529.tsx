import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cat Memory Challenge",
  description: "A cute memory card game with cats",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${sora.className} bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
