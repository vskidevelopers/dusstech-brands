import { notFound } from 'next/navigation';
import { getOrderById, getCustomerOrderHistory } from '@/features/orders/queries';
import { OrderBuilder } from '@/features/orders/components/OrderBuilder';

interface EditOrderPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditOrderPage({ params }: EditOrderPageProps) {
    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) notFound();

    // Fetch customer history based on the order's phone number
    const customerHistory = order.phone
        ? await getCustomerOrderHistory(order.phone, order.id)
        : undefined;

    return (
        <OrderBuilder
            mode="edit"
            initialData={order}
            customerHistory={customerHistory}
        />
    );
}