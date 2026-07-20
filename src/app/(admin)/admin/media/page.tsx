import { Library } from 'lucide-react';
import { UnderConstructionPage } from '@/components/shared/UnderConstructionPage';

export default function MediaPage() {
    return (
        <UnderConstructionPage
            title="Media Library"
            description="Centralized asset management for all your images, videos, and brand files. Cloudinary integration coming soon."
            icon={Library}
        />
    );
}