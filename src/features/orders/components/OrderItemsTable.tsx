/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Controller, useWatch, type Control, type UseFieldArrayReturn } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ServicePicker } from '@/components/shared/ServicePicker';
import { ProductPicker } from '@/components/shared/ProductPicker';
import { calculateLineTotal } from '@/lib/order-calculations';
import type { OrderFormData } from '../schema';

interface OrderItemsTableProps {
    fields: any[];
    control: Control<OrderFormData>;
    append: UseFieldArrayReturn<OrderFormData, 'items'>['append'];
    remove: UseFieldArrayReturn<OrderFormData, 'items'>['remove'];
    update: UseFieldArrayReturn<OrderFormData, 'items'>['update'];
}

export function OrderItemsTable({ fields, control, append, remove, update }: OrderItemsTableProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground px-2">
                <div className="col-span-5">Description</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="col-span-2 text-right">Discount</div>
                <div className="col-span-1"></div>
            </div>

            {fields.map((field, index) => (
                <LineItemRow
                    key={field.id}
                    index={index}
                    control={control}
                    update={update}
                    remove={remove}
                />
            ))}

            <Button
                type="button"
                variant="outline"
                className="w-full border-dashed"
                onClick={() => append({
                    item_type: 'custom',
                    description: '',
                    quantity: 1,
                    unit_price: 0,
                    discount: 0,
                    line_total: 0,
                    sort_order: fields.length,
                })}
            >
                <Plus className="mr-2 h-4 w-4" /> Add Line Item
            </Button>
        </div>
    );
}

function LineItemRow({
    index, control, update, remove,
}: {
    index: number;
    control: Control<OrderFormData>;
    update: UseFieldArrayReturn<OrderFormData, 'items'>['update'];
    remove: UseFieldArrayReturn<OrderFormData, 'items'>['remove'];
}) {
    const itemType = useWatch({ control, name: `items.${index}.item_type` });
    const quantity = useWatch({ control, name: `items.${index}.quantity` }) || 0;
    const unitPrice = useWatch({ control, name: `items.${index}.unit_price` }) || 0;
    const discount = useWatch({ control, name: `items.${index}.discount` }) || 0;

    const recalcLineTotal = () => {
        const lineTotal = calculateLineTotal(Number(quantity), Number(unitPrice), Number(discount));
        update(index, {
            ...control._formValues.items[index],
            line_total: lineTotal,
        } as any);
    };

    return (
        <div className="grid grid-cols-12 gap-2 items-start">
            <div className="col-span-5 space-y-2">
                <Controller
                    name={`items.${index}.item_type`}
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={(val: any) => {
                            field.onChange(val);
                            const current = control._formValues.items[index];
                            update(index, { ...current, item_type: val, reference_id: null });
                        }}>
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="service">Service</SelectItem>
                                <SelectItem value="product">Product</SelectItem>
                                <SelectItem value="custom">Custom Item</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />

                {itemType === 'service' && <ServicePicker index={index} update={update as any} />}
                {itemType === 'product' && <ProductPicker index={index} update={update as any} />}

                <Controller
                    name={`items.${index}.description`}
                    control={control}
                    render={({ field }) => (
                        <Input {...field} placeholder="Item description" className="h-9" />
                    )}
                />
            </div>

            <div className="col-span-2">
                <Controller
                    name={`items.${index}.quantity`}
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="number"
                            min="0.01"
                            step="0.01"
                            className="h-9 text-right"
                            onBlur={() => recalcLineTotal()}
                        />
                    )}
                />
            </div>

            <div className="col-span-2">
                <Controller
                    name={`items.${index}.unit_price`}
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="number"
                            min="0"
                            step="0.01"
                            className="h-9 text-right"
                            onBlur={() => recalcLineTotal()}
                        />
                    )}
                />
            </div>

            <div className="col-span-2">
                <Controller
                    name={`items.${index}.discount`}
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="number"
                            min="0"
                            step="0.01"
                            className="h-9 text-right"
                            onBlur={() => recalcLineTotal()}
                        />
                    )}
                />
            </div>

            <div className="col-span-1 flex items-center justify-end">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}