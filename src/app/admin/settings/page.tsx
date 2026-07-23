import { redirect } from 'next/navigation';
import { getBusinessSettings } from '@/features/settings';
import { SettingsForm } from '@/features/settings/components/SettingsForm';

export default async function SettingsPage() {
    const settings = await getBusinessSettings();

    if (!settings) {
        // This should never happen because the migration seeds the row,
        // but handle it defensively.
        redirect('/admin');
    }

    return <SettingsForm initialSettings={settings} />;
}
