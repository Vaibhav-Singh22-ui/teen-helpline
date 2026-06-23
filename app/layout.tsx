import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Buddy from '../components/Buddy';

export const metadata: Metadata = {
  title: 'TeenHelpline – The Safest Place for Teenagers to Heal',
  description: 'An anonymous, safe, and judgment-free wellness space for teenagers in India and globally. Connect with Buddy AI companion, explore Calm Zone games, and book verified counseling.',
  keywords: 'Teen mental wellness, exam stress, anxiety relief, anonymous teen support, online counseling, India teen helpline, mental health companion, Calm Zone',
  openGraph: {
    title: 'TeenHelpline – The Safest Place for Teenagers to Heal',
    description: 'An anonymous, safe, and judgment-free wellness space for teenagers.',
    url: 'https://teenhelpline.in',
    type: 'website'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Navbar />
        <main style={styles.main}>
          {children}
        </main>
        <Footer />
        <Buddy />
      </body>
    </html>
  );
}

const styles = {
  main: {
    display: 'flex',
    flexDirection: 'column' as const,
    flexGrow: 1,
    minHeight: 'calc(100vh - 75px - 400px)' // accounts for navbar and footer heights
  }
};
