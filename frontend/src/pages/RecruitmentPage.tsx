import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Briefcase, Building2, CheckCircle } from 'lucide-react';
import { EnquiryForm } from '../components/common/EnquiryForm';

const RecruitmentPage = () => {
    return (
        <div className="min-h-screen bg-white" style={{ marginTop: '100px' }}>
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-gradient-to-b from-slate-900 to-slate-800 text-white overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block py-1 px-3 rounded-full bg-brand-blue/20 text-brand-blue font-medium text-sm mb-6 border border-brand-blue/20"
                        >
                            Generic & Tech Recruitment
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                        >
                            Hire Top Tier <span className="text-brand-blue">Tech Talent</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-300 mb-8 leading-relaxed"
                        >
                            We bridge the gap between skilled candidates and innovative companies.
                            From fresh graduates to experienced professionals, find the perfect fit for your team.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link to="/recruitment#enquiry-form" className="px-8 py-4 bg-brand-blue text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors w-full sm:w-auto text-center">
                                Hire Talent
                            </Link>
                            <Link to="/recruitment#process" className="px-8 py-4 bg-white/10 text-white rounded-lg font-semibold hover:bg-white/20 transition-colors w-full sm:w-auto backdrop-blur-sm text-center">
                                Hiring Process
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Abstract Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl opacity-50" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-50" />
                </div>
            </section>

            {/* Stats / Trust Signals */}
            <section className="py-10 bg-slate-50 border-b border-gray-200">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: "Candidates Placed", value: "500+" },
                            { label: "Corporate Partners", value: "50+" },
                            { label: "Retention Rate", value: "95%" },
                            { label: "Time to Fill", value: "< 14 Days" }
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                                <p className="text-sm text-gray-500 uppercase tracking-wide">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Recruitment Solutions</h2>
                        <p className="text-gray-600">Tailored hiring strategies to meet your specific business needs.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Users className="w-8 h-8 text-brand-blue" />,
                                title: "Campus Hiring",
                                description: "Access our pool of trained fresh graduates ready to deploy."
                            },
                            {
                                icon: <Briefcase className="w-8 h-8 text-purple-600" />,
                                title: "Lateral Hiring",
                                description: "Experienced professionals pre-screened for your requirements."
                            },
                            {
                                icon: <Building2 className="w-8 h-8 text-orange-500" />,
                                title: "Contract Staffing",
                                description: "Flexible staffing solutions for project-based needs."
                            }
                        ].map((service, idx) => (
                            <div key={idx} className="p-8 border border-gray-100 rounded-2xl hover:shadow-xl transition-shadow bg-white group">
                                <div className="p-3 bg-gray-50 rounded-xl inline-block mb-6 group-hover:bg-blue-50 transition-colors">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section id="process" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Hiring Process</h2>
                        <p className="text-gray-600">Streamlined workflow to get you the best talent faster.</p>
                    </div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -translate-y-1/2 z-0" />

                        <div className="grid md:grid-cols-4 gap-8 relative z-10">
                            {[
                                { step: "01", title: "Requirement", desc: "Share your JD & Criteria" },
                                { step: "02", title: "Sourcing", desc: "We screen & shortlist" },
                                { step: "03", title: "Interview", desc: "You assess the best" },
                                { step: "04", title: "Onboarding", desc: "Final offer & joining" }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                                    <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                        {item.step}
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h4>
                                    <p className="text-sm text-gray-500">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact / Employer Form Section */}
            <section id="enquiry-form" className="py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-brand-blue font-semibold tracking-wider text-sm">PARTNER WITH US</span>
                            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">Ready to build your dream team?</h2>
                            <p className="text-lg text-gray-600 mb-8">
                                Fill out the form with your hiring requirements, and our corporate relations team will get in touch with you within 24 hours.
                            </p>

                            <ul className="space-y-4">
                                {[
                                    "Pre-screened candidates",
                                    "Zero cost for initial screening",
                                    "Dedicated account manager",
                                    "Placement support until onboarding"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center text-gray-700">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Employer Enquiry</h3>
                            {/* We will need to update EnquiryForm to handle 'type="HR"' or similar context */}
                            <EnquiryForm type="HR" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default RecruitmentPage;
