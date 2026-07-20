/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import { Controller, useWatch } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { ServicePicker } from '../../../components/shared/ServicePicker';
import { ProductPicker } from '../../../components/shared/ProductPicker';
import type { UseFieldArrayReturn, Control } from 'react-hook-form';
import type { QuotationFormData } from '../schema';

interface LineItemsTableProps {
    fields: any[];
    control: Control<QuotationFormData>;
    append: UseFieldArrayReturn<QuotationFormData, 'items'>['append'];
    remove: UseFieldArrayReturn<QuotationFormData, 'items'>['remove'];
    update: UseFieldArrayReturn<QuotationFormData, 'items'>['update'];
}

export function LineItemsTable({ fields, control, append, remove, update }: LineItemsTableProps) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground px-2">
                <div className="col-span-5">Description</div>
                <div className="col-span-2 text-right">Qty</div>
                <div className="col-span-2 text-right">Unit Price</div>
                <div className="2 col-span-2 text-right">Discount</div>
                <div className="col-span-1"></div>
            </div>

            {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                    {/* Type Picker */}
                    <div className="col-span-5 space-y-2">
                        <Controller
                            name={`items.${index}.item_type`}
                            control={control}
                            render={({ field: typeField }) => (
                                <Select value={typeField.value} onValueChange={(val: any) => {
                                    typeField.onChange(val);
                                    // Reset reference when type changes
                                    update(index, { ...useWatch({ control, name: `items.${index}` }), reference_id: undefined });
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

                        {/* Conditional Pickers */}
                        <Controller
                            name={`items.${index}.item_type`}
                            control={control}
                            render={({ field: typeField }) => (
                                <>
                                    {typeField.value === 'service' && (
                                        <ServicePicker
                                            index={index}
                                            update={update}
                                        />
                                    )}
                                    {typeField.value === 'product' && (
                                        <ProductPicker
                                            index={index}
                                            update={update}
                                        />
                                    )}
                                </>
                            )}
                        />

                        <Controller
                            name={`items.${index}.description`}
                            control={control}
                            render={({ field }) => (
                                <Input {...field} placeholder="Item description" className="h-9" />
                            )}
                        />
                    </div>

                    {/* Qty */}
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
                                    onChange={(e) => {
                                        field.onChange(e.target.value);
                                        // Trigger line total recalculation (handled by RHF or manual)
                                    }}
                                />
                            )}
                        />
                    </div>

                    {/* Unit Price */}
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
                                />
                            )}
                        />
                    </div>

                    {/* Discount */}
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
                                />
                            )}
                        />
                    </div>

                    {/* Remove */}
                    <div className="col-span-1 flex items-center justify-end">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-muted-foreground hover:text-destructive"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
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