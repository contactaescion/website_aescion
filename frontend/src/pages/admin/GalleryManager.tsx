import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui-kit/Button';
import { Input } from '../../components/ui-kit/Input';
import { Card } from '../../components/ui-kit/Card';
import { Trash2, UploadCloud } from 'lucide-react';

const API_URL = 'http://localhost:3000'; // Should be env var in prod

export function GalleryManager() {
    const [images, setImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const { register, handleSubmit, reset } = useForm();
    const token = localStorage.getItem('access_token');

    const fetchImages = async () => {
        try {
            const res = await fetch(`${API_URL}/gallery`);
            const data = await res.json();
            setImages(data);
        } catch (error) {
            console.error('Failed to fetch images', error);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            if (data.file && data.file[0]) {
                formData.append('file', data.file[0]);
            }

            const res = await fetch(`${API_URL}/gallery/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (res.ok) {
                alert('Image uploaded successfully!');
                reset();
                setIsUploading(false);
                fetchImages();
            } else {
                alert('Upload failed');
            }
        } catch (error) {
            console.error('Upload error', error);
            alert('Error uploading image');
        }
    };

    const onDelete = async (id: number) => {
        if (confirm('Delete this image?')) {
            try {
                const res = await fetch(`${API_URL}/gallery/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (res.ok) {
                    setImages(images.filter((i: any) => i.id !== id));
                } else {
                    alert('Failed to delete');
                }
            } catch (error) {
                console.error('Delete error', error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Gallery Management</h1>
                <Button onClick={() => setIsUploading(!isUploading)} className="gap-2">
                    <UploadCloud className="w-4 h-4" /> Upload New
                </Button>
            </div>

            {isUploading && (
                <Card className="p-6 border-dashed border-2 border-brand-blue bg-blue-50/50">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-4">
                            <Input label="Image Title" {...register('title')} required />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    {...register('description')}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                                    rows={3}
                                    placeholder="Add image description..."
                                />
                            </div>
                        </div>

                        <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center bg-white cursor-pointer hover:border-brand-blue transition-colors">
                            <input type="file" {...register('file')} className="hidden" id="file-upload" />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <UploadCloud className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-500">Click to select images</p>
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <Button type="submit">Upload</Button>
                            <Button type="button" variant="ghost" onClick={() => setIsUploading(false)}>Cancel</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {images.map((img: any) => (
                    <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <img src={img.thumb_url || img.public_url || img.url} alt={img.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button onClick={() => onDelete(img.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-white text-xs">
                            <div className="font-bold truncate">{img.title}</div>
                            <div className="opacity-80 truncate text-[10px]">{img.description}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
