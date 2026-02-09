import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { search as searchApi } from '../../api/search';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ courses: any[], gallery: any[] }>({ courses: [], gallery: [] });
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setQuery('');
            setResults({ courses: [], gallery: [] });
            setHasSearched(false);
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true);
                try {
                    setError(null);
                    const data = await searchApi.query(query);
                    setResults(data);
                    setHasSearched(true);
                } catch (err) {
                    console.error('Search failed', err);
                    setError('Failed to fetch results. Please try again.');
                    setResults({ courses: [], gallery: [] });
                } finally {
                    setLoading(false);
                }
            } else {
                setResults({ courses: [], gallery: [] });
                setHasSearched(false);
            }
        }, 500); // Debounce

        return () => clearTimeout(timer);
    }, [query]);

    const handleNavigate = (path: string) => {
        onClose();
        // Since it's a single page (mostly), we might need to handle scrolling if hashing
        // For courses, we might have a dedicated page later or scroll to section
        // Assuming courses are on homepage for now or have separate page?
        // PublicPage has Sections.
        // Let's assume we can navigate to #courses or specific course page if implemented.
        // For now, let's navigate to home with hash or just close and maybe scroll.
        // If we have course detail page, navigate there.
        // It seems currently everything is on PublicPage or Admin.
        // But let's assume we navigate to /#courses.

        // Actually, if we are in admin, going to /#courses is weird.
        // If we are publicly, it works.

        if (path.startsWith('http') || path.startsWith('/')) {
            window.location.href = path; // Simple reload for hash change reliability
        }
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center p-4 border-b border-gray-100">
                            <Search className="w-5 h-5 text-gray-400 mr-3" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search courses, gallery..."
                                className="flex-1 text-lg outline-none text-gray-800 placeholder-gray-400"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            {loading ? (
                                <Loader2 className="w-5 h-5 text-brand-blue animate-spin ml-3" />
                            ) : (
                                <button onClick={onClose} className="ml-3 p-1 hover:bg-gray-100 rounded-full">
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            )}
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-4 bg-gray-50/50">

                            {error && (
                                <div className="text-center py-8 text-red-500">
                                    {error}
                                </div>
                            )}

                            {!loading && !error && hasSearched && results.courses.length === 0 && results.gallery.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No results found for "{query}"
                                </div>
                            )}

                            {results.courses.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Courses</h3>
                                    <div className="space-y-2">
                                        {results.courses.map((course: any) => (
                                            <div
                                                key={course.id}
                                                onClick={() => handleNavigate(`/#courses`)} // Simplified navigation
                                                className="flex items-center p-3 bg-white rounded-xl hover:bg-brand-blue/5 hover:border-brand-blue/20 border border-transparent transition-all cursor-pointer group"
                                            >
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-4">
                                                    <span className="text-lg">📚</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-800 group-hover:text-brand-blue">{course.title}</h4>
                                                    <p className="text-sm text-gray-500 line-clamp-1">{course.description}</p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-brand-blue" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.gallery.length > 0 && (
                                <div className="mb-2">
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Gallery</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {results.gallery.map((image: any) => (
                                            <div
                                                key={image.id}
                                                onClick={() => handleNavigate(`/#gallery`)}
                                                className="flex items-center p-2 bg-white rounded-xl hover:bg-brand-blue/5 border border-transparent transition-all cursor-pointer"
                                            >
                                                <img src={image.thumb_url || image.public_url} className="w-12 h-12 rounded-lg object-cover mr-3" alt={image.title} />
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{image.title}</h4>
                                                    <p className="text-xs text-gray-400">{image.category}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
