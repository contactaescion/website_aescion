import { useEffect, useState } from 'react';
import { Card } from '../../components/ui-kit/Card';
import { courses as coursesApi } from '../../api/courses';
import { enquiries as enquiriesApi } from '../../api/enquiries';
import { gallery as galleryApi } from '../../api/gallery';
import { popups as popupsApi } from '../../api/popups';
import { analytics as analyticsApi } from '../../api/analytics';
import { BookOpen, Image, Bell, Briefcase, GraduationCap } from 'lucide-react';

export function Dashboard() {
    const [stats, setStats] = useState({
        totalCourses: 0,
        trainingEnquiries: 0,
        hrEnquiries: 0,
        newTrainingEnquiries: 0,
        newHrEnquiries: 0,
        totalImages: 0,
        activePopups: 0,
        totalVisits: 0,
        uniqueVisitors: 0
    });
    // Charts removed
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [
                    coursesData,
                    enquiriesData,
                    galleryData,
                    popupsData,
                    analyticsStats,
                    conversionData
                ] = await Promise.all([
                    coursesApi.getAll().catch(() => []),
                    enquiriesApi.getAll().catch(() => []),
                    galleryApi.getAll().catch(() => []),
                    popupsApi.getAll().catch(() => []),
                    analyticsApi.getStats().catch(() => ({ totalVisits: 0, uniqueVisitors: 0 })),
                    analyticsApi.getConversions().catch(() => ({ conversionRate: 0, visitors: 0 }))
                ]);

                setStats({
                    totalCourses: coursesData.length,
                    trainingEnquiries: enquiriesData.filter((e: any) => (!e.type || e.type === 'TRAINING')).length,
                    hrEnquiries: enquiriesData.filter((e: any) => e.type === 'HR').length,
                    newTrainingEnquiries: enquiriesData.filter((e: any) => (!e.type || e.type === 'TRAINING') && e.status === 'NEW').length,
                    newHrEnquiries: enquiriesData.filter((e: any) => e.type === 'HR' && e.status === 'NEW').length,
                    totalImages: galleryData.length,
                    activePopups: popupsData.filter((p: any) => p.is_active).length,
                    totalVisits: analyticsStats.totalVisits,
                    uniqueVisitors: analyticsStats.uniqueVisitors,
                    conversionRate: conversionData.conversionRate
                } as any);
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();


    }, []);

    const StatCard = ({ title, value, subValue, icon: Icon, color }: any) => (
        <Card className="p-6 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-800">{loading ? '-' : value}</h3>
                {subValue && <p className="text-xs text-brand-blue mt-1 font-medium">{subValue}</p>}
            </div>
            <div className={`p-4 rounded-full ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </Card>
    );

    const role = sessionStorage.getItem('user_role');
    const isTrainingView = !role || role === 'SUPER_ADMIN' || role === 'STAFF' || role === 'TRAINER';
    const isHrView = !role || role === 'SUPER_ADMIN' || role === 'STAFF' || role === 'HR';
    const isAdminView = !role || role === 'SUPER_ADMIN' || role === 'STAFF';

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Visitor stats removed as per request
                <StatCard
                    title="Total Visitors"
                    value={stats.totalVisits}
                    icon={TrendingUp}
                    color="bg-emerald-500"
                />
                <StatCard
                    title="Unique Visitors"
                    value={stats.uniqueVisitors}
                    icon={Globe}
                    color="bg-teal-500"
                />
                */}
                {isTrainingView && (
                    <StatCard
                        title="Training Leads"
                        value={stats.trainingEnquiries}
                        subValue={`${stats.newTrainingEnquiries} New`}
                        icon={GraduationCap}
                        color="bg-blue-500"
                    />
                )}
                {isHrView && (
                    <StatCard
                        title="Corporate Leads"
                        value={stats.hrEnquiries}
                        subValue={`${stats.newHrEnquiries} New`}
                        icon={Briefcase}
                        color="bg-purple-500"
                    />
                )}
                {/*
                <StatCard
                    title="Conversion Rate"
                    value={`${(stats as any).conversionRate || 0}%`}
                    icon={Target}
                    color="bg-rose-500"
                    subValue="Enquiries / Unique Visitors"
                />
                */}
            </div>

            {/* Analytics charts removed as per request */}

            {isAdminView && (
                <>
                    <h2 className="text-xl font-bold text-gray-800 mt-8">Content Stats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            title="Total Courses"
                            value={stats.totalCourses}
                            icon={BookOpen}
                            color="bg-indigo-500"
                        />
                        <StatCard
                            title="Gallery Images"
                            value={stats.totalImages}
                            icon={Image}
                            color="bg-pink-500"
                        />
                        <StatCard
                            title="Active Popups"
                            value={stats.activePopups}
                            icon={Bell}
                            color="bg-orange-500"
                        />
                    </div>
                </>
            )}
        </div>
    );
}
