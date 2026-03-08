import Link from 'next/link';
import { getProjects } from '@/lib/docs';
import DocLayout from '@/components/DocLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AnimatedProjectGrid from '@/components/AnimatedProjectGrid';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, BookOpen, ExternalLink, Library, Rocket, ShieldCheck } from 'lucide-react';

export default async function ProjectsPage() {
	const projects = await getProjects();

	return (
		<DocLayout>
			<main className="container mx-auto px-6   py-20 max-w-7xl">
				<div className="flex flex-col gap-6 mb-16 max-w-2xl">
					<div className="flex items-center gap-2 text-blue-500 font-bold uppercase tracking-widest text-[10px] bg-blue-500/10 w-fit px-3 py-1 rounded-full border border-blue-500/20">
						<Library className="h-3 w-3" />
						Engineering Hub
					</div>
					<h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
						Software <span className="text-zinc-600">Playbooks</span>
					</h1>
					<p className="text-lg text-zinc-400 leading-relaxed font-medium">
						A collection of technical documentation, architecture guides, and internal engineering patterns for WebChirpy projects.
					</p>
				</div>

				<AnimatedProjectGrid projects={projects} />
			</main>
		</DocLayout>
	);
}
