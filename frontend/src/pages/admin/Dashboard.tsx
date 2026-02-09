import { useEffect, useState } from 'react';
import { Card } from '../../components/ui-kit/Card';
import { courses as coursesApi } from '../../api/courses';
import { enquiries as enquiriesApi } from '../../api/enquiries';
import { gallery as galleryApi } from '../../api/gallery';
import { popups as popupsApi } from '../../api/popups';
import { analytics as analyticsApi } from '../../api/analytics';
import { BookOpen, Image, Bell, TrendingUp, Globe, Briefcase, GraduationCap, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

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
    const [dailyVisits, setDailyVisits] = useState([]);
    const [topPages, setTopPages] = useState([]);
    const [sources, setSources] = useState([]);
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
                    topPagesData,
                    conversionData,
                    sourcesData
                ] = await Promise.all([
                    coursesApi.getAll().catch(() => []),
                    enquiriesApi.getAll().catch(() => []),
                    galleryApi.getAll().catch(() => []),
                    popupsApi.getAll().catch(() => []),
                    analyticsApi.getStats().catch(() => ({ totalVisits: 0, uniqueVisitors: 0 })),
                    analyticsApi.getDailyVisits().catch(() => []),
                    analyticsApi.getTopPages().catch(() => []),
                    analyticsApi.getConversions().catch(() => ({ conversionRate: 0, visitors: 0 })),
                    analyticsApi.getSources().catch(() => [])
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
                setDailyVisits(dailyData);
                setTopPages(topPagesData);
                setSources(sourcesData);
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
                <StatCard
                    title="Conversion Rate"
                    value={`${(stats as any).conversionRate || 0}%`}
                    icon={Target}
                    color="bg-rose-500"
                    subValue="Enquiries / Unique Visitors"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Enquiries by Source</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sources}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {sources.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

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
