import type { ReactNode } from 'react';

interface ContentProps {
    children: ReactNode;
}

export function Content({ children }: ContentProps) {
    return (
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
                {children}
            </div>
        </main>
    );
}