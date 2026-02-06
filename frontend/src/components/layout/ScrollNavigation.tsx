
import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '../ui-kit/Button';
import { motion, AnimatePresence } from 'framer-motion';

export function ScrollNavigation() {
    const [showUp, setShowUp] = useState(false);
    const [showDown, setShowDown] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            // Show Up button if scrolled down more than 300px
            setShowUp(scrollY > 300);

            // Show Down button if not at the bottom (with buffer)
            setShowDown(scrollY + windowHeight < documentHeight - 50);
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
            <AnimatePresence>
                {showUp && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="flex flex-col gap-2"
                    >
                        <Button
                            size="sm"
                            onClick={scrollToTop}
                            className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-full shadow-lg p-2"
                            aria-label="Scroll to top"
                        >
                            <ArrowUp className="w-5 h-5" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showDown && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        <Button
                            size="sm"
                            onClick={scrollToBottom}
                            className="bg-brand-orange hover:bg-brand-orange/90 text-white rounded-full shadow-lg p-2"
                            aria-label="Scroll to bottom"
                        >
                            <ArrowDown className="w-5 h-5" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
