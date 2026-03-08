'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, LayoutGrid, Rocket, Command } from 'lucide-react';
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command';

interface SearchResult {
	project: string;
	projectSlug: string;
	title: string;
	slug: string;
	href: string;
}

export default function SearchDialog() {
	const [open, setOpen] = React.useState(false);
	const [results, setResults] = React.useState<SearchResult[]>([]);
	const [loading, setLoading] = React.useState(true);
	const router = useRouter();

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};

		document.addEventListener('keydown', down);

		// Fetch search indexing data
		fetch('/api/search')
			.then((res) => res.json())
			.then((data) => {
				setResults(data);
				setLoading(false);
			})
			.catch((err) => console.error('Search index failed:', err));

		return () => document.removeEventListener('keydown', down);
	}, []);

	const onSelect = React.useCallback((href: string) => {
		setOpen(false);
		router.push(href);
	}, [router]);

	return (
		<>
			<div
				onClick={() => setOpen(true)}
				className="relative group max-w-[200px] md:max-w-none cursor-pointer"
			>
				<Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500 group-hover:text-white transition-colors" />
				<div className="pl-9 h-9 w-full md:w-[240px] lg:w-[320px] bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900 transition-all rounded-lg flex items-center text-zinc-500 text-xs select-none">
					Quick search...
				</div>
				<kbd className="pointer-events-none absolute right-2 top-2 h-5 select-none items-center gap-1 rounded border border-zinc-800 bg-black px-1.5 font-mono text-[10px] font-medium text-zinc-500 opacity-100 sm:flex">
					⌘K
				</kbd>
			</div>

			<CommandDialog open={open} onOpenChange={setOpen}>
				<CommandInput placeholder="Search documentation..." />
				<CommandList className="max-h-[400px]">
					<CommandEmpty>No results found.</CommandEmpty>

					{/* Group results by project */}
					{Array.from(new Set(results.map(r => r.project))).map(projectName => (
						<CommandGroup key={projectName} heading={projectName}>
							{results.filter(r => r.project === projectName).map((result) => (
								<CommandItem
									key={result.href}
									onSelect={() => onSelect(result.href)}
									className="flex items-center gap-2 px-4 py-3 cursor-pointer"
								>
									{result.slug === 'overview' ? (
										<LayoutGrid className="h-4 w-4 text-zinc-500" />
									) : result.slug.includes('setup') ? (
										<Rocket className="h-4 w-4 text-zinc-500" />
									) : (
										<FileText className="h-4 w-4 text-zinc-500" />
									)}
									<span className="flex-1">{result.title}</span>
									<span className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest border border-zinc-900 px-1.5 rounded bg-zinc-950">
										{result.slug.replace(/-/g, ' ')}
									</span>
								</CommandItem>
							))}
						</CommandGroup>
					))}
				</CommandList>
			</CommandDialog>
		</>
	);
}
