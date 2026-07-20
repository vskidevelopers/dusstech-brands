import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/website/ui/Button';
import { Container } from '@/components/website/ui/Container';
import { HeroRotatingText } from './HeroRotatingText';
import { HeroCollage } from './HeroCollage';
import { FadeUp } from '@/components/website/motion';
import type { Product } from '@/features/products/types';

interface HeroProps {
    featuredProducts?: Product[];
}

export function Hero({ featuredProducts = [] }: HeroProps) {
    // Extract images from featured products for the collage
    const collageImages = featuredProducts
        .map((p) => p.featured_image)
        .filter((img): img is string => !!img)
        .slice(0, 5);

    return (
        <section className="relative overflow-hidden border-b border-border">
            {/* Mesh background */}
            <div
                className="pointer-events-none absolute inset-0 opacity-60"
                style={{
                    backgroundImage: `
            radial-gradient(at 15% 20%, hsl(var(--primary) / 0.18) 0%, transparent 50%),
            radial-gradient(at 85% 80%, hsl(var(--accent) / 0.12) 0%, transparent 50%),
            radial-gradient(at 50% 50%, hsl(var(--primary-300) / 0.08) 0%, transparent 50%)
          `,
                }}
                aria-hidden
            />

            <Container size="xl" className="relative py-16 md:py-24 lg:py-32">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left: Copy */}
                    <FadeUp>
                        <div className="max-w-xl">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                                </span>
                                Premium Branding · Nairobi
                            </div>

                            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.02] tracking-[-0.03em] text-foreground">
                                Own Your Brand.
                                <br />
                                <span className="mt-2 block">
                                    <HeroRotatingText />
                                </span>
                            </h1>

                            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                                From logo design to vehicle branding, we craft bold identities that make Kenyan businesses unforgettable. Quality craftsmanship, fast turnaround, zero compromise.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center gap-3">
                                <Button size="lg" asChild>
                                    <a href="#brandflow">
                                        Start BrandFlow
                                        <ArrowRight className="h-4 w-4" />
                                    </a>
                                </Button>
                                <Button size="lg" variant="outline" asChild>
                                    <Link href="/shop">
                                        <ShoppingBag className="h-4 w-4" />
                                        Browse Shop
                                    </Link>
                                </Button>
                            </div>

                            {/* Trust indicators */}
                            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {[0, 1, 2].map((i) => (
                                            <div
                                                key={i}
                                                className="h-7 w-7 rounded-full border-2 border-background bg-gradient-to-br from-primary/40 to-accent/40"
                                            />
                                        ))}
                                    </div>
                                    <span>
                                        <strong className="text-foreground">500+</strong> happy clients
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="flex gap-0.5">
                                        {[0, 1, 2, 3, 4].map((i) => (
                                            <svg key={i} className="h-4 w-4 fill-accent text-accent" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span>
                                        <strong className="text-foreground">4.9/5</strong> rating
                                    </span>
                                </div>
                            </div>
                        </div>
                    </FadeUp>

                    {/* Right: Collage */}
                    <div className="hidden lg:block">
                        <HeroCollage images={collageImages} />
                    </div>
                </div>
            </Container>
        </section>
    );
}