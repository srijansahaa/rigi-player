import { Open_Sans } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import { CustomProvider } from "@/app/customProvider";

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Rigi Player - You own video player",
  description: "I hope you like it",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${openSans.className} dark:bg-slate-800`}>
        <header className="px-4 lg:px-32 py-4 lg:py-8 shadow-lg mb-8 sticky top-0 bg-white dark:bg-slate-800 z-50">
          <div className="flex gap-2">
            <Image
              src="https://app.rigi.club/wp-content/themes/Rigi/assets/img/logo.svg"
              width={87}
              height={24}
              alt="rigi"
              className="border-e-2 pe-2"
            />
            <span className="text-violet-900 dark:text-white font-semibold">Player</span>
          </div>
        </header>
        <CustomProvider>{children}</CustomProvider>
      </body>
    </html>
  );
}
