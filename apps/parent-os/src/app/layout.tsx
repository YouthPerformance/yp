import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ConvexProvider } from "@/lib/convex";
import { BottomNav } from "@/components/bottom-nav";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "YP Parent OS",
  description: "We don't show your schedule. We run it.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <ConvexProvider>
          <div className="min-h-screen pb-20 bg-gray-50">
            {children}
          </div>
          <BottomNav />
        </ConvexProvider>
      </body>
    </html>
  );
}
