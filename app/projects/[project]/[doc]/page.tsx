import { notFound } from 'next/navigation';
import { getDocContent, getProjectDocs } from '@/lib/docs';
import Sidebar from '@/components/Sidebar';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import DocLayout from '@/components/DocLayout';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Clock, Github, MessageSquare, Command } from 'lucide-react';
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

	return (
		<DocLayout>
			<div className="flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-10">
				<Sidebar projectName={projectName} projectSlug={project} docs={allDocs} />

				<main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px] max-w-full">
					<div className="mx-auto w-full min-w-0 px-4 md:px-0">
						<div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
							<div className="overflow-hidden text-ellipsis whitespace-nowrap">
								Projects
							</div>
							<ChevronRight className="h-4 w-4" />
							<div className="overflow-hidden text-ellipsis whitespace-nowrap">
								{projectName}
							</div>
							<ChevronRight className="h-4 w-4" />
							<div className="font-medium text-foreground">
								{docTitle}
							</div>
						</div>

						<div className="space-y-2 mb-8">
							<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight">
								{docTitle}
							</h1>
							{docData.metadata.description && (
								<p className="text-xl text-muted-foreground leading-relaxed">
									{docData.metadata.description}
								</p>
							)}
						</div>

						<div className="flex items-center space-x-4 text-sm text-muted-foreground mb-12">
							<div className="flex items-center">
								<Clock className="mr-1 h-4 w-4" />
								<span>Updated Mar 2026</span>
							</div>
							<Separator orientation="vertical" className="h-4" />
							<div className="flex items-center">
								<Badge variant="secondary" className="bg-primary/5 hover:bg-primary/10 text-primary border-none">
									v1.0.0
								</Badge>
							</div>
						</div>

						<MarkdownRenderer content={docData.content} />

						<Separator className="my-20" />

						<div className="flex flex-col gap-8 mb-20">
							<div className="flex flex-col gap-2">
								<h3 className="font-bold text-lg">Next Steps</h3>
								<p className="text-muted-foreground text-sm">Was this page helpful? Join our community or contribute on GitHub.</p>
							</div>
							<div className="flex flex-wrap gap-4">
								<Button variant="outline" size="sm" className="gap-2">
									<Github className="h-4 w-4" /> Edit this page
								</Button>
								<Button variant="outline" size="sm" className="gap-2">
									<MessageSquare className="h-4 w-4" /> Give feedback
								</Button>
							</div>
						</div>
					</div>

					<aside className="hidden text-sm xl:block sticky top-24 h-fit px-8 border-l">
						<div className="flex flex-col gap-6">
							<div>
								<h4 className="mb-4 font-bold uppercase tracking-widest text-[11px] text-muted-foreground">
									On this page
								</h4>
								<nav className="flex flex-col gap-3">
									<a href="#" className="font-medium text-primary hover:underline transition-colors">Overview</a>
									<a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Architecture</a>
									<a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Key Features</a>
									<a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Configuration</a>
								</nav>
							</div>

							<div className="rounded-xl border bg-card/50 p-6 flex flex-col gap-4">
								<div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest">
									<Command className="h-3 w-3 text-primary" />
									Newsletter
								</div>
								<p className="text-xs text-muted-foreground leading-relaxed">
									Get the latest engineering updates and playbooks delivered to your inbox.
								</p>
								<Button size="sm" className="w-full text-xs h-8">
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
