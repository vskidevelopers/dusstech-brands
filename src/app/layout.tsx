import { CartDrawer } from "@/components/shared/CartDrawer";
import "./globals.css"; // ⚠️ THIS LINE MUST BE HERE (adjust path if your css is elsewhere)
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dusstech",
  description: "Dusstech Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-white text-black"> {/* Ensure body has basic classes */}
        {children}
        <CartDrawer />
      </body>
    </html>
  );
}