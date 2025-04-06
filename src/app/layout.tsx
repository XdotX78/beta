import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MainNavigation from "./components/MainNavigation";
import { loadFonts } from "./lib/fontLoader";
import "./fonts.css";

// Load fonts for the application
loadFonts();

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
        {/* Add Google Fonts preconnect links to the head section */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <MainNavigation />
          <main className="flex-grow relative z-10">{children}</main>
          <footer className="bg-gray-800 text-white py-8 relative z-10">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-xl font-bold mb-4">Gaia Explorer</h2>
                  <p className="text-gray-300 max-w-md">
                    Uncovering mysteries, exploring history, and visualizing global events through interactive maps.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                  <ul className="space-y-2">
                    <li><a href="/" className="text-blue-300 hover:text-white transition-colors">Home</a></li>
                    <li><a href="/maps" className="text-blue-300 hover:text-white transition-colors">Maps</a></li>
                    <li><a href="/maps/mysteries" className="text-blue-300 hover:text-white transition-colors">Mysteries</a></li>
                    <li><a href="/maps/history" className="text-blue-300 hover:text-white transition-colors">History</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                <p>© {new Date().getFullYear()} Gaia Explorer. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
