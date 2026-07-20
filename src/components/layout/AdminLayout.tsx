import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { Header } from './Header';
import { Content } from './Content';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

interface AdminLayoutProps {
    children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <ErrorBoundary>
            <TooltipProvider delayDuration={300}>
                <div className="relative flex h-screen overflow-hidden bg-background text-foreground">
                    {/* Desktop Sidebar */}
                    <Sidebar />

                    {/* Mobile Drawer */}
                    <MobileSidebar />

                    {/* Main Content Area */}
                    <div className="flex flex-1 flex-col overflow-hidden">
                        <Header />
                        <Content>{children}</Content>
                    </div>
                </div>
            </TooltipProvider>
        </ErrorBoundary>
    );
}