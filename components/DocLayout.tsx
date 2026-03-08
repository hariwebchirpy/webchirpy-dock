import React from 'react';
import Link from 'next/link';
import { Search, Github, Twitter, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DocLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/10">
			{/* Top Navigation Bar */}
			<header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
				<div className="container flex h-14 items-center gap-4 px-4 sm:px-8 max-w-(--breakpoint-2xl) mx-auto">
					<div className="flex items-center gap-2 md:gap-6">
						<Link href="/" className="flex items-center space-x-2">
							<Command className="h-6 w-6" />
							<span className="hidden font-bold sm:inline-block">
								WebChirpy<span className="text-primary/60">Docs</span>
							</span>
						</Link>
						<nav className="flex items-center space-x-6 text-sm font-medium">
							<Link href="/projects" className="transition-colors hover:text-foreground/80 text-foreground">Projects</Link>
							<Link href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">Showcase</Link>
							<Link href="#" className="transition-colors hover:text-foreground/80 text-foreground/60">Community</Link>
						</nav>
					</div>

					<div className="flex flex-1 items-center justify-end space-x-4">
						<div className="w-full flex-1 md:w-auto md:flex-initial">
							<div className="relative group">
								<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-foreground" />
								<Input
									type="search"
									placeholder="Search documentation..."
									className="pl-9 h-9 w-full md:w-[300px] lg:w-[400px] bg-muted/50 border-transparent hover:bg-muted/80 focus:bg-background transition-all"
								/>
								<kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
									<span className="text-xs">⌘</span>K
								</kbd>
							</div>
						</div>
						<nav className="flex items-center gap-1">
							<Button variant="ghost" size="icon" className="h-9 w-9">
								<Github className="h-4 w-4" />
								<span className="sr-only">GitHub</span>
							</Button>
							<Button variant="ghost" size="icon" className="h-9 w-9">
								<Twitter className="h-4 w-4" />
								<span className="sr-only">Twitter</span>
							</Button>
						</nav>
					</div>
				</div>
			</header>

			<div className="max-w-(--breakpoint-2xl) mx-auto">
				{children}
			</div>
		</div>
	);
}
