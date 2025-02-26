import { MDXProvider } from '@mdx-js/react';
import { useEffect, useState } from 'react';
import type * as React from 'react';
import * as runtime from 'react/jsx-runtime';

interface MDXRendererProps {
  content: string;
}

const components = {
  h1: (props: any) => <h1 className="text-2xl font-bold my-4" {...props} />,
  h2: (props: any) => <h2 className="text-xl font-bold my-3" {...props} />,
  h3: (props: any) => <h3 className="text-lg font-bold my-2" {...props} />,
  p: (props: any) => <p className="my-2" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-5 my-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-5 my-2" {...props} />,
  li: (props: any) => <li className="my-1" {...props} />,
  code: (props: any) => {
    const { className, children, ...rest } = props;
    const isInline = typeof className !== 'string';

    if (isInline) {
      return (
        <code className="bg-gray-100 px-1 rounded text-sm font-mono" {...rest}>
          {children}
        </code>
      );
    }

    return (
      <pre className="bg-gray-100 p-3 rounded my-3 overflow-auto">
        <code className="text-sm font-mono" {...rest}>
          {children}
        </code>
      </pre>
    );
  },
  a: (props: any) => <a className="text-blue-500 hover:underline" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-3" {...props} />
  ),
  table: (props: any) => <table className="min-w-full border-collapse my-3" {...props} />,
  th: (props: any) => <th className="border border-gray-300 px-4 py-2 bg-gray-100" {...props} />,
  td: (props: any) => <td className="border border-gray-300 px-4 py-2" {...props} />,
};

const MDXRenderer: React.FC<MDXRendererProps> = ({ content }) => {
  const [mdxContent, setMdxContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderMDX = async () => {
      try {
        // 使用简单的方法：将MDX内容转换为HTML
        const html = await convertMarkdownToHTML(content);
        setMdxContent(html);
        setError(null);
      } catch (err) {
        console.error('MDX渲染错误:', err);
        setError(err instanceof Error ? err.message : '渲染MDX时出错');
      }
    };

    renderMDX();
  }, [content]);

  // 改进的Markdown转HTML函数，更好地处理代码块
  const convertMarkdownToHTML = async (markdown: string): Promise<string> => {
    // 处理代码块，支持语言高亮
    const html = markdown
      // 处理带语言的代码块
      .replace(/```(\w+)?\n([\s\S]*?)```/gim, (match, lang, code) => {
        const language = lang || 'text';
        const highlightedCode = highlightCode(code, language);
        return `<pre class="bg-zinc-950 dark:bg-zinc-900 p-4 rounded-xl overflow-auto my-4"><code class="language-${language} text-sm font-mono text-white">${highlightedCode}</code></pre>`;
      })

      // 标题
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold my-4">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold my-3">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold my-2">$1</h3>')

      // 段落
      .replace(/^\s*(\n)?(.+)/gim, (m) =>
        /\<(\/)?(h1|h2|h3|ul|ol|li|blockquote|pre|table)/.test(m) ? m : '<p class="my-2">$2</p>',
      )

      // 粗体和斜体
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/~~(.*)~~/gim, '<del>$1</del>')

      // 链接
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/gim,
        '<a href="$2" class="text-blue-500 hover:underline">$1</a>',
      )

      // 列表
      .replace(/^\s*\n\*/gim, '<ul class="list-disc pl-5 my-2">\n*')
      .replace(/^\s*\n\-/gim, '<ul class="list-disc pl-5 my-2">\n-')
      .replace(/^\s*\n\+/gim, '<ul class="list-disc pl-5 my-2">\n+')
      .replace(/^\*(.+)/gim, '<li class="my-1">$1</li>')
      .replace(/^\-(.+)/gim, '<li class="my-1">$1</li>')
      .replace(/^\+(.+)/gim, '<li class="my-1">$1</li>')
      .replace(/^\s*\n([^*\n])/gim, '</ul>\n\n$1')

      // 引用
      .replace(
        /^\>(.+)/gim,
        '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-3">$1</blockquote>',
      )

      // 内联代码
      .replace(
        /`([^`]+)`/gim,
        '<code class="bg-gray-100 px-1 rounded text-sm font-mono">$1</code>',
      );

    return html;
  };

  // 简单的代码高亮函数
  const highlightCode = (code: string, language: string): string => {
    // 这里可以集成更复杂的语法高亮库，如Prism.js或highlight.js
    // 这里我们使用一个简单的实现
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // 为不同类型的代码添加基本的语法高亮
    if (
      language === 'jsx' ||
      language === 'tsx' ||
      language === 'javascript' ||
      language === 'typescript'
    ) {
      return escapedCode
        .replace(
          /(import|export|from|const|let|var|function|return|if|else|for|while|class|extends|=>)/g,
          '<span class="text-purple-400">$1</span>',
        )
        .replace(/(".*?"|'.*?'|`.*?`)/g, '<span class="text-green-400">$1</span>')
        .replace(/(&lt;\/?[a-zA-Z].*?&gt;)/g, '<span class="text-blue-400">$1</span>')
        .replace(/({.*?})/g, '<span class="text-yellow-400">$1</span>');
    }

    return escapedCode;
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded border border-red-200">
        <h3 className="font-bold">MDX渲染错误</h3>
        <pre className="mt-2 text-sm overflow-auto">{error}</pre>
      </div>
    );
  }

  return (
    <div className="mdx-content p-4">
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
      <div dangerouslySetInnerHTML={{ __html: mdxContent }} />
    </div>
  );
};

export default MDXRenderer;
