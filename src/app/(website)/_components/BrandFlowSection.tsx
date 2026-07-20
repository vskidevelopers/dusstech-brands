import { BrandFlow, BrandFlowCard } from '@/features/brandflow/components';
import { Container } from '@/components/website/ui/Container';
import { SectionHeader } from '@/components/website/layout/SectionHeader';
import { FadeUp } from '@/components/website/motion';

export function BrandFlowSection() {
    return (
        <section id="brandflow" className="border-b border-border bg-gradient-to-b from-canvas to-background py-16 md:py-24">
            <Container size="lg">
                <FadeUp>
                    <SectionHeader
                        eyebrow="Guided Discovery"
                        title="What would you like to brand today?"
                        description="Answer a few quick questions and we'll recommend the perfect solution for your needs."
                    />
                </FadeUp>
                <FadeUp delay={0.15}>
                    <BrandFlowCard>
                        <BrandFlow flowId="discovery" />
                    </BrandFlowCard>
                </FadeUp>
            </Container>
        </section>
    );
}