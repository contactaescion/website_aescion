import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, CheckCircle, Eye } from 'lucide-react';
import { Button, buttonVariants } from '../../components/ui-kit/Button';
import { Card } from '../../components/ui-kit/Card';
import { client } from '../../api/client';

interface Popup {
    id: number;
    title: string;
    image_url: string;
    is_active: boolean;
    created_at: string;
}

export function PopupManager() {
    const [popups, setPopups] = useState<Popup[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchPopups();
    }, []);

    const fetchPopups = async () => {
        try {
            const response = await client.get('/popups');
            setPopups(response.data);
        } catch (error) {
            console.error('Failed to fetch popups', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', file.name.split('.')[0]); // Default title from filename

        setUploading(true);
        try {
            await client.post('/popups', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchPopups();
        } catch (error) {
            console.error('Upload failed', error);
            alert('Failed to upload popup');
        } finally {
            setUploading(false);
        }
    };

    const toggleActive = async (id: number) => {
        try {
            await client.patch(`/popups/${id}/toggle`);
            fetchPopups();
        } catch (error) {
            console.error('Toggle failed', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this popup?')) return;
        try {
            await client.delete(`/popups/${id}`);
            fetchPopups();
        } catch (error) {
            console.error('Delete failed', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Marketing Popups</h1>
                <div className="relative">
                    <input
                        type="file"
                        id="popup-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                    <label
                        htmlFor="popup-upload"
                        className={buttonVariants({
                            variant: 'primary',
                            className: uploading ? 'opacity-50 pointer-events-none cursor-not-allowed' : 'cursor-pointer'
                        })}
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Add New Popup'}
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {popups.map((popup) => (
                        <motion.div
                            key={popup.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            layout
                        >
                            <Card className="overflow-hidden group">
                                <div className="aspect-video bg-gray-100 relative">
                                    <img
                                        src={popup.image_url}
                                        alt={popup.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => window.open(popup.image_url, '_blank')}
                                            className="p-2 bg-white rounded-full hover:bg-gray-100 text-gray-900"
                                            title="View Full Size"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(popup.id)}
                                            className="p-2 bg-red-500 rounded-full hover:bg-red-600 text-white"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {popup.is_active && (
                                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            ACTIVE
                                        </div>
                                    )}
                                </div>
                                <div className="p-4 flex items-center justify-between">
                                    <div className="truncate font-medium text-gray-700 max-w-[60%]">
                                        {popup.title}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant={popup.is_active ? 'outline' : 'primary'}
                                        onClick={() => toggleActive(popup.id)}
                                        className={popup.is_active ? 'border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700' : ''}
                                    >
                                        {popup.is_active ? 'Deactivate' : 'Activate'}
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {popups.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        No popups found. Upload one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
