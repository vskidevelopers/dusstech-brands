/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Truck, CreditCard, Clock } from "lucide-react";
import { toast } from "sonner";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { OrderSummary } from "@/components/shared/OrderSummary";
import { InputField, TextareaField } from "@/components/shared/FormField";
import { useCartStore } from "@/features/cart/store";
import { createWebsiteOrderAction } from "@/features/orders/actions";

const checkoutSchema = z.object({
    full_name: z.string().min(2, "Full name is required"),
    phone: z.string().min(10, "Valid phone number is required"),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    company: z.string().optional(),
    delivery_method: z.enum(["pickup", "delivery"]),
    county: z.string().optional(),
    town: z.string().optional(),
    area: z.string().optional(),
    instructions: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const router = useRouter();
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);
    const transformToOrderItems = useCartStore((state) => state.transformToOrderItems);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "delivery">("pickup");

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            full_name: "",
            phone: "",
            email: "",
            company: "",
            delivery_method: "pickup",
            county: "",
            town: "",
            area: "",
            instructions: "",
        },
    });

    // 1. Autosave: Restore form data from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("checkout-form");
        if (saved) {
            try {
                const data = JSON.parse(saved);
                Object.entries(data).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        setValue(key as keyof CheckoutFormData, value as any);
                        if (key === "delivery_method") {
                            setDeliveryMethod(value as "pickup" | "delivery");
                        }
                    }
                });
            } catch (e) {
                console.error("Failed to parse saved checkout form", e);
            }
        }
    }, [setValue]);

    // 2. Autosave: Watch form changes and save to localStorage
    useEffect(() => {
        const subscription = watch((data) => {
            localStorage.setItem("checkout-form", JSON.stringify(data));
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    // 3. Redirect to cart if empty
    useEffect(() => {
        if (items.length === 0) {
            router.push("/cart");
        }
    }, [items, router]);

    const onSubmit = async (data: CheckoutFormData) => {
        setIsSubmitting(true);

        try {
            const orderItems = transformToOrderItems();

            // Combine delivery details into a single string for the database
            const deliveryLocation =
                data.delivery_method === "delivery"
                    ? [data.county, data.town, data.area].filter(Boolean).join(", ")
                    : null;

            const result = await createWebsiteOrderAction({
                customer_name: data.full_name,
                customer_phone: data.phone,
                customer_email: data.email || null,
                customer_company: data.company || null,
                delivery_method: data.delivery_method,
                delivery_location: deliveryLocation,
                payment_option: "later",
                items: orderItems,
            });

            if (result.success && result.data) {
                clearCart();
                localStorage.removeItem("checkout-form");
                router.push(`/order-success?order=${result.data.order_number}`);
            } else {
                throw new Error(result.error || "Failed to create order");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            toast.error(error instanceof Error ? error.message : "Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Guard against flash of empty cart before redirect
    if (items.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <Breadcrumbs
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Cart", href: "/cart" },
                        { label: "Checkout" },
                    ]}
                />

                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Left Column: Form */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Customer Information */}
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <h2 className="text-xl font-semibold">Customer Information</h2>
                                    <InputField
                                        label="Full Name"
                                        error={errors.full_name?.message}
                                        required
                                        placeholder="John Doe"
                                        {...register("full_name")}
                                    />
                                    <InputField
                                        label="Phone Number"
                                        error={errors.phone?.message}
                                        required
                                        type="tel"
                                        placeholder="+254 700 000 000"
                                        {...register("phone")}
                                    />
                                    <InputField
                                        label="Email"
                                        error={errors.email?.message}
                                        type="email"
                                        placeholder="john@example.com (Optional)"
                                        {...register("email")}
                                    />
                                    <InputField
                                        label="Company"
                                        error={errors.company?.message}
                                        placeholder="Company Name (Optional)"
                                        {...register("company")}
                                    />
                                </CardContent>
                            </Card>

                            {/* Delivery Method */}
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <h2 className="text-xl font-semibold">Delivery Method</h2>
                                    <RadioGroup
                                        value={deliveryMethod}
                                        onValueChange={(value) => {
                                            setDeliveryMethod(value as "pickup" | "delivery");
                                            setValue("delivery_method", value as "pickup" | "delivery");
                                        }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        <div>
                                            <RadioGroupItem value="pickup" id="pickup" className="peer sr-only" />
                                            <Label
                                                htmlFor="pickup"
                                                className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                                            >
                                                <MapPin className="h-8 w-8 mb-2 text-muted-foreground peer-data-[state=checked]:text-primary" />
                                                <span className="font-semibold">Pickup</span>
                                                <span className="text-sm text-muted-foreground text-center">
                                                    Collect from our location
                                                </span>
                                            </Label>
                                        </div>
                                        <div>
                                            <RadioGroupItem value="delivery" id="delivery" className="peer sr-only" />
                                            <Label
                                                htmlFor="delivery"
                                                className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                                            >
                                                <Truck className="h-8 w-8 mb-2 text-muted-foreground peer-data-[state=checked]:text-primary" />
                                                <span className="font-semibold">Delivery</span>
                                                <span className="text-sm text-muted-foreground text-center">
                                                    We&apos;ll deliver to you
                                                </span>
                                            </Label>
                                        </div>
                                    </RadioGroup>

                                    {deliveryMethod === "delivery" && (
                                        <div className="space-y-4 pt-4 animate-in slide-in-from-top-2 duration-300">
                                            <InputField
                                                label="County"
                                                error={errors.county?.message}
                                                placeholder="e.g., Nairobi"
                                                {...register("county")}
                                            />
                                            <InputField
                                                label="Town"
                                                error={errors.town?.message}
                                                placeholder="e.g., Westlands"
                                                {...register("town")}
                                            />
                                            <InputField
                                                label="Area / Landmark"
                                                error={errors.area?.message}
                                                placeholder="e.g., Near Sarit Centre"
                                                {...register("area")}
                                            />
                                            <TextareaField
                                                label="Additional Instructions"
                                                error={errors.instructions?.message}
                                                placeholder="Any special delivery instructions..."
                                                {...register("instructions")}
                                            />
                                            <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                Delivery fee will be communicated after order confirmation.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Payment Option */}
                            <Card>
                                <CardContent className="pt-6 space-y-4">
                                    <h2 className="text-xl font-semibold">Payment</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card className="border-2 border-primary bg-primary/5">
                                            <CardContent className="pt-6">
                                                <div className="flex items-start gap-3">
                                                    <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <h3 className="font-semibold">Place Order</h3>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Our team will contact you to confirm details and arrange payment.
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="border-2 border-muted bg-muted/20 opacity-70">
                                            <CardContent className="pt-6">
                                                <div className="flex items-start gap-3">
                                                    <CreditCard className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold">Pay Now</h3>
                                                            <span className="text-[10px] font-bold uppercase tracking-wider bg-muted-foreground/20 text-muted-foreground px-2 py-0.5 rounded">
                                                                Coming Soon
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            M-Pesa STK Push integration coming soon.
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Placing Order...
                                    </>
                                ) : (
                                    "Place Order"
                                )}
                            </Button>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:sticky lg:top-24 h-fit">
                            <OrderSummary showCheckoutButton={false} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}