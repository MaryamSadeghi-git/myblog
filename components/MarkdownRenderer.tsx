// components/MarkdownRenderer.tsx
import { MDXRemote } from 'next-mdx-remote/rsc';
import CodeBlock from './CodeBlock';
import React from 'react';

const components = {
  // جلوگیری از قرار گرفتن دیو داخل پاراگراف
  p: (props: any) => <div className="mb-4 text-gray-700 leading-relaxed" {...props} />,
  pre: (props: any) => <>{props.children}</>,
  code: ({ className, children, ...props }: any) => {
    const isBlock = className || (typeof children === 'string' && children.includes('\n'));
    if (isBlock) {
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }
    return (
      <code className="bg-gray-100 text-red-500 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    );
  },
};

export default function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;

  return (
    <div className="prose max-w-none">
      <MDXRemote source={content} components={components} />
    </div>
  );
}
