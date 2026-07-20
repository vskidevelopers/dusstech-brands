import { Skeleton } from '@/components/ui/skeleton';

export function ServicesSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
                <Skeleton className="h-9 w-full sm:max-w-xs" />
                <Skeleton className="h-9 w-full sm:w-[160px]" />
                <Skeleton className="h-9 w-full sm:w-[160px]" />
            </div>
            <div className="rounded-lg border">
                <div className="border-b p-4">
                    <Skeleton className="h-4 w-32" />
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 border-b p-4 last:border-b-0">
                        <Skeleton className="h-10 w-10 rounded-md" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                        <Skeleton className="hidden h-4 w-20 md:block" />
                        <Skeleton className="hidden h-4 w-16 sm:block" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                ))}
            </div>
        </div>
    );
}