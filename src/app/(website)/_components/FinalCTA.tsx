import Link from 'next/link';
import { ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/website/ui/Button';
import { Container } from '@/components/website/ui/Container';
import { FadeUp } from '@/components/website/motion';

export function FinalCTA() {
    return (
        <section className="relative overflow-hidden py-20 md:py-28">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-600 to-primary-800" />
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `
            radial-gradient(at 20% 20%, hsl(var(--accent) / 0.4) 0%, transparent 50%),
            radial-gradient(at 80% 80%, hsl(var(--primary-300) / 0.3) 0%, transparent 50%)
          `,
                }}
                aria-hidden
            />

            <Container size="lg" className="relative text-center">
                <FadeUp>
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                        <Sparkles className="h-7 w-7 text-white" />
                    </div>

                    <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white">
                        Ready to Build Your Brand?
                    </h2>
                    <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
                        Let us craft something unforgettable. Start with BrandFlow or explore our full catalog.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="bg-white text-primary hover:bg-white/90"
                            asChild
                        >
                            <a href="#brandflow">
                                Start BrandFlow <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                            asChild
                        >
                            <Link href="/services">
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Browse Services
                            </Link>
                        </Button>
                    </div>
                </FadeUp>
            </Container>
        </section>
    );
}