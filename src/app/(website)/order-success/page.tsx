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

    useEffect(() => {
        setTimeout(() => setShowAnimation(true), 100);
    }, []);

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <Card className="max-w-2xl w-full">
                <CardContent className="pt-12 pb-8 text-center space-y-6">
                    {/* Success Icon */}
                    <div
                        className={`mx-auto w-24 h-24 rounded-full bg-green-100 flex items-center justify-center transition-all duration-700 ${showAnimation ? "scale-100 opacity-100" : "scale-50 opacity-0"
                            }`}
                    >
                        <CheckCircle2 className="h-16 w-16 text-green-600" />
                    </div>

                    {/* Message */}
                    <div
                        className={`space-y-2 transition-all duration-700 delay-200 ${showAnimation ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                            }`}
                    >
                        <h1 className="text-3xl font-bold">Order Placed Successfully!</h1>
                        <p className="text-lg text-muted-foreground">
                            Thank you for your order. Our team will contact you shortly.
                        </p>
                    </div>

                    {/* Order Details */}
                    {orderNumber && (
                        <div
                            className={`bg-muted/50 rounded-lg p-6 transition-all duration-700 delay-400 ${showAnimation ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                                }`}
                        >
                            <p className="text-sm text-muted-foreground mb-1">Order Number</p>
                            <p className="text-2xl font-bold text-primary font-mono">{orderNumber}</p>
                        </div>
                    )}

                    {/* Info */}
                    <div
                        className={`text-sm text-muted-foreground transition-all duration-700 delay-600 ${showAnimation ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                            }`}
                    >
                        <p>Estimated response time: Within 24 hours</p>
                        <p>We&apos;ll reach out to confirm your order and discuss next steps.</p>
                    </div>

                    {/* Actions */}
                    <div
                        className={`flex flex-wrap gap-3 justify-center pt-4 transition-all duration-700 delay-800 ${showAnimation ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                            }`}
                    >
                        <Button asChild>
                            <Link href="/shop">
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Continue Shopping
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/services">
                                <Wrench className="h-4 w-4 mr-2" />
                                View Services
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <a
                                href="https://wa.me/254700000000?text=Hi, I just placed an order and have a question."
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                WhatsApp Us
                            </a>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link href="/">
                                <Home className="h-4 w-4 mr-2" />
                                Back Home
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}