import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "./_components/ContactForm";

export const metadata: Metadata = {
    title: "Contact Us | Dusstech Brands",
    description:
        "Get in touch with Dusstech Brands for custom branding services, product orders, or general inquiries. We're here to help bring your vision to life.",
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-28">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-primary/10 blur-3xl animate-pulse [animation-delay:1s]" />
                </div>
                <div className="container relative mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Have a project in mind? Need a custom quote? We&apos;d love to hear from you.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="container mx-auto px-4 py-16 md:py-24">
                <div className="grid lg:grid-cols-3 gap-12">

                    {/* Left Column: Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                            <p className="text-muted-foreground mb-8">
                                Choose the most convenient way to reach us. Our team is ready to assist you.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Card className="border-border/50 hover:border-primary/50 transition-colors">
                                <CardContent className="flex items-start gap-4 p-5">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Phone</h3>
                                        <p className="text-muted-foreground text-sm mb-2">Mon-Fri, 8am - 6pm EAT</p>
                                        <a href="tel:+254722277778" className="text-primary font-medium hover:underline">
                                            +254 700 000 000
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 hover:border-primary/50 transition-colors">
                                <CardContent className="flex items-start gap-4 p-5">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <p className="text-muted-foreground text-sm mb-2">We reply within 24 hours</p>
                                        <a href="mailto:hello@dusstech.com" className="text-primary font-medium hover:underline">
                                            hello@dusstech.com
                                        </a>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 hover:border-primary/50 transition-colors">
                                <CardContent className="flex items-start gap-4 p-5">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Location</h3>
                                        <p className="text-muted-foreground text-sm mb-2">Visit our workshop</p>
                                        <p className="text-foreground font-medium">
                                            Nairobi, Kenya
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/50 hover:border-primary/50 transition-colors">
                                <CardContent className="flex items-start gap-4 p-5">
                                    <div className="p-3 rounded-full bg-primary/10 text-primary">
                                        <Clock className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Business Hours</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Monday - Friday: 8:00 AM - 6:00 PM<br />
                                            Saturday: 9:00 AM - 4:00 PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* WhatsApp CTA */}
                        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                            <CardContent className="p-6 text-center">
                                <MessageCircle className="h-10 w-10 text-green-600 mx-auto mb-3" />
                                <h3 className="font-bold text-lg mb-2 text-green-800 dark:text-green-200">
                                    Prefer WhatsApp?
                                </h3>
                                <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                                    Get instant responses to your inquiries via our WhatsApp business line.
                                </p>
                                <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                                    <a href="https://wa.me/254722277778?text=Hi%20Dusstech,%20I%20have%20an%20inquiry." target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Chat on WhatsApp
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:col-span-2">
                        <ContactForm />
                    </div>
                </div>
            </section>
        </div>
    );
}