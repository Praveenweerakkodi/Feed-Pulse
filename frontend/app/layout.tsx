import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeRegistry from '@/components/ThemeRegistry';

// Import Google's Inter font — modern, clean, very legible for SaaS apps
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'FeedPulse — AI Product Feedback',
  description: 'AI-powered product feedback platform for modern product teams.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* 
        We add the Inter font variable to the body class 
        so Tailwind can use it everywhere.
      */}
      <body className={`${inter.variable} font-sans antialiased text-slate-100 bg-slate-900 min-h-screen flex flex-col`}>
        {/* 
          ThemeRegistry wraps our entire app.
          It provides the stable MUI theme to all components.
          And the ToastProvider for global notifications.
        */}
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
