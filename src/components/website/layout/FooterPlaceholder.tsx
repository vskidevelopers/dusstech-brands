// src/components/website/layout/FooterPlaceholder.tsx
import Link from 'next/link';
import { Container } from '../ui/Container';
import { Divider } from '../ui/Divider';
import { Text } from '../ui/Text';

export function FooterPlaceholder() {
    return (
        <footer className="bg-canvas border-t border-border">
            <Container size="xl" className="py-12 md:py-16">
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <Link href="/" className="font-bold text-xl tracking-tight">
                            <span className="text-primary">Dusstech</span> Brands
                        </Link>
                        <Text variant="small" color="muted" className="mt-3 max-w-sm">
                            Premium branding, printing, and signage solutions for Kenyan businesses. Own Your Brand.
                        </Text>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Company</h4>
                        <nav className="flex flex-col gap-2">
                            {['Services', 'Products', 'Portfolio', 'About'].map((item) => (
                                <Link key={item} href={`/${item.toLowerCase()}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    {item}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Contact</h4>
                        <nav className="flex flex-col gap-2">
                            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Get a Quote
                            </Link>
                            <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Admin Portal
                            </Link>
                        </nav>
                    </div>
                </div>
                <Divider className="my-8" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <Text variant="small" color="muted">
                        © {new Date().getFullYear()} Dusstech Brands Limited. All rights reserved.
                    </Text>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">Privacy</Link>
                        <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">Terms</Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}