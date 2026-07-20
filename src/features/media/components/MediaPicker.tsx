'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MediaLibrary } from './MediaLibrary';
import { DropzoneUploader } from './DropzoneUploader';
import type { MediaItem } from '../types';

interface MediaPickerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    folder: string;
    multiple?: boolean;
    onSelect: (media: MediaItem | MediaItem[]) => void;
}

export function MediaPicker({ open, onOpenChange, folder, multiple = false, onSelect }: MediaPickerProps) {
    const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([]);

    const handleSelect = (media: MediaItem) => {
        if (multiple) {
            const exists = selectedMedia.find(m => m.id === media.id);
            if (exists) {
                setSelectedMedia(selectedMedia.filter(m => m.id !== media.id));
            } else {
                setSelectedMedia([...selectedMedia, media]);
            }
        } else {
            setSelectedMedia([media]);
        }
    };

    const handleConfirm = () => {
        if (selectedMedia.length > 0) {
            onSelect(multiple ? selectedMedia : selectedMedia[0]);
            setSelectedMedia([]);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Select Media from {folder}</DialogTitle>
                </DialogHeader>

                <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    {/* Uploader Section */}
                    <DropzoneUploader folder={folder} />

                    {/* Library Grid */}
                    <div className="flex-1 overflow-y-auto border rounded-md p-4">
                        <MediaLibrary
                            folder={folder}
                            selectedIds={selectedMedia.map(m => m.id)}
                            onSelect={handleSelect}
                            multiple={multiple}
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                        {selectedMedia.length} item(s) selected
                    </span>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={handleConfirm} disabled={selectedMedia.length === 0}>
                            Confirm Selection
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}