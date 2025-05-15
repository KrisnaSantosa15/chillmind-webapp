import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChillMind - Student Mental Wellness",
  description: "A personalized mental health monitoring platform for students, with ML-based assessments and recommendations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="light-theme">
      <head>
        {/* Font Awesome CDN */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
        {/* Theme script to prevent flash and ensure theme consistency */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // First remove any existing theme classes to start with a clean slate
                  document.documentElement.classList.remove('dark', 'light-theme', 'dark-theme');
                  
                  // Get stored theme preference
                  var theme = localStorage.getItem('theme');
                  var systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  // Apply appropriate theme class
                  if (theme === 'dark' || (!theme && systemPrefersDark)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.add('dark-theme');
                  } else {
                    document.documentElement.classList.add('light-theme');
                  }
                } catch (e) {
                  console.error('Error applying theme:', e);
                  // Fallback to light theme
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light-theme');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
