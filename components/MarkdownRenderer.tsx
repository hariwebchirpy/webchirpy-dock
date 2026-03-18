'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import Link from 'next/link';
import { Check, Copy } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  projectSlug?: string;
  isChangeDoc?: boolean;
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute right-3 top-3 flex items-center gap-1 rounded-md border border-zinc-700 bg-zinc-800 px-2 py-1 text-xs text-zinc-400 transition-colors hover:border-zinc-500 hover:text-white"
      title="Copy code"
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-green-400" />
          <span className="text-green-400">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

function InlineCode({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const text = typeof children === 'string' ? children : String(children ?? '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <code
      onClick={handleCopy}
      title="Click to copy"
      className="group relative inline-flex cursor-pointer items-center gap-1 rounded-lg bg-zinc-900 px-2 py-0.5 font-mono text-sm text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-white"
    >
      {text}
      <span className="ml-0.5 opacity-0 transition-opacity group-hover:opacity-60">
        {copied ? <Check className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
      </span>
    </code>
  );
}

export default function MarkdownRenderer({ content, projectSlug, isChangeDoc }: MarkdownRendererProps) {
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none
      prose-headings:scroll-mt-20
      prose-h1:text-4xl prose-h1:font-extrabold prose-h1:tracking-tight prose-h1:mb-10 prose-h1:text-white
      prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-b prose-h2:border-zinc-900 prose-h2:pb-3 prose-h2:text-white
      prose-h3:text-xl prose-h3:font-bold prose-h3:tracking-tight prose-h3:mt-12 prose-h3:mb-4 prose-h3:text-zinc-100
      prose-p:text-zinc-400 prose-p:leading-8 prose-p:mb-6 prose-p:text-[16px]
      prose-a:text-blue-500 prose-a:font-medium prose-a:underline-offset-4 hover:prose-a:underline transition-colors
      prose-blockquote:border-l-2 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-500/5 prose-blockquote:px-8 prose-blockquote:py-2 prose-blockquote:rounded-r-xl prose-blockquote:italic
      prose-code:bg-zinc-900 prose-code:rounded-lg prose-code:px-2 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:text-zinc-200 prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800/80 prose-pre:rounded-2xl prose-pre:p-0 prose-pre:mb-8 prose-pre:shadow-2xl
      prose-ul:list-disc prose-ul:pl-8 prose-ul:my-8 prose-li:text-zinc-400 prose-li:mb-3 prose-li:marker:text-zinc-700
      prose-ol:list-decimal prose-ol:pl-8 prose-ol:my-8
      prose-table:border-collapse prose-table:w-full prose-table:my-10 prose-table:rounded-xl prose-table:overflow-hidden prose-table:border prose-table:border-zinc-900
      prose-th:bg-zinc-900/50 prose-th:p-5 prose-th:text-left prose-th:border-b prose-th:border-zinc-900 prose-th:font-bold prose-th:text-zinc-200
      prose-td:p-5 prose-td:border-b prose-td:border-zinc-900/50 prose-td:text-zinc-400
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code: ({ node, className, children, ...props }) => {
            // If it's inside a pre (fenced block), render normally
            const isBlock = !!className;
            if (isBlock) return <code className={className} {...props}>{children}</code>;
            return <InlineCode>{children}</InlineCode>;
          },
          pre: ({ node, children, ...props }) => {
            // Extract text content from the code element inside pre
            const codeEl = (children as any)?.[0];
            const codeText =
              typeof codeEl?.props?.children === 'string'
                ? codeEl.props.children
                : Array.isArray(codeEl?.props?.children)
                ? codeEl.props.children.join('')
                : '';

            return (
              <div className="relative group">
                <pre {...props}>{children}</pre>
                <CopyButton code={codeText} />
              </div>
            );
          },
          h2: ({ node, ...props }) => {
            const id = String(props.children)
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-');
            return <h2 id={id} {...props} />;
          },
          h3: ({ node, ...props }) => {
            const id = String(props.children)
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-');
            return <h3 id={id} {...props} />;
          },
          a: ({ node, href, ...props }) => {
            if (href && projectSlug && (href.endsWith('.md') || !href.includes(':'))) {
              let targetHref = href.replace(/\.md$/, '');

              if (!targetHref.startsWith('/') && !targetHref.startsWith('http')) {
                if (isChangeDoc) {
                  targetHref = `/projects/${projectSlug}/changes/${targetHref}`;
                } else {
                  targetHref = `/projects/${projectSlug}/${targetHref}`;
                }
              }

              return (
                <Link href={targetHref} {...props} className="text-blue-500 font-medium underline-offset-4 hover:underline transition-colors">
                  {props.children}
                </Link>
              );
            }
            return <a href={href} {...props} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined} />;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
