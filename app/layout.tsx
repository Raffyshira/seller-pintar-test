
import type { Metadata } from 'next';
import { Archivo } from 'next/font/google';
import './globals.css';



import { Toaster } from '@/components/ui/sonner';

import Providers from './Providers';


const archivo = Archivo({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${archivo.className} antialiased`}
      >
        <Providers>
          <main>
            {children}
          </main>
          <Toaster position='top-right' />
        </Providers>

      </body>
    </html>
  )
}
