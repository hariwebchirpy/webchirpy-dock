import React from 'react';
import Link from 'next/link';
import { Search, Github, Twitter, Command, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SearchDialog from './SearchDialog';
import Image from 'next/image';

export default function DocLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/20">
			{/* Top Navigation Bar */}
			<header className="sticky top-0 z-50 w-full border-b border-zinc-800/50 bg-black/70 backdrop-blur-xl">
				<div className="container flex h-14 items-center gap-4 px-4 sm:px-8 max-w-7xl mx-auto">
					<div className="flex items-center gap-2 md:gap-8">
						<Link href="/" className="flex items-center space-x-2.5">
							<div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
								{/* <Command className="h-5 w-5 text-white" /> */}
								<Image src="/logo.png" alt="Logo" width={24} height={24} />
							</div>
							<span className="hidden font-bold sm:inline-block tracking-tight">
								<span className="text-zinc-500">WebChirpy</span>
							</span>
						</Link>
						<nav className="flex items-center space-x-6 text-sm font-medium">
							<Link href="/projects" className="transition-colors hover:text-white text-zinc-100">Projects</Link>
						</nav>
					</div>

					<div className="flex flex-1 items-center justify-end space-x-4">
						<div className="w-full flex-1 md:w-auto md:flex-initial">
							<SearchDialog />
						</div>
						<nav className="flex items-center gap-1">
							<Link
								href="https://github.com/hariwebchirpy/webchirpy-dock"
								target="_blank"
								rel="noopener noreferrer"
								className="h-9 w-9 inline-flex items-center justify-center rounded-md text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors"
							>
								<Github className="h-4 w-4" />
								<span className="sr-only">GitHub</span>
							</Link>
						</nav>
					</div>
				</div>
			</header>

			<div className="container mx-auto max-w-7xl">
				{children}
			</div>
		</div>
	);
}
