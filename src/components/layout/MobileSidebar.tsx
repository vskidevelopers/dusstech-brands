'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { navigation } from '@/constants/navigation';
import { SidebarGroup } from './SidebarGroup';
import { Logo } from './Logo';
import { useUIStore } from '@/store/use-ui-store';

export function MobileSidebar() {
    const pathname = usePathname();
    const { isMobileSidebarOpen, setMobileSidebarOpen } = useUIStore();

    // Auto-close drawer when navigating
    useEffect(() => {
        setMobileSidebarOpen(false);
    }, [pathname, setMobileSidebarOpen]);

    return (
        <Sheet open={isMobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetContent side="left" className="w-[280px] p-0 flex flex-col">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <Logo />
                <div className="flex-1 overflow-y-auto px-3 py-4">
                    {navigation.map((group) => (
                        <SidebarGroup key={group.title} group={group} />
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}