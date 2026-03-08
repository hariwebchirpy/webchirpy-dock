import { redirect } from 'next/navigation';
import { getProjectDocs } from '@/lib/docs';

export default async function ProjectPage({ params }: { params: Promise<{ project: string }> }) {
	const { project } = await params;
	const docs = await getProjectDocs(project);

	if (docs.length > 0) {
		// Redirect to overview if it exists, otherwise to the first doc
		const hasOverview = docs.some(d => d.slug === 'overview');
		const target = hasOverview ? 'overview' : docs[0].slug;
		redirect(`/projects/${project}/${target}`);
	}

	redirect('/projects');
}
