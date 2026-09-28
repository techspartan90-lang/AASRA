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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('aasra_app_state_v1');
                  var theme = 'light';
                  if (saved) {
                    var parsed = JSON.parse(saved);
                    if (parsed && parsed.theme) {
                      theme = parsed.theme;
                    }
                  }
                  var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#f7f9fc] text-[#172033] antialiased dark:bg-[#0b1220] dark:text-[#f8fafc] transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
