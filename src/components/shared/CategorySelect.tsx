'use client';

import { useEffect, useState } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getAllCategoriesForSelect } from '@/features/categories/queries';
import type { Category } from '@/features/categories/types';

interface CategorySelectProps {
    value: string | null;
    onChange: (value: string | null) => void;
    placeholder?: string;
}

export function CategorySelect({ value, onChange, placeholder = 'Select category...' }: CategorySelectProps) {
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadCategories() {
            const data = await getAllCategoriesForSelect();
            setCategories(data);
            setLoading(false);
        }
        loadCategories();
    }, []);

    const selectedCategory = categories.find((c) => c.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedCategory ? selectedCategory.name : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search category..." />
                    <CommandList>
                        {loading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No category found.</CommandEmpty>
                                <CommandGroup>
                                    <CommandItem
                                        value="none"
                                        onSelect={() => {
                                            onChange(null);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                value === null ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                        None
                                    </CommandItem>
                                    {categories.map((category) => (
                                        <CommandItem
                                            key={category.id}
                                            value={category.id}
                                            onSelect={() => {
                                                onChange(category.id === value ? null : category.id);
                                                setOpen(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    value === category.id ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                            {category.name}
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