import Link from 'next/link';
import { getProjects } from '@/lib/docs';
import DocLayout from '@/components/DocLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, ExternalLink } from 'lucide-react';

export default async function ProjectsPage() {
	const projects = await getProjects();

	return (
		<DocLayout>
			<main className="container mx-auto px-4 py-16 sm:px-8 max-w-(--breakpoint-2xl)">
				<div className="flex flex-col gap-4 mb-12">
					<Badge variant="outline" className="w-fit text-primary font-mono px-3 py-1 bg-primary/5 uppercase tracking-tighter">
						Knowledge Repository
					</Badge>
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
						Software Projects
					</h1>
					<p className="text-xl text-muted-foreground max-w-[700px]">
						A central hub for our documentation, internal playbooks, and architecture guides. Select a project to begin.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{projects.map((project) => (
						<Link
							key={project.slug}
							href={`/projects/${project.slug}/overview`}
							className="group"
						>
							<Card className="h-full transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 border hover:border-primary/50 bg-card/50 backdrop-blur-sm overflow-hidden relative">
								<div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
									<ExternalLink className="h-4 w-4 text-muted-foreground" />
								</div>
								<CardHeader className="space-y-4">
									<div className="w-12 h-12 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-105 transition-all">
										<BookOpen className="h-6 w-6 text-primary" />
									</div>
									<div>
										<CardTitle className="text-xl font-bold tracking-tight mb-1">
											{project.name}
										</CardTitle>
										<CardDescription className="line-clamp-2 text-sm leading-relaxed">
											{project.description}
										</CardDescription>
									</div>
								</CardHeader>
								<CardContent>
									<div className="flex items-center text-sm font-semibold text-primary transition-all">
										Explore Documentation
										<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
									</div>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			</main>
		</DocLayout>
	);
}
