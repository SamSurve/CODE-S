import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Online Compiler',
  description:
    'An interactive online sandboxed compiler to write, upload, edit, and execute C and C++ programs.',
  keywords: [
    'Online Compiler',
    'C Compiler',
    'C++ Compiler',
    'Online IDE',
    'Sandboxed Engine',
    'Algorithms'
  ],
  authors: [{ name: 'Siddhant Surve' }]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-zinc-100">
        {children}
      </body>
    </html>
  );
}
