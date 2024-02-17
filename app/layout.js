"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { Provider } from "react-redux";
import { store } from "@/feature/store";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        <body>
          <header className="px-4 lg:px-32 py-4 lg:py-8 shadow-lg mb-8 sticky top-0 bg-white z-50">
            <div className="flex gap-2">
              <Image
                src="https://app.rigi.club/wp-content/themes/Rigi/assets/img/logo.svg"
                width={87}
                height={24}
                alt="rigi"
                className="border-e-2 pe-2"
              />
              <span className="text-violet-900 font-semibold">Player</span>
            </div>
          </header>
          <Provider store={store}>
          {children}
          </Provider>
        </body>
    </html>
  );
}
