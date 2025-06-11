import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientWrapper from "@/src/components/ClientWrapper";
import { GeolocationProvider } from "../contexts/GeolocationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rentora - Student Renting Made Social",
  description:
    "Find your perfect student housing with Rentora. Connect with fellow students and find your ideal living space."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GeolocationProvider>
          <ClientWrapper>{children}</ClientWrapper>
        </GeolocationProvider>
      </body>
    </html>
  );
}
