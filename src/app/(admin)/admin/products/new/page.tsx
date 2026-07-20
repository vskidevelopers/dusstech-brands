import { ProductForm } from '@/features/products/components/ProductForm';
import { getAllCollectionsForSelect } from '@/features/collections';

export default async function NewProductPage() {
    const collections = await getAllCollectionsForSelect();

    return (
        <ProductForm
            mode="create"
            initialCollectionIds={[]}
            availableCollections={collections}
        />
    );
}