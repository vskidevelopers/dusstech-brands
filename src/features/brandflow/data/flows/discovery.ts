import {
  Shirt,
  Coffee,
  Briefcase,
  Megaphone,
  Printer,
  Gift,
  Car,
  PartyPopper,
  Palette,
Scissors ,
  Layers,
  Stamp,
  Droplet,
  Square,
} from "lucide-react";
import type { FlowDefinition } from "../../types";

/**
 * The main discovery flow.
 * This is the ONLY place where flow logic is defined.
 * Future: this can be loaded from the database / CMS.
 */
export const discoveryFlow: FlowDefinition = {
  id: "discovery",
  name: "Brand Discovery",
  description: "Find the perfect branding solution for your needs.",
  entryStepId: "category",
  steps: {
    // ─── STEP 1: Category ────────────────────────────────────
    category: {
      id: "category",
      type: "question",
      title: "Let's find your perfect match",
      description:
        "Tell us what you'd like to brand, and we'll guide you to the right solution.",
      question: "What would you like to brand today?",
      icon: Palette,
      layout: "grid",
      options: [
        {
          id: "clothing",
          label: "Clothing",
          description: "T-shirts, hoodies, jerseys, uniforms",
          icon: Shirt,
          next: "clothing-have-items",
          tags: ["clothing", "apparel"],
        },
        {
          id: "drinkware",
          label: "Drinkware",
          description: "Mugs, bottles, tumblers",
          icon: Coffee,
          next: "drinkware-method",
          tags: ["drinkware", "corporate-gifts"],
        },
        {
          id: "business",
          label: "Business Identity",
          description: "Logo, cards, letterheads",
          icon: Briefcase,
          next: "business-scope",
          tags: ["business", "branding", "identity"],
        },
        {
          id: "signage",
          label: "Signage",
          description: "3D signs, lightboxes, banners",
          icon: Megaphone,
          next: "signage-type",
          tags: ["signage", "branding"],
        },
        {
          id: "printing",
          label: "Printing",
          description: "Flyers, brochures, posters",
          icon: Printer,
          next: "printing-type",
          tags: ["printing", "marketing"],
        },
        {
          id: "corporate",
          label: "Corporate Gifts",
          description: "Pens, notebooks, tech accessories",
          icon: Gift,
          next: "corporate-quantity",
          tags: ["corporate-gifts", "promotional"],
        },
        {
          id: "vehicle",
          label: "Vehicle Branding",
          description: "Car wraps, truck branding",
          icon: Car,
          next: "vehicle-type",
          tags: ["vehicle", "branding"],
        },
        {
          id: "events",
          label: "Events",
          description: "Activations, expos, launches",
          icon: PartyPopper,
          next: "events-scope",
          tags: ["events", "promotional"],
        },
      ],
    },

    // ─── CLOTHING BRANCH ────────────────────────────────────
    "clothing-have-items": {
      id: "clothing-have-items",
      type: "question",
      title: "Clothing branding",
      question: "Do you already have the clothing items?",
      icon: Shirt,
      layout: "list",
      options: [
        {
          id: "yes",
          label: "Yes, I have items",
          description: "I'll bring my own clothing for branding",
          next: "clothing-method",
          tags: ["bring-own"],
        },
        {
          id: "no",
          label: "No, I need clothing too",
          description: "I need both garments and branding",
          next: "clothing-product",
          tags: ["need-product"],
        },
      ],
    },

    "clothing-method": {
      id: "clothing-method",
      type: "question",
      title: "Choose your branding method",
      description:
        "Each method has unique qualities. Pick what fits your vision.",
      question: "Which branding method interests you?",
      icon: Layers,
      layout: "grid",
      options: [
        {
          id: "embroidery",
          label: "Embroidery",
          description: "Premium, durable, professional finish",
          icon: Scissors,
          next: "result",
          tags: ["embroidery", "premium", "service"],
        },
        {
          id: "dtf",
          label: "DTF Printing",
          description: "Vibrant colors, any fabric, full-color designs",
          icon: Printer,
          next: "result",
          tags: ["dtf", "full-color", "service"],
        },
        {
          id: "screen-print",
          label: "Screen Printing",
          description: "Best for bulk orders, cost-effective",
          icon: Layers,
          next: "result",
          tags: ["screen-print", "bulk", "service"],
        },
        {
          id: "heat-transfer",
          label: "Heat Transfer",
          description: "Great for small batches, quick turnaround",
          icon: Square,
          next: "result",
          tags: ["heat-transfer", "small-batch", "service"],
        },
        {
          id: "sublimation",
          label: "Sublimation",
          description: "All-over prints, polyester fabrics",
          icon: Droplet,
          next: "result",
          tags: ["sublimation", "all-over", "service"],
        },
        {
          id: "vinyl",
          label: "Vinyl Cutting",
          description: "Names, numbers, simple logos",
          icon: Stamp,
          next: "result",
          tags: ["vinyl", "simple", "service"],
        },
      ],
    },

    "clothing-product": {
      id: "clothing-product",
      type: "question",
      title: "What clothing do you need?",
      description: "We supply quality garments and brand them for you.",
      question: "Which type of clothing?",
      icon: Shirt,
      layout: "grid",
      options: [
        {
          id: "tshirt",
          label: "T-Shirts",
          description: "Classic tees in all colors",
          icon: Shirt,
          next: "result",
          tags: ["tshirt", "product", "casual"],
        },
        {
          id: "polo",
          label: "Polo Shirts",
          description: "Smart corporate look",
          icon: Shirt,
          next: "result",
          tags: ["polo", "product", "corporate"],
        },
        {
          id: "jersey",
          label: "Jerseys",
          description: "Sports and team jerseys",
          icon: Shirt,
          next: "result",
          tags: ["jersey", "product", "sports"],
        },
        {
          id: "hoodie",
          label: "Hoodies",
          description: "Cozy branded hoodies",
          icon: Shirt,
          next: "result",
          tags: ["hoodie", "product", "casual"],
        },
        {
          id: "cap",
          label: "Caps & Hats",
          description: "Branded headwear",
          icon: Shirt,
          next: "result",
          tags: ["cap", "product", "accessory"],
        },
        {
          id: "reflector",
          label: "Reflectors & Vests",
          description: "Safety and visibility wear",
          icon: Shirt,
          next: "result",
          tags: ["reflector", "product", "safety"],
        },
      ],
    },

    // ─── DRINKWARE BRANCH ────────────────────────────────────
    "drinkware-method": {
      id: "drinkware-method",
      type: "question",
      title: "Choose your branding method",
      question: "How would you like your drinkware branded?",
      icon: Coffee,
      layout: "grid",
      options: [
        {
          id: "sublimation",
          label: "Sublimation",
          description: "Full-color, wrap-around prints",
          icon: Droplet,
          next: "result",
          tags: ["sublimation", "drinkware", "service"],
        },
        {
          id: "engraving",
          label: "Laser Engraving",
          description: "Premium metal finish",
          icon: Stamp,
          next: "result",
          tags: ["engraving", "premium", "service"],
        },
        {
          id: "vinyl",
          label: "Vinyl Stickers",
          description: "Cost-effective, quick turnaround",
          icon: Square,
          next: "result",
          tags: ["vinyl", "drinkware", "service"],
        },
      ],
    },

    // ─── BUSINESS BRANCH ────────────────────────────────────
    "business-scope": {
      id: "business-scope",
      type: "question",
      title: "Business identity scope",
      question: "What's your starting point?",
      icon: Briefcase,
      layout: "list",
      options: [
        {
          id: "logo-only",
          label: "Just a logo",
          description: "I need a fresh logo design",
          next: "result",
          tags: ["logo", "design", "service"],
        },
        {
          id: "full-identity",
          label: "Full brand identity",
          description: "Logo, colors, typography, guidelines",
          next: "result",
          tags: ["identity", "branding", "premium", "service"],
        },
        {
          id: "stationery",
          label: "Stationery suite",
          description: "Cards, letterheads, envelopes",
          next: "result",
          tags: ["stationery", "printing", "service"],
        },
      ],
    },

    // ─── SIGNAGE BRANCH ────────────────────────────────────
    "signage-type": {
      id: "signage-type",
      type: "question",
      title: "Signage type",
      question: "What kind of signage do you need?",
      icon: Megaphone,
      layout: "grid",
      options: [
        {
          id: "3d",
          label: "3D Signage",
          description: "Dimensional letters and logos",
          next: "result",
          tags: ["3d-signage", "premium", "service"],
        },
        {
          id: "lightbox",
          label: "Lightbox Signs",
          description: "Illuminated signage",
          next: "result",
          tags: ["lightbox", "service"],
        },
        {
          id: "banner",
          label: "Banners & Flags",
          description: "Portable signage for events",
          next: "result",
          tags: ["banner", "events", "service"],
        },
        {
          id: "window",
          label: "Window Graphics",
          description: "Frosted, perforated, vinyl",
          next: "result",
          tags: ["window", "branding", "service"],
        },
      ],
    },

    // ─── PRINTING BRANCH ────────────────────────────────────
    "printing-type": {
      id: "printing-type",
      type: "question",
      title: "Print material",
      question: "What would you like to print?",
      icon: Printer,
      layout: "grid",
      options: [
        {
          id: "business-cards",
          label: "Business Cards",
          next: "result",
          tags: ["business-cards", "printing", "service"],
        },
        {
          id: "flyers",
          label: "Flyers & Brochures",
          next: "result",
          tags: ["flyers", "brochures", "printing", "service"],
        },
        {
          id: "posters",
          label: "Posters",
          next: "result",
          tags: ["posters", "printing", "service"],
        },
        {
          id: "calendars",
          label: "Calendars & Diaries",
          next: "result",
          tags: ["calendars", "corporate-gifts", "service"],
        },
      ],
    },

    // ─── CORPORATE GIFTS BRANCH ─────────────────────────────
    "corporate-quantity": {
      id: "corporate-quantity",
      type: "question",
      title: "Order size",
      question: "Roughly how many items do you need?",
      icon: Gift,
      layout: "list",
      options: [
        {
          id: "small",
          label: "Under 50",
          next: "result",
          tags: ["small-batch", "corporate-gifts"],
        },
        {
          id: "medium",
          label: "50 - 500",
          next: "result",
          tags: ["medium-batch", "corporate-gifts"],
        },
        {
          id: "large",
          label: "500+",
          next: "result",
          tags: ["bulk", "corporate-gifts"],
        },
      ],
    },

    // ─── VEHICLE BRANCH ─────────────────────────────────────
    "vehicle-type": {
      id: "vehicle-type",
      type: "question",
      title: "Vehicle branding",
      question: "What type of vehicle?",
      icon: Car,
      layout: "grid",
      options: [
        {
          id: "car",
          label: "Car",
          next: "result",
          tags: ["car", "vehicle", "service"],
        },
        {
          id: "van",
          label: "Van / Pickup",
          next: "result",
          tags: ["van", "vehicle", "service"],
        },
        {
          id: "truck",
          label: "Truck / Lorry",
          next: "result",
          tags: ["truck", "vehicle", "service"],
        },
        {
          id: "matatu",
          label: "Matatu",
          next: "result",
          tags: ["matatu", "vehicle", "service"],
        },
      ],
    },

    // ─── EVENTS BRANCH ──────────────────────────────────────
    "events-scope": {
      id: "events-scope",
      type: "question",
      title: "Event scope",
      question: "What kind of event?",
      icon: PartyPopper,
      layout: "list",
      options: [
        {
          id: "expo",
          label: "Expo / Trade Show",
          next: "result",
          tags: ["expo", "events", "service"],
        },
        {
          id: "launch",
          label: "Product Launch",
          next: "result",
          tags: ["launch", "events", "service"],
        },
        {
          id: "activation",
          label: "Brand Activation",
          next: "result",
          tags: ["activation", "events", "service"],
        },
        {
          id: "wedding",
          label: "Wedding / Private",
          next: "result",
          tags: ["wedding", "events", "service"],
        },
      ],
    },

    // ─── RESULT ─────────────────────────────────────────────
    result: {
      id: "result",
      type: "result",
      title: "Your personalized recommendations",
      description: "Based on your choices, here's what we recommend.",
      recommendationTypes: ["service", "product", "collection", "portfolio"],
    },
  },

  // ─── RECOMMENDATIONS POOL ─────────────────────────────────
  // Each recommendation has tags; engine matches them to user's accumulated tags.
  recommendations: [
    // Services
    {
      id: "svc-embroidery",
      type: "service",
      title: "Premium Embroidery",
      description:
        "Professional embroidery for a polished, long-lasting finish.",
      href: "/services/embroidery",
      matchTags: ["embroidery", "premium", "clothing"],
      priority: 10,
    },
    {
      id: "svc-dtf",
      type: "service",
      title: "DTF Printing",
      description: "Full-color prints on any fabric with vibrant detail.",
      href: "/services/dtf-printing",
      matchTags: ["dtf", "full-color", "clothing"],
      priority: 9,
    },
    {
      id: "svc-screen",
      type: "service",
      title: "Screen Printing",
      description: "Cost-effective bulk branding with bold, durable results.",
      href: "/services/screen-printing",
      matchTags: ["screen-print", "bulk", "clothing"],
      priority: 8,
    },
    {
      id: "svc-logo",
      type: "service",
      title: "Logo Design",
      description: "Custom logo design that captures your brand essence.",
      href: "/services/logo-design",
      matchTags: ["logo", "design", "branding", "identity"],
      priority: 10,
    },
    {
      id: "svc-identity",
      type: "service",
      title: "Full Brand Identity",
      description:
        "Complete brand system: logo, colors, typography, guidelines.",
      href: "/services/brand-identity",
      matchTags: ["identity", "branding", "premium"],
      priority: 9,
    },
    {
      id: "svc-3d",
      type: "service",
      title: "3D Signage",
      description: "Dimensional signage that commands attention.",
      href: "/services/3d-signage",
      matchTags: ["3d-signage", "signage", "premium"],
      priority: 9,
    },
    {
      id: "svc-vehicle",
      type: "service",
      title: "Vehicle Branding",
      description: "Turn your vehicle into a moving billboard.",
      href: "/services/vehicle-branding",
      matchTags: ["vehicle", "car", "van", "truck", "matatu"],
      priority: 9,
    },
    {
      id: "svc-business-cards",
      type: "service",
      title: "Business Card Printing",
      description:
        "Premium business cards that make a lasting first impression.",
      href: "/services/business-cards",
      matchTags: ["business-cards", "printing", "stationery"],
      priority: 8,
    },

    // Products
    {
      id: "prod-tshirt",
      type: "product",
      title: "Custom T-Shirts",
      description: "Quality tees in every color, ready for your brand.",
      href: "/shop/t-shirts",
      matchTags: ["tshirt", "clothing", "casual", "need-product"],
      priority: 10,
    },
    {
      id: "prod-polo",
      type: "product",
      title: "Branded Polo Shirts",
      description: "Smart corporate polos for your team.",
      href: "/shop/polo-shirts",
      matchTags: ["polo", "corporate", "clothing", "need-product"],
      priority: 9,
    },
    {
      id: "prod-hoodie",
      type: "product",
      title: "Custom Hoodies",
      description: "Cozy, premium hoodies with your branding.",
      href: "/shop/hoodies",
      matchTags: ["hoodie", "casual", "clothing", "need-product"],
      priority: 8,
    },
    {
      id: "prod-jersey",
      type: "product",
      title: "Sports Jerseys",
      description: "Team jerseys with custom names and numbers.",
      href: "/shop/jerseys",
      matchTags: ["jersey", "sports", "clothing", "need-product"],
      priority: 8,
    },
    {
      id: "prod-mug",
      type: "product",
      title: "Custom Mugs",
      description: "Branded mugs perfect for corporate gifts.",
      href: "/shop/mugs",
      matchTags: ["drinkware", "corporate-gifts"],
      priority: 8,
    },

    // Collections
    {
      id: "col-corporate",
      type: "collection",
      title: "Corporate Essentials",
      description: "Everything your business needs to look professional.",
      href: "/shop/collections/corporate",
      matchTags: ["corporate", "business", "corporate-gifts"],
      priority: 7,
    },
    {
      id: "col-events",
      type: "collection",
      title: "Event Branding Kit",
      description: "Complete branding solutions for events and activations.",
      href: "/shop/collections/events",
      matchTags: ["events", "expo", "launch", "activation"],
      priority: 7,
    },

    // Portfolio
    {
      id: "port-clothing",
      type: "portfolio",
      title: "Clothing Branding Showcase",
      description: "See how we have transformed clothing for Kenyan brands.",
      href: "/portfolio?tag=clothing",
      matchTags: ["clothing", "apparel"],
      priority: 5,
    },
    {
      id: "port-signage",
      type: "portfolio",
      title: "Signage Projects",
      description: "Browse our signage installations across Nairobi.",
      href: "/portfolio?tag=signage",
      matchTags: ["signage", "3d-signage", "vehicle"],
      priority: 5,
    },
  ],
};
