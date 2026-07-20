import { notFound } from 'next/navigation';
import { getCategoryById } from '@/features/categories';
import { CategoryForm } from '@/features/categories/components/CategoryForm';

interface EditCategoryPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
    const { id } = await params;
    const category = await getCategoryById(id);

    if (!category) notFound();

    return <CategoryForm mode="edit" initialData={category} />;
}