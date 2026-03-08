'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Rocket, ExternalLink, ShieldCheck } from 'lucide-react';

interface Project {
	slug: string;
	name: string;
	description: string;
}

export default function AnimatedProjectGrid({ projects }: { projects: Project[] }) {
	const container: Variants = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.2
			}
		}
	};

	const item: Variants = {
		hidden: { opacity: 0, y: 20 },
		show: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				ease: [0.22, 1, 0.36, 1] // Custom ease-out expo
			}
		}
	};

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
		>
			{projects.map((project) => (
				<motion.div key={project.slug} variants={item}>
					<Link
						href={`/projects/${project.slug}/overview`}
						className="group block h-full"
					>
						<Card className="h-full transition-all duration-300 border-zinc-900 bg-zinc-950/50 hover:bg-zinc-950 hover:border-zinc-800 hover:shadow-2xl hover:shadow-blue-500/5 overflow-hidden relative rounded-2xl group">
							<div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
								<ExternalLink className="h-4 w-4 text-zinc-600" />
							</div>
							<CardHeader className="space-y-6 p-8">
								<div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600/10 group-hover:border-blue-500/20 transition-all duration-500">
									<Rocket className="h-7 w-7 text-zinc-400 group-hover:text-blue-500 transition-colors" />
								</div>
								<div className="space-y-2">
									<CardTitle className="text-2xl font-bold tracking-tight text-white group-hover:text-blue-500 transition-colors">
										{project.name}
									</CardTitle>
									<CardDescription className="line-clamp-3 text-[15px] leading-relaxed text-zinc-500 font-medium whitespace-pre-wrap">
										{project.description}
									</CardDescription>
								</div>
							</CardHeader>
							<CardContent className="px-8 pb-8 pt-0 mt-auto">
								<Separator className="mb-6 bg-zinc-900" />
								<div className="flex items-center text-sm font-bold text-zinc-400 group-hover:text-white transition-all">
									Explore Documentation
									<ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
								</div>
							</CardContent>
						</Card>
					</Link>
				</motion.div>
			))}

			{/* Internal Reference Card */}
			<motion.div variants={item}>
				<div className="group block h-full cursor-not-allowed grayscale p-px rounded-2xl bg-linear-to-b from-zinc-800 to-transparent opacity-40">
					<div className="h-full p-8 bg-black rounded-2xl flex flex-col gap-6">
						<div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
							<ShieldCheck className="h-7 w-7 text-zinc-700" />
						</div>
						<div className="space-y-2">
							<h3 className="text-2xl font-bold tracking-tight text-zinc-700">Internal Security</h3>
							<p className="text-[15px] text-zinc-800 font-medium">Coming soon for authenticated users.</p>
						</div>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}
