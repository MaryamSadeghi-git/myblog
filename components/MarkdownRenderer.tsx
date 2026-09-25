    // components/MarkdownRenderer.tsx
    import { MDXRemote } from 'next-mdx-remote/rsc';
    import CodeBlock from './CodeBlock';

    export default function MarkdownRenderer({ content }: { content: string }) {
      // مهم: MDXRemote ممکن است <pre> یا <code> را پاس دهد.
      // ما هر دو را به CodeBlock متصل می‌کنیم.
      const components = {
        code: (props: any) => <CodeBlock {...props} />,
        pre: ({ children }: any) => <>{children}</>, // <pre> را فقط به صورت wrapper نگه می‌داریم
      };

      return <MDXRemote source={content} components={components} />;
    }
