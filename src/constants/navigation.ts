import {
  LayoutDashboard,
  Wrench,
  Package,
  Tags,
  FolderHeart,
  FileText,
  ShoppingCart,
  MessageSquare,
  Image,
  Library,
  Star,
  Globe,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    title: "MAIN",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "CATALOG",
    items: [
      { label: "Services", href: "/admin/services", icon: Wrench },
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: Tags },
      { label: "Collections", href: "/admin/collections", icon: FolderHeart },
    ],
  },
  {
    title: "BUSINESS",
    items: [
      { label: "Quotations", href: "/admin/quotations", icon: FileText },
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
    ],
  },
  {
    title: "CONTENT",
    items: [
      { label: "Portfolio", href: "/admin/portfolio", icon: Image },
      { label: "Media", href: "/admin/media", icon: Library },
      { label: "Testimonials", href: "/admin/testimonials", icon: Star },
      { label: "Website", href: "/admin/content", icon: Globe },
    ],
  },
  {
    title: "SYSTEM",
    items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];

export const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/services": "Services",
  "/admin/products": "Products",
  "/admin/categories": "Categories",
  "/admin/collections": "Collections",
  "/admin/quotations": "Quotations",
  "/admin/orders": "Orders",
  "/admin/inquiries": "Inquiries",
  "/admin/portfolio": "Portfolio",
  "/admin/media": "Media Library",
  "/admin/testimonials": "Testimonials",
  "/admin/content": "Website Content",
  "/admin/settings": "Settings",
};
