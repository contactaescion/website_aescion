import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui-kit/Button';
import { Input } from '../../components/ui-kit/Input';
import { Card } from '../../components/ui-kit/Card';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { courses as coursesApi, type Course } from '../../api/courses';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; // VS Code dark-like theme

export function CoursesManager() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, reset, setValue, watch } = useForm();

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await coursesApi.getAll();
            setCourses(data);
        } catch (error) {
            console.error('Failed to fetch courses', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const onDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this course?')) {
            try {
                await coursesApi.delete(id);
                fetchCourses();
            } catch (error: any) {
                console.error('Failed to delete course', error);
                const msg = error.response?.data?.message || error.message || 'Failed to delete course';
                alert(`Failed to delete course: ${msg}`);
            }
        }
    };

    const onToggleFeature = async (course: Course) => {
        try {
            await coursesApi.update(course.id, { is_featured: !course.is_featured });
            fetchCourses();
        } catch (error) {
            console.error('Failed to update course', error);
        }
    };

    const onSubmit = async (data: any) => {
        try {
            if (editingCourse) {
                await coursesApi.update(editingCourse.id, data);
            } else {
                await coursesApi.create({
                    ...data,
                    is_featured: false
                });
            }
            setIsFormOpen(false);
            setEditingCourse(null);
            reset({});
            fetchCourses();
        } catch (error) {
            console.error('Failed to save course', error);
            alert('Failed to save course');
        }
    };

    const handleEdit = (course: Course) => {
        setEditingCourse(course);
        setIsFormOpen(true);
        // Timeout to allow form to mount if it wasn't open
        setTimeout(() => reset(course), 0);
    };

    const handleCancel = () => {
        setIsFormOpen(false);
        setEditingCourse(null);
        reset({});
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Courses Management</h1>
                <Button onClick={() => { setEditingCourse(null); reset({}); setIsFormOpen(true); }} className="gap-2">
                    <Plus className="w-4 h-4" /> Add Course
                </Button>
            </div>

            {isFormOpen && (
                <Card className="p-6">
                    <h3 className="text-lg font-bold mb-4">{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Course Title" {...register('title', { required: true })} required />
                            <Input label="Duration" {...register('duration', { required: true })} required />
                            <Input label="Fees" {...register('fees', { required: true })} required />
                            <Input label="Mode" {...register('mode', { required: true })} required />
                            <Input label="Image URL (Public URL)" {...register('image_url')} placeholder="https://..." />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Code Snippet (Optional)</label>
                            <div className="border border-gray-300 rounded-lg overflow-hidden bg-[#1e1e1e]">
                                <Editor
                                    value={watch('code_snippet') || ''}
                                    onValueChange={code => setValue('code_snippet', code)}
                                    highlight={code => highlight(code, languages.js, 'js')}
                                    padding={10}
                                    style={{
                                        fontFamily: '"Fira code", "Fira Mono", monospace',
                                        fontSize: 14,
                                        minHeight: '200px',
                                        color: '#f8f8f2',
                                    }}
                                />
                            </div>
                            <p className="text-xs text-gray-500">This code will be displayed in the Featured Course section.</p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="submit">{editingCourse ? 'Update Course' : 'Save Course'}</Button>
                            <Button type="button" variant="ghost" onClick={handleCancel}>Cancel</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Title</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Duration</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Fees</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-center">Featured</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">Loading courses...</td>
                            </tr>
                        ) : courses.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">No courses found</td>
                            </tr>
                        ) : (
                            courses.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-medium text-gray-900">{course.title}</td>
                                    <td className="p-4 text-gray-600">{course.duration}</td>
                                    <td className="p-4 text-gray-600">{course.fees}</td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => onToggleFeature(course)}
                                            className={`p-1 rounded-full transition-colors ${course.is_featured ? 'text-yellow-400 bg-yellow-50' : 'text-gray-300 hover:text-yellow-400'}`}
                                        >
                                            <Star className="w-5 h-5 fill-current" />
                                        </button>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <button onClick={() => handleEdit(course)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => onDelete(course.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
