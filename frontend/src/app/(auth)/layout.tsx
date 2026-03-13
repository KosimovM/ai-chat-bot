export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Background gradient effects could go here */}
                {children}
            </div>
        </div>
    );
}
