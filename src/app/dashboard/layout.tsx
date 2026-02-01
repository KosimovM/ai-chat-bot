import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="pl-64 flex flex-col min-h-screen">
                <Topbar />
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
