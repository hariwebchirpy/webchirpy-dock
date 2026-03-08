'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownBodyProps {
	content: string;
}

export default function MarkdownBody({ content }: MarkdownBodyProps) {
	return (
		<div className="prose prose-invert prose-zinc max-w-none 
      prose-headings:font-semibold prose-headings:tracking-tight 
      prose-h1:text-4xl prose-h1:mb-8 
      prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-zinc-800 prose-h2:pb-2
      prose-p:text-zinc-400 prose-p:leading-relaxed 
      prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-blue-400 prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-zinc-900/50 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl prose-pre:p-4
      prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
      prose-strong:text-zinc-100
      prose-ul:list-disc prose-li:text-zinc-400
    ">
			<ReactMarkdown remarkPlugins={[remarkGfm]}>
				{content}
			</ReactMarkdown>
		</div>
	);
}
