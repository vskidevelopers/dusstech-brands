import Link from "next/link";
import { ArrowLeft, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductNotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
            <div className="rounded-full bg-muted p-6 mb-6">
                <PackageX className="h-16 w-16 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Product Not Found</h1>
            <p className="text-muted-foreground mb-8 max-w-md">
                The product you&apos;re looking for doesn&apos;t exist or may have been removed.
            </p>
            <Button asChild>
                <Link href="/shop">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                </Link>
            </Button>
        </div>
    );
}