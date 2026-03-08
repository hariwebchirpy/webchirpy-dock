import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content/projects');

export interface DocMetadata {
	title: string;
	description?: string;
	order?: number;
	[key: string]: any;
}

export interface DocContent {
	slug: string;
	metadata: DocMetadata;
	content: string;
}

export interface ProjectInfo {
	name: string;
	slug: string;
	description: string;
}

export interface DocListItem {
	slug: string;
	title: string;
	order: number;
}

export async function getProjects(): Promise<ProjectInfo[]> {
	if (!fs.existsSync(contentDirectory)) return [];

	const projectDirs = fs.readdirSync(contentDirectory).filter(file => {
		return fs.statSync(path.join(contentDirectory, file)).isDirectory();
	});

	return projectDirs.map(dir => {
		const projectPath = path.join(contentDirectory, dir);
		const metaPath = path.join(projectPath, 'meta.json');
		const overviewPath = path.join(projectPath, 'overview.md');

		let name = dir.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
		let description = `Documentation for ${name}. Includes setup instructions and guides.`;

		if (fs.existsSync(metaPath)) {
			try {
				const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
				if (meta.name) name = meta.name;
				if (meta.description) description = meta.description;
			} catch (e) {
				console.error(`Error parsing meta.json for ${dir}`, e);
			}
		}
		else if (fs.existsSync(overviewPath)) {
			try {
				const fileContents = fs.readFileSync(overviewPath, 'utf8');
				const { data } = matter(fileContents);
				if (data.description) description = data.description;
			} catch (e) {
				console.error(`Error parsing overview.md for ${dir}`, e);
			}
		}

		return {
			name,
			slug: dir,
			description,
		};
	});
}

export async function getProjectDocs(projectSlug: string): Promise<DocListItem[]> {
	const projectPath = path.join(contentDirectory, projectSlug);
	if (!fs.existsSync(projectPath)) return [];

	const files = fs.readdirSync(projectPath).filter(file => file.endsWith('.md'));

	const docs = files.map(file => {
		const slug = file.replace(/\.md$/, '');
		const fullPath = path.join(projectPath, file);
		const fileContents = fs.readFileSync(fullPath, 'utf8');
		const { data } = matter(fileContents);

		return {
			slug,
			title: data.title || slug.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
			order: data.order !== undefined ? data.order : 999,
		};
	});

	return docs.sort((a, b) => a.order - b.order);
}

export async function getDocContent(projectSlug: string, docSlug: string): Promise<DocContent | null> {
	const fullPath = path.join(contentDirectory, projectSlug, `${docSlug}.md`);
	if (!fs.existsSync(fullPath)) return null;

	const fileContents = fs.readFileSync(fullPath, 'utf8');
	const { data, content } = matter(fileContents);

	return {
		slug: docSlug,
		metadata: data as DocMetadata,
		content,
	};
}
