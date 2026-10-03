// components/MarkdownRenderer.tsx
'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

// تم اصلی و دقیق محیط VS Code
import 'highlight.js/styles/vs2015.css';

// رنگ‌بندی برچسب زبان‌ها برای جذابیت بیشتر
const langColors: Record<string, string> = {
  dart: 'text-[#00B4AB] bg-[#00B4AB]/10',
  flutter: 'text-[#47C5FB] bg-[#47C5FB]/10',
  python: 'text-[#3776AB] bg-[#3776AB]/10',
  javascript: 'text-[#F7DF1E] bg-[#F7DF1E]/10',
  js: 'text-[#F7DF1E] bg-[#F7DF1E]/10',
  typescript: 'text-[#3178C6] bg-[#3178C6]/10',
  ts: 'text-[#3178C6] bg-[#3178C6]/10',
  html: 'text-[#E34F26] bg-[#E34F26]/10',
  css: 'text-[#1572B6] bg-[#1572B6]/10',
  bash: 'text-[#4EAA25] bg-[#4EAA25]/10',
  json: 'text-[#FF6B00] bg-[#FF6B00]/10',
};

// دکمه کپی خفن با انیمیشن
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label="کپی کردن کد"
      className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all duration-200 border border-zinc-700/50 hover:border-zinc-500 shadow-sm active:scale-95"
    >
      {copied ? (
        <>
          <span className="text-emerald-400">✓</span>
          <span className="text-emerald-400 font-sans text-[11px]">کپی شد!</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span className="font-sans text-[11px]">کپی</span>
        </>
      )}
    </button>
  );
}

export default function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;

  return (
    <div className="w-full text-text-main/90 leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          p: (props: any) => <p className="mb-6 leading-8 text-base sm:text-lg" {...props} />,
          h1: (props: any) => <h1 className="mt-10 mb-4 text-2xl sm:text-4xl font-black text-text-main" {...props} />,
          h2: (props: any) => <h2 className="mt-8 mb-4 text-xl sm:text-2xl font-bold text-text-main" {...props} />,
          h3: (props: any) => <h3 className="mt-6 mb-3 text-lg sm:text-xl font-bold text-text-main" {...props} />,
          ul: (props: any) => <ul className="mb-6 list-disc pr-6 space-y-2 text-text-main/90" {...props} />,
          ol: (props: any) => <ol className="mb-6 list-decimal pr-6 space-y-2 text-text-main/90" {...props} />,
          li: (props: any) => <li className="leading-7" {...props} />,

          // بلاک کد با استایل macOS + VS Code Terminal
          pre: ({ children, ...props }: any) => {
            const codeString =
              children?.[0]?.props?.children?.[0] ||
              children?.props?.children ||
              '';

            const className = children?.[0]?.props?.className || '';
            const match = /language-(\w+)/.exec(className);
            const rawLang = match ? match[1].toLowerCase() : 'code';
            const badgeStyle = langColors[rawLang] || 'text-accent-orange bg-accent-orange/10';

            return (
              <div
                className="my-8 rounded-2xl overflow-hidden bg-[#141416] shadow-2xl ring-1 ring-white/10 hover:ring-white/20 transition-all duration-300"
                dir="ltr"
              >
                {/* نوار بالای پنجره شبیه macOS */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#1c1c1f]/90 backdrop-blur border-b border-white/5 select-none">
                  {/* دکمه‌های سه رنگ Mac */}
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-sm opacity-85 hover:opacity-100 transition-opacity" />
                    <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-sm opacity-85 hover:opacity-100 transition-opacity" />
                    <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-sm opacity-85 hover:opacity-100 transition-opacity" />
                    
                    {/* بج اختصاصی زبان برنامه نویسی */}
                    <span className={`ml-3 px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold uppercase tracking-wider ${badgeStyle}`}>
                      {rawLang}
                    </span>
                  </div>

                  {/* دکمه کپی */}
                  <CopyButton code={String(codeString).trim()} />
                </div>

                {/* بدنه کد با اسکرول‌بار نرم و پدینگ استاندارد */}
                <pre
                  className="!bg-transparent !p-5 !m-0 overflow-x-auto text-[13.5px] sm:text-[14.5px] font-mono leading-relaxed text-left selection:bg-accent-orange/30 selection:text-white"
                  {...props}
                >
                  {children}
                </pre>
              </div>
            );
          },

          // کدهای تک خطی (Inline Code)
          code: ({ className, children, ...props }: any) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="bg-accent-orange/10 text-accent-orange px-2 py-0.5 rounded-md text-[13px] font-mono font-medium mx-1 border border-accent-orange/20 inline-block align-baseline"
                  dir="ltr"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
