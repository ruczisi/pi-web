import type { Metadata } from "next";
import { Noto_Sans_Mono } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/components/I18nProvider";

const notoSansMono = Noto_Sans_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-noto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pi Agent Web",
  description: "Pi Coding Agent Web Interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={notoSansMono.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("pi-theme");if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}})();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem("pi-lang")||navigator.language||"en";document.documentElement.lang=l.startsWith("zh")?"zh":"en";}catch(e){}})();`,
          }}
        />
      </head>
      <body style={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
