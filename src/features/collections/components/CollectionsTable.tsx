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
import { CollectionStatusBadge } from './CollectionStatusBadge';
import { CollectionBooleanToggle } from './CollectionBooleanToggle';
import { DeleteCollectionDialog } from './DeleteCollectionDialog';
import { toggleFeaturedAction } from '../actions';
import type { Collection } from '../types';

interface CollectionsTableProps {
    collections: Collection[];
}

export function CollectionsTable({ collections }: CollectionsTableProps) {
    const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);

    if (collections.length === 0) return null;

    return (
        <>
            <div className="overflow-x-auto rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Description</TableHead>
                            <TableHead className="text-center">Featured</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden lg:table-cell">Updated</TableHead>
                            <TableHead className="w-[60px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {collections.map((collection) => (
                            <TableRow key={collection.id}>
                                <TableCell>
                                    <Link
                                        href={`/admin/collections/${collection.id}/edit`}
                                        className="font-medium hover:text-primary hover:underline"
                                    >
                                        {collection.name}
                                    </Link>
                                    <div className="text-xs text-muted-foreground">/{collection.slug}</div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell max-w-xs truncate text-muted-foreground">
                                    {collection.description || '—'}
                                </TableCell>
                                <TableCell className="text-center">
                                    <CollectionBooleanToggle
                                        collection={collection}
                                        field="featured"
                                        toggleAction={toggleFeaturedAction}
                                        icon={Star}
                                        activeColor="text-amber-400"
                                        label="Featured"
                                        successMessage={collection.featured ? 'Removed from featured' : 'Marked as featured'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <CollectionStatusBadge active={collection.active} />
                                </TableCell>
                                <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                                    {format(new Date(collection.updated_at), 'MMM d, yyyy')}
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
                                                <Link href={`/admin/collections/${collection.id}/edit`}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => setDeleteTarget(collection)}
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
                <DeleteCollectionDialog
                    collectionId={deleteTarget.id}
                    collectionName={deleteTarget.name}
                    open={!!deleteTarget}
                    onOpenChange={(open) => !open && setDeleteTarget(null)}
                />
            )}
        </>
    );
}