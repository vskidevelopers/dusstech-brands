/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
    Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFormContext, type UseFieldArrayReturn } from 'react-hook-form';
import type { QuotationFormData } from '@/features/quotations/schema';
import { getActiveProductsForSelect } from '@/features/products/queries';

interface ProductPickerProps {
    index: number;
    update: UseFieldArrayReturn<QuotationFormData, 'items'>['update'];
}

export function ProductPicker({ index, update }: ProductPickerProps) {
    const [open, setOpen] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ Defensive: get the entire form context, handle null gracefully
    const formContext = useFormContext<QuotationFormData>();

    // ✅ Use formContext.watch instead of useWatch — safe when context is null
    const currentReferenceId = formContext?.watch(`items.${index}.reference_id`) as string | undefined;
    const getValues = formContext?.getValues;

    useEffect(() => {
        let cancelled = false;
        async function loadProducts() {
            setLoading(true);
            try {
                const data = await getActiveProductsForSelect();
                if (!cancelled) setProducts(data);
            } catch (error) {
                console.error('Failed to load products', error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        loadProducts();
        return () => { cancelled = true; };
    }, []);

    // ✅ Bail out gracefully if no form context is available
    if (!getValues) {
        return (
            <Button
                variant="outline"
                className="w-full justify-start h-9 text-sm font-normal text-muted-foreground"
                disabled
            >
                Select a product...
            </Button>
        );
    }

    const handleSelect = (product: any) => {
        const currentItem = getValues(`items.${index}`);
        const currentQty = Number(currentItem?.quantity) || 1;
        const currentDiscount = Number(currentItem?.discount) || 0;
        const price = Number(product.selling_price) || 0;

        update(index, {
            ...currentItem,
            item_type: 'product',
            reference_id: product.id,
            description: product.name,
            unit_price: price,
            line_total: (currentQty * price) - currentDiscount,
        });
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between h-9 text-sm font-normal"
                >
                    {currentReferenceId
                        ? products.find((p: any) => p.id === currentReferenceId)?.name || 'Product Selected'
                        : 'Select a product...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search products..." />
                    <CommandList>
                        {loading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No products found.</CommandEmpty>
                                <CommandGroup>
                                    {products.map((product: any) => (
                                        <CommandItem
                                            key={product.id}
                                            value={product.name}
                                            onSelect={() => handleSelect(product)}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    currentReferenceId === product.id ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                            <div className="flex flex-col">
                                                <span>{product.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    KES {Number(product.selling_price || 0).toLocaleString()}
                                                </span>
                                            </div>
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