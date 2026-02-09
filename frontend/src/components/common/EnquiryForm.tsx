import { useForm } from 'react-hook-form';
import { Button } from '../ui-kit/Button';
import { Input } from '../ui-kit/Input';
import { enquiries } from '../../api/enquiries';
import { courses } from '../../api/courses';
import { useState, useEffect } from 'react';

interface EnquiryFormProps {
    type?: 'TRAINING' | 'HR';
    onSuccess?: () => void;
}

interface EnquiryFormData {
    name: string;
    phone: string;
    email: string;
    course_interest?: string;
    message: string;
    type?: string;
    session_id?: string;
}

export function EnquiryForm({ type = 'TRAINING', onSuccess }: EnquiryFormProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<EnquiryFormData>();
    const [courseOptions, setCourseOptions] = useState<string[]>([]);

    useEffect(() => {
        if (type === 'TRAINING') {
            const fetchCourses = async () => {
                try {
                    const data = await courses.getAll();
                    setCourseOptions(data.map((c: any) => c.title));
                } catch (error) {
                    console.error('Failed to load courses', error);
                    setCourseOptions(['Java Full Stack', 'Python Full Stack', 'MERN Stack']);
                }
            };
            fetchCourses();
        }
    }, [type]);

    const onSubmit = async (data: EnquiryFormData) => {
        try {
            const sessionId = localStorage.getItem('session_id');
            await enquiries.create({ ...data, type, session_id: sessionId || undefined });
            alert('Thank you! We will contact you shortly.');
            reset();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Enquiry failed', error);
            alert('Failed to send enquiry. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
                label={type === 'HR' ? "Company / Contact Name" : "Full Name"}
                placeholder={type === 'HR' ? "Acme Corp / John Doe" : "John Doe"}
                {...register('name', { required: 'Name is required' })}
                error={errors.name?.message}
            />

            <Input
                label="Phone Number"
                placeholder="9876543210"
                type="tel"
                {...register('phone', { required: 'Phone is required', pattern: { value: /^[0-9]{10}$/, message: 'Invalid phone number' } })}
                error={errors.phone?.message}
            />

            <Input
                label="Email Address (Optional)"
                placeholder="john@example.com"
                type="email"
                {...register('email')}
            />

            {type === 'TRAINING' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interested Course</label>
                    <select
                        {...register('course_interest')}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all bg-white"
                    >
                        <option value="">Select a course</option>
                        {courseOptions.map((title) => (
                            <option key={title} value={title}>{title}</option>
                        ))}
                        <option value="Other">Other</option>
                    </select>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {type === 'HR' ? "Job Requirements / Message" : "Message"}
                </label>
                <textarea
                    {...register('message', { required: type === 'HR' ? 'Message is required' : false })}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all resize-none placeholder:text-gray-400"
                    placeholder={type === 'HR' ? "We are looking for Java Developers..." : "I want to know about..."}
                />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
            </div>

            <Button type="submit" fullWidth disabled={isSubmitting} size="lg">
                {isSubmitting ? 'Sending...' : 'Submit Enquiry'}
            </Button>
        </form>
    );
}
