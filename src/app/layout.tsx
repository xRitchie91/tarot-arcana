// app/layout.tsx

import "./globals.css";

export const metadata = {
  title: "Tarot Arcana",
  description: "Interactive tarot reading experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}