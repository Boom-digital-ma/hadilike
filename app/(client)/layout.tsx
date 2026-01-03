import Navigation from "@/components/Navigation";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";
import GoogleTagManager from "@/components/GoogleTagManager";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <GoogleTagManager />
      <Navigation />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
      <Chatbot />
    </div>
  );
}
