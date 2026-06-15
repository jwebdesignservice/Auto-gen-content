import './globals.css';
import { Space_Grotesk, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import Shell from '../components/Shell';

const display = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-display', display: 'swap' });
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: 'italic', variable: '--font-serif', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

export const metadata = {
  title: 'Fast Launch — Content Engine',
  description: 'Dashboard for the Fast Launch content automation engine.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${mono.variable}`}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
