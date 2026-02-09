import { useState, useEffect } from 'react';
import { enquiries, type Enquiry } from '../../api/enquiries';
import { users, type User } from '../../api/users';
import { Mail, Phone, Calendar, User as UserIcon, Search, Filter, Briefcase, GraduationCap } from 'lucide-react';

export function EnquiriesManager() {
    const [list, setList] = useState<Enquiry[]>([]);
    const [staffList, setStaffList] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const role = sessionStorage.getItem('user_role');
    const [activeTab, setActiveTab] = useState<'TRAINING' | 'HR'>(role === 'HR' ? 'HR' : 'TRAINING');

    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
    const [noteText, setNoteText] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [enquiriesData, usersData] = await Promise.all([
                enquiries.getAll(),
                users.getAll().catch(() => [])
            ]);
            setList(enquiriesData);
            setStaffList(usersData.filter(u => u.role === 'STAFF' || u.role === 'HR' || u.role === 'SUPER_ADMIN'));
        } catch (error) {
            console.error('Failed to load data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            await enquiries.updateStatus(id, newStatus);
            setList(list.map(e => e.id === id ? { ...e, status: newStatus as any } : e));
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status');
        }
    };

    const handleAssign = async (id: number, userId: number | string) => {
        if (!userId) return;
        try {
            await enquiries.assign(id, Number(userId));
            setList(list.map(e => e.id === id ? { ...e, assigned_to: Number(userId) } : e));
        } catch (error) {
            console.error('Failed to assign', error);
            alert('Failed to assign enquiry');
        }
    };

    const handleAddNote = async () => {
        if (!selectedEnquiry || !noteText.trim()) return;
        try {
            const updated = await enquiries.addNote(selectedEnquiry.id, noteText);
            setList(list.map(e => e.id === updated.id ? updated : e));
            setSelectedEnquiry(updated);
            setNoteText('');
        } catch (error) {
            console.error('Failed to add note', error);
            alert('Failed to add note');
        }
    };

    const filteredList = list.filter(enquiry => {
        // Filter by Tab (Type)
        // Legacy data might not have type, assume TRAINING if missing
        const type = enquiry.type || 'TRAINING';
        if (type !== activeTab) return false;

        const matchesSearch = (
            enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.phone.includes(searchTerm) ||
            enquiry.course_interest?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (enquiry.source || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesStatus = statusFilter === 'All' || (enquiry.status || 'NEW') === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div>Loading enquiries...</div>;

    const TabButton = ({ tab, label, icon: Icon }: any) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${activeTab === tab
                ? 'border-brand-blue text-brand-blue bg-blue-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
        >
            <Icon className="w-4 h-4" />
            {label}
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeTab === tab ? 'bg-blue-100 text-brand-blue' : 'bg-gray-100 text-gray-600'
                }`}>
                {list.filter(e => (e.type || 'TRAINING') === tab).length}
            </span>
        </button>
    );

    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Enquiries CRM</h1>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex overflow-hidden">
                {(role === 'SUPER_ADMIN' || role === 'STAFF' || role === 'TRAINER') && (
                    <TabButton tab="TRAINING" label="Training & Courses" icon={GraduationCap} />
                )}
                {(role === 'SUPER_ADMIN' || role === 'STAFF' || role === 'HR') && (
                    <TabButton tab="HR" label="Recruitment & Hiring" icon={Briefcase} />
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, phone..."
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
                        <option value="CONTACTED">Contacted</option>
                        <option value="FOLLOW_UP">Follow Up</option>
                        <option value="CONVERTED">Converted</option>
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
                                {activeTab === 'TRAINING' && <th className="px-6 py-4">Course</th>}
                                <th className="px-6 py-4">Message</th>
                                <th className="px-6 py-4">Assigned To</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredList.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        No {activeTab.toLowerCase()} enquiries found matching your filters.
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
                                            <div className="text-xs text-gray-400 mt-1">
                                                {new Date(enquiry.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 font-medium text-gray-900">
                                                <UserIcon className="w-4 h-4 text-brand-blue" />
                                                {enquiry.name}
                                            </div>
                                            {enquiry.source && (
                                                <span className="text-xs text-gray-400 block mt-1">via {enquiry.source}</span>
                                            )}
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
                                        {activeTab === 'TRAINING' && (
                                            <td className="px-6 py-4">
                                                <span className="inline-flex px-2 py-1 bg-blue-50 text-brand-blue rounded text-xs font-medium">
                                                    {enquiry.course_interest || 'General'}
                                                </span>
                                            </td>
                                        )}
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600 truncate max-w-xs cursor-help" title={enquiry.message}>
                                                {enquiry.message}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={enquiry.assigned_to || ''}
                                                onChange={(e) => handleAssign(enquiry.id, e.target.value)}
                                                className="text-sm border-gray-200 rounded-md focus:ring-brand-blue focus:border-brand-blue py-1 pl-2 pr-6"
                                                style={{ maxWidth: '140px' }}
                                            >
                                                <option value="">Unassigned</option>
                                                {staffList.map(u => (
                                                    <option key={u.id} value={u.id}>{u.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={enquiry.status || 'NEW'}
                                                onChange={(e) => handleStatusUpdate(enquiry.id, e.target.value)}
                                                className={`text-xs font-medium px-2 py-1 rounded-full border-none focus:ring-2 focus:ring-offset-1 cursor-pointer
                                                    ${enquiry.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                                                        enquiry.status === 'CONTACTED' ? 'bg-yellow-100 text-yellow-800' :
                                                            enquiry.status === 'CONVERTED' ? 'bg-green-100 text-green-800' :
                                                                enquiry.status === 'CLOSED' ? 'bg-gray-100 text-gray-800' :
                                                                    'bg-purple-100 text-purple-800'}`}
                                            >
                                                <option value="NEW">New</option>
                                                <option value="CONTACTED">Contacted</option>
                                                <option value="FOLLOW_UP">Follow Up</option>
                                                <option value="CONVERTED">Converted</option>
                                                <option value="CLOSED">Closed</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedEnquiry(enquiry)}
                                                className="text-brand-blue hover:text-blue-700 text-sm font-medium"
                                            >
                                                Notes {enquiry.notes && enquiry.notes.length > 0 && `(${enquiry.notes.length})`}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notes Modal */}
            {selectedEnquiry && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold">Notes for {selectedEnquiry.name}</h3>
                            <button
                                onClick={() => setSelectedEnquiry(null)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                x
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            {selectedEnquiry.notes && selectedEnquiry.notes.length > 0 ? (
                                selectedEnquiry.notes.map((note, index) => (
                                    <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                                        {note}
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic text-center">No notes yet.</p>
                            )}
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Add a new note..."
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-brand-blue/20 outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                                />
                                <button
                                    onClick={handleAddNote}
                                    disabled={!noteText.trim()}
                                    className="bg-brand-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-brand-blue/90 disabled:opacity-50"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
