// import Image from 'next/image';
// import Link from 'next/link';
// import { ArrowRight } from 'lucide-react';
// import { Button } from '@/components/website/ui/Button';
// import { Container } from '@/components/website/ui/Container';
// import { SectionHeader } from '@/components/website/layout/SectionHeader';
// import { StaggerContainer, StaggerItem } from '@/components/website/motion';
// // import type { PortfolioItem } from '@/features/portfolio/queries';

// interface PortfolioPreviewProps {
//   items: PortfolioItem[];
// }

// export function PortfolioPreview({ items }: PortfolioPreviewProps) {
//   if (items.length === 0) return null;

//   return (
//     <section className="border-b border-border py-16 md:py-24">
//       <Container size="xl">
//         <SectionHeader
//           eyebrow="Our Work"
//           title="Recent Projects"
//           description="A glimpse of the brands we have helped bring to life."
//         />

//         <StaggerContainer staggerDelay={0.08} className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
//           {items.map((item, i) => (
//             <StaggerItem key={item.id}>
//               <Link
//                 href={`/portfolio/${item.slug}`}
//                 className="group relative block break-inside-avoid overflow-hidden rounded-2xl border border-border bg-muted"
//               >
//                 {/* Variable heights for masonry effect */}
//                 <div
//                   className="relative w-full overflow-hidden bg-muted"
//                   style={{
//                     aspectRatio: i % 3 === 0 ? '4/5' : i % 3 === 1 ? '1/1' : '3/4',
//                   }}
//                 >
//                   {item.cover_image ? (
//                     <Image
//                       src={item.cover_image}
//                       alt={item.title}
//                       fill
//                       className="object-cover transition-transform duration-500 group-hover:scale-105"
//                       sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                     />
//                   ) : (
//                     <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
//                       <span className="text-5xl font-bold text-primary/20">
//                         {item.title.charAt(0)}
//                       </span>
//                     </div>
//                   )}
//                 </div>

//                 {/* Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

//                 <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
//                   {item.category && (
//                     <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
//                       {item.category}
//                     </span>
//                   )}
//                   <h3 className="mt-1 text-lg font-semibold text-white">
//                     {item.title}
//                   </h3>
//                 </div>
//               </Link>
//             </StaggerItem>
//           ))}
//         </StaggerContainer>

//         <div className="mt-10 text-center">
//           <Button variant="outline" size="lg" asChild>
//             <Link href="/portfolio">
//               View Full Portfolio <ArrowRight className="ml-2 h-4 w-4" />
//             </Link>
//           </Button>
//         </div>
//       </Container>
//     </section>
//   );
// }