'use client';

import { motion } from 'framer-motion';
import type { NavGroup } from '@/constants/navigation';
import { SidebarItem } from './SidebarItem';
import { useUIStore } from '@/store/use-ui-store';

interface SidebarGroupProps {
    group: NavGroup;
}

export function SidebarGroup({ group }: SidebarGroupProps) {
    const { isSidebarCollapsed } = useUIStore();

    return (
        <div className="mb-6">
            <motion.h3
                initial={false}
                animate={{ opacity: isSidebarCollapsed ? 0 : 1, height: isSidebarCollapsed ? 0 : 'auto' }}
                transition={{ duration: 0.2 }}
                className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider overflow-hidden"
            >
                {group.title}
            </motion.h3>
            <nav className="flex flex-col gap-1">
                {group.items.map((item) => (
                    <SidebarItem key={item.href} item={item} />
                ))}
            </nav>
        </div>
    );
}