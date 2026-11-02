import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClientProviders from '@/components/ClientProviders';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vesna.vercel.app';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'VESNA | The Digital Invitation Atelier',
  description: 'Design exquisite animated digital invitations for weddings, Barat, Walima, Mehndi, and life’s most cherished celebrations.',
  keywords: 'VESNA, digital invitation atelier, Pakistani wedding invites, Barat, Walima, Mehndi, online RSVP, animated luxury invitation card',
  openGraph: {
    title: 'VESNA | The Digital Invitation Atelier',
    description: 'Design exquisite animated digital invitations for weddings, Barat, Walima, Mehndi, and life’s most cherished celebrations.',
    url: '/',
    siteName: 'VESNA Luxury Invitations',
    images: [
      {
        url: '/api/og?title=VESNA%20Atelier&event=Luxury%20Digital%20Invitations&date=Weddings%20%E2%80%A2%20Milestones&venue=Worldwide%20Guest%20RSVP&theme=gold',
        width: 1200,
        height: 630,
        alt: 'VESNA Digital Invitation Atelier',
      },
    ],
    locale: 'en_PK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VESNA | The Digital Invitation Atelier',
    description: 'Design exquisite animated digital invitations for weddings, Barat, Walima, Mehndi, and life’s most cherished celebrations.',
    images: [
      '/api/og?title=VESNA%20Atelier&event=Luxury%20Digital%20Invitations&date=Weddings%20%E2%80%A2%20Milestones&venue=Worldwide%20Guest%20RSVP&theme=gold',
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Amiri:ital,wght@0,400;0,700;1,400&family=Cinzel+Decorative:wght@700&family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Montserrat:wght@200;300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-ivory text-espresso antialiased font-sans min-h-screen flex flex-col selection:bg-sand-300 selection:text-espresso">
        <ClientProviders>
          <Navbar />
          <div className="flex-grow">
            {children}
          </div>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
