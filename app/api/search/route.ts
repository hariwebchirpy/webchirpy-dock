import { NextResponse } from 'next/server';
import { getProjects, getProjectDocs } from '@/lib/docs';

export async function GET() {
	try {
		const projects = await getProjects();
		const allDocs = await Promise.all(
			projects.map(async (project) => {
				const docs = await getProjectDocs(project.slug);
				return docs.map((doc) => ({
					project: project.name,
					projectSlug: project.slug,
					title: doc.title,
					slug: doc.slug,
					href: `/projects/${project.slug}/${doc.slug}`
				}));
			})
		);

		return NextResponse.json(allDocs.flat());
	} catch (error) {
		return NextResponse.json({ error: 'Failed to fetch search data' }, { status: 500 });
	}
}
