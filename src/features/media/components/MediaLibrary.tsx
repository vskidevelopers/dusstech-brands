'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMediaListAction } from '../actions';
import type { MediaItem, MediaFilters } from '../types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface MediaLibraryProps {
    folder: string;
    selectedIds: string[];
    onSelect: (media: MediaItem) => void;
    multiple?: boolean;
}

export function MediaLibrary({ folder, selectedIds, onSelect, multiple = false }: MediaLibraryProps) {
    const [filters, setFilters] = useState<MediaFilters>({ folder, page: 1, pageSize: 24 });

    console.log("🔥 STEP 6: MediaLibrary rendering. Current filters:", filters);

    const { data: result, isLoading, refetch } = useQuery({
        queryKey: ['media', folder, filters.search, filters.resourceType],
        queryFn: async () => {
            console.log("🔥 STEP 6a: Fetching media from Supabase for folder:", folder);
            const res = await getMediaListAction({ ...filters, folder });
            console.log("✅ STEP 6a COMPLETE: Fetched", res.data.length, "items.");
            return res;
        },
    });

    const media = result?.data || [];
    const loading = isLoading;

    if (loading) return <div className="text-center py-10 text-muted-foreground">Loading media...</div>;
    if (media.length === 0) return <div className="text-center py-10 text-muted-foreground">No media found in this folder.</div>;

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    placeholder="Search filename or alt text..."
                    className="max-w-xs"
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
                />
                <Select 
                    value={filters.resourceType} 
                    onValueChange={(v) => setFilters(prev => ({ ...prev, resourceType: v as MediaFilters['resourceType'] }))}
                >
                    <SelectTrigger className="w-[130px]"><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="auto">All</SelectItem>
                        <SelectItem value="image">Images</SelectItem>
                        <SelectItem value="video">Videos</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {media.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                        <div
                            key={item.id}
                            onClick={() => {
                                console.log("🔥 STEP 7: User clicked media item. ID:", item.id, "URL:", item.secure_url);
                                onSelect(item);
                            }}
                            className={cn(
                                "group relative aspect-square rounded-lg border bg-muted overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-primary",
                                isSelected && "ring-2 ring-primary"
                            )}
                        >
                            {item.resource_type === 'image' ? (
                                <img src={item.secure_url} alt={item.alt_text || item.filename} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-white">
                                    <span className="text-xs uppercase">{item.format}</span>
                                </div>
                            )}

                            {isSelected && (
                                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                                    <Check className="h-4 w-4" />
                                </div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.original_filename}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}