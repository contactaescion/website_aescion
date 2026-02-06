import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui-kit/Card';
import { Button } from '../ui-kit/Button';
import { Search, Clock, Users, BookOpen } from 'lucide-react';
import { Input } from '../ui-kit/Input';
import { courses as coursesApi, type Course } from '../../api/courses';

export function Courses() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await coursesApi.getAll();
                setCourses(data);
            } catch (error) {
                console.error('Failed to fetch courses', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return <div className="py-20 text-center text-gray-500">Loading courses...</div>;
    }

    return (
        <section id="courses" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Our Courses</h2>
                        <p className="text-gray-600">
                            Industry-standard curriculum designed to get you hired. All courses include placement support.
                        </p>
                    </div>
                    <div className="w-full md:w-auto relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search className="w-5 h-5" />
                        </div>
                        <Input
                            placeholder="Search courses..."
                            className="pl-10 w-full md:w-80 bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCourses.map((course) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full flex flex-col p-6 hover:shadow-lg transition-shadow">
                                <div className="mb-4">
                                    <div className="bg-brand-blue/10 w-12 h-12 rounded-lg flex items-center justify-center text-brand-blue mb-4">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                                </div>

                                <div className="space-y-3 mb-6 flex-grow">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {course.duration}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Users className="w-4 h-4 mr-2" />
                                        {course.mode}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <div className="text-brand-orange font-bold text-lg">{course.fees}</div>
                                    <a href="#contact">
                                        <Button size="sm" variant="outline">
                                            Enquire
                                        </Button>
                                    </a>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
