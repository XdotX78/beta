import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MainNavigation from "./components/MainNavigation";
import CookieConsent from "./components/CookieConsent";
import Footer from "./components/layout/Footer";
import "./fonts.css";
import { Providers } from './providers';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gaia Explorer",
  description: "Explore global mysteries, historical events, and news through interactive maps",
  metadataBase: new URL('http://localhost:3000'),
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <MainNavigation />
            <main className="flex-grow relative z-10">{children}</main>
            <Footer />
            <CookieConsent />
          </div>
        </Providers>
      </body>
    </html>
  );
}
