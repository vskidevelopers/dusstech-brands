export function PagePlaceholder({ title }: { title: string }) {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
        </div>
    );
}