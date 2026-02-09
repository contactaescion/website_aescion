import { motion } from 'framer-motion';
import { Button } from '../ui-kit/Button';
import { ArrowRight, MessageCircle, GraduationCap, Users, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeroProps {
    title?: React.ReactNode;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    showStats?: boolean;
    variant?: 'default' | 'recruitment' | 'landing';
}

export function Hero({
    title,
    subtitle,
    ctaText = "Enquire Now",
    ctaLink = "#contact",
    showStats = true,
    variant = 'default'
}: HeroProps) {
    const isRecruitment = variant === 'recruitment';
    const isLanding = variant === 'landing';

    const defaultTitle = (
        <>
            Learn to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-purple-600">Code.</span><br />
            Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">Future.</span>
        </>
    );

    const landingTitle = (
        <>
            Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-purple-600">Talent.</span><br />
            Transforming <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">Business.</span>
        </>
    );

    const defaultSubtitle = "AESCION transforms beginners into industry-ready Full Stack Developers. Master the tech stack that top companies hire for.";
    const landingSubtitle = "Your one-stop EdTech solution for IT training, recruitment, and software development. Bridging the gap between talent and opportunity.";

    // Persona cards for landing page
    const personas = [
        {
            icon: GraduationCap,
            title: "For Students",
            description: "Master in-demand tech skills with hands-on training and 100% placement support",
            color: "blue",
            link: "/training",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            icon: Users,
            title: "For HR Teams",
            description: "Find pre-vetted, industry-ready tech talent for your organization",
            color: "purple",
            link: "/recruitment",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            icon: Briefcase,
            title: "For Businesses",
            description: "Custom software solutions built by expert developers",
            color: "orange",
            link: "#contact",
            gradient: "from-orange-500 to-red-500"
        }
    ];

    if (isLanding) {
        return (
            <section id="home" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-brand-blue/10 to-purple-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-brand-orange/10 to-pink-500/10 rounded-full blur-3xl" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    {/* Hero Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto mb-16"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1] mb-6">
                            {landingTitle}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
                            {landingSubtitle}
                        </p>
                    </motion.div>

                    {/* Persona Cards */}
                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
                        {personas.map((persona, index) => (
                            <motion.div
                                key={persona.title}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                className="group"
                            >
                                <Link to={persona.link} className="block h-full">
                                    <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden h-full flex flex-col">
                                        {/* Gradient overlay on hover */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${persona.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                                        <div className="relative z-10 flex flex-col h-full">
                                            {/* Icon */}
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${persona.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                                <persona.icon className="w-8 h-8 text-white" />
                                            </div>

                                            {/* Content */}
                                            <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                                {persona.title}
                                            </h3>
                                            <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                                                {persona.description}
                                            </p>

                                            {/* CTA */}
                                            <div className="flex items-center text-sm font-semibold text-gray-900 group-hover:text-brand-blue transition-colors mt-auto">
                                                Learn More
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
                    >
                        <a href="#contact" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg shadow-brand-blue/20">
                                Get Started
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </a>
                        <a href="https://wa.me/917550068877" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                            <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2 border-gray-200">
                                <MessageCircle className="w-5 h-5" />
                                WhatsApp Us
                            </Button>
                        </a>
                    </motion.div>
                </div>
            </section>
        );
    }

    // Original Hero for Training/Recruitment pages
    return (
        <section id="home" className="relative min-h-screen flex items-center pt-32 overflow-hidden bg-brand-light">
            {/* Background Gradient Orbs */}
            <div className={`absolute top-[-20%] right-[-10%] w-[800px] h-[800px] rounded-full blur-3xl ${isRecruitment ? 'bg-purple-500/5' : 'bg-brand-blue/5'}`} />
            <div className={`absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-3xl ${isRecruitment ? 'bg-indigo-500/5' : 'bg-brand-orange/5'}`} />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Column: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="space-y-8 text-center lg:text-left"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                            {title || defaultTitle}
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                            {subtitle || defaultSubtitle}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            {ctaLink.startsWith('#') ? (
                                <a href={ctaLink} className="w-full sm:w-auto">
                                    <Button size="lg" className={`w-full sm:w-auto gap-2 shadow-lg ${isRecruitment ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200' : 'shadow-brand-blue/20'}`}>
                                        {ctaText}
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </a>
                            ) : (
                                <Link to={ctaLink} className="w-full sm:w-auto">
                                    <Button size="lg" className={`w-full sm:w-auto gap-2 shadow-lg ${isRecruitment ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200' : 'shadow-brand-blue/20'}`}>
                                        {ctaText}
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                            )}

                            <a href="https://wa.me/917550068877" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2 border-gray-200">
                                    <MessageCircle className="w-5 h-5" />
                                    WhatsApp Us
                                </Button>
                            </a>
                        </div>

                        {showStats && (
                            <div className="flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-gray-500 pt-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    100% Placement Support
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${isRecruitment ? 'bg-purple-600' : 'bg-brand-blue'}`} />
                                    {isRecruitment ? 'Verified Talent' : 'Hands-on Projects'}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Right Column: Visual Element */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative hidden lg:block"
                    >
                        {/* Abstract Tech Visual */}
                        <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                            {/* Main Floating Card */}
                            <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col animate-float">
                                <div className="h-10 bg-gray-50 border-b border-gray-100 flex items-center px-6 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                    <div className="w-3 h-3 rounded-full bg-green-400" />
                                </div>
                                <div className="p-8 font-mono text-sm leading-relaxed overflow-hidden">
                                    {isRecruitment ? (
                                        <>
                                            <div className="text-gray-400 mb-2">// Hiring Workflow</div>
                                            <div><span className="text-purple-600">const</span> <span className="text-brand-blue">candidate</span> = <span className="text-purple-600">await</span> <span className="text-yellow-600">AESCION</span>.<span className="text-blue-600">getTalent</span>();</div>
                                            <div className="ml-4 mt-2">
                                                <span className="text-purple-600">if</span> (candidate.<span className="text-green-600">skills</span>.includes(<span className="text-green-600">'FullStack'</span>)) {'{'}
                                            </div>
                                            <div className="ml-8 mt-2">
                                                <span className="text-brand-blue">company</span>.<span className="text-blue-600">hire</span>(candidate);
                                            </div>
                                            <div className="ml-4 mt-2">{'}'}</div>
                                            <div className="mt-4 text-green-500">// Position Filled!</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-gray-400 mb-2">// Full Stack Development Path</div>
                                            <div><span className="text-purple-600">const</span> <span className="text-brand-blue">student</span> = <span className="text-purple-600">new</span> <span className="text-yellow-600">Developer</span>();</div>
                                            <div className="ml-4 mt-2">
                                                <span className="text-brand-blue">student</span>.<span className="text-blue-600">learn</span>([<span className="text-green-600">'React'</span>, <span className="text-green-600">'Node.js'</span>, <span className="text-green-600">'AWS'</span>, <span className="text-green-600">'MongoDB'</span>]);
                                            </div>
                                            <div className="ml-4 mt-2">
                                                <span className="text-brand-blue">student</span>.<span className="text-blue-600">buildProjects</span>(<span className="text-orange-500">true</span>);
                                            </div>
                                            <div className="ml-4 mt-2">
                                                <span className="text-purple-600">await</span> <span className="text-brand-blue">student</span>.<span className="text-blue-600">getPlaced</span>();
                                            </div>
                                            <div className="mt-4 text-gray-400">// Output: Success!</div>
                                        </>
                                    )}

                                    {/* Tech Stack Icons Grid inside card for visual interest */}
                                    <div className="grid grid-cols-4 gap-4 mt-12 opacity-50">
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse-slow" style={{ animationDelay: `${i * 0.2}s` }} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Floating Badges */}
                            <div className="absolute -right-8 top-20 p-4 bg-white rounded-2xl shadow-xl flex items-center gap-3 animate-float-delayed border border-gray-100">
                                <div className="p-2 bg-blue-100 rounded-lg text-brand-blue">
                                    <GraduationCap className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Focus</div>
                                    <div className="font-bold text-gray-800">Web Dev</div>
                                </div>
                            </div>

                            <div className="absolute -left-4 bottom-32 p-4 bg-white rounded-2xl shadow-xl flex items-center gap-3 animate-float border border-gray-100" style={{ animationDelay: '1s' }}>
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Master</div>
                                    <div className="font-bold text-gray-800">Backend</div>
                                </div>
                            </div>

                            <div className="absolute right-12 bottom-12 p-4 bg-white rounded-2xl shadow-xl flex items-center gap-3 animate-float-delayed border border-gray-100" style={{ animationDelay: '2s' }}>
                                <div className="p-2 bg-orange-100 rounded-lg text-brand-orange">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Deploy</div>
                                    <div className="font-bold text-gray-800">DevOps</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
