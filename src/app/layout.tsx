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
  title: 'AOA Practical Codes — Write. Run. Learn.',
  description:
    'An interactive AOA (Analysis of Algorithms) practical library and online sandboxed compiler to write, upload, edit, and execute C and C++ programs.',
  keywords: [
    'AOA',
    'Analysis of Algorithms',
    'C Compiler',
    'C++ Compiler',
    'Online IDE',
    'Judge0',
    'Engineering Practicals',
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
