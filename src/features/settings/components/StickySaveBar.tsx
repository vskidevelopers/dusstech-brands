'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, RotateCcw, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface StickySaveBarProps {
    isDirty: boolean;
    isPending: boolean;
    onSave: () => void;
    onDiscard: () => void;
}

export function StickySaveBar({ isDirty, isPending, onSave, onDiscard }: StickySaveBarProps) {
    const router = useRouter();

    // Warn before leaving with unsaved changes
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, [isDirty]);

    return (
        <AnimatePresence>
            {isDirty && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
                >
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
                        <div className="flex items-center gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            <span className="font-medium">You have unsaved changes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onDiscard}
                                disabled={isPending}
                            >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Discard
                            </Button>
                            <Button type="button" onClick={onSave} disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}