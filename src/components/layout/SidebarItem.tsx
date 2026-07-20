'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { NavItem } from '@/constants/navigation';
import { useUIStore } from '@/store/use-ui-store';

interface SidebarItemProps {
    item: NavItem;
}

export function SidebarItem({ item }: SidebarItemProps) {
    const pathname = usePathname();
    const { isSidebarCollapsed } = useUIStore();
    const isActive = pathname === item.href;

    // item.icon is a valid React component (LucideIcon)
    const Icon = item.icon;

    const content = (
        <Link
            href={item.href}
            className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors relative',
                isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            )}
            aria-current={isActive ? 'page' : undefined}
        >
            {isActive && (
                <motion.div
                    layoutId="active-sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            )}
            <Icon className="h-4 w-4 shrink-0" />
            <motion.span
                initial={false}
                animate={{ opacity: isSidebarCollapsed ? 0 : 1, width: isSidebarCollapsed ? 0 : 'auto' }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
            >
                {item.label}
            </motion.span>
        </Link>
    );

    if (isSidebarCollapsed) {
        return (
            <Tooltip>
                <TooltipTrigger asChild>{content}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>{item.label}</TooltipContent>
            </Tooltip>
        );
    }

    return content;
}