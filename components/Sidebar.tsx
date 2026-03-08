'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronRight, FileText, LayoutGrid, Layers, Settings2 } from 'lucide-react';
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

	return (
		<aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block md:w-[240px] lg:w-[280px]">
			<ScrollArea className="h-full py-6 pr-6 pl-8">
				<div className="flex flex-col gap-6">
					<div className="px-2">
						<h4 className="mb-4 rounded-md bg-muted/50 px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mr-auto inline-block">
							Project
						</h4>
						<div className="flex items-center gap-2 text-sm font-bold text-foreground">
							<LayoutGrid className="h-4 w-4 text-primary" />
							{projectName}
						</div>
					</div>

					<div className="flex flex-col gap-1">
						<div className="px-2 mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							<Layers className="h-3 w-3" />
							Contents
						</div>
						<nav className="grid grid-flow-row auto-rows-max text-sm">
							{docs.map((doc) => {
								const href = `/projects/${projectSlug}/${doc.slug}`;
								const isActive = pathname === href;

								return (
									<Link
										key={doc.slug}
										href={href}
										className={cn(
											"group flex w-full items-center rounded-md border border-transparent px-2 py-1.5 transition-all",
											isActive
												? "bg-primary/5 text-primary font-medium"
												: "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
										)}
									>
										<span className={cn(
											"mr-2 h-1.5 w-1.5 rounded-full transition-all shrink-0",
											isActive ? "bg-primary scale-100" : "bg-transparent scale-0 group-hover:scale-100 group-hover:bg-muted-foreground/40"
										)} />
										{doc.title}
										{isActive && <ChevronRight className="ml-auto h-3 w-3 animate-in fade-in slide-in-from-left-1" />}
									</Link>
								);
							})}
						</nav>
					</div>

					<div className="flex flex-col gap-1">
						<div className="px-2 mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							<Settings2 className="h-3 w-3" />
							Reference
						</div>
						<nav className="grid grid-flow-row auto-rows-max text-sm">
							<Link href="#" className="flex w-full items-center rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground">
								API Reference
							</Link>
							<Link href="#" className="flex w-full items-center rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted/50 hover:text-foreground">
								CLI Commands
							</Link>
						</nav>
					</div>
				</div>
			</ScrollArea>
		</aside>
	);
}
