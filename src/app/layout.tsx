import type { Metadata } from "next";
import { JetBrains_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import "./trex.css";

const sourceSerif = Source_Serif_4({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-source-serif",
  weight: ["400", "500", "600", "700"],
});

const jetBrainsMono = JetBrains_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-code",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "T-Rex: Tactile-Reactive Dexterous Manipulation",
  description:
    "T-Rex is a tactile-reactive dexterous manipulation framework: a 100-hour tactile-rich dataset, a variable-rate Mixture-of-Transformer architecture with a temporal tactile VQ-VAE encoder, and state-of-the-art results across 12 real-world manipulation tasks.",
  icons: {
    icon: "/seo/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSerif.variable} ${jetBrainsMono.variable} h-full antialiased`}>
      <body className={`${sourceSerif.className} min-h-full flex flex-col`}>{children}</body>
    </html>
  );
}
