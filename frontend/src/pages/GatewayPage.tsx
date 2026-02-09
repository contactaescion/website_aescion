import { Link } from 'react-router-dom';
import { GraduationCap, Briefcase, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function GatewayPage() {
    return (
        <div className="min-h-screen flex flex-col md:flex-row font-sans">
            {/* Student / Training Section */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="flex-1 bg-white flex flex-col justify-center items-center p-12 text-center border-b md:border-b-0 md:border-r border-gray-100 hover:bg-blue-50 transition-colors group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
                <div className="z-10 max-w-lg">
                    <div className="bg-blue-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                        <GraduationCap className="w-10 h-10 text-brand-blue" />
                    </div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">For Students</h2>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Master industry-ready skills with our expert-led IT training courses.
                        Get placed in top tech companies.
                    </p>
                    <Link to="/training">
                        <button className="bg-brand-blue text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            Explore Courses <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                </div>
            </motion.div>

            {/* Employer / Recruitment Section */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex-1 bg-slate-900 flex flex-col justify-center items-center p-12 text-center text-white hover:bg-slate-800 transition-colors group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />
                <div className="z-10 max-w-lg">
                    <div className="bg-brand-orange/20 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300">
                        <Briefcase className="w-10 h-10 text-brand-orange" />
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4">For Employers</h2>
                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        Hire pre-vetted, top-tier tech talent ready to deploy.
                        Simplify your recruitment process today.
                    </p>
                    <Link to="/recruitment">
                        <button className="bg-brand-orange text-white px-8 py-4 rounded-full text-lg font-semibold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                            Hire Talent <ArrowRight className="w-5 h-5" />
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
