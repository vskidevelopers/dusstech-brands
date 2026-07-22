/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Package, Truck, CheckCircle, Clock, Phone, Hash, ArrowRight, Shield, Zap, Headphones, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { trackOrderByNumberAndPhone } from "@/features/orders/queries.public";

export default function TrackOrderPage() {
    const router = useRouter();
    const [orderNumber, setOrderNumber] = useState("");
    const [phone, setPhone] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [error, setError] = useState("");

    const handleTrackOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!orderNumber.trim() || !phone.trim()) {
            setError("Please enter both order number and phone number");
            return;
        }

        setIsSearching(true);

        try {
            const result = await trackOrderByNumberAndPhone(orderNumber, phone);

            console.log("search results >> ", result);

            if (!result.success) {
                setError(result.error || "Order not found");
                toast.error(result.error || "Order not found");
                return;
            }

            setOrder(result.data);
        } catch (err) {
            console.error("Track order error:", err);
            setError("An error occurred while tracking your order");
            toast.error("Failed to track order");
        } finally {
            setIsSearching(false);
        }
    };

    // ✅ Dynamic timeline based on actual production status
    const getTimeline = (currentStatus: string) => {
        const stages = [
            { status: "new", label: "Order Placed", icon: Clock },
            { status: "in_production", label: "In Production", icon: Package },
            { status: "quality_check", label: "Quality Check", icon: CheckCircle },
            { status: "completed", label: "Completed", icon: CheckCircle },
            { status: "delivered", label: "Delivered", icon: Truck },
        ];

        const currentIndex = stages.findIndex(s => s.status === currentStatus);

        return stages.map((stage, index) => ({
            ...stage,
            completed: index <= currentIndex,
            current: index === currentIndex,
            date: index <= currentIndex ? new Date().toISOString() : null,
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "new": return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "in_production": return "bg-blue-100 text-blue-800 border-blue-300";
            case "quality_check": return "bg-purple-100 text-purple-800 border-purple-300";
            case "completed": return "bg-green-100 text-green-800 border-green-300";
            case "delivered": return "bg-green-100 text-green-800 border-green-300";
            default: return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "new": return <Clock className="h-4 w-4" />;
            case "in_production": return <Package className="h-4 w-4" />;
            case "quality_check": return <CheckCircle className="h-4 w-4" />;
            case "completed": return <CheckCircle className="h-4 w-4" />;
            case "delivered": return <Truck className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            "new": "Order Placed",
            "in_production": "In Production",
            "quality_check": "Quality Check",
            "completed": "Completed",
            "delivered": "Delivered",
        };
        return labels[status] || status.replace("_", " ");
    };

    if (order) {
        const timeline = getTimeline(order.status);

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4">
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">Order Tracking</h1>
                        <p className="text-lg text-muted-foreground">
                            Track your order <span className="font-mono font-bold text-primary">{order.order_number}</span>
                        </p>
                    </div>

                    {/* Status Badge */}
                    <Card className="border-2">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between flex-wrap gap-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-3 rounded-full ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Current Status</p>
                                        <p className="text-xl font-bold capitalize">
                                            {getStatusLabel(order.status)}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="outline" onClick={() => setOrder(null)}>
                                    Track Another Order
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timeline */}
                    <Card>
                        <CardContent className="pt-6">
                            <h2 className="text-xl font-semibold mb-6">Order Progress</h2>
                            <div className="space-y-6">
                                {timeline.map((step, index) => {
                                    const Icon = step.icon;
                                    return (
                                        <div key={index} className="relative">
                                            {index < timeline.length - 1 && (
                                                <div className={`absolute left-6 top-12 w-0.5 h-full ${step.completed ? "bg-green-500" : "bg-gray-200"
                                                    }`} />
                                            )}
                                            <div className="flex items-start gap-4">
                                                <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-2 ${step.current
                                                    ? "bg-blue-500 border-blue-500 text-white animate-pulse"
                                                    : step.completed
                                                        ? "bg-green-500 border-green-500 text-white"
                                                        : "bg-white border-gray-300 text-gray-400"
                                                    }`}>
                                                    {step.completed ? (
                                                        <Icon className="h-5 w-5" />
                                                    ) : (
                                                        <Circle className="h-5 w-5" />
                                                    )}
                                                </div>
                                                <div className="flex-1 pt-2">
                                                    <p className={`font-semibold ${step.current ? "text-blue-600" : step.completed ? "text-foreground" : "text-muted-foreground"
                                                        }`}>
                                                        {step.label}
                                                    </p>
                                                    {step.current && (
                                                        <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-100">
                                                            In Progress
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Order Details */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-4">Order Items</h3>
                                <div className="space-y-3">
                                    {order.items?.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-semibold">KES {item.subtotal.toLocaleString()}</p>
                                        </div>
                                    ))}
                                    <Separator />
                                    <div className="flex justify-between items-center font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-primary">KES {order.total?.toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-4">Need Help?</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Headphones className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="font-medium">Customer Support</p>
                                            <p className="text-sm text-muted-foreground">We&apos;re here to help 24/7</p>
                                        </div>
                                    </div>
                                    <Button className="w-full" variant="outline" asChild>
                                        <a
                                            href={`https://wa.me/254722277778?text=Hi, I have a question about order ${order.order_number}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Phone className="h-4 w-4 mr-2" />
                                            Contact via WhatsApp
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-16 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg mb-4">
                        <Search className="h-10 w-10" />
                    </div>
                    <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Track Your Order
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-lg mx-auto">
                        Stay updated on your order status. Real-time tracking from production to delivery.
                    </p>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
                    <Card className="border-0 shadow-md bg-white/80 backdrop-blur">
                        <CardContent className="pt-6 text-center">
                            <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                            <p className="font-semibold text-sm">Secure Tracking</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md bg-white/80 backdrop-blur">
                        <CardContent className="pt-6 text-center">
                            <Zap className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                            <p className="font-semibold text-sm">Real-time Updates</p>
                        </CardContent>
                    </Card>
                    <Card className="border-0 shadow-md bg-white/80 backdrop-blur">
                        <CardContent className="pt-6 text-center">
                            <Headphones className="h-8 w-8 text-green-600 mx-auto mb-2" />
                            <p className="font-semibold text-sm">24/7 Support</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tracking Form */}
                <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-xl">
                    <CardContent className="pt-8 pb-8">
                        <form onSubmit={handleTrackOrder} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="orderNumber" className="text-base font-semibold">
                                    Order Number
                                </Label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="orderNumber"
                                        type="text"
                                        placeholder="e.g., ORD-2026-000000"
                                        value={orderNumber}
                                        onChange={(e) => setOrderNumber(e.target.value)}
                                        className="pl-12 h-14 text-lg"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-base font-semibold">
                                    Phone Number
                                </Label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="e.g., 0798792928"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="pl-12 h-14 text-lg"
                                        required
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                disabled={isSearching}
                            >
                                {isSearching ? (
                                    <>
                                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Searching...
                                    </>
                                ) : (
                                    <>
                                        Track Order
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <Separator className="my-6" />

                        <div className="text-center text-sm text-muted-foreground">
                            <p>Can&apos;t find your order?</p>
                            <Button variant="link" className="p-0 h-auto font-semibold" asChild>
                                <a href="https://wa.me/254722277778" target="_blank" rel="noopener noreferrer">
                                    Contact us on WhatsApp
                                </a>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Features */}
                <div className="mt-16 grid md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: Package,
                            title: "Production Updates",
                            desc: "Track your order from design to completion"
                        },
                        {
                            icon: Truck,
                            title: "Delivery Tracking",
                            desc: "Know exactly when to expect your order"
                        },
                        {
                            icon: CheckCircle,
                            title: "Quality Assured",
                            desc: "Every order goes through quality checks"
                        }
                    ].map((feature, idx) => (
                        <Card key={idx} className="border-0 shadow-md bg-white/60 backdrop-blur">
                            <CardContent className="pt-6 text-center">
                                <feature.icon className="h-10 w-10 text-primary mx-auto mb-3" />
                                <h3 className="font-semibold mb-1">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}