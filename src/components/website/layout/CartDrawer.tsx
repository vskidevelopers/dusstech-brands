'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCartStore } from '@/store/useCartStore';
import { useLockedBody } from '../hooks';
import { cn } from '@/lib/utils';

interface CartItem {
    id: string;
    type: string;
    name: string;
    slug: string;
    image?: string;
    price: number;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    closeCart: () => void;
    removeItem: (id: string, type: string) => void;
    updateQuantity: (id: string, type: string, quantity: number) => void;
    subtotal: () => number;
    totalItems: () => number;
}

export function CartDrawer(): React.ReactElement {
    const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCartStore();

    useLockedBody(isOpen);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={closeCart}
                        className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm"
                        aria-hidden
                    />

                    <motion.aside
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
                        className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-md flex-col bg-background shadow-2xl"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Shopping cart"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border px-5 py-4">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5" />
                                <h2 className="text-lg font-semibold">Your Cart</h2>
                                {totalItems() > 0 && (
                                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                                        {totalItems()}
                                    </span>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={closeCart}
                                aria-label="Close cart"
                                className="rounded-full p-2 hover:bg-muted transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                                        <ShoppingBag className="h-7 w-7 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Your cart is empty</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Browse our products and services to get started.
                                    </p>
                                    <Button className="mt-6" asChild>
                                        <Link href="/shop" onClick={closeCart}>
                                            Start Shopping
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <ul className="divide-y divide-border">
                                    <AnimatePresence initial={false}>
                                        {items.map((item) => (
                                            <motion.li
                                                key={`${item.type}-${item.id}`}
                                                layout
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex gap-4 p-5"
                                            >
                                                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                                                    {item.image ? (
                                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center">
                                                            <ShoppingBag className="h-6 w-6 text-muted-foreground/50" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-1 flex-col">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                                {item.type}
                                                            </p>
                                                            <Link
                                                                href={`/${item.type === 'product' ? 'shop' : 'services'}/${item.slug}`}
                                                                onClick={closeCart}
                                                                className="text-sm font-semibold hover:text-primary transition-colors"
                                                            >
                                                                {item.name}
                                                            </Link>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(item.id, item.type)}
                                                            aria-label={`Remove ${item.name}`}
                                                            className="rounded p-1 text-muted-foreground hover:text-destructive transition-colors"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    <div className="mt-auto flex items-center justify-between pt-2">
                                                        <div className="flex items-center gap-1 rounded-lg border border-border">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateQuantity(item.id, item.type, item.quantity - 1)}
                                                                aria-label="Decrease quantity"
                                                                className="flex h-7 w-7 items-center justify-center hover:bg-muted rounded-l-lg transition-colors"
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateQuantity(item.id, item.type, item.quantity + 1)}
                                                                aria-label="Increase quantity"
                                                                className="flex h-7 w-7 items-center justify-center hover:bg-muted rounded-r-lg transition-colors"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                        <p className="text-sm font-semibold">
                                                            KES {(item.price * item.quantity).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.li>
                                        ))}
                                    </AnimatePresence>
                                </ul>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-border p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Subtotal</span>
                                    <span className="text-xl font-bold">KES {subtotal().toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Shipping and taxes calculated at checkout.
                                </p>
                                <Button className="w-full" size="lg" asChild>
                                    <Link href="/checkout" onClick={closeCart}>
                                        Checkout <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button variant="outline" className="w-full" onClick={closeCart}>
                                    Continue Shopping
                                </Button>
                            </div>
                        )}
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}