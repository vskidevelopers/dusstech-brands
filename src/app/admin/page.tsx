import { Separator } from '@/components/ui/separator';
import {
    DashboardHeader, StatCard, QuickActionCard, ActivityCard,
    RecentOrdersTable, RecentQuotesTable, DashboardGrid,
    quickActions,
} from '@/features/dashboard';
import { BusinessProfileCard } from '@/features/dashboard/components/BusinessProfileCard';
import { getBusinessSettings } from '@/features/settings';
import {
    getDashboardStatsAction,
    getRecentOrdersAction,
    getRecentQuotesAction
} from '@/features/dashboard/actions';

export default async function AdminDashboardPage() {
    const [settings, stats, orders, quotes] = await Promise.all([
        getBusinessSettings(),
        getDashboardStatsAction(),
        getRecentOrdersAction(5),
        getRecentQuotesAction(5),
    ]);

    // ✅ Updated to include helper, accent, and accentText
    const statsData = [
        {
            label: 'Total Services',
            value: stats.totalServices,
            description: `${stats.activeServices} active`,
            icon: 'service',
            trend: null,
            helper: `${stats.activeServices} active`,
            accent: 'text-blue-600',
            accentText: 'Active',
        },
        {
            label: 'Total Products',
            value: stats.totalProducts,
            description: 'In catalog',
            icon: 'product',
            trend: null,
            helper: 'In catalog',
            accent: 'text-purple-600',
            accentText: 'Products',
        },
        {
            label: 'Total Orders',
            value: stats.totalOrders,
            description: 'All time',
            icon: 'order',
            trend: null,
            helper: 'All time',
            accent: 'text-green-600',
            accentText: 'Orders',
        },
        {
            label: 'Total Quotes',
            value: stats.totalQuotes,
            description: 'Awaiting response',
            icon: 'quote',
            trend: null,
            helper: 'Awaiting response',
            accent: 'text-amber-600',
            accentText: 'Quotes',
        },
    ];

    return (
        <div className="space-y-8">
            <DashboardHeader />
            <Separator />

            <section aria-labelledby="kpi-heading">
                <h2 id="kpi-heading" className="sr-only">Key Performance Indicators</h2>
                <DashboardGrid>
                    {statsData.map((stat, index) => <StatCard key={index} data={stat} />)}
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