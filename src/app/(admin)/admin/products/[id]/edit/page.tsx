import { notFound } from 'next/navigation';
import { getProductById } from '@/features/products';
import { getAllCollectionsForSelect } from '@/features/collections';
import { ProductForm } from '@/features/products/components/ProductForm';
import { getProductCollectionIds } from '@/features/products/queries';

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params;
    const [product, collectionIds, collections] = await Promise.all([
        getProductById(id),
        getProductCollectionIds(id),
        getAllCollectionsForSelect(),
    ]);

    if (!product) notFound();

    return (
        <ProductForm
            mode="edit"
            initialData={product}
            initialCollectionIds={collectionIds}
            availableCollections={collections}
        />
    );
}