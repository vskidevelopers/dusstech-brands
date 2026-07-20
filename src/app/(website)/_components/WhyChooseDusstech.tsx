import {
    Award,
    Zap,
    Palette,
    Package,
    Truck,
    Headphones,
    type LucideIcon,
} from 'lucide-react';
import { Container } from '@/components/website/ui/Container';
import { SectionHeader } from '@/components/website/layout/SectionHeader';
import { FeatureCard } from '@/components/website/ui/FeatureCard';
import { StaggerContainer, StaggerItem } from '@/components/website/motion';

interface WhyItem {
    icon: LucideIcon;
    title: string;
    description: string;
}

const WHY_ITEMS: WhyItem[] = [
    {
        icon: Award,
        title: 'Premium Quality',
        description: 'Every product meets the highest standards — from materials to finishing.',
    },
    {
        icon: Zap,
        title: 'Fast Turnaround',
        description: 'Tight deadline? We deliver without compromising on quality.',
    },
    {
        icon: Palette,
        title: 'Custom Branding',
        description: 'Your brand, your way. Full customization on every order.',
    },
    {
        icon: Package,
        title: 'Bulk Orders',
        description: 'From 1 to 10,000 units — we scale with your business needs.',
    },
    {
        icon: Truck,
        title: 'Nationwide Delivery',
        description: 'We ship across Kenya. Nairobi same-day, countrywide in days.',
    },
    {
        icon: Headphones,
        title: 'Professional Support',
        description: 'Dedicated team from quote to delivery. We are always a message away.',
    },
];

export function WhyChooseDusstech() {
    return (
        <section className="border-b border-border bg-gradient-to-b from-canvas to-background py-16 md:py-24">
            <Container size="xl">
                <SectionHeader
                    eyebrow="Why Us"
                    title="Why Choose Dusstech"
                    description="We are more than a printing company. We are your brand partner."
                />

                <StaggerContainer staggerDelay={0.08} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {WHY_ITEMS.map((item) => (
                        <StaggerItem key={item.title}>
                            <FeatureCard
                                icon={<item.icon className="h-5 w-5" />}
                                title={item.title}
                                description={item.description}
                            />
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </Container>
        </section>
    );
}