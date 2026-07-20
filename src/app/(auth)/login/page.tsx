/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { loginAction } from '@/actions/auth/login';
import { loginSchema, type LoginInput } from '@/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const fadeIn = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
};

export default function LoginPage() {
    const [isPending, startTransition] = useTransition();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    const rememberMe = watch('rememberMe');

    const onSubmit = (data: LoginInput) => {
        setServerError(null);
        startTransition(async () => {
            const result = await loginAction(data);
            if (!result.success && result.error) {
                setServerError(result.error);
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden p-4">
            {/* Ambient background glow */}
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                aria-hidden
            >
                <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-[400px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-purple-500/10 blur-3xl" />
            </div>

            <motion.div
                variants={fadeIn as any}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="mb-8 flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    >
                        <span className="text-2xl font-bold">D</span>
                    </motion.div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        Dusstech Brands
                    </p>
                </div>

                {/* Auth Card */}
                <Card className="border-white/10 bg-background/60 shadow-2xl backdrop-blur-xl">
                    <CardContent className="p-8">
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Sign in to access your admin dashboard.
                            </p>
                        </div>

                        {serverError && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                                role="alert"
                            >
                                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                <span>{serverError}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        autoComplete="email"
                                        placeholder="admin@dusstech.co.ke"
                                        className={cn(
                                            'pl-9',
                                            errors.email && 'border-destructive focus-visible:ring-destructive'
                                        )}
                                        disabled={isPending}
                                        aria-invalid={errors.email ? 'true' : 'false'}
                                        aria-describedby={errors.email ? 'email-error' : undefined}
                                        {...register('email')}
                                    />
                                </div>
                                {errors.email && (
                                    <p id="email-error" className="text-xs text-destructive">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="#"
                                        className="text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-primary hover:underline"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toast.info('Password reset is not yet available.');
                                        }}
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                        className={cn(
                                            'pl-9',
                                            errors.password && 'border-destructive focus-visible:ring-destructive'
                                        )}
                                        disabled={isPending}
                                        aria-invalid={errors.password ? 'true' : 'false'}
                                        aria-describedby={errors.password ? 'password-error' : undefined}
                                        {...register('password')}
                                    />
                                </div>
                                {errors.password && (
                                    <p id="password-error" className="text-xs text-destructive">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onCheckedChange={(checked: boolean) =>
                                        setValue('rememberMe', checked === true, { shouldDirty: true })
                                    }
                                    disabled={isPending}
                                />
                                <Label htmlFor="rememberMe" className="text-sm font-normal">
                                    Remember me for 30 days
                                </Label>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={isPending}
                                aria-busy={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Dusstech Brands Limited. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
}