import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, BookOpen, Image, Users, LogOut, Menu } from 'lucide-react';

export function AdminLayout() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isProfileOpen, setProfileOpen] = useState(false);

    // Auth is now handled by ProtectedRoute wrapper in App.tsx


    const userRole = sessionStorage.getItem('user_role');

    const navigation = [
        {
            category: 'Overview',
            items: [
                { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard', roles: ['SUPER_ADMIN', 'STAFF', 'HR', 'TRAINER'] },
            ]
        },
        {
            category: 'Training',
            items: [
                { icon: BookOpen, label: 'Courses', href: '/admin/courses', roles: ['SUPER_ADMIN', 'STAFF'] },
                { icon: Image, label: 'Gallery', href: '/admin/gallery', roles: ['SUPER_ADMIN', 'STAFF'] },
                { icon: Users, label: 'Training Enquiries', href: '/admin/enquiries?type=TRAINING', roles: ['SUPER_ADMIN', 'STAFF'] },
                { icon: LayoutDashboard, label: 'Popups', href: '/admin/popups', roles: ['SUPER_ADMIN', 'STAFF'] },
            ]
        },
        {
            category: 'Recruitment',
            items: [
                { icon: Users, label: 'Employer Enquiries', href: '/admin/enquiries?type=HR', roles: ['SUPER_ADMIN', 'HR'] },
                // { icon: FileText, label: 'Job Requests', href: '/admin/jobs', roles: ['SUPER_ADMIN', 'HR'] }, // Placeholder
            ]
        },

    ];

    // Helper to check role access
    const hasAccess = (roles?: string[]) => !roles || roles.includes(userRole || '');

    const handleLogout = () => {
        if (confirm('Are you sure you want to logout?')) {
            sessionStorage.removeItem('access_token');
            window.location.href = '/admin/login';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className={`bg-white border-r border-gray-200 fixed lg:static inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20 lg:hover:w-64 group'}`}>
                <div className="h-16 flex items-center justify-center border-b border-gray-100">
                    <img src="/assets/logo.svg" alt="AESCION Logo" className="h-26 md:h-50 w-auto" />
                </div>
                <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
                    {navigation.map((section, idx) => (
                        <div key={idx}>
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4 lg:hidden lg:group-hover:block">
                                {section.category}
                            </div>
                            <div className="space-y-1">
                                {section.items.filter(item => hasAccess(item.roles)).map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-brand-blue rounded-lg transition-colors"
                                    >
                                        <item.icon className="w-5 h-5 shrink-0" />
                                        <span className={`${!isSidebarOpen && 'lg:hidden lg:group-hover:block'} whitespace-nowrap`}>{item.label}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 relative">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 lg:hidden">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="font-bold text-gray-900">Admin Panel</div>

                    <div className="relative">
                        <button
                            onClick={() => setProfileOpen(!isProfileOpen)}
                            className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center text-white font-bold hover:ring-2 ring-offset-2 ring-brand-orange transition-all"
                        >
                            A
                        </button>

                        {isProfileOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-100">
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>
                <main className="flex-1 p-4 lg:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
