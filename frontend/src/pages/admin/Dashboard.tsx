import { useEffect, useState } from 'react';
import { Card } from '../../components/ui-kit/Card';
import { courses as coursesApi } from '../../api/courses';
import { enquiries as enquiriesApi } from '../../api/enquiries';
import { BookOpen, Users, MessageSquare } from 'lucide-react';

export function Dashboard() {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalEnquiries: 0,
        newEnquiries: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [coursesData, enquiriesData] = await Promise.all([
                    coursesApi.getAll(),
                    enquiriesApi.getAll()
                ]);

                setStats({
                    totalCourses: coursesData.length,
                    totalEnquiries: enquiriesData.length,
                    newEnquiries: enquiriesData.filter(e => e.status === 'NEW').length
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
            </div>
        </div>
    );
}
