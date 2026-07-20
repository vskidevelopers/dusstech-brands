'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Collection } from '@/features/collections/types';

interface CollectionMultiSelectProps {
    value: string[];
    onChange: (value: string[]) => void;
    collections: Collection[];
    loading?: boolean;
    placeholder?: string;
}

export function CollectionMultiSelect({
    value,
    onChange,
    collections,
    loading = false,
    placeholder = 'Select collections...',
}: CollectionMultiSelectProps) {
    const [open, setOpen] = useState(false);

    const selectedCollections = collections.filter((c) => value.includes(c.id));

    const toggleCollection = (collectionId: string) => {
        if (value.includes(collectionId)) {
            onChange(value.filter((id) => id !== collectionId));
        } else {
            onChange([...value, collectionId]);
        }
    };

    const removeCollection = (collectionId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(value.filter((id) => id !== collectionId));
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-auto min-h-[2.5rem] py-2"
                >
                    <div className="flex flex-wrap gap-1">
                        {selectedCollections.length === 0 ? (
                            <span className="text-muted-foreground">{placeholder}</span>
                        ) : (
                            selectedCollections.map((collection) => (
                                <Badge
                                    key={collection.id}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    {collection.name}
                                    <X
                                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                                        onClick={(e) => removeCollection(collection.id, e)}
                                    />
                                </Badge>
                            ))
                        )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search collections..." />
                    <CommandList>
                        {loading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No collections found.</CommandEmpty>
                                <CommandGroup>
                                    {collections.map((collection) => (
                                        <CommandItem
                                            key={collection.id}
                                            value={collection.id}
                                            onSelect={() => toggleCollection(collection.id)}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    value.includes(collection.id) ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                            {collection.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}