interface SpecificationsTableProps {
    specifications: Record<string, string>;
}

export function SpecificationsTable({ specifications }: SpecificationsTableProps) {
    return (
        <div className="rounded-lg border overflow-hidden">
            <table className="w-full">
                <tbody>
                    {Object.entries(specifications).map(([key, value], index) => (
                        <tr key={key} className={index % 2 === 0 ? "bg-muted/50" : "bg-background"}>
                            <td className="px-6 py-4 font-medium text-foreground capitalize">
                                {key.replace(/_/g, " ")}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">{value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}