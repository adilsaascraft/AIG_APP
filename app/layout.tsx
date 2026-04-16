import type { Metadata } from 'next'
import { Poppins, Francois_One } from 'next/font/google'
import '@/styles/globals.css'
import { Toaster } from "@/components/ui/sonner"


const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const francoisOne = Francois_One({
  variable: '--font-francois',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AIG App',
  description: 'Admin panel for managing AIG App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Optional extra favicons for multiple devices */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
      </head>

      <body
        className={`${poppins.variable} ${francoisOne.variable} font-sans antialiased`}
      >
         
            {children}
            <Toaster richColors position="bottom-right" closeButton />
          
      </body>
    </html>
  )
}
