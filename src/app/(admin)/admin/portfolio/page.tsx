import { Image as ImageIcon } from 'lucide-react';
import { UnderConstructionPage } from '@/components/shared/UnderConstructionPage';

export default function PortfolioPage() {
    return (
        <UnderConstructionPage
            title="Portfolio"
            description="Showcase your completed branding projects with images, descriptions, and client testimonials."
            icon={ImageIcon}
        />
    );
}