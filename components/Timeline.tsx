'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, GitCommit, ChevronRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface TimelineItem {
	slug: string;
	title: string;
	date?: string;
	commit?: string;
	repo?: string;
	category?: string;
}

interface TimelineProps {
	items: TimelineItem[];
	projectSlug: string;
}

export default function Timeline({ items, projectSlug }: TimelineProps) {
	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-center">
				<div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
					<GitCommit className="h-8 w-8 text-zinc-500" />
				</div>
				<h3 className="text-xl font-bold text-white mb-2">No changes yet</h3>
				<p className="text-zinc-500 max-w-xs">
					We haven't recorded any major changes for this project recently. Check back later!
				</p>
			</div>
		);
	}

	return (
		<div className="relative space-y-1">
			{/* Vertical Line */}
			<div className="absolute left-[17px] top-2 bottom-2 w-0.5 bg-zinc-800" />

			{items.map((item, index) => (
				<motion.div
					key={item.slug}
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: index * 0.05, duration: 0.3 }}
					className="relative pl-12 pb-10 group"
				>
					{/* Dot */}
					<div className="absolute left-0 top-1.5 flex items-center justify-center w-[36px] h-[36px]">
						<div className="w-2.5 h-2.5 rounded-full bg-zinc-700 border-2 border-black ring-4 ring-black z-10 group-hover:bg-blue-500 transition-colors duration-300" />
						{index === 0 && (
							<div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping" />
						)}
					</div>

					{/* Content */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center gap-3">
							<div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
								<Calendar className="h-3 w-3" />
								{item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
							</div>
							{item.category && (
								<Badge variant="outline" className="bg-zinc-500/5 text-zinc-400 border-zinc-800 text-[10px] font-bold h-5 px-1.5 uppercase tracking-tighter">
									{item.category}
								</Badge>
							)}
							{index === 0 && (
								<Badge variant="outline" className="bg-blue-500/5 text-blue-500 border-blue-500/20 text-[10px] font-bold h-5 px-1.5 uppercase tracking-tighter">
									Latest
								</Badge>
							)}
						</div>

						<Link
							href={`/projects/${projectSlug}/changes/${item.slug}`}
							className="group/link flex flex-col gap-2 p-5 rounded-2xl border border-zinc-900 bg-zinc-950/50 hover:bg-zinc-900/50 hover:border-zinc-800 transition-all duration-300"
						>
							<div className="flex items-start justify-between gap-4">
								<h3 className="text-lg font-bold text-white group-hover/link:text-blue-400 transition-colors leading-tight">
									{item.title}
								</h3>
								<div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-500 group-hover/link:text-white group-hover/link:bg-blue-600 group-hover/link:border-blue-500 transition-all">
									<ArrowUpRight className="h-4 w-4" />
								</div>
							</div>

							<div className="flex items-center justify-between mt-1">
								<div className="flex items-center gap-1.5 text-sm font-medium text-zinc-500">
									View technical changes
									<ChevronRight className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all" />
								</div>
								{item.commit && (
									<div
										onClick={(e) => {
											e.preventDefault();
											e.stopPropagation();
											const fullRepo = (item.repo && item.repo.includes('/')) ? item.repo : `hariwebchirpy/${item.repo || projectSlug}`;
											window.open(`https://github.com/${fullRepo}/commit/${item.commit}`, '_blank');
										}}
										className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 hover:text-white transition-colors bg-zinc-900 px-2 py-0.5 rounded cursor-pointer border border-zinc-800/50"
									>
										<GitCommit className="h-2.5 w-2.5" />
										{item.commit.substring(0, 7)}
									</div>
								)}
							</div>
						</Link>
					</div>
				</motion.div>
			))}
		</div>
	);
}
