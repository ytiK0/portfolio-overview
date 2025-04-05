import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.scss";

const geistSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Портфель",
  description: "Портфель пользователя",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
