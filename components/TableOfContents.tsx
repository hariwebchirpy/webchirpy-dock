'use client';

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TOCItem {
	text: string;
	id: string;
}

interface TableOfContentsProps {
	headings: TOCItem[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
	const [activeId, setActiveId] = useState<string>('');
	const observer = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		const handleObserver = (entries: IntersectionObserverEntry[]) => {
			// Find the first entry that is intersecting
			const visibleEntry = entries.find((entry) => entry.isIntersecting);
			if (visibleEntry) {
				setActiveId(visibleEntry.target.id);
			}
		};

		observer.current = new IntersectionObserver(handleObserver, {
			rootMargin: '-100px 0% -80% 0%',
			threshold: 0,
		});

		const elements = headings.map((h) => document.getElementById(h.id));
		elements.forEach((el) => {
			if (el) observer.current?.observe(el);
		});

		return () => observer.current?.disconnect();
	}, [headings]);

	if (headings.length === 0) return null;

	return (
		<div className="flex flex-col gap-8">
			<div>
				<h4 className="mb-4 font-bold uppercase tracking-widest text-[11px] text-zinc-500">
					On this page
				</h4>
				<nav className="relative flex flex-col gap-1 text-[13px]">
					{/* Active Indicator Line */}
					<div className="absolute left-0 top-0 h-full w-px bg-zinc-900" />

					{headings.map((heading) => {
						const isActive = activeId === heading.id;
						return (
							<a
								key={heading.id}
								href={`#${heading.id}`}
								className={cn(
									"relative pl-4 py-1.5 transition-all duration-200 border-l px-4",
									isActive
										? "text-blue-500 font-semibold border-blue-500 -ml-px"
										: "text-zinc-500 hover:text-zinc-300 border-transparent"
								)}
								onClick={(e) => {
									e.preventDefault();
									const element = document.getElementById(heading.id);
									if (element) {
										window.scrollTo({
											top: element.offsetTop - 100,
											behavior: 'smooth'
										});
										setActiveId(heading.id);
										// Update URL hash without jumping
										window.history.pushState(null, '', `#${heading.id}`);
									}
								}}
							>
								{heading.text}
							</a>
						);
					})}
				</nav>
			</div>
		</div>
	);
}
