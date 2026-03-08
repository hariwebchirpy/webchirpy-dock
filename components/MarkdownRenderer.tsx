'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none 
      prose-headings:scroll-mt-20
      prose-h1:text-4xl prose-h1:font-extrabold prose-h1:tracking-tight prose-h1:mb-8
      prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:pb-2
      prose-h3:text-xl prose-h3:font-semibold prose-h3:tracking-tight prose-h3:mt-8 prose-h3:mb-3
      prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4
      prose-a:text-primary prose-a:font-medium prose-a:underline-offset-4 hover:prose-a:underline
      prose-blockquote:border-l-4 prose-blockquote:border-primary/20 prose-blockquote:bg-muted/30 prose-blockquote:px-6 prose-blockquote:py-1 prose-blockquote:rounded-r-lg
      prose-code:bg-muted prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:text-primary prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-muted/30 prose-pre:border prose-pre:rounded-xl prose-pre:p-0 prose-pre:mb-6
      prose-ul:list-disc prose-ul:pl-6 prose-li:text-muted-foreground prose-li:mb-2
      prose-ol:list-decimal prose-ol:pl-6
      prose-table:border-collapse prose-table:w-full prose-table:my-8
      prose-th:bg-muted/50 prose-th:p-4 prose-th:text-left prose-th:border prose-th:font-semibold
      prose-td:p-4 prose-td:border prose-td:text-muted-foreground
    ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
