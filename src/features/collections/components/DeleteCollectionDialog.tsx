'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog, DialogContent, DialogDescription, DialogFooter,
    DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deleteCollectionAction } from '../actions';

interface DeleteCollectionDialogProps {
    collectionId: string;
    collectionName: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DeleteCollectionDialog({
    collectionId, collectionName, open, onOpenChange,
}: DeleteCollectionDialogProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteCollectionAction(collectionId);
            if (result.success) {
                toast.success(`"${collectionName}" has been archived.`);
                onOpenChange(false);
                router.refresh();
            } else {
                toast.error(result.error ?? 'Failed to archive collection');
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    <DialogTitle>Archive this collection?</DialogTitle>
                    <DialogDescription>
                        <strong>{collectionName}</strong> will be marked as inactive. Products and services linked to it will no longer show this collection, but you can restore it anytime.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Archiving...
                            </>
                        ) : (
                            'Archive collection'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}