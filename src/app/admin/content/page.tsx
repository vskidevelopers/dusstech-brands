'use client';
import { Globe } from 'lucide-react';
import { UnderConstructionPage } from '@/components/shared/UnderConstructionPage';

export default function ContentPage() {
    return (
        <UnderConstructionPage
            title="Website Content"
            description="Edit your public website pages, hero sections, and brand storytelling — all from here."
            icon={Globe}
        />
    );
}