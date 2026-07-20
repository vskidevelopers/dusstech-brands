import {
  FileText,
  ShoppingCart,
  MessageSquare,
  Wrench,
  Package,
  Image,
  Plus,
  Upload,
  Settings,
} from "lucide-react";
import type { StatCardData, QuickActionData, BusinessInfo } from "./types";

export const stats: StatCardData[] = [
  {
    label: "Pending Quotations",
    value: 0,
    helper: "Awaiting your review",
    icon: <FileText className="h-5 w-5" />,
    accent: "bg-amber-500/10",
    accentText: "text-amber-500",
  },
  {
    label: "Active Orders",
    value: 0,
    helper: "Currently in production",
    icon: <ShoppingCart className="h-5 w-5" />,
    accent: "bg-blue-500/10",
    accentText: "text-blue-500",
  },
  {
    label: "New Inquiries",
    value: 0,
    helper: "Needs response",
    icon: <MessageSquare className="h-5 w-5" />,
    accent: "bg-purple-500/10",
    accentText: "text-purple-500",
  },
  {
    label: "Services Offered",
    value: 0,
    helper: "Across all categories",
    icon: <Wrench className="h-5 w-5" />,
    accent: "bg-emerald-500/10",
    accentText: "text-emerald-500",
  },
  {
    label: "Products Listed",
    value: 0,
    helper: "Ready to sell",
    icon: <Package className="h-5 w-5" />,
    accent: "bg-pink-500/10",
    accentText: "text-pink-500",
  },
  {
    label: "Portfolio Projects",
    value: 0,
    helper: "Showcasing your work",
    icon: <Image className="h-5 w-5" />,
    accent: "bg-cyan-500/10",
    accentText: "text-cyan-500",
  },
];

export const quickActions: QuickActionData[] = [
  {
    title: "New Service",
    description: "Add a branding or printing service",
    icon: <Plus className="h-5 w-5" />,
    href: "/admin/services",
    accent: "bg-emerald-500/10",
    accentText: "text-emerald-500",
  },
  {
    title: "New Product",
    description: "List a product for sale",
    icon: <Package className="h-5 w-5" />,
    href: "/admin/products",
    accent: "bg-pink-500/10",
    accentText: "text-pink-500",
  },
  {
    title: "Create Quote",
    description: "Send a quotation to a customer",
    icon: <FileText className="h-5 w-5" />,
    href: "/admin/quotes",
    accent: "bg-amber-500/10",
    accentText: "text-amber-500",
  },
  {
    title: "Upload Media",
    description: "Add images to your media library",
    icon: <Upload className="h-5 w-5" />,
    href: "/admin/media",
    accent: "bg-blue-500/10",
    accentText: "text-blue-500",
  },
  {
    title: "Add Portfolio Project",
    description: "Showcase a completed project",
    icon: <Image className="h-5 w-5" />,
    href: "/admin/portfolio",
    accent: "bg-cyan-500/10",
    accentText: "text-cyan-500",
  },
  {
    title: "Website Settings",
    description: "Update your public website content",
    icon: <Settings className="h-5 w-5" />,
    href: "/admin/settings",
    accent: "bg-purple-500/10",
    accentText: "text-purple-500",
  },
];

export const businessInfo: BusinessInfo = {
  name: "Dusstech Brands Limited",
  location: {
    building: "Munyu Business Plaza",
    road: "Munyu Road",
    city: "Nairobi",
  },
  motto: "Own Your Brand",
};
