/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { settingsSchema, type SettingsFormData } from '../schema';
import { updateSettingsAction } from '../actions';
import type { Settings } from '../types';
import { StickySaveBar } from './StickySaveBar';
import { SettingsSidebar } from './SettingsSidebar';
import { GeneralSettingsCard } from './GeneralSettingsCard';
import { BrandingSettingsCard } from './BrandingSettingsCard';
import { ContactSettingsCard } from './ContactSettingsCard';
import { LocationSettingsCard } from './LocationSettingsCard';
import { BusinessHoursCard } from './BusinessHoursCard';
import { SocialLinksCard } from './SocialLinksCard';
import { SeoSettingsCard } from './SeoSettingsCard';
import { QuotationDefaultsCard } from './QuotationDefaultsCard';
import { OrderDefaultsCard } from './OrderDefaultsCard';
import { PaymentSettingsCard } from './PaymentSettingsCard';
import { SystemSettingsCard } from './SystemSettingsCard';

interface SettingsFormProps {
    initialSettings: Settings;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [isPending, startTransition] = useTransition();

    const {
        control, handleSubmit, reset, setValue, formState: { errors, isDirty },
    } = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema) as any,
        defaultValues: {
            business_name: initialSettings.business_name,
            tagline: initialSettings.tagline ?? '',
            registration_number: initialSettings.registration_number ?? '',
            kra_pin: initialSettings.kra_pin ?? '',
            logo_url: initialSettings.logo_url ?? '',
            favicon_url: initialSettings.favicon_url ?? '',
            primary_color: initialSettings.primary_color,
            secondary_color: initialSettings.secondary_color,
            phone_primary: initialSettings.phone_primary ?? '',
            phone_secondary: initialSettings.phone_secondary ?? '',
            whatsapp_number: initialSettings.whatsapp_number ?? '',
            email: initialSettings.email ?? '',
            website: initialSettings.website ?? '',
            address: initialSettings.address ?? '',
            building: initialSettings.building ?? '',
            street: initialSettings.street ?? '',
            city: initialSettings.city ?? '',
            county: initialSettings.county ?? '',
            country: initialSettings.country,
            google_maps_url: initialSettings.google_maps_url ?? '',
            business_hours: initialSettings.business_hours as any,
            facebook: initialSettings.facebook ?? '',
            instagram: initialSettings.instagram ?? '',
            linkedin: initialSettings.linkedin ?? '',
            tiktok: initialSettings.tiktok ?? '',
            youtube: initialSettings.youtube ?? '',
            x: initialSettings.x ?? '',
            default_meta_title: initialSettings.default_meta_title ?? '',
            default_meta_description: initialSettings.default_meta_description ?? '',
            default_keywords: initialSettings.default_keywords ?? '',
            default_terms: initialSettings.default_terms ?? '',
            default_notes: initialSettings.default_notes ?? '',
            default_validity_days: initialSettings.default_validity_days,
            currency: initialSettings.currency,
            currency_symbol: initialSettings.currency_symbol,
            vat_enabled: initialSettings.vat_enabled,
            default_vat_percentage: initialSettings.default_vat_percentage,
            default_delivery_message: initialSettings.default_delivery_message ?? '',
            default_pickup_message: initialSettings.default_pickup_message ?? '',
            mpesa_paybill: initialSettings.mpesa_paybill ?? '',
            mpesa_till: initialSettings.mpesa_till ?? '',
            mpesa_account_name: initialSettings.mpesa_account_name ?? '',
            payments_enabled: initialSettings.payments_enabled,
            maintenance_mode: initialSettings.maintenance_mode,
            allow_guest_orders: initialSettings.allow_guest_orders,
            allow_guest_checkout: initialSettings.allow_guest_checkout,
        },
    });

    const onSubmit = (data: SettingsFormData) => {
        startTransition(async () => {
            const result = await updateSettingsAction(data);
            if (result.success) {
                toast.success('Settings saved successfully');
                reset(data); // Mark form as clean
            } else {
                if (result.fieldErrors) {
                    Object.entries(result.fieldErrors).forEach(([field, msg]) => {
                        toast.error(`${field}: ${Array.isArray(msg) ? msg[0] : msg}`);
                    });
                } else {
                    toast.error(result.error ?? 'Failed to save settings');
                }
            }
        });
    };

    const handleDiscard = () => {
        reset();
        toast.info('Changes discarded');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Business Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Configure every aspect of Dusstech Brands from one place.
                </p>
            </div>

            <div className="flex gap-8">
                <SettingsSidebar />

                <div className="flex-1 space-y-6 pb-24">
                    <GeneralSettingsCard control={control} errors={errors} />
                    <BrandingSettingsCard control={control} setValue={setValue} errors={errors} />
                    <ContactSettingsCard control={control} errors={errors} />
                    <LocationSettingsCard control={control} errors={errors} />
                    <BusinessHoursCard control={control} />
                    <SocialLinksCard control={control} errors={errors} />
                    <SeoSettingsCard control={control} errors={errors} />
                    <QuotationDefaultsCard control={control} errors={errors} />
                    <OrderDefaultsCard control={control} errors={errors} />
                    <PaymentSettingsCard control={control} errors={errors} />
                    <SystemSettingsCard control={control} />
                </div>
            </div>

            <StickySaveBar
                isDirty={isDirty}
                isPending={isPending}
                onSave={handleSubmit(onSubmit)}
                onDiscard={handleDiscard}
            />
        </form>
    );
}