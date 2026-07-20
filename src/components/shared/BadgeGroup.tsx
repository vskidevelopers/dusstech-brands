import { Badge } from "@/components/ui/badge";
import { Star, Sparkles, TrendingUp, Percent } from "lucide-react";

export interface BadgeConfig {
    featured?: boolean;
    isNew?: boolean;
    isPopular?: boolean;
    discountPercent?: number;
}

interface BadgeGroupProps {
    badges: BadgeConfig;
    className?: string;
}

export function BadgeGroup({ badges, className }: BadgeGroupProps) {
    const activeBadges = [];

    if (badges.discountPercent && badges.discountPercent > 0) {
        activeBadges.push({
            key: "discount",
            label: `-${badges.discountPercent}%`,
            icon: Percent,
            className: "bg-red-500 text-white",
        });
    }

    if (badges.isNew) {
        activeBadges.push({
            key: "new",
            label: "New",
            icon: Sparkles,
            className: "bg-blue-500 text-white",
        });
    }

    if (badges.isPopular) {
        activeBadges.push({
            key: "popular",
            label: "Popular",
            icon: TrendingUp,
            className: "bg-orange-500 text-white",
        });
    }

    if (badges.featured) {
        activeBadges.push({
            key: "featured",
            label: "Featured",
            icon: Star,
            className: "bg-primary text-primary-foreground",
        });
    }

    if (activeBadges.length === 0) return null;

    return (
        <div className={`absolute top-3 left-3 flex flex-col gap-1 ${className || ""}`}>
            {activeBadges.map((badge) => (
                <Badge key={badge.key} className={badge.className}>
                    <badge.icon className="h-3 w-3 mr-1" />
                    {badge.label}
                </Badge>
            ))}
        </div>
    );
}