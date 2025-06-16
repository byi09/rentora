import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GeolocationProvider } from "../contexts/GeolocationContext";
import { ToastProvider } from "../components/ui/Toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Livaro - Student Renting Made Social",
  description:
    "Find your perfect student housing with Livaro. Connect with fellow students and find your ideal living space."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <GeolocationProvider>
            {children}
          </GeolocationProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
