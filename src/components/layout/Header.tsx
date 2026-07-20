'use client';

import { usePathname } from 'next/navigation';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { NavUser } from './NavUser';
import { useUIStore } from '@/store/use-ui-store';
import { pageTitles } from '@/constants/navigation';

export function Header() {
    const pathname = usePathname();
    const { setMobileSidebarOpen } = useUIStore();
    const title = pageTitles[pathname] || 'Dashboard';

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-md px-4 md:px-6 shrink-0">
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open menu"
            >
                <Menu className="h-5 w-5" />
            </Button>

            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>

            <div className="ml-auto flex items-center gap-2">
                <ThemeToggle />
                <Button variant="ghost" size="icon" aria-label="Notifications">
                    <Bell className="h-5 w-5" />
                </Button>
                <NavUser />
            </div>
        </header>
    );
}