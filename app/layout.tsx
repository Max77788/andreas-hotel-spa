import "./globals.css";
import type { Metadata } from "next";
import Script from "next/script";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "The Andreas Hotel & Spa – Palm Springs, CA",
  description:
    "Ideally located in the heart of downtown Palm Springs, the Andreas Hotel & Spa brings modern style to a classic setting. Originally built in 1935, enjoy 25 luxurious guest rooms and suites, a full-service spa, and stunning pool courtyard.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "The Andreas Hotel & Spa – Palm Springs, CA",
    description:
      "A boutique adults-only hotel in downtown Palm Springs featuring 25 luxurious rooms, a full-service spa, heated pool, and courtyard fireplaces. Established 1935.",
    url: "https://andreashotel.com",
    siteName: "The Andreas Hotel & Spa",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {/* Vapi AI Chatbot Widget */}
        <Script
          src="https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js"
          strategy="afterInteractive"
        />
        {/* @ts-expect-error custom web component */}
        <vapi-widget
          public-key="a2166c04-eff0-4623-852e-93d4e7d54f7e"
          assistant-id="94338a77-21c7-49d4-b2c6-d3c23a9f6ee7"
          mode="chat"
          theme="dark"
          size="full"
          radius="large"
          base-color="#2a2118"
          accent-color="#c9a96e"
          button-base-color="#2a2118"
          button-accent-color="#c9a96e"
          empty-chat-message="Hi, Sam here! How can I help you today?"
        />
      </body>
    </html>
  );
}
