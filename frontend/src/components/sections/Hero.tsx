import { motion } from 'framer-motion';
import { Button } from '../ui-kit/Button';
import { ArrowRight, MessageCircle, Server, Database, Globe } from 'lucide-react';

export function Hero() {
    return (
        <section id="home" className="relative min-h-screen flex items-center pt-32 overflow-hidden bg-brand-light">
            {/* Background Gradient Orbs */}
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-brand-blue/5 rounded-full blur-3xl" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-3xl" />

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
                            Learn to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-purple-600">Code.</span><br />
                            Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500">Future.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-xl mx-auto lg:mx-0">
                            AESCION transforms beginners into industry-ready Full Stack Developers. Master the tech stack that top companies hire for.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <a href="#contact" className="w-full sm:w-auto">
                                <Button size="lg" className="w-full sm:w-auto gap-2 shadow-lg shadow-brand-blue/20">
                                    Enquire Now
                                    <ArrowRight className="w-5 h-5" />
                                </Button>
                            </a>
                            <a href="https://wa.me/917550068877" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                <Button size="lg" variant="secondary" className="w-full sm:w-auto gap-2 border-gray-200">
                                    <MessageCircle className="w-5 h-5" />
                                    WhatsApp Us
                                </Button>
                            </a>
                        </div>

                        <div className="flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-gray-500 pt-4">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                100% Placement Support
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue" />
                                Hands-on Projects
                            </div>
                        </div>
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
                                    <Globe className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Focus</div>
                                    <div className="font-bold text-gray-800">Web Dev</div>
                                </div>
                            </div>

                            <div className="absolute -left-4 bottom-32 p-4 bg-white rounded-2xl shadow-xl flex items-center gap-3 animate-float border border-gray-100" style={{ animationDelay: '1s' }}>
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                    <Database className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Master</div>
                                    <div className="font-bold text-gray-800">Backend</div>
                                </div>
                            </div>

                            <div className="absolute right-12 bottom-12 p-4 bg-white rounded-2xl shadow-xl flex items-center gap-3 animate-float-delayed border border-gray-100" style={{ animationDelay: '2s' }}>
                                <div className="p-2 bg-orange-100 rounded-lg text-brand-orange">
                                    <Server className="w-6 h-6" />
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
