'use client';

import { useTransition } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Archive, ArchiveRestore } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { queryKeys } from '@/lib/query-keys';
import { toggleActiveAction } from '../actions';
import type { Service } from '../types';

interface ActiveToggleProps {
    service: Service;
}

export function ActiveToggle({ service }: ActiveToggleProps) {
    const queryClient = useQueryClient();
    const [isPending, startTransition] = useTransition();

    const mutation = useMutation({
        mutationFn: (active: boolean) => toggleActiveAction(service.id, active),
        onMutate: async (active) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.services.all });
            const previous = queryClient.getQueryData<Service[]>(queryKeys.services.lists());
            if (previous) {
                queryClient.setQueryData<Service[]>(queryKeys.services.lists(), (old) =>
                    old?.map((s) => (s.id === service.id ? { ...s, active } : s)) ?? []
                );
            }
            return { previous };
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(queryKeys.services.lists(), context.previous);
            }
            toast.error('Failed to update status');
        },
        onSuccess: (result) => {
            if (!result.success) {
                toast.error(result.error ?? 'Failed to update');
            } else {
                toast.success(service.active ? 'Service archived' : 'Service restored');
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
        },
    });

    const handleClick = () => {
        startTransition(() => {
            mutation.mutate(!service.active);
        });
    };

    const Icon = service.active ? Archive : ArchiveRestore;

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleClick}
            disabled={isPending}
            aria-label={service.active ? 'Archive service' : 'Restore service'}
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Icon className="h-4 w-4" />
            )}
        </Button>
    );
}