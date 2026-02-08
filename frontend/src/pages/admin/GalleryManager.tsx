import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../components/ui-kit/Button';
import { Input } from '../../components/ui-kit/Input';
import { Card } from '../../components/ui-kit/Card';
import { Trash2, UploadCloud } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function GalleryManager() {
    const [images, setImages] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [editingImage, setEditingImage] = useState<any>(null);
    const { register, handleSubmit, reset, setValue } = useForm();
    const token = sessionStorage.getItem('access_token');

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

    const onEdit = (img: any) => {
        setEditingImage(img);
        setValue('title', img.title);
        setValue('description', img.description);
        setIsUploading(true);
        // smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            if (data.file && data.file[0]) {
                formData.append('file', data.file[0]);
            }

            let url = `${API_URL}/gallery/upload`;
            let method = 'POST';

            if (editingImage) {
                url = `${API_URL}/gallery/${editingImage.id}`;
                method = 'PATCH';
                // For patch, we might send JSON if no file is new, but using FormData is fine usually if backend supports it.
                // However, the backend update endpoint takes @Body() updateDto, which nests JSON parsing usually.
                // GalleryController.update uses @Body(), not FileInterceptor (unless we add it).
                // Let's check GalleryController.update. It does NOT have FileInterceptor.
                // So for update, we probably can't update file yet, or need to adjust controller.
                // For now, let's assume update only updates text fields as per current controller signature likely.
            }

            // If editing and using PATCH, we need to send JSON, not FormData, unless we change controller.
            // The controller update method: @Body() updateDto: any.
            // Let's verify controller update.

            let headers: any = {
                'Authorization': `Bearer ${token}`,
            };

            let body;
            if (editingImage) {
                headers['Content-Type'] = 'application/json';
                body = JSON.stringify({
                    title: data.title,
                    description: data.description,
                });
            } else {
                body = formData;
            }

            const res = await fetch(url, {
                method,
                headers,
                body,
            });

            if (res.ok) {
                alert(editingImage ? 'Image updated successfully!' : 'Image uploaded successfully!');
                reset();
                setIsUploading(false);
                setEditingImage(null);
                fetchImages();
            } else {
                const err = await res.json();
                alert(`Operation failed: ${err.message || res.statusText}`);
            }
        } catch (error) {
            console.error('Operation error', error);
            alert('Error performing operation');
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
                    const err = await res.json().catch(() => ({}));
                    alert(`Failed to delete: ${err.message || res.status + ' ' + res.statusText}`);
                }
            } catch (error) {
                console.error('Delete error', error);
                alert('Delete error: ' + error);
            }
        }
    };

    const handleCancel = () => {
        setIsUploading(false);
        setEditingImage(null);
        reset();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Gallery Management</h1>
                <Button onClick={() => { setIsUploading(!isUploading); setEditingImage(null); reset(); }} className="gap-2">
                    <UploadCloud className="w-4 h-4" /> {isUploading ? 'Close Form' : 'Upload New'}
                </Button>
            </div>

            {isUploading && (
                <Card className="p-6 border-dashed border-2 border-brand-blue bg-blue-50/50">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold">{editingImage ? 'Edit Image' : 'Upload New Image'}</h2>
                    </div>
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

                        {!editingImage && (
                            <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg text-center bg-white cursor-pointer hover:border-brand-blue transition-colors">
                                <input type="file" {...register('file')} className="hidden" id="file-upload" />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <UploadCloud className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">Click to select images</p>
                                </label>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Button type="submit">{editingImage ? 'Update' : 'Upload'}</Button>
                            <Button type="button" variant="ghost" onClick={handleCancel}>Cancel</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {images.map((img: any) => (
                    <div key={img.id} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                        <img src={img.thumb_url || img.public_url || img.url} alt={img.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="sm" variant="secondary" onClick={() => onEdit(img)} className="h-8 w-8 p-0 rounded-full bg-white text-gray-700 hover:text-brand-blue">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                </svg>
                            </Button>
                            <button onClick={() => onDelete(img.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors h-8 w-8 flex items-center justify-center">
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
