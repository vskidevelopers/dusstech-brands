'use client';

import { useTransition } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { queryKeys } from '@/lib/query-keys';
import { toggleFeaturedAction } from '../actions';
import type { Service } from '../types';

interface FeaturedToggleProps {
    service: Service;
}

export function FeaturedToggle({ service }: FeaturedToggleProps) {
    const queryClient = useQueryClient();
    const [isPending, startTransition] = useTransition();

    const mutation = useMutation({
        mutationFn: (featured: boolean) => toggleFeaturedAction(service.id, featured),
        onMutate: async (featured) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.services.all });
            const previous = queryClient.getQueryData<Service[]>(queryKeys.services.lists());
            if (previous) {
                queryClient.setQueryData<Service[]>(queryKeys.services.lists(), (old) =>
                    old?.map((s) => (s.id === service.id ? { ...s, featured } : s)) ?? []
                );
            }
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKeys.services.lists(), context.previous);
            }
            toast.error('Failed to update featured status');
        },
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.error ?? 'Failed to update');
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
        },
    });

    const handleClick = () => {
        startTransition(() => {
            mutation.mutate(!service.featured);
        });
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            disabled={isPending}
            aria-label={service.featured ? 'Remove from featured' : 'Mark as featured'}
            aria-pressed={service.featured}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Star
                    className={`h-4 w-4 ${service.featured
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground hover:text-amber-400'
                        }`}
                />
            )}
        </Button>
    );
}