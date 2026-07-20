// import { Container } from '@/components/website/layout/Container';
// import { SectionHeader } from '@/components/website/layout/SectionHeader';
// import { ReviewCard } from '@/components/website/ui/ReviewCard';
// import { StaggerContainer, StaggerItem } from '@/components/website/motion';
// import type { Testimonial } from '@/features/testimonials/queries';

// interface TestimonialsProps {
//   testimonials: Testimonial[];
// }

// export function Testimonials({ testimonials }: TestimonialsProps) {
//   if (testimonials.length === 0) return null;

//   return (
//     <section className="border-b border-border bg-gradient-to-b from-background to-canvas py-16 md:py-24">
//       <Container size="xl">
//         <SectionHeader
//           eyebrow="Testimonials"
//           title="What Our Clients Say"
//           description="Real stories from real brands we have helped grow."
//         />

//         <StaggerContainer staggerDelay={0.1} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {testimonials.map((t) => (
//             <StaggerItem key={t.id}>
//               <ReviewCard
//                 quote={t.quote}
//                 author={t.name}
//                 role={[t.role, t.company].filter(Boolean).join(' · ') || undefined}
//                 avatar={t.avatar || undefined}
//                 rating={t.rating ?? undefined}
//               />
//             </StaggerItem>
//           ))}
//         </StaggerContainer>
//       </Container>
//     </section>
//   );
// }