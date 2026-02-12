import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';



// Define Image Interface
interface GalleryImage {
    id: number;
    title: string;
    category: string;
    public_url: string;
    thumb_url?: string;
    description?: string;
    s3_key?: string;
}

export function Gallery() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [loading, setLoading] = useState(true);
    const [overrides, setOverrides] = useState<Record<number, string>>({});

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch(`${API_URL}/gallery`);
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setImages(data);
                } else {
                    // Fallback to local public assets when server returns empty
                    const fallback = [
                        { id: 1, title: 'Classroom', category: 'CLASSROOM', public_url: '/assets/class.jpeg', description: '' },
                        { id: 2, title: 'Classroom Session', category: 'CLASSROOM', public_url: '/assets/class1.jpeg', description: '' },
                        { id: 3, title: 'Event', category: 'EVENTS', public_url: '/assets/event.jpeg', description: '' },
                        { id: 4, title: 'Event Highlight', category: 'EVENTS', public_url: '/assets/event1.jpeg', description: '' },
                        { id: 5, title: 'Office Space', category: 'OFFICE', public_url: '/assets/office.jpeg', description: '' },
                        { id: 6, title: 'Recruitment Drive', category: 'EVENTS', public_url: '/assets/recruitment.jpeg', description: '' },
                    ];
                    setImages(fallback as GalleryImage[]);
                }
            } catch (error) {
                console.error('Failed to fetch gallery images', error);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, []);

    const filteredImages = images;

    return (
        <section id="gallery" className="py-20 bg-white" style={{ paddingBottom: "0px" }}>
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Life at AESCION</h2>
                    <p className="text-gray-600">A glimpse into our classrooms, events, and student achievements.</p>
                </div>



                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="aspect-video bg-gray-200 rounded-xl"></div>
                                <div className="mt-3 px-1">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredImages.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">No images found in this category.</div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredImages.map((image) => (
                                <motion.div
                                    key={image.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer"
                                        onClick={() => setSelectedImage(image)}
                                    >
                                        <img
                                            src={overrides[image.id] || image.public_url}
                                            alt={image.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            onError={async () => {
                                                try {
                                                    // Attempt to refresh signed url using s3_key when available
                                                    // @ts-ignore
                                                    const key = (image as any).s3_key || (image.public_url && image.public_url.split('/').pop());
                                                    if (!key) return;
                                                    const resp = await fetch(`${API_URL}/gallery/presign?key=${encodeURIComponent(key)}`);
                                                    const j = await resp.json();
                                                    if (j?.url) setOverrides(prev => ({ ...prev, [image.id]: j.url }));
                                                } catch (e) {
                                                    // ignore
                                                }
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <ZoomIn className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <div className="mt-3 px-1">
                                        <h3 className="font-bold text-gray-900 text-lg">{image.title}</h3>
                                        {image.description && (
                                            <p className="text-gray-600 text-sm mt-1">{image.description}</p>
                                        )}
                                    </div>
                                </motion.div>))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div className="relative max-w-5xl w-full max-h-[90vh]" onClick={e => e.stopPropagation()}>
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>
                            <img
                                src={selectedImage.public_url}
                                alt={selectedImage.title}
                                className="w-full h-full object-contain rounded-lg shadow-2xl"
                            />
                            <div className="mt-4 text-center">
                                <h3 className="text-white text-xl font-bold">{selectedImage.title}</h3>
                                {selectedImage.description && (
                                    <p className="text-gray-300 mt-2 text-base max-w-2xl mx-auto">{selectedImage.description}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
