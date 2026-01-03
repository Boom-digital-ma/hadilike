import Navigation from "@/components/Navigation";
import Chatbot from "@/components/Chatbot";
import Footer from "@/components/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
      <Chatbot />
    </div>
  );
}
