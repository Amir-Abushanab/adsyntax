'use client';

import "./globals.css";
import '@radix-ui/themes/styles.css';
// import { Public_Sans } from "next/font/google";
import { Theme } from '@radix-ui/themes';
import { ThemeProvider } from 'next-themes';


import { Navbar } from "@/components/Navbar";

// const publicSans = Public_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Ad Syntax</title>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <meta
          name="description"
          content="Libraries for injecting Ads into your LLMs"
        />
        <meta property="og:title" content="Ad Syntax" />
        <meta
          property="og:description"
          content="Libraries for injecting Ads into your LLMs"
        />
        <meta property="og:image" content="/images/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ad Syntax" />
        <meta
          name="twitter:description"
          content="Starter template showing how to use LangChain in Next.js projects. See source code and deploy your own at https://github.com/langchain-ai/langchain-nextjs-template!"
        />
        <meta name="twitter:image" content="/images/og-image.png" />
      </head>
      <body>
      <ThemeProvider attribute="class">
          <Theme>
            <div className="flex flex-col p-4 md:p-12 h-[100vh]">
              <Navbar></Navbar>
              {children}
            </div>
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  );
}
