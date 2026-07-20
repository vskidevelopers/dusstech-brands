'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, CheckCircle } from 'lucide-react';
import { useUploadMedia } from '../hooks';
import { cn } from '@/lib/utils';

interface DropzoneUploaderProps {
    folder: string;
}

export function DropzoneUploader({ folder }: DropzoneUploaderProps) {
    const { upload, isUploading } = useUploadMedia(folder);
    const [uploadingFiles, setUploadingFiles] = useState<Record<string, 'uploading' | 'success' | 'error'>>({});

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        for (const file of acceptedFiles) {
            setUploadingFiles(prev => ({ ...prev, [file.name]: 'uploading' }));
            try {
                await upload(file);
                setUploadingFiles(prev => ({ ...prev, [file.name]: 'success' }));
                setTimeout(() => {
                    setUploadingFiles(prev => {
                        const next = { ...prev };
                        delete next[file.name];
                        return next;
                    });
                }, 2000);
            } catch {
                setUploadingFiles(prev => ({ ...prev, [file.name]: 'error' }));
            }
        }
    }, [upload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.svg', '.avif'],
            'video/*': ['.mp4', '.webm'],
        },
        maxSize: 10 * 1024 * 1024, // 10MB
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            )}
        >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium">
                {isDragActive ? "Drop files here" : "Drag & drop files here, or click to select"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
                Supports JPG, PNG, WEBP, SVG, MP4 (Max 10MB)
            </p>

            {Object.keys(uploadingFiles).length > 0 && (
                <div className="mt-4 space-y-2 text-left">
                    {Object.entries(uploadingFiles).map(([name, status]) => (
                        <div key={name} className="flex items-center gap-2 text-sm">
                            {status === 'uploading' && <span className="animate-spin">⏳</span>}
                            {status === 'success' && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {status === 'error' && <X className="h-4 w-4 text-red-500" />}
                            <span className="truncate flex-1">{name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}