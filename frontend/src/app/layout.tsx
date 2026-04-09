import type { Metadata } from "next";
import { Manrope } from 'next/font/google';

import "./globals.css";
import { Providers } from "./providers";


const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-sans',
});


export const metadata: Metadata = {
  title: "Employee Attendance System",
  description:
    "Modern employee attendance, leave and shift management dashboard for teams and institutions.",
  openGraph: {
    title: "Employee Attendance System",
    description:
      "Track attendance, manage leave requests, and view insightful reports in a clean dashboard.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Employee Attendance System dashboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Employee Attendance System",
    description:
      "Production-ready attendance and leave dashboard with clean UI and charts.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
