'use client';

import { useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Edit, MoreHorizontal, Trash2, Star, Sparkles, Flame } from 'lucide-react';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProductStatusBadge } from './ProductStatusBadge';
import { ProductBooleanToggle } from './ProductBooleanToggle';
import { DeleteProductDialog } from './DeleteProductDialog';
import {
    toggleFeaturedAction, toggleNewArrivalAction, togglePopularAction,
} from '../actions';
import type { Product } from '../types';

interface ProductsTableProps {
    products: Product[];
}

function formatPrice(price: number | null, compareAt: number | null): React.ReactNode {
    if (price === null || price === 0) return <span className="text-muted-foreground">—</span>;
    const formatted = new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        maximumFractionDigits: 0,
    }).format(price);

    if (compareAt && compareAt > price) {
        const compareFormatted = new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES',
            maximumFractionDigits: 0,
        }).format(compareAt);
        return (
            <div className="flex items-center gap-2">
                <span className="font-medium tabular-nums">{formatted}</span>
                <span className="text-xs text-muted-foreground line-through tabular-nums">
                    {compareFormatted}
                </span>
            </div>
        );
    }
    return <span className="tabular-nums">{formatted}</span>;
}

export function ProductsTable({ products }: ProductsTableProps) {
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

    if (products.length === 0) return null;

    return (
        <>
            <div className="overflow-x-auto rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px]">Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden sm:table-cell">Price</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Featured</TableHead>
                            <TableHead className="hidden md:table-cell text-center">New</TableHead>
                            <TableHead className="hidden md:table-cell text-center">Popular</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="hidden lg:table-cell">Updated</TableHead>
                            <TableHead className="w-[60px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                                        {product.featured_image ? (
                                            <img
                                                src={product.featured_image}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                —
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Link
                                        href={`/admin/products/${product.id}/edit`}
                                        className="font-medium hover:text-primary hover:underline"
                                    >
                                        {product.name}
                                    </Link>
                                    <div className="text-xs text-muted-foreground">
                                        /{product.slug}
                                        {product.collection && (
                                            <span className="ml-2">• {product.collection}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    {formatPrice(product.selling_price, product.compare_at_price)}
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-center">
                                    <ProductBooleanToggle
                                        product={product}
                                        field="featured"
                                        toggleAction={toggleFeaturedAction}
                                        icon={Star}
                                        activeColor="text-amber-400"
                                        label="Featured"
                                        successMessage={product.featured ? 'Removed from featured' : 'Marked as featured'}
                                    />
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-center">
                                    <ProductBooleanToggle
                                        product={product}
                                        field="new_arrival"
                                        toggleAction={toggleNewArrivalAction}
                                        icon={Sparkles}
                                        activeColor="text-cyan-400"
                                        label="New arrival"
                                        successMessage={product.new_arrival ? 'Removed from new arrivals' : 'Marked as new arrival'}
                                    />
                                </TableCell>
                                <TableCell className="hidden md:table-cell text-center">
                                    <ProductBooleanToggle
                                        product={product}
                                        field="popular"
                                        toggleAction={togglePopularAction}
                                        icon={Flame}
                                        activeColor="text-orange-400"
                                        label="Popular"
                                        successMessage={product.popular ? 'Removed from popular' : 'Marked as popular'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <ProductStatusBadge active={product.active} />
                                </TableCell>
                                <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">
                                    {format(new Date(product.updated_at), 'MMM d, yyyy')}
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
                                                <Link href={`/admin/products/${product.id}/edit`}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => setDeleteTarget(product)}
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
                <DeleteProductDialog
                    productId={deleteTarget.id}
                    productName={deleteTarget.name}
                    open={!!deleteTarget}
                    onOpenChange={(open) => !open && setDeleteTarget(null)}
                />
            )}
        </>
    );
}