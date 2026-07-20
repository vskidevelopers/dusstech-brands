'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageIcon, Upload, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ServiceFormMediaProps {
    featuredImage: string;
    gallery: string[];
    onFeaturedImageChange: (url: string) => void;
    onGalleryChange: (urls: string[]) => void;
    featuredImageError?: string;
}

export function ServiceFormMedia({
    featuredImage, gallery, onFeaturedImageChange, onGalleryChange, featuredImageError,
}: ServiceFormMediaProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            // Placeholder: In production, these would upload to Cloudinary and return URLs.
            // For now, we create object URLs to simulate the gallery behavior.
            const newUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
            onGalleryChange([...gallery, ...newUrls].slice(0, 20));
        },
        [gallery, onGalleryChange]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        maxSize: 5 * 1024 * 1024,
    });

    const removeGalleryItem = (index: number) => {
        onGalleryChange(gallery.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            {/* Featured image */}
            <div className="space-y-2">
                <Label>Featured Image URL</Label>
                <Input
                    value={featuredImage}
                    onChange={(e) => onFeaturedImageChange(e.target.value)}
                    placeholder="https://..."
                    className={cn(featuredImageError && 'border-destructive')}
                />
                {featuredImageError && <p className="text-xs text-destructive">{featuredImageError}</p>}
                {featuredImage && (
                    <div className="mt-2 aspect-video overflow-hidden rounded-md border bg-muted">
                        <img src={featuredImage} alt="Featured" className="h-full w-full object-cover" />
                    </div>
                )}
            </div>

            {/* Gallery */}
            <div className="space-y-2">
                <Label>Gallery ({gallery.length}/20)</Label>

                <div
                    {...getRootProps()}
                    className={cn(
                        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors',
                        isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
                    )}
                >
                    <input {...getInputProps()} />
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <div className="text-sm">
                        <span className="font-medium text-foreground">Drop images here</span>
                        {' '}or click to browse
                    </div>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB each</p>
                </div>

                {gallery.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                        {gallery.map((url, i) => (
                            <div key={i} className="group relative aspect-square overflow-hidden rounded-md border bg-muted">
                                <img src={url} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                                    onClick={() => removeGalleryItem(i)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}