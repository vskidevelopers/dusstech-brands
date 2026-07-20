'use client';

import { useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NewsletterCTAProps {
    className?: string;
    variant?: 'default' | 'compact';
}

export function NewsletterCTA({ className, variant = 'default' }: NewsletterCTAProps) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        setStatus('loading');
        // Placeholder - will be wired to actual service later
        setTimeout(() => {
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 3000);
        }, 800);
    };

    if (variant === 'compact') {
        return (
            <form onSubmit={handleSubmit} className={cn('flex gap-2', className)}>
                <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1"
                />
                <Button type="submit" disabled={status !== 'idle'}>
                    {status === 'success' ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
            </form>
        );
    }

    return (
        <div className={cn('rounded-2xl border border-border bg-card p-6 md:p-8', className)}>
            <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold tracking-tight">Stay in the loop</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Get branding tips, new product drops, and exclusive offers.
                    </p>
                    <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2">
                        <Input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1"
                        />
                        <Button type="submit" disabled={status !== 'idle'}>
                            {status === 'success' ? (
                                <>
                                    <Check className="h-4 w-4" /> Subscribed
                                </>
                            ) : (
                                <>
                                    Subscribe <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}