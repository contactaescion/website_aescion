import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Sparkles } from 'lucide-react';
import { client } from '../../api/client';

export function MarketingPopup() {
    const [popup, setPopup] = useState<{ image_url: string; title: string } | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const fetchActivePopup = async () => {
            try {
                const response = await client.get('/popups/active');
                if (response.data && response.data.image_url) {
                    setPopup(response.data);
                    // Show immediately or after small delay
                    setTimeout(() => setIsOpen(true), 1000);
                }
            } catch (error) {
                // Ignore errors
            }
        };

        fetchActivePopup();
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    if (!popup || !isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.8 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="fixed bottom-4 right-4 z-50 w-64 md:w-72 group"
            >
                {/* Decorative Animations */}
                <div className="absolute -inset-4 pointer-events-none">
                    {/* Glowing Stars */}
                    <motion.div
                        animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2 -left-2 text-yellow-400"
                    >
                        <Star className="w-8 h-8 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                    </motion.div>
                    <motion.div
                        animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.5, 1], rotate: [0, 45, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                        className="absolute top-1/2 -right-4 text-yellow-300"
                    >
                        <Star className="w-6 h-6 fill-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                    </motion.div>

                    {/* Crackers / Sparkles */}
                    <motion.div
                        animate={{ scale: [0.8, 1.2, 0.8], rotate: [0, 180, 360] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-2 -left-2 text-pink-500"
                    >
                        <Sparkles className="w-8 h-8 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -10, 0], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-6 right-8 text-blue-400"
                    >
                        <Sparkles className="w-6 h-6 drop-shadow-[0_0_5px_rgba(96,165,250,0.8)]" />
                    </motion.div>
                </div>

                {/* Main Popup Content */}
                <div className="relative bg-white rounded-lg shadow-2xl border-2 border-brand-orange/20 overflow-hidden transform transition-transform group-hover:scale-[1.02]">
                    <button
                        onClick={handleClose}
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-500 hover:text-red-500 rounded-full p-1 transition-colors z-10 backdrop-blur-sm"
                        aria-label="Close popup"
                    >
                        <X className="w-4 h-4" />
                    </button>

                    <div className="relative">
                        {/* Shine effect */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent z-10 pointer-events-none"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        />

                        <img
                            src={popup.image_url}
                            alt={popup.title}
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
