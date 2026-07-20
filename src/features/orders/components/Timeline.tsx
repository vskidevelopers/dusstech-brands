import { format } from 'date-fns';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { OrderTimelineEvent } from '../types';

interface TimelineProps {
  events: OrderTimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">
            No timeline events yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative border-l border-border ml-3 space-y-6">
          {events.map((event, index) => {
            const metadata = event.metadata as Record<string, unknown> | undefined;
            const createdAt = new Date(event.created_at as string | number | Date);

            return (
              <li key={String(event.id)} className="ml-6">
                <span className="absolute flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full -left-3.5 ring-4 ring-background">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </span>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">{String(event.event)}</p>
                    {metadata && Object.keys(metadata).length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                        {JSON.stringify(metadata)}
                      </p>
                    )}
                  </div>
                  <time className="text-xs text-muted-foreground whitespace-nowrap tabular-nums">
                    {format(createdAt, 'MMM d, yyyy · HH:mm')}
                  </time>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}