/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { DAYS_OF_WEEK, DAY_LABELS, type DayOfWeek, type BusinessHours } from '../types';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';

interface BusinessHoursEditorProps {
    value: BusinessHours;
    onChange: (value: BusinessHours) => void;
}

export function BusinessHoursEditor({ value, onChange }: BusinessHoursEditorProps) {
    const updateDay = (day: DayOfWeek, field: keyof BusinessHours[DayOfWeek], val: any) => {
        onChange({
            ...value,
            [day]: { ...value[day], [field]: val },
        });
    };

    return (
        <div className="space-y-3">
            {DAYS_OF_WEEK.map((day) => {
                const schedule = value[day];
                return (
                    <div
                        key={day}
                        className="grid grid-cols-[100px_40px_1fr_1fr] items-center gap-3 rounded-md border p-3"
                    >
                        <Label className="font-medium">{DAY_LABELS[day]}</Label>
                        <Switch
                            checked={schedule.isOpen}
                            onCheckedChange={(checked) => updateDay(day, 'isOpen', checked)}
                            aria-label={`${DAY_LABELS[day]} open`}
                        />
                        {schedule.isOpen ? (
                            <>
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground">Open</span>
                                    <Input
                                        type="time"
                                        value={schedule.open}
                                        onChange={(e) => updateDay(day, 'open', e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground">Close</span>
                                    <Input
                                        type="time"
                                        value={schedule.close}
                                        onChange={(e) => updateDay(day, 'close', e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="col-span-2 flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                Closed
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}