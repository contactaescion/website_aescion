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
}

export function Gallery() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:3000'; // Should be env var

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch(`${API_URL}/gallery`);
                const data = await res.json();
                setImages(data);
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
                    <div className="text-center py-12 text-gray-500">Loading gallery...</div>
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
                                            src={image.public_url}
                                            alt={image.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
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
