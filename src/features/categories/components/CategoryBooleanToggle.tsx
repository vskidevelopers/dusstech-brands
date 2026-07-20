'use client';

import { useTransition } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { queryKeys } from '@/lib/query-keys';
import type { Category } from '../types';

interface CategoryBooleanToggleProps {
    category: Category;
    field: 'featured' | 'active';
    toggleAction: (id: string, value: boolean) => Promise<{ success: boolean; error?: string }>;
    icon: LucideIcon;
    activeColor: string;
    label: string;
    successMessage: string;
}

export function CategoryBooleanToggle({
    category, field, toggleAction, icon: Icon, activeColor, label, successMessage,
}: CategoryBooleanToggleProps) {
    const queryClient = useQueryClient();
    const [isPending, startTransition] = useTransition();
    const currentValue = category[field];

    const mutation = useMutation({
        mutationFn: (newValue: boolean) => toggleAction(category.id, newValue),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: queryKeys.products.all });
            const previous = queryClient.getQueryData(queryKeys.products.lists());
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKeys.products.lists(), context.previous);
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
            queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
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