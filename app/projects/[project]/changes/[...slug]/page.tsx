import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getChangeContent, getProjectDocs } from '@/lib/docs';
import Sidebar from '@/components/Sidebar';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import DocLayout from '@/components/DocLayout';
import AnimatedContent from '@/components/AnimatedContent';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, ChevronRight, Clock, Github } from 'lucide-react';

interface ChangePageProps {
	params: Promise<{
		project: string;
		slug: string[];
	}>;
}

export default async function ChangePage({ params }: ChangePageProps) {
	const { project, slug } = await params;

	const [changeData, allDocs] = await Promise.all([
		getChangeContent(project, slug),
		getProjectDocs(project)
	]);

	if (!changeData) {
		notFound();
	}

	const projectName = project.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
	const changeTitle = changeData.metadata.title || slug[slug.length - 1].replace(/-/g, ' ');
	const category = slug.length > 1 ? slug[0].charAt(0).toUpperCase() + slug[0].slice(1) : null;

	return (
		<DocLayout>
			<div className="flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-14 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
				<Sidebar projectName={projectName} projectSlug={project} docs={allDocs} />

				<main className="relative py-8 lg:gap-10 lg:py-12 max-w-full">
					<AnimatedContent>
						<div className="mx-auto w-full min-w-0 px-4 md:px-0">
							<div className="mb-6 flex items-center space-x-1.5 text-[13px] text-zinc-500 font-medium">
								<div className="hover:text-zinc-300 transition-colors cursor-pointer text-white">
									{projectName}
								</div>
								<ChevronRight className="h-3.5 w-3.5 opacity-50" />
								<Link href={`/projects/${project}/changes`} className="hover:text-zinc-300 transition-colors cursor-pointer">
									Timeline
								</Link>
								{category && (
									<>
										<ChevronRight className="h-3.5 w-3.5 opacity-50" />
										<div className="hover:text-zinc-300 transition-colors cursor-pointer">
											{category}
										</div>
									</>
								)}
								<ChevronRight className="h-3.5 w-3.5 opacity-50" />
								<div className="text-white">
									{changeTitle}
								</div>
							</div>

							<div className="space-y-4 mb-12">
								<div className="flex items-center gap-3 mb-2">
									<Badge variant="outline" className="rounded-full bg-blue-500/10 text-blue-500 border-none text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5">
										Code Change
									</Badge>
									{category && (
										<Badge variant="outline" className="rounded-full bg-zinc-500/10 text-zinc-400 border-none text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5">
											{category}
										</Badge>
									)}
									<div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold">
										<Clock className="h-3.5 w-3.5" />
										{changeData.metadata.date ? new Date(changeData.metadata.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'}
									</div>
								</div>
								<h1 className="scroll-m-20 text-[40px] font-extrabold tracking-tight text-white leading-none">
									{changeTitle}
								</h1>
								{changeData.metadata.commit && (
									<Link
										href={`https://github.com/hariwebchirpy/${changeData.metadata.repo || project}/commit/${changeData.metadata.commit}`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 text-sm font-mono text-zinc-500 bg-zinc-900/50 hover:bg-zinc-900 hover:text-white transition-all w-fit px-3 py-1 rounded-lg border border-zinc-800"
									>
										<Github className="h-3.5 w-3.5" />
										Commit: {changeData.metadata.commit.substring(0, 7)}
									</Link>
								)}
							</div>

							<MarkdownRenderer content={changeData.content} />

							<Separator className="my-24 bg-zinc-900" />

							<div className="flex items-center">
								<Link
									href={`/projects/${project}/changes`}
									className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors font-bold group"
								>
									<ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
									Back to Timeline
								</Link>
							</div>
						</div>
					</AnimatedContent>
				</main>
			</div>
		</DocLayout>
	);
}
