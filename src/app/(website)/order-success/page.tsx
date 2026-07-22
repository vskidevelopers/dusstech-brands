"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, Wrench, MessageCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const orderNumber = searchParams.get("order");
    const [showAnimation, setShowAnimation] = useState(false);

    // ✅ Generate a dynamic, professional WhatsApp message
    const whatsappMessage = orderNumber
        ? `Hi Dusstech, I just placed an order (Order #: ${orderNumber}) and would like to confirm the details and next steps.`
        : "Hi Dusstech, I just placed an order on your website and would like to confirm the details.";

    const encodedMessage = encodeURIComponent(whatsappMessage);
    // Replace with your actual business WhatsApp number
    const whatsappNumber = "254722277778";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    useEffect(() => {
        // Trigger staggered animations on mount
        setTimeout(() => setShowAnimation(true), 100);
    }, []);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <Card className="max-w-2xl w-full border-0 shadow-lg">
                <CardContent className="pt-12 pb-8 text-center space-y-6">

                    {/* Success Icon */}
                    <div
                        className={`mx-auto w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center transition-all duration-700 ${showAnimation ? "scale-100 opacity-100" : "scale-50 opacity-0"
                            }`}
                    >
                        <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
                    </div>

                    {/* Message */}
                    <div
                        className={`space-y-2 transition-all duration-700 delay-200 ${showAnimation ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                            }`}
                    >
                        <h1 className="text-3xl font-bold tracking-tight">Order Placed Successfully!</h1>
                        <p className="text-lg text-muted-foreground max-w-md mx-auto">
                            Thank you for your order. Our team will review it and contact you shortly to confirm details and arrange payment.
                        </p>
                    </div>

                    {/* Order Details Card */}
                    {orderNumber && (
                        <div
                            className={`bg-muted/50 border rounded-xl p-6 max-w-sm mx-auto transition-all duration-700 delay-400 ${showAnimation ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                }`}
                        >
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                                Your Order Number
                            </p>
                            <p className="text-2xl font-bold text-primary font-mono tracking-wide">
                                {orderNumber}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Please save this number for your records.
                            </p>
                        </div>
                    )}

                    {/* Info */}
                    <div
                        className={`text-sm text-muted-foreground transition-all duration-700 delay-600 ${showAnimation ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                            }`}
                    >
                        <p className="font-medium text-foreground">Estimated response time: Within 24 hours</p>
                    </div>

                    {/* Actions */}
                    <div
                        className={`flex flex-col sm:flex-row flex-wrap gap-3 justify-center pt-4 transition-all duration-700 delay-800 ${showAnimation ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                            }`}
                    >
                        {/* ✅ Upgraded WhatsApp Button with Dynamic Message */}
                        <Button asChild variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Confirm via WhatsApp
                            </a>
                        </Button>

                        <Button variant="outline" asChild>
                            <Link href="/shop">
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Continue Shopping
                            </Link>
                        </Button>

                        <Button variant="ghost" asChild>
                            <Link href="/">
                                <Home className="h-4 w-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}