import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MANAS SURAKSHA - Mind Protection & Distress Early-Warning System',
  description:
    'Continuous, privacy-conscious mental health monitoring and distress early-warning system for victims of atrocities, assisting authorized counsellors and public welfare officers.',
  openGraph: {
    title: 'MANAS SURAKSHA - Mind Protection & Distress Early-Warning System',
    description:
      'Continuous, privacy-conscious mental health monitoring and distress early-warning system for victims of atrocities, assisting authorized counsellors and public welfare officers.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MANAS SURAKSHA - Mind Protection & Distress Early-Warning System',
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
                  var explicitTheme = localStorage.getItem('manas-suraksha-theme');
                  var theme = explicitTheme;
                  if (!theme) {
                    var saved = localStorage.getItem('aasra_app_state_v1');
                    if (saved) {
                      var parsed = JSON.parse(saved);
                      if (parsed && parsed.theme) {
                        theme = parsed.theme;
                      }
                    }
                  }
                  var isDark = false;
                  if (theme === 'dark') {
                    isDark = true;
                  } else if (theme === 'light') {
                    isDark = false;
                  } else {
                    isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  }
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
      <body className="min-h-screen bg-white text-[#333333] antialiased dark:bg-[#151515] dark:text-[#FFFFFF] transition-colors duration-200 luxury-ambient-bg">
        {children}
      </body>
    </html>
  );
}
