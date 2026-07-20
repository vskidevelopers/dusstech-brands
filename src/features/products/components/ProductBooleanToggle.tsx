'use client';

import { useTransition } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { queryKeys } from '@/lib/query-keys';
import type { Product } from '../types';

interface ProductBooleanToggleProps {
    product: Product;
    field: 'featured' | 'active' | 'new_arrival' | 'popular';
    toggleAction: (id: string, value: boolean) => Promise<{ success: boolean; error?: string }>;
    icon: LucideIcon;
    activeColor: string; // Tailwind text color class when active
    label: string;
    successMessage: string;
}

export function ProductBooleanToggle({
    product, field, toggleAction, icon: Icon, activeColor, label, successMessage,
}: ProductBooleanToggleProps) {
    const queryClient = useQueryClient();
    const [isPending, startTransition] = useTransition();
    const currentValue = product[field];

    const mutation = useMutation({
        mutationFn: (newValue: boolean) => toggleAction(product.id, newValue),
        onMutate: async (newValue) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.services.all });
            const previous = queryClient.getQueryData(queryKeys.services.lists());
            // Optimistic update is handled by router.refresh() after action completes
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKeys.services.lists(), context.previous);
            }
            toast.error(`Failed to update ${label.toLowerCase()}`);
        },
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.error ?? 'Failed to update');
            } else {
                toast.success(successMessage);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
        },
    });

    const handleClick = () => {
        startTransition(() => {
            mutation.mutate(!currentValue);
        });
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            disabled={isPending}
            aria-label={`${currentValue ? 'Remove' : 'Set'} ${label.toLowerCase()}`}
            aria-pressed={currentValue}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Icon
                    className={`h-4 w-4 ${currentValue
                        ? `${activeColor} fill-current`
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                />
            )}
        </Button>
    );
}