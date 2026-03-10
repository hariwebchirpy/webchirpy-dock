import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getDocContent, getProjectDocs } from '@/lib/docs';
import Sidebar from '@/components/Sidebar';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import DocLayout from '@/components/DocLayout';
import TableOfContents from '@/components/TableOfContents';
import AnimatedContent from '@/components/AnimatedContent';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Clock, Github, MessageSquare, Command, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageProps {
	params: Promise<{
		project: string;
		doc: string;
	}>;
}

export default async function DocPage({ params }: PageProps) {
	const { project, doc } = await params;

	const [docData, allDocs] = await Promise.all([
		getDocContent(project, doc),
		getProjectDocs(project)
	]);

	if (!docData) {
		notFound();
	}

	const projectName = project.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
	const docTitle = docData.metadata.title || doc.replace(/-/g, ' ');

	// Extract headings for TOC
	const headings = docData.content.split('\n')
		.filter(line => line.startsWith('## ')) // We'll focus on H2s for TOC clarity
		.map(line => {
			const text = line.replace(/^## /, '').trim();
			const id = text.toLowerCase()
				.replace(/[^\w\s-]/g, '')
				.replace(/\s+/g, '-');
			return { text, id };
		});

	return (
		<DocLayout>
			<div className="flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-14 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
				<Sidebar projectName={projectName} projectSlug={project} docs={allDocs} />

				<main className="relative py-8 lg:gap-10 lg:py-12 xl:grid xl:grid-cols-[1fr_260px] max-w-full">
					<AnimatedContent>
						<div className="mx-auto w-full min-w-0 px-4 md:px-0">
							<div className="mb-6 flex items-center space-x-1.5 text-[13px] text-zinc-500 font-medium">
								<Link href="/projects" className="hover:text-zinc-300 transition-colors cursor-pointer">
									Projects
								</Link>
								<ChevronRight className="h-3.5 w-3.5 opacity-50" />
								<Link href={`/projects/${project}`} className="hover:text-zinc-300 transition-colors cursor-pointer">
									{projectName}
								</Link>
								<ChevronRight className="h-3.5 w-3.5 opacity-50" />
								<div className="text-white">
									{docTitle}
								</div>
							</div>

							<div className="space-y-4 mb-12">
								<div className="flex items-center gap-3 mb-2">
									<Badge variant="outline" className="rounded-full bg-blue-500/10 text-blue-500 border-none text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5">
										Production Ready
									</Badge>
									<Link
										href="https://github.com/hariwebchirpy/webchirpy-dock"
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer text-xs font-semibold"
									>
										<Star className="h-3.5 w-3.5 fill-zinc-500/20" />
										Star on GitHub
									</Link>
								</div>
								<h1 className="scroll-m-20 text-[40px] font-extrabold tracking-tight text-white leading-none">
									{docTitle}
								</h1>
								{docData.metadata.description && (
									<p className="text-xl text-zinc-400 leading-relaxed font-medium">
										{docData.metadata.description}
									</p>
								)}
							</div>

							<MarkdownRenderer content={docData.content} projectSlug={project} />

							<Separator className="my-24 bg-zinc-900" />

							<div className="flex flex-col gap-10 mb-24">
								<div className="flex flex-col gap-3">
									<h3 className="font-bold text-xl tracking-tight text-white">Need help?</h3>
									<p className="text-zinc-500 text-[15px] leading-relaxed max-w-md">Our engineering team is always available to help you with your implementation questions or feedback.</p>
								</div>
								<div className="flex flex-wrap gap-4">
									<Link
										href={`https://github.com/hariwebchirpy/webchirpy-dock/blob/main/content/projects/${project}/${doc}.md`}
										target="_blank"
										rel="noopener noreferrer"
										className="bg-white text-black hover:bg-zinc-200 font-bold rounded-xl px-6 h-11 inline-flex items-center justify-center transition-colors"
									>
										<Github className="mr-2 h-4 w-4" /> View Source
									</Link>
									<Button variant="outline" className="border-zinc-800 bg-transparent hover:bg-white/5 font-bold rounded-xl px-4 h-11">
										<MessageSquare className="mr-2 h-4 w-4" /> Feedback
									</Button>
								</div>
							</div>
						</div>
					</AnimatedContent>

					<aside className="hidden text-sm xl:block sticky top-28 h-fit px-6 border-l border-zinc-900 ml-10">
						<div className="flex flex-col gap-8">
							<TableOfContents headings={headings} />

							<div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col gap-5 shadow-2xl">
								<div className="flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest text-zinc-400">
									<Command className="h-4 w-4 text-white" />
									Playbook Updates
								</div>
								<p className="text-[13px] text-zinc-500 leading-relaxed">
									Subscribe to get notified about changes to this engineering playbook.
								</p>
								<Button size="sm" className="w-full bg-white text-black hover:bg-zinc-200 font-bold rounded-lg h-9">
									Subscribe
								</Button>
							</div>
						</div>
					</aside>
				</main>
			</div>
		</DocLayout>
	);
}
