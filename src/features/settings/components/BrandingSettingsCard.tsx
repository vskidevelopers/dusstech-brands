/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { Controller, type Control, type UseFormSetValue } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Palette, Image as ImageIcon, X } from 'lucide-react';
import { SectionCard } from './SectionCard';
import { FormField } from './FormField';
import { ColorPicker } from './ColorPicker';
import { MediaPicker } from '@/features/media/components/MediaPicker';
import type { SettingsFormData } from '../schema';
import type { MediaItem } from '@/features/media/types';

interface BrandingSettingsCardProps {
    control: Control<SettingsFormData>;
    setValue: UseFormSetValue<SettingsFormData>; // ✅ Added setValue
    errors: any;
}

export function BrandingSettingsCard({ control, setValue, errors }: BrandingSettingsCardProps) {
    const [isLogoPickerOpen, setIsLogoPickerOpen] = useState(false);
    const [isFaviconPickerOpen, setIsFaviconPickerOpen] = useState(false);

    return (
        <SectionCard id="branding" title="Branding" icon={Palette} description="Logo, colors, and visual identity.">
            <div className="grid gap-6 sm:grid-cols-2">

                {/* === LOGO UPLOAD === */}
                <div className="space-y-2">
                    <FormField label="Company Logo" error={errors.logo_url?.message} hint="Recommended: PNG or SVG with transparent background">
                        <Controller
                            name="logo_url"
                            control={control}
                            render={({ field }) => (
                                <div className="space-y-3">
                                    {field.value ? (
                                        <div className="relative group w-full max-w-[200px] aspect-[3/1] rounded-lg border bg-muted/50 overflow-hidden">
                                            <img
                                                src={field.value}
                                                alt="Logo preview"
                                                className="w-full h-full object-contain p-2"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => setIsLogoPickerOpen(true)}
                                                >
                                                    Change
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => field.onChange('')} // ✅ field.onChange clears it
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full max-w-[200px] h-20 flex flex-col gap-1 border-dashed"
                                            onClick={() => setIsLogoPickerOpen(true)}
                                        >
                                            <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Select Logo</span>
                                        </Button>
                                    )}
                                </div>
                            )}
                        />
                    </FormField>
                </div>

                {/* === FAVICON UPLOAD === */}
                <div className="space-y-2">
                    <FormField label="Favicon" error={errors.favicon_url?.message} hint="Recommended: 32x32px or 64x64px PNG/ICO">
                        <Controller
                            name="favicon_url"
                            control={control}
                            render={({ field }) => (
                                <div className="space-y-3">
                                    {field.value ? (
                                        <div className="relative group w-16 h-16 rounded-lg border bg-muted/50 overflow-hidden">
                                            <img
                                                src={field.value}
                                                alt="Favicon preview"
                                                className="w-full h-full object-contain p-2"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="destructive"
                                                    className="h-6 w-6"
                                                    onClick={() => field.onChange('')} // ✅ field.onChange clears it
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-16 h-16 flex flex-col items-center justify-center gap-1 border-dashed"
                                            onClick={() => setIsFaviconPickerOpen(true)}
                                        >
                                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                        </Button>
                                    )}
                                </div>
                            )}
                        />
                    </FormField>
                </div>
            </div>

            {/* === COLOR PICKERS === */}
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <Controller
                    name="primary_color"
                    control={control}
                    render={({ field }) => (
                        <ColorPicker
                            label="Primary Color"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.primary_color?.message}
                        />
                    )}
                />
                <Controller
                    name="secondary_color"
                    control={control}
                    render={({ field }) => (
                        <ColorPicker
                            label="Secondary Color"
                            value={field.value}
                            onChange={field.onChange}
                            error={errors.secondary_color?.message}
                        />
                    )}
                />
            </div>

            {/* === MEDIA PICKER DIALOGS === */}
            <MediaPicker
                open={isLogoPickerOpen}
                onOpenChange={setIsLogoPickerOpen}
                folder="branding/logos"
                multiple={false}
                onSelect={(media: MediaItem | MediaItem[]) => {
                    const item = Array.isArray(media) ? media[0] : media;
                    if (item) {
                        setValue('logo_url', item.secure_url); // ✅ Clean, RHF-approved update
                    }
                }}
            />

            <MediaPicker
                open={isFaviconPickerOpen}
                onOpenChange={setIsFaviconPickerOpen}
                folder="branding/favicon"
                multiple={false}
                onSelect={(media: MediaItem | MediaItem[]) => {
                    const item = Array.isArray(media) ? media[0] : media;
                    if (item) {
                        setValue('favicon_url', item.secure_url); // ✅ Clean, RHF-approved update
                    }
                }}
            />
        </SectionCard>
    );
}