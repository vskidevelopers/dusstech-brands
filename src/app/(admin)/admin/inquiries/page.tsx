import { MessageSquare } from 'lucide-react';
import { UnderConstructionPage } from '@/components/shared/UnderConstructionPage';

export default function InquiriesPage() {
    return (
        <UnderConstructionPage
            title="Customer Inquiries"
            description="Track and manage questions from your website visitors. Auto-synced with WhatsApp and email."
            icon={MessageSquare}
        />
    );
}