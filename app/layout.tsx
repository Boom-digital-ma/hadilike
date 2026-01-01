import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/Chatbot";
import Navigation from "@/components/Navigation";
import { Providers } from "@/components/Providers";
import { CHATBOT_CONFIG } from "@/data/shop-config";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "Hadilike - Fleuriste d'Émotion Marrakech",
  description: "Créations florales d'exception à Marrakech. Bouquets, Boîtes à fleurs et Sur-mesure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${playfair.variable} ${lato.variable} antialiased`}
      >
        <Providers>
          <Navigation />
          {children}
          {CHATBOT_CONFIG.enabled && <Chatbot />}
        </Providers>
      </body>
    </html>
  );
}
