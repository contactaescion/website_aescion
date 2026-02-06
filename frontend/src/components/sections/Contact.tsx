import { useForm } from 'react-hook-form';
import { Button } from '../ui-kit/Button';
import { Input } from '../ui-kit/Input';
import { Card } from '../ui-kit/Card';
import { MapPin, Phone, Mail } from 'lucide-react';
import { enquiries } from '../../api/enquiries';
import { courses } from '../../api/courses';
import { useState, useEffect } from 'react';

interface EnquiryForm {
    name: string;
    phone: string;
    email: string;
    course: string;
    message: string;
}

export function Contact() {
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<EnquiryForm>();

    const [courseOptions, setCourseOptions] = useState<string[]>([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Assuming courses API has a getAll public endpoint or similar
                // If not, we might need to adjust authentication or use a public endpoint
                const data = await courses.getAll();
                setCourseOptions(data.map((c: any) => c.title));
            } catch (error) {
                console.error('Failed to load courses', error);
                // Fallback to minimal default list if fetch fails
                setCourseOptions(['Java Full Stack', 'Python Full Stack', 'MERN Stack']);
            }
        };
        fetchCourses();
    }, []);

    const onSubmit = async (data: EnquiryForm) => {
        try {
            await enquiries.create(data);
            alert('Thank you! We will contact you shortly.');
            reset();
        } catch (error) {
            console.error('Enquiry failed', error);
            alert('Failed to send enquiry. Please try again.');
        }
    };

    return (
        <section id="contact" className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Contact Info & Map */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
                        <p className="text-gray-600 mb-8 max-w-md">
                            Have questions? Visit our office or drop us a message. We'd love to help you build your career.
                        </p>

                        <div className="space-y-6 mb-10">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-blue shrink-0">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Visit Us</h4>
                                    <p className="text-gray-600 text-sm mt-1">
                                        10B/1H, 15/1, Thirumalai Nambi Complex,<br />
                                        Vannarpettai, Tirunelveli - 627003.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-blue shrink-0">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Call Us</h4>
                                    <p className="text-gray-600 text-sm mt-1">
                                        <a href="tel:7550068877" className="hover:text-brand-blue">7550068877</a>, <a href="tel:6374092647" className="hover:text-brand-blue">6374092647</a>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-blue shrink-0">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Email Us</h4>
                                    <p className="text-gray-600 text-sm mt-1">
                                        <a href="mailto:contact.aescion@gmail.com" className="hover:text-brand-blue">contact.aescion@gmail.com</a>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Google Map Embed */}
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 h-[300px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2597.435453417162!2d77.72265439533734!3d8.729137110217543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0411ff5689aa91%3A0x77874ccbd7fe72d8!2sAESCION%20EDTECH%20SOLUTIONS!5e1!3m2!1sen!2sin!4v1770187230280!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>
                    </div>

                    {/* Enquiry Form */}
                    <div className="lg:pl-8">
                        <Card className="p-8 border-t-8 border-t-brand-blue">
                            <h3 className="text-2xl font-bold mb-6">Send an Enquiry</h3>
                            <form id="contact-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <Input
                                    label="Full Name"
                                    placeholder="John Doe"
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

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Interested Course</label>
                                    <select
                                        {...register('course')}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all bg-white"
                                    >
                                        <option value="">Select a course</option>
                                        {courseOptions.map((title) => (
                                            <option key={title} value={title}>{title}</option>
                                        ))}
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        {...register('message')}
                                        rows={4}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all resize-none placeholder:text-gray-400"
                                        placeholder="I want to know about..."
                                    />
                                </div>

                                <Button type="submit" fullWidth disabled={isSubmitting} size="lg">
                                    {isSubmitting ? 'Sending...' : 'Submit Enquiry'}
                                </Button>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
