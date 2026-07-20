'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Edit, MoreHorizontal, Trash2, Star } from 'lucide-react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CategoryStatusBadge } from './CategoryStatusBadge';
import { CategoryBooleanToggle } from './CategoryBooleanToggle';
import { DeleteCategoryDialog } from './DeleteCategoryDialog';
import { toggleFeaturedAction } from '../actions';
import type { Category } from '../types';

interface CategoriesTableProps {
    categories: Category[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

    if (categories.length === 0) return null;

    return (
        <>
            <div className="overflow-x-auto rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px]">Icon</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Description</TableHead>
                            <TableHead className="hidden sm:table-cell">Order</TableHead>
                            <TableHead className="text-center">Featured</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden lg:table-cell">Updated</TableHead>
                            <TableHead className="w-[60px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>
                                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-lg">
                                        {category.icon || '📁'}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Link
                                        href={`/admin/categories/${category.id}/edit`}
                                        className="font-medium hover:text-primary hover:underline"
                                    >
                                        {category.name}
                                    </Link>
                                    <div className="text-xs text-muted-foreground">/{category.slug}</div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell max-w-xs truncate text-muted-foreground">
                                    {category.description || '—'}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell tabular-nums text-muted-foreground">
                                    {category.sort_order}
                                </TableCell>
                                <TableCell className="text-center">
                                    <CategoryBooleanToggle
                                        category={category}
                                        field="featured"
                                        toggleAction={toggleFeaturedAction}
                                        icon={Star}
                                        activeColor="text-amber-400"
                                        label="Featured"
                                        successMessage={category.featured ? 'Removed from featured' : 'Marked as featured'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <CategoryStatusBadge active={category.active} />
                                </TableCell>
                                <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                                    {format(new Date(category.updated_at), 'MMM d, yyyy')}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Actions</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/admin/categories/${category.id}/edit`}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => setDeleteTarget(category)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Archive
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {deleteTarget && (
                <DeleteCategoryDialog
                    categoryId={deleteTarget.id}
                    categoryName={deleteTarget.name}
                    open={!!deleteTarget}
                    onOpenChange={(open) => !open && setDeleteTarget(null)}
                />
            )}
        </>
    );
}