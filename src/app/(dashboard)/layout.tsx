import { ChatWidget } from "@/components/ChatWidget";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
            <Sidebar />
            <div className="pl-64 flex flex-col min-h-screen w-full transition-all duration-300">
                <Topbar />
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
            <ChatWidget />
        </div>
    );
}
