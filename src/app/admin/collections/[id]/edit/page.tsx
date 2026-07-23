import { notFound } from 'next/navigation';
import { getCollectionById } from '@/features/collections';
import { CollectionForm } from '@/features/collections/components/CollectionForm';

interface EditCollectionPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditCollectionPage({ params }: EditCollectionPageProps) {
    const { id } = await params;
    const collection = await getCollectionById(id);

    if (!collection) notFound();

    return <CollectionForm mode="edit" initialData={collection} />;
}