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
import { getActiveServicesForSelect } from '@/features/services/queries';

interface ServicePickerProps {
    index: number;
    update: UseFieldArrayReturn<QuotationFormData, 'items'>['update'];
}

export function ServicePicker({ index, update }: ServicePickerProps) {
    const [open, setOpen] = useState(false);
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ Defensive: get the entire form context, handle null gracefully
    const formContext = useFormContext<QuotationFormData>();

    // ✅ Use formContext.watch instead of useWatch — safe when context is null
    const currentReferenceId = formContext?.watch(`items.${index}.reference_id`) as string | undefined;
    const getValues = formContext?.getValues;

    useEffect(() => {
        let cancelled = false;
        async function loadServices() {
            setLoading(true);
            try {
                const data = await getActiveServicesForSelect();
                if (!cancelled) setServices(data);
            } catch (error) {
                console.error('Failed to load services', error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        loadServices();
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
                Select a service...
            </Button>
        );
    }

    const handleSelect = (service: any) => {
        const currentItem = getValues(`items.${index}`);
        const currentQty = Number(currentItem?.quantity) || 1;
        const currentDiscount = Number(currentItem?.discount) || 0;
        const price = Number(service.starting_price) || 0;

        update(index, {
            ...currentItem,
            item_type: 'service',
            reference_id: service.id,
            description: service.name,
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
                        ? services.find((s: any) => s.id === currentReferenceId)?.name || 'Service Selected'
                        : 'Select a service...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search services..." />
                    <CommandList>
                        {loading ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>No services found.</CommandEmpty>
                                <CommandGroup>
                                    {services.map((service: any) => (
                                        <CommandItem
                                            key={service.id}
                                            value={service.name}
                                            onSelect={() => handleSelect(service)}
                                        >
                                            <Check
                                                className={cn(
                                                    'mr-2 h-4 w-4',
                                                    currentReferenceId === service.id ? 'opacity-100' : 'opacity-0'
                                                )}
                                            />
                                            <div className="flex flex-col">
                                                <span>{service.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    KES {Number(service.starting_price || 0).toLocaleString()}
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