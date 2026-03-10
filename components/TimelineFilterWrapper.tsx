'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Layers, ChevronDown, Check } from 'lucide-react';
import Timeline from '@/components/Timeline';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TimelineItem {
	slug: string;
	title: string;
	date?: string;
	commit?: string;
	repo?: string;
	category?: string;
}

interface TimelineFilterWrapperProps {
	items: TimelineItem[];
	projectSlug: string;
}

export default function TimelineFilterWrapper({ items, projectSlug }: TimelineFilterWrapperProps) {
	// Extract unique categories
	const categories = useMemo(() => {
		const cats = items
			.map(item => item.category)
			.filter((cat): cat is string => Boolean(cat));
		return Array.from(new Set(cats)).sort();
	}, [items]);

	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [isExpanded, setIsExpanded] = useState(true);

	const filteredItems = useMemo(() => {
		if (!selectedCategory) return items;
		return items.filter(item => item.category === selectedCategory);
	}, [items, selectedCategory]);

	return (
		<div className="flex flex-col md:flex-row gap-8 items-start relative pb-20">
			{/* Accordion Sidebar for Categories */}
			{categories.length > 0 && (
				<aside className="w-full md:w-[220px] shrink-0 md:sticky md:top-24 hidden md:block">
					<div className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md">
						<button
							onClick={() => setIsExpanded(!isExpanded)}
							className="flex items-center justify-between w-full text-left"
						>
							<div className="flex items-center gap-2">
								<Filter className="h-4 w-4 text-zinc-400" />
								<span className="text-sm font-semibold text-white">Filter by Category</span>
							</div>
							<ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform duration-300", isExpanded ? "rotate-180" : "")} />
						</button>

						<AnimatePresence initial={false}>
							{isExpanded && (
								<motion.div
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.3, ease: "easeInOut" }}
									className="overflow-hidden"
								>
									<div className="pt-4 flex flex-col gap-1.5">
										<button
											onClick={() => setSelectedCategory(null)}
											className={cn(
												"flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-all",
												selectedCategory === null
													? "bg-blue-500/10 text-blue-500 font-semibold border border-blue-500/20"
													: "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
											)}
										>
											<span>All Changes</span>
											{selectedCategory === null && <Check className="h-3.5 w-3.5" />}
										</button>

										{categories.map(category => (
											<button
												key={category}
												onClick={() => setSelectedCategory(category)}
												className={cn(
													"flex items-center justify-between w-full px-3 py-2 text-sm rounded-lg transition-all",
													selectedCategory === category
														? "bg-blue-500/10 text-blue-500 font-semibold border border-blue-500/20"
														: "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50"
												)}
											>
												<div className="flex items-center gap-2">
													<Layers className="h-3.5 w-3.5 opacity-60" />
													<span>{category}</span>
												</div>
												{selectedCategory === category && <Check className="h-3.5 w-3.5" />}
											</button>
										))}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</aside>
			)}

			{/* Mobile Categories Dropdown (Visible only on small screens) */}
			{categories.length > 0 && (
				<div className="w-full md:hidden mb-6">
					<ScrollArea className="w-full whitespace-nowrap pb-4">
						<div className="flex w-max space-x-2">
							<button
								onClick={() => setSelectedCategory(null)}
								className={cn(
									"px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
									selectedCategory === null
										? "bg-blue-500/10 text-blue-500 border-blue-500/20"
										: "bg-zinc-900 text-zinc-400 border-zinc-800"
								)}
							>
								All
							</button>
							{categories.map(category => (
								<button
									key={category}
									onClick={() => setSelectedCategory(category)}
									className={cn(
										"px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors border flex items-center gap-1.5",
										selectedCategory === category
											? "bg-blue-500/10 text-blue-500 border-blue-500/20"
											: "bg-zinc-950 text-zinc-400 border-zinc-900"
									)}
								>
									{category}
								</button>
							))}
						</div>
					</ScrollArea>
				</div>
			)}

			<div className="flex-1 min-w-0">
				<Timeline items={filteredItems} projectSlug={projectSlug} />
			</div>
		</div>
	);
}
