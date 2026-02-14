import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { client } from '../../api/client';

interface Popup {
    id: number;
    title: string;
    image_url: string;
    type: 'TRAINING' | 'HR' | 'HOME';
    is_active: boolean;
}

interface PopupOverlayProps {
    type: 'ALL' | 'TRAINING' | 'HR' | 'HOME';
}

export function PopupOverlay({ type }: PopupOverlayProps) {
    const [popup, setPopup] = useState<Popup | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        checkAndShowPopup();
    }, [type]);

    const checkAndShowPopup = async () => {
        try {
            const { data } = await client.get<Popup[]>('/popups/active');

            const relevantPopups = data.filter(p => {
                if (type === 'ALL') return true;
                return p.type === type;
            });

            if (relevantPopups.length > 0) {
                relevantPopups.sort((a, b) => b.id - a.id);
                setPopup(relevantPopups[0]);
                setTimeout(() => setIsVisible(true), 1500);
            }
        } catch (error) {
            console.error('Failed to fetch popups', error);
        }
    };

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!popup) return null;

    // Unified styles for ALL popups with enhanced professional animations and reduced size
    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-50 pointer-events-none flex items-end justify-end p-4 sm:p-6">
                    <motion.div
                        className="pointer-events-auto relative"
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        transition={{ duration: 0.6, type: 'spring', damping: 20, stiffness: 300 }}
                    >
                        {/* Decorative Elements - Professional animated floaters (Scaled down) */}
                        <motion.div
                            className="absolute -top-8 -left-6 z-10 select-none pointer-events-none filter drop-shadow-lg"
                            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="text-3xl">✨</div>
                        </motion.div>

                        <motion.div
                            className="absolute -top-10 right-4 z-10 select-none pointer-events-none filter drop-shadow-md"
                            animate={{ y: [0, -15, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                            <div className="text-2xl opacity-90">🎉</div>
                        </motion.div>

                        <motion.div
                            className="absolute bottom-6 -left-8 z-10 select-none pointer-events-none filter drop-shadow-lg"
                            animate={{ y: [0, -8, 0], rotate: [0, -10, 0] }}
                            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                            <div className="text-2xl">🌟</div>
                        </motion.div>

                        {/* Subtle sparkle particles */}
                        <motion.div
                            className="absolute top-0 left-1/2 z-10 select-none pointer-events-none opacity-60"
                            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5], y: -20 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 2 }}
                        >
                            <div className="text-lg">✨</div>
                        </motion.div>

                        {/* Close Button - Sleek & integrated */}
                        <motion.button
                            className="absolute -top-3 -right-3 z-20 bg-white text-gray-800 rounded-full p-1.5 shadow-lg border border-gray-100 
                            hover:bg-red-50 hover:text-red-500 hover:scale-110 active:scale-95 transition-all duration-200 group"
                            onClick={handleClose}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                        >
                            <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                        </motion.button>

                        {/* Image Container with Glassmorphism Border - Size reduced by ~40% */}
                        <div className="p-1 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-md rounded-xl shadow-2xl border border-white/50">
                            <motion.img
                                src={popup.image_url}
                                alt={popup.title}
                                className="rounded-lg w-[200px] md:w-[240px] object-cover shadow-inner"
                                initial={{ filter: 'blur(8px)' }}
                                animate={{ filter: 'blur(0px)' }}
                                transition={{ duration: 0.8 }}
                            />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
