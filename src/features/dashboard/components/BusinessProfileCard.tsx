/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from 'framer-motion';
import { Building2, MapPin, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { fadeInUp } from '../animations';
import type { Settings } from '@/features/settings/types';
import { formatFullAddress } from '@/features/settings/utils'; // ✅ Import from utils, not service

interface BusinessProfileCardProps {
    settings: Settings;
}

export function BusinessProfileCard({ settings }: BusinessProfileCardProps) {
    const businessName = (settings.business_name as string) || 'Dusstech Brands';
    const logoUrl = settings.logo_url as string | undefined;
    const primaryColor = (settings.primary_color as string) || '#000000';
    const secondaryColor = (settings.secondary_color as string) || '#666666';
    const tagline = settings.tagline as string | null | undefined;

    const fullAddress = formatFullAddress(settings as any);

    return (
        <motion.div
            variants={fadeInUp as any}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            <Card className="relative overflow-hidden">
                <div
                    className="absolute inset-x-0 top-0 h-1"
                    style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor}, transparent)` }}
                    aria-hidden={true}
                />

                <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                        <div
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl"
                            style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                        >
                            {logoUrl ? (
                                <img src={logoUrl} alt={businessName} className="h-10 w-10 object-contain" />
                            ) : (
                                <Building2 className="h-7 w-7" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Business Profile</p>
                            <h3 className="mt-1 text-lg font-bold tracking-tight truncate">{businessName}</h3>
                            {tagline && (
                                <p className="mt-0.5 text-sm text-muted-foreground italic">{tagline}</p>
                            )}
                        </div>
                    </div>

                    <Separator className="my-5" />

                    <dl className="space-y-4">
                        {fullAddress && (
                            <div className="flex items-start gap-3">
                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                <div className="text-sm">
                                    <dt className="font-medium text-foreground">Location</dt>
                                    <dd className="mt-0.5 text-muted-foreground">{fullAddress}</dd>
                                </div>
                            </div>
                        )}

                        {tagline && (
                            <div className="flex items-start gap-3">
                                <Quote className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                <div className="text-sm">
                                    <dt className="font-medium text-foreground">Motto</dt>
                                    <dd className="mt-0.5 italic text-muted-foreground">&ldquo;{tagline}&rdquo;</dd>
                                </div>
                            </div>
                        )}
                    </dl>
                </CardContent>
            </Card>
        </motion.div>
    );
}