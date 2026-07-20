'use client';

import { motion } from 'framer-motion';
import { navigation } from '@/constants/navigation';
import { SidebarGroup } from './SidebarGroup';
import { Logo } from './Logo';
import { useUIStore } from '@/store/use-ui-store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

export function Sidebar() {
    const { isSidebarCollapsed, toggleSidebar } = useUIStore();

    return (
        <motion.aside
            initial={false}
            animate={{ width: isSidebarCollapsed ? 80 : 280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
                'hidden md:flex flex-col h-screen sticky top-0 border-r bg-background/50 backdrop-blur-xl z-30'
            )}
            aria-label="Main navigation"
        >
            <Logo collapsed={isSidebarCollapsed} />

            <div className="flex-1 overflow-y-auto px-3 py-4">
                {navigation.map((group) => (
                    <SidebarGroup key={group.title} group={group} />
                ))}
            </div>

            <div className="p-3 border-t">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="w-full justify-center"
                    aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
                </Button>
            </div>
        </motion.aside>
    );
}