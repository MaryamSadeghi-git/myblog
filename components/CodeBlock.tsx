    // components/CodeBlock.tsx
    'use client';

    import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
    import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

    export default function CodeBlock({ children, className, ...props }: any) {
      // استخراج زبان از className
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : 'text'; // اگر زبان مشخص نبود، پیش‌فرض 'text'

      const codeString = String(children).replace(/\n$/, '');

      return (
        <div dir="ltr" className="my-4 overflow-hidden rounded-lg">
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus} // استفاده از استایل VS Code Dark Plus
            showLineNumbers={true} // نمایش شماره خطوط
            customStyle={{ // استایل سفارشی برای باکس کلی
              margin: 0,
              padding: '1rem',
              background: '#1e1e1e', // رنگ پس‌زمینه تیره شبیه VS Code
              fontSize: '0.9rem',
            }}
            lineNumberStyle={{ // استایل شماره خطوط
              color: '#6e7681',
              minWidth: '2.5em',
              paddingRight: '1em',
              userSelect: 'none',
            }}
          >
            {codeString}
          </SyntaxHighlighter>
        </div>
      );
    }
