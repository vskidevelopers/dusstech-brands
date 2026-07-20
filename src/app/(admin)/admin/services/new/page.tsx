import { ServiceForm } from '@/features/services/components/ServiceForm';
import { getAllCollectionsForSelect } from '@/features/collections';

export default async function NewServicePage() {
    const collections = await getAllCollectionsForSelect();

    return (
        <ServiceForm
            mode="create"
            initialCollectionIds={[]}
            availableCollections={collections}
        />
    );
}