import { motion } from 'framer-motion';
import { CheckCircle, Code, Laptop, Users, Briefcase } from 'lucide-react';
import { Card } from '../ui-kit/Card';

interface ServiceItem {
    icon: any;
    title: string;
    description: string;
    flow: ('training' | 'recruitment' | 'general')[];
}

const services: ServiceItem[] = [
    {
        icon: Code,
        title: 'IT Training',
        description: 'Comprehensive courses in Full Stack (Python/Java/MERN), Embedded Systems, IoT, and AI.',
        flow: ['training', 'general']
    },
    {
        icon: Users,
        title: 'Placement Support',
        description: 'Dedicated placement assistance, mock interviews, and resume building workshops.',
        flow: ['training'] // Only show on training page
    },
    {
        icon: Laptop,
        title: 'Internships',
        description: 'Real-world project experience for college students to gain industry exposure.',
        flow: ['training'] // Only show on training page
    },
    {
        icon: CheckCircle,
        title: 'Software Development',
        description: 'Custom software solutions ensuring quality and scalability for businesses.',
        flow: ['general']
    },
    {
        icon: Briefcase,
        title: 'HR Recruitment',
        description: 'End-to-end recruitment solutions connecting top talent with leading organizations.',
        flow: ['recruitment', 'general']
    },
];

interface ServicesProps {
    filter?: 'general' | 'training' | 'recruitment';
}

export function Services({ filter = 'general' }: ServicesProps) {
    const filteredServices = services.filter(s => s.flow.includes(filter));

    return (
        <section id="services" className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
                    <p className="text-lg text-gray-600">
                        {filter === 'training' && "Empowering your career with top-notch training and support."}
                        {filter === 'recruitment' && "Connecting you with the best talent in the industry."}
                        {filter === 'general' && "We provide end-to-end edtech solutions, from premium training to software development and recruitment services."}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {filteredServices.map((service, index) => (
                        <motion.div
                            key={service.title}
                            className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1rem)] flex-shrink-0"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full p-8 hover:-translate-y-1 transition-transform border-t-4 border-t-white hover:border-t-brand-blue">
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-brand-blue">
                                    <service.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                                <p className="text-gray-500 leading-relaxed text-sm">
                                    {service.description}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
