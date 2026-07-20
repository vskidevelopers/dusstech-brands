import Link from 'next/link';
import { motion } from 'framer-motion';

export function Logo({ collapsed }: { collapsed?: boolean }) {
    return (
        <Link href="/admin" className="flex items-center gap-3 px-4 h-16 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg shrink-0">
                D
            </div>
            <motion.div
                initial={false}
                animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : 'auto' }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
            >
                <div className="flex flex-col">
                    <span className="text-sm font-semibold tracking-tight">Dusstech Brands</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Admin Portal</span>
                </div>
            </motion.div>
        </Link>
    );
}