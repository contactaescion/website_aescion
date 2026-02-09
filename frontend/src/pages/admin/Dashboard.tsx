import { useEffect, useState } from 'react';
import { Card } from '../../components/ui-kit/Card';
import { courses as coursesApi } from '../../api/courses';
import { enquiries as enquiriesApi } from '../../api/enquiries';
import { gallery as galleryApi } from '../../api/gallery';
import { popups as popupsApi } from '../../api/popups';
import { analytics as analyticsApi } from '../../api/analytics';
import { BookOpen, Users, MessageSquare, Image, Bell, TrendingUp, Globe } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export function Dashboard() {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalEnquiries: 0,
        newEnquiries: 0,
        totalImages: 0,
        activePopups: 0,
        totalVisits: 0,
        uniqueVisitors: 0
    });
    const [dailyVisits, setDailyVisits] = useState([]);
    const [topPages, setTopPages] = useState([]);
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
                    dailyData,
                    topPagesData
                ] = await Promise.all([
                    coursesApi.getAll().catch(() => []),
                    enquiriesApi.getAll().catch(() => []),
                    galleryApi.getAll().catch(() => []),
                    popupsApi.getAll().catch(() => []),
                    analyticsApi.getStats().catch(() => ({ totalVisits: 0, uniqueVisitors: 0 })),
                    analyticsApi.getDailyVisits().catch(() => []),
                    analyticsApi.getTopPages().catch(() => [])
                ]);

                setStats({
                    totalCourses: coursesData.length,
                    totalEnquiries: enquiriesData.length,
                    newEnquiries: enquiriesData.filter((e: any) => e.status === 'NEW').length,
                    totalImages: galleryData.length,
                    activePopups: popupsData.filter((p: any) => p.is_active).length,
                    totalVisits: analyticsStats.totalVisits,
                    uniqueVisitors: analyticsStats.uniqueVisitors
                });
                setDailyVisits(dailyData);
                setTopPages(topPagesData);
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Visitor Trends (Last 7 Days)</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dailyVisits}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Top Pages</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topPages} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="path" type="category" width={150} tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mt-8">Content Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Courses"
                    value={stats.totalCourses}
                    icon={BookOpen}
                    color="bg-blue-500"
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
