import { notFound } from 'next/navigation';
import { getProjectDocs, getProjectChanges } from '@/lib/docs';
import Sidebar from '@/components/Sidebar';
import DocLayout from '@/components/DocLayout';
import AnimatedContent from '@/components/AnimatedContent';
import TimelineFilterWrapper from '@/components/TimelineFilterWrapper';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface ChangesPageProps {
	params: Promise<{
		project: string;
	}>;
}

export default async function ChangesPage({ params }: ChangesPageProps) {
	const { project } = await params;

	const [allDocs, changes] = await Promise.all([
		getProjectDocs(project),
		getProjectChanges(project)
	]);

	if (allDocs.length === 0) {
		notFound();
	}

	const projectName = project.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

	const lastUpdated = changes.length > 0 && (changes[0] as any).date
		? new Date((changes[0] as any).date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
		: 'Recently';

	return (
		<DocLayout>
			<div className="flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-14 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
				<Sidebar projectName={projectName} projectSlug={project} docs={allDocs} />

				<main className="relative py-8 lg:gap-10 lg:py-12 max-w-full">
					<AnimatedContent>
						<div className="mx-auto w-full min-w-0 px-4 md:px-0 max-w-3xl">
							<div className="mb-6 flex items-center space-x-1.5 text-[13px] text-zinc-500 font-medium">
								<Link href="/projects" className="hover:text-zinc-300 transition-colors cursor-pointer">
									Projects
								</Link>
								<ChevronRight className="h-3.5 w-3.5 opacity-50" />
								<Link href={`/projects/${project}`} className="hover:text-zinc-300 transition-colors cursor-pointer text-white">
									{projectName}
								</Link>
								<ChevronRight className="h-3.5 w-3.5 opacity-50" />
								<div className="text-white">
									Timeline
								</div>
							</div>

							<div className="space-y-4 mb-16">
								<div className="flex items-center gap-3 mb-2">
									<Badge variant="outline" className="rounded-full bg-blue-500/10 text-blue-500 border-none text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5">
										Project Updates
									</Badge>
									<div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold">
										<Clock className="h-3.5 w-3.5" />
										Last updated {lastUpdated}
									</div>
								</div>
								<h1 className="scroll-m-20 text-[40px] font-extrabold tracking-tight text-white leading-none">
									Project Timeline
								</h1>
								<p className="text-xl text-zinc-400 leading-relaxed font-medium">
									A complete history of architectural decisions, feature implementations, and documentation updates for {projectName}.
								</p>
							</div>

							<TimelineFilterWrapper items={changes as any[]} projectSlug={project} />
						</div>
					</AnimatedContent>
				</main>
			</div>
		</DocLayout>
	);
}
