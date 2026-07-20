// import { createClient } from '@/lib/supabase/server';

// export interface PortfolioItem {
//   id: string;
//   title: string;
//   slug: string;
//   description: string | null;
//   cover_image: string | null;
//   category: string | null;
//   created_at: string;
// }

// export async function getLatestPortfolio(limit: number = 6): Promise<PortfolioItem[]> {
//   const supabase = await createClient();
// //
//   // Check if table exists; if not, return empty array gracefully
//   try {
//     // const { data, error } = await supabase
//     //   .from('portfolio')
//     //   .select('id, title, slug, description, cover_image, category, created_at')
//     //   .is('deleted_at', null)
//     //   .order('created_at', { ascending: false })
//     //   .limit(limit);

//     // if (error) return [];
//     // return (data as PortfolioItem[]) ?? [];
//   } catch {
//     return [];
//   }
// }
