import { useState, useEffect } from 'react';
import { enquiries, type Enquiry } from '../../api/enquiries';
import { Mail, Phone, Calendar, User, Search, Filter } from 'lucide-react';

export function EnquiriesManager() {
    const [list, setList] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        loadEnquiries();
    }, []);

    const loadEnquiries = async () => {
        try {
            const data = await enquiries.getAll();
            setList(data);
        } catch (error) {
            console.error('Failed to load enquiries', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredList = list.filter(enquiry => {
        const matchesSearch = (
            enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.phone.includes(searchTerm) ||
            enquiry.course_interest?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesStatus = statusFilter === 'All' || (enquiry.status || 'NEW') === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div>Loading enquiries...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Enquiries ({list.length})</h1>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, phone or course..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all"
                    >
                        <option value="All">All Status</option>
                        <option value="NEW">New</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Course</th>
                                <th className="px-6 py-4">Message</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredList.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No enquiries found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredList.map((enquiry) => (
                                    <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {new Date(enquiry.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 font-medium text-gray-900">
                                                <User className="w-4 h-4 text-brand-blue" />
                                                {enquiry.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Phone className="w-3 h-3" />
                                                    {enquiry.phone}
                                                </div>
                                                {enquiry.email && (
                                                    <div className="flex items-center gap-2 text-gray-500">
                                                        <Mail className="w-3 h-3" />
                                                        {enquiry.email}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex px-2 py-1 bg-blue-50 text-brand-blue rounded text-xs font-medium">
                                                {enquiry.course_interest}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 truncate max-w-xs" title={enquiry.message}>
                                                {enquiry.message}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {enquiry.status === 'CLOSED' ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                    Closed
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await enquiries.updateStatus(enquiry.id, 'CLOSED');
                                                            loadEnquiries();
                                                        } catch (error) {
                                                            console.error('Failed to update status', error);
                                                            alert('Failed to update status');
                                                        }
                                                    }}
                                                    className="inline-flex items-center px-3 py-1 text-xs font-semibold text-white bg-brand-blue hover:bg-brand-blue/90 rounded-lg transition-colors shadow-sm"
                                                >
                                                    Mark as Read
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
