import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/website/ui/Container';
import { SectionHeader } from '@/components/website/layout/SectionHeader';
import { StaggerContainer, StaggerItem } from '@/components/website/motion';
import type { Category } from '@/features/categories/types';

interface PopularCategoriesProps {
    categories: Category[];
}

export function PopularCategories({ categories }: PopularCategoriesProps) {
    if (categories.length === 0) return null;

    return (
        <section className="border-b border-border py-16 md:py-24">
            <Container size="xl">
                <SectionHeader
                    eyebrow="Explore"
                    title="Popular Categories"
                    description="Browse our most-loved categories and find exactly what your brand needs."
                />

                <StaggerContainer staggerDelay={0.08} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => (
                        <StaggerItem key={category.id}>
                            <Link
                                href={`/shop?category=${category.slug}`}
                                className="group relative block aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted"
                            >
                                {category.icon ? (
                                    <Image
                                        src={category.icon}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                                        <span className="text-4xl font-bold text-primary/30">
                                            {category.name.charAt(0)}
                                        </span>
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-x-0 bottom-0 p-6">
                                    <h3 className="text-xl font-semibold tracking-tight text-white">
                                        {category.name}
                                    </h3>
                                    {category.description && (
                                        <p className="mt-1 line-clamp-2 text-sm text-white/80">
                                            {category.description}
                                        </p>
                                    )}
                                    <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                                        Explore <ArrowRight className="h-3.5 w-3.5" />
                                    </div>
                                </div>
                            </Link>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </Container>
        </section>
    );
}