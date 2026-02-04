import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'P01NT - Albanian Sports Federation Platform',
  description: 'Your centralized hub for Albanian sports federations. Stay updated with the latest news, match schedules, and athlete information.',
  keywords: ['Albanian sports', 'FSHF', 'FSHB', 'FSHV', 'ATF', 'football', 'basketball', 'volleyball', 'taekwondo'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-light-gray">
        <Providers>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
