'use client';

import { useTransition } from 'react';
import Link from 'next/link'; // ✅ Added Next.js Link
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, User, Loader2, Home } from 'lucide-react'; // ✅ Added Home icon
import { logoutAction } from '@/actions/auth/logout';

export function NavUser() {
    const [isPending, startTransition] = useTransition();

    const handleLogout = () => {
        startTransition(async () => {
            await logoutAction();
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full" disabled={isPending}>
                    <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary">DB</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Admin User</p>
                        <p className="text-xs leading-none text-muted-foreground">admin@dusstech.co.ke</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* ✅ NEW: View Website Link */}
                <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer w-full">
                        <Home className="mr-2 h-4 w-4" />
                        <span>View Website</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem disabled={isPending}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled={isPending}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isPending}
                    className="cursor-pointer text-red-600 focus:text-red-600" // Optional: makes logout stand out
                >
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                    )}
                    <span>{isPending ? 'Signing out...' : 'Log out'}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}