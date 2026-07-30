import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AppBackground from "@/components/ui/AppBackground";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "AI Study Planner",
  description: "Plan your learning journey with AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased min-h-screen flex flex-col bg-transparent relative text-white`}>
        <AppBackground />
        <Navbar />
        <main className="flex-1 relative z-10">
          {children}
        </main>
        {/* <Footer /> */}
      </body>
    </html>
  );
}