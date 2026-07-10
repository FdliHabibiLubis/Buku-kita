import { Archivo_Narrow, Public_Sans } from "next/font/google";
import "./globals.css";

const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  variable: "--font-archivo-narrow",
  weight: ["400", "500", "700"],
});

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "Buku Kita - Toko Buku Neobrutalist",
  description: "Toko buku online dengan tema Neobrutalist Cobalt yang modern, interaktif, dan premium.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${archivoNarrow.variable} ${publicSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col font-body bg-background-custom text-on-surface"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
