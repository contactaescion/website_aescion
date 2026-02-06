import { motion } from 'framer-motion';
import { Button } from '../ui-kit/Button';
import { Check,} from 'lucide-react';
import { useEffect, useState } from 'react';
import { courses as coursesApi, type Course } from '../../api/courses';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';

export function FeaturedCourse() {
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedCourse = async () => {
            try {
                const allCourses = await coursesApi.getAll();
                const featured = allCourses.find(c => c.is_featured);
                setCourse(featured || null);
            } catch (error) {
                console.error('Failed to fetch featured course', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedCourse();
    }, []);

    // Effect to highlight code when course updates
    useEffect(() => {
        if (course?.code_snippet) {
            Prism.highlightAll();
        }
    }, [course]);

    if (loading) return <div className="py-24 bg-gray-900 text-center text-white">Loading featured course...</div>;
    if (!course) return null; // Or show a default fallback

    // Map features based on course data if possible, or use defaults
    const features = [
        '100% Placement Assistance',
        'Live Project Development',
        'Mock Interviews & Resume Building',
        `Duration: ${course.duration}`,
        `Mode: ${course.mode}`
    ];

    return (
        <section id="featured" className="py-24 bg-gray-900 text-white overflow-hidden relative">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-10 right-10 w-96 h-96 bg-brand-blue rounded-full blur-[100px]" />
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-brand-orange rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="flex-1 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/20 text-brand-orange text-sm font-semibold">
                            <span>★ Featured Course</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                            Master {course.title}
                        </h2>

                        <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
                            Become a complete professional with our flagship <strong>{course.title}</strong> course.
                            Learn from experts with real-world curriculum.
                            Fees: <span className="text-brand-orange font-bold">{course.fees}</span>
                        </p>

                        <ul className="space-y-4">
                            {features.map((item) => (
                                <li key={item} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <span className="text-gray-300 font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <a href="#contact">
                                <Button size="lg" className="bg-brand-blue hover:bg-blue-600 text-white border-none shadow-lg shadow-blue-500/20">
                                    Get Syllabus & Fees
                                </Button>
                            </a>
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10"
                        >
                            {/* Code Preview */}
                            <div className="bg-[#1e1e1e] p-6 rounded-t-lg flex items-center gap-2 border-b border-white/5">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <div className="ml-4 text-xs text-gray-400 font-mono">
                                    aescion.dev
                                </div>
                            </div>
                            <div className="bg-[#0d0d0d] p-8 text-sm font-mono text-gray-300 leading-relaxed overflow-x-auto min-h-[200px] flex items-center">
                                {course.code_snippet ? (
                                    <pre className="m-0 bg-transparent w-full" style={{ background: "#0d0d0d" }}>
                                        <code className="language-javascript" dangerouslySetInnerHTML={{ __html: course.code_snippet }} />
                                    </pre>
                                ) : (
                                    <div className="text-center w-full">
                                        <p className="text-brand-orange font-bold text-lg">{course.title}</p>
                                        <p className="text-gray-500 mt-2">Learn by building real projects</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-brand-orange rounded-full blur-xl opacity-20 animate-pulse" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-brand-blue rounded-full blur-xl opacity-20 animate-pulse" />
                    </div>
                </div>
            </div>
        </section>
    );
}
