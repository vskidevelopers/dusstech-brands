'use client';

import { useTransition } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, type LucideIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { queryKeys } from '@/lib/query-keys';
import type { Collection } from '../types';

interface CollectionBooleanToggleProps {
    collection: Collection;
    field: 'featured' | 'active';
    toggleAction: (id: string, value: boolean) => Promise<{ success: boolean; error?: string }>;
    icon: LucideIcon;
    activeColor: string;
    label: string;
    successMessage: string;
}

export function CollectionBooleanToggle({
    collection, field, toggleAction, icon: Icon, activeColor, label, successMessage,
}: CollectionBooleanToggleProps) {
    const queryClient = useQueryClient();
    const [isPending, startTransition] = useTransition();
    const currentValue = collection[field];

    const mutation = useMutation({
        mutationFn: (newValue: boolean) => toggleAction(collection.id, newValue),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: queryKeys.collections.all });
            const previous = queryClient.getQueryData(queryKeys.collections.lists());
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKeys.collections.lists(), context.previous);
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
            queryClient.invalidateQueries({ queryKey: queryKeys.collections.all });
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