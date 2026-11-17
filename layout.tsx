import type { Metadata, Viewport } from "next";
import { Forum, Manrope, Allura } from "next/font/google";
import "./globals.css";

const display = Forum({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });
const script = Allura({ subsets: ["latin"], weight: "400", variable: "--font-script" });

export const metadata: Metadata = {
  title: "US&ABOUT — Make time for what matters",
  description: "Create a personal invitation, send a unique link, and plan the day together. Free, always.",
  openGraph: { title: "US&ABOUT — Make time for what matters", description: "Create a personal invitation and plan the day together. Free, always.", type: "website" },
};
export const viewport: Viewport = { themeColor: "#0B080D", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${script.variable}`}>
      <body>{children}</body>
    </html>
  );
}
