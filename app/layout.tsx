import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hadilike.ma | Fleuriste d'Exception Marrakech",
  description: "Créations florales d'exception, livraison gants blancs à Marrakech. Bouquets, Flower Boxes et compositions sur mesure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${playfair.variable} ${montserrat.variable} antialiased bg-white text-primary flex flex-col min-h-screen`}
      >
        <div className="flex-grow">
          {children}
        </div>
        <Chatbot />
        <Footer />
      </body>
    </html>
  );
}

