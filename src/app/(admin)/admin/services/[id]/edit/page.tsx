import { notFound } from 'next/navigation';
import { getServiceById } from '@/features/services/queries';
import { ServiceForm } from '@/features/services/components/ServiceForm';

interface EditServicePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: EditServicePageProps) {
    const { id } = await params;
    const service = await getServiceById(id);

    if (!service) {
        notFound();
    }

    return <ServiceForm mode="edit" initialData={service} />;
}