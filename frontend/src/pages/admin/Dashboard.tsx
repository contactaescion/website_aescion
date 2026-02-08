import { useEffect, useState } from 'react';
import { Card } from '../../components/ui-kit/Card';
import { courses as coursesApi } from '../../api/courses';
import { enquiries as enquiriesApi } from '../../api/enquiries';
import { gallery as galleryApi } from '../../api/gallery';
import { popups as popupsApi } from '../../api/popups';
import { BookOpen, Users, MessageSquare, Image, Bell } from 'lucide-react';

export function Dashboard() {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalEnquiries: 0,
        newEnquiries: 0,
        totalImages: 0,
        activePopups: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // We use Promise.allSettled to ensure failure in one doesn't break others,
                // but for simplicity/consistency with previous code we can use Promise.all
                // or handle errors individually. 
                // Let's use Promise.all and wrap in try-catch which is already there.
                // Note: If endpoints don't exist yet, this might fail.
                const [coursesData, enquiriesData, galleryData, popupsData] = await Promise.all([
                    coursesApi.getAll().catch(() => []),
                    enquiriesApi.getAll().catch(() => []),
                    galleryApi.getAll().catch(() => []),
                    popupsApi.getAll().catch(() => [])
                ]);

                setStats({
                    totalCourses: coursesData.length,
                    totalEnquiries: enquiriesData.length,
                    newEnquiries: enquiriesData.filter((e: any) => e.status === 'NEW').length,
                    totalImages: galleryData.length,
                    activePopups: popupsData.filter((p: any) => p.is_active).length
                });
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }: any) => (
        <Card className="p-6 flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-800">{loading ? '-' : value}</h3>
            </div>
            <div className={`p-4 rounded-full ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </Card>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Courses"
                    value={stats.totalCourses}
                    icon={BookOpen}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Enquiries"
                    value={stats.totalEnquiries}
                    icon={Users}
                    color="bg-purple-500"
                />
                <StatCard
                    title="New Enquiries"
                    value={stats.newEnquiries}
                    icon={MessageSquare}
                    color="bg-orange-500"
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
                    color="bg-indigo-500"
                />
            </div>
        </div>
    );
}
