import type { ReactNode } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { QueryProvider } from '@/components/providers/QueryProvider';

export default function Layout({ children }: { children: ReactNode }) {
    return (
        <QueryProvider>
            <AdminLayout>{children}</AdminLayout>
        </QueryProvider>
    );
}