import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calender",
  description: "A clean calendar application.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}