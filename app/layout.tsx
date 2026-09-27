import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "وبلاگ تخصصی و مدرن",
  description: "وبلاگ مهندسی نرم‌افزار و تکنولوژی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body className="bg-[#080b11] text-slate-200 antialiased min-h-screen flex flex-col selection:bg-cyan-500 selection:text-black font-sans">
        
        {/* Glow Effects در پس‌زمینه */}
        <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />
        <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-purple-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080b11]/70 border-b border-cyan-500/10 shadow-2xl shadow-cyan-950/20">
          <div className="max-w-5xl mx-auto px-6 h-18 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-35 h-10 rounded-xl bg-slate-950/90 text-slate-100/90 font-bold shadow-sm shadow-orange-900/85 transition duration-300">
                <div className="w-full h-full bg-[#0d121d] rounded-[10px] flex items-center justify-center font-black text-slate-100/75 text-lg hover:bg-slate-800/90">
                   وبلاگ من
                </div>
              </div>
      
            </Link>

            
        <div className="flex justify-center items-center gap-4">
          <Link
            href="/posts"
            className="px-10 py-3 rounded-xl bg-slate-950/90 hover:bg-slate-800/90 text-slate-100/90 font-bold shadow-sm shadow-orange-900/85 transition duration-200"
          >
             تمام مقالات
          </Link>
          
        </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-[#06080d] py-8 text-center text-xs text-slate-500">
          <p className="flex items-center justify-center gap-1.5">
           با ما همراه باشید در <span className="text-cyan-400 font-mono">Telegram</span> و <span className="text-violet-400 font-mono">WhatsApp</span>
          </p>
        </footer>
      </body>
    </html>
  );
}

