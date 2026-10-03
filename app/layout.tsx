// app/layout.tsx
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body className="bg-bg-main text-text-main antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
