import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AASRA Care - AI-Assisted Distress Early-Warning System',
  description:
    'Continuous, privacy-conscious mental health monitoring and distress early-warning system for victims of atrocities, assisting authorized counsellors and public welfare officers.',
  openGraph: {
    title: 'AASRA Care - AI-Assisted Distress Early-Warning System',
    description:
      'Continuous, privacy-conscious mental health monitoring and distress early-warning system for victims of atrocities, assisting authorized counsellors and public welfare officers.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AASRA Care - AI-Assisted Distress Early-Warning System',
    description:
      'Continuous, privacy-conscious mental health monitoring and distress early-warning system for victims of atrocities, assisting authorized counsellors and public welfare officers.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
