import { Poppins } from "next/font/google";
import "./globals.css";

export const metadata = {
  title: "Finance Tracker",
  description: "financial management",
  icons: {
    icon: "/Finance-Tracker.png",
  },
};

export const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
