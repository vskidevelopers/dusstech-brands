import { Separator } from '@/components/ui/separator';
import {
    DashboardHeader, StatCard, QuickActionCard, ActivityCard,
    RecentOrdersTable, RecentQuotesTable, DashboardGrid,
    stats, quickActions,
} from '@/features/dashboard';
import { BusinessProfileCard } from '@/features/dashboard/components/BusinessProfileCard';
import { getBusinessSettings } from '@/features/settings';

export default async function AdminDashboardPage() {
    const [settings] = await Promise.all([
        getBusinessSettings(),
    ]);

    const orders: never[] = [];
    const quotes: never[] = [];

    return (
        <div className="space-y-8">
            <DashboardHeader />
            <Separator />

            <section aria-labelledby="kpi-heading">
                <h2 id="kpi-heading" className="sr-only">Key Performance Indicators</h2>
                <DashboardGrid>
                    {stats.map((stat) => <StatCard key={stat.label} data={stat} />)}
                </DashboardGrid>
            </section>

            <section aria-labelledby="actions-heading">
                <div className="mb-4">
                    <h2 id="actions-heading" className="text-xl font-semibold tracking-tight">Quick Actions</h2>
                    <p className="text-sm text-muted-foreground">Jump straight into the tasks you do most.</p>
                </div>
                <DashboardGrid columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {quickActions.map((action) => <QuickActionCard key={action.title} data={action} />)}
                </DashboardGrid>
            </section>

            <section aria-labelledby="activity-heading">
                <h2 id="activity-heading" className="sr-only">Recent Activity</h2>
                <ActivityCard />
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
                <RecentOrdersTable orders={orders} />
                <RecentQuotesTable quotes={quotes} />
            </section>

            {settings && (
                <section aria-labelledby="business-heading">
                    <h2 id="business-heading" className="sr-only">Business Overview</h2>
                    <BusinessProfileCard settings={settings} />
                </section>
            )}
        </div>
    );
}