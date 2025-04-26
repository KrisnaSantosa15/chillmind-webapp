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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme script to prevent flash and ensure theme consistency */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Get stored theme preference
                  var theme = localStorage.getItem('theme');
                  
                  // Apply appropriate theme class
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark-theme');
                  } else {
                    document.documentElement.classList.add('light-theme');
                  }
                } catch (e) {
                  console.error('Error applying theme:', e);
                  // Fallback to light theme
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
