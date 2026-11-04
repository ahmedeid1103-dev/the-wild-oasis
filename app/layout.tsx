import type { Metadata } from "next";
import { Josefin_Sans } from "next/font/google";

import "@/app/styles/globals.css";
import Header from "@/components/Header";
import SiteShell from "@/components/SiteShell";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Welcome | The Wild Oasis",
    template: "%s | The Wild Oasis",
  },
  description:
    "Luxurious cabin hotel, located in the heart of the Italian Dolomites, surrounded by beautiful mountains and dark forests",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} flex min-h-screen flex-col overflow-x-hidden bg-primary-950 text-primary-100 antialiased`}
      >
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteShell header={<Header />}>{children}</SiteShell>
      </body>
    </html>
  );
}
