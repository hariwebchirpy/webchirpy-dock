'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronRight, FileText, LayoutGrid, Layers, Settings2, Code2, Rocket, HelpCircle, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
	projectName: string;
	projectSlug: string;
	docs: {
		slug: string;
		title: string;
		order: number;
	}[];
}

export default function Sidebar({ projectName, projectSlug, docs }: SidebarProps) {
	const pathname = usePathname();

	// Simple categorization helper
	const getIcon = (title: string) => {
		const t = title.toLowerCase();
		if (t.includes('overview')) return LayoutGrid;
		if (t.includes('setup')) return Rocket;
		if (t.includes('architecture')) return Layers;
		if (t.includes('deploy')) return Code2;
		if (t.includes('trouble')) return HelpCircle;
		return FileText;
	};

	return (
		<aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block md:w-[240px] lg:w-[260px]">
			<ScrollArea className="h-full py-6 pr-4 pl-4 lg:pl-0">
				<div className="flex flex-col gap-8">
					<div className="px-3">
						<h4 className="mb-3 rounded-md bg-white/5 border border-white/5 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-500 w-fit">
							Project
						</h4>
						<div className="flex items-center gap-2.5 text-sm font-bold text-white tracking-tight">
							<div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
								<LayoutGrid className="h-4 w-4 text-blue-500" />
							</div>
							{projectName}
						</div>
					</div>

					<div className="flex flex-col gap-1">
						<div className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
							<Layers className="h-3 w-3" />
							Navigation
						</div>
						<nav className="grid grid-flow-row auto-rows-max text-sm gap-0.5">
							{/* Timeline Link */}
							<Link
								href={`/projects/${projectSlug}/changes`}
								className={cn(
									"group flex w-full items-center rounded-md px-3 py-2 transition-all",
									pathname.startsWith(`/projects/${projectSlug}/changes`)
										? "bg-white/5 text-white font-semibold"
										: "text-zinc-500 hover:text-white"
								)}
							>
								<Clock className={cn(
									"mr-2.5 h-4 w-4 transition-colors",
									pathname.startsWith(`/projects/${projectSlug}/changes`) ? "text-blue-500" : "text-zinc-500 group-hover:text-zinc-300"
								)} />
								Timeline
								{pathname.startsWith(`/projects/${projectSlug}/changes`) && (
									<div className="ml-auto w-1 h-4 bg-blue-500 rounded-full animate-in fade-in zoom-in-50 duration-300" />
								)}
							</Link>

							{docs.map((doc) => {
								const href = `/projects/${projectSlug}/${doc.slug}`;
								const isActive = pathname === href;
								const Icon = getIcon(doc.title);

								return (
									<Link
										key={doc.slug}
										href={href}
										className={cn(
											"group flex w-full items-center rounded-md px-3 py-2 transition-all",
											isActive
												? "bg-white/5 text-white font-semibold"
												: "text-zinc-500 hover:text-white"
										)}
									>
										<Icon className={cn(
											"mr-2.5 h-4 w-4 transition-colors",
											isActive ? "text-blue-500" : "text-zinc-500 group-hover:text-zinc-300"
										)} />
										{doc.title}
										{isActive && (
											<div className="ml-auto w-1 h-4 bg-blue-500 rounded-full animate-in fade-in zoom-in-50 duration-300" />
										)}
									</Link>
								);
							})}
						</nav>
					</div>

					<div className="flex flex-col gap-1">
						<div className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
							<Settings2 className="h-3 w-3" />
							Resources
						</div>
						<nav className="grid grid-flow-row auto-rows-max text-sm gap-0.5 px-3">
							<Link href="https://github.com/hariwebchirpy/webchirpy-dock" target="_blank" className="flex w-full items-center py-1.5 text-zinc-500 hover:text-white transition-colors">
								GitHub Repository
							</Link>
							<Link href="/projects/webchirpy-dock/overview" className="flex w-full items-center py-1.5 text-zinc-500 hover:text-white transition-colors">
								Documentation Guide
							</Link>
						</nav>
					</div>
				</div>
			</ScrollArea>
		</aside>
	);
}
