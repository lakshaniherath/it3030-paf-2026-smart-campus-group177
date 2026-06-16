import React, { useState, useEffect } from 'react';
import { resourceService } from '../api/resourceService';
import ResourceForm from '../components/ResourceForm';
import StatusBadge from '../components/StatusBadge';
import TypeBadge from '../components/TypeBadge';
import { FiPlusCircle, FiEdit2, FiTrash2, FiArrowLeft, FiDatabase, FiCheckCircle, FiMonitor, FiBarChart2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AdminResourceManagementPage = () => {
    const navigate = useNavigate();
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewState, setViewState] = useState('list');
    const [selectedResource, setSelectedResource] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (viewState === 'list') loadResources();
    }, [viewState]);

    const loadResources = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await resourceService.getAllResources({ size: 100 });
            setResources(data.content || []);
        } catch (err) {
            setError('Failed to load resources: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData) => {
        setSubmitLoading(true);
        setError('');
        try {
            if (viewState === 'create') {
                await resourceService.createResource(formData);
                setMessage('Resource created successfully.');
            } else {
                await resourceService.updateResource(selectedResource.id, formData);
                setMessage('Resource updated successfully.');
            }
            setViewState('list');
        } catch (err) {
            setError('Operation failed: ' + err.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this resource?')) return;
        try {
            await resourceService.deleteResource(id);
            setMessage('Resource deleted.');
            loadResources();
        } catch (err) {
            setError('Failed to delete: ' + err.message);
        }
    };

    const totalResources = resources.length;
    const activeResources = resources.filter(r => r.status === 'ACTIVE').length;
    const equipmentCount = resources.filter(r => r.type === 'EQUIPMENT').length;

    if (viewState === 'create' || viewState === 'edit') {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 text-slate-800">
                <div className="flex min-h-screen">
                    {/* Sidebar */}
                    <aside className="w-72 bg-gradient-to-b from-blue-800 via-blue-700 to-cyan-700 px-4 py-6 hidden md:block">
                        <h2 className="text-xl font-bold text-white px-2">Resource Management</h2>
                        <p className="text-xs text-blue-100 px-2 mt-1">Member 1 Admin Panel</p>

                        <nav className="mt-8 space-y-2">
                            <button
                                onClick={() => setViewState('list')}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border bg-white/95 text-blue-900 border-blue-100 hover:border-cyan-300 transition"
                            >
                                <FiDatabase size={16} /> All Resources
                            </button>
                            <button
                                onClick={() => navigate('/admin/resources/analytics')}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border bg-white/95 text-blue-900 border-blue-100 hover:border-cyan-300 transition"
                            >
                                <FiBarChart2 size={16} /> View Analytics
                            </button>
                        </nav>

                        <div className="mt-8 space-y-2 px-1">
                            <p className="text-xs text-blue-200 uppercase tracking-widest px-1 mb-3">Quick Stats</p>
                            {[
                                { label: 'Total', value: totalResources, color: 'text-white' },
                                { label: 'Active', value: activeResources, color: 'text-emerald-300' },
                                { label: 'Equipment', value: equipmentCount, color: 'text-amber-300' },
                            ].map(s => (
                                <div key={s.label} className="flex justify-between items-center bg-white/10 rounded-xl px-3 py-2">
                                    <span className="text-sm text-blue-100">{s.label}</span>
                                    <span className={`font-bold text-lg ${s.color}`}>{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 p-4 md:p-8">
                        <div className="space-y-5">
                            <button
                                onClick={() => setViewState('list')}
                                className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-700 transition"
                            >
                                <FiArrowLeft size={14} /> Back to List
                            </button>
                            <h2 className="text-2xl font-bold text-blue-900">
                                {viewState === 'create' ? 'Add New Resource' : `Edit: ${selectedResource?.name}`}
                            </h2>
                            {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-sm">{error}</div>}
                            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                                <ResourceForm
                                    initialData={selectedResource}
                                    onSubmit={handleSubmit}
                                    onCancel={() => setViewState('list')}
                                    isSubmitting={submitLoading}
                                />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 text-slate-800">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className="w-72 bg-gradient-to-b from-blue-800 via-blue-700 to-cyan-700 px-4 py-6 hidden md:block">
                    <h2 className="text-xl font-bold text-white px-2">Resource Management</h2>
                    <p className="text-xs text-blue-100 px-2 mt-1">Member 1 Admin Panel</p>

                    <nav className="mt-8 space-y-2">
                        <button
                            onClick={() => setViewState('list')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition ${
                                viewState === 'list'
                                    ? 'bg-cyan-400 text-slate-950 border-cyan-300 font-semibold'
                                    : 'bg-white/95 text-blue-900 border-blue-100 hover:border-cyan-300'
                            }`}
                        >
                            <FiDatabase size={16} /> All Resources
                        </button>
                        <button
                            onClick={() => navigate('/admin/resources/analytics')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border bg-white/95 text-blue-900 border-blue-100 hover:border-cyan-300 transition"
                        >
                            <FiBarChart2 size={16} /> View Analytics
                        </button>
                    </nav>

                    <div className="mt-8 space-y-2 px-1">
                        <p className="text-xs text-blue-200 uppercase tracking-widest px-1 mb-3">Quick Stats</p>
                        {[
                            { label: 'Total', value: totalResources, color: 'text-white' },
                            { label: 'Active', value: activeResources, color: 'text-emerald-300' },
                            { label: 'Equipment', value: equipmentCount, color: 'text-amber-300' },
                        ].map(s => (
                            <div key={s.label} className="flex justify-between items-center bg-white/10 rounded-xl px-3 py-2">
                                <span className="text-sm text-blue-100">{s.label}</span>
                                <span className={`font-bold text-lg ${s.color}`}>{s.value}</span>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8">
                    <div className="space-y-6">
            {/* Page header */}
            <header className="rounded-2xl border border-blue-100 bg-white p-4 md:p-6 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-blue-900">Resource Management</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Manage campus facilities and assets</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/resources/analytics')}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition text-sm"
                    >
                        <FiBarChart2 size={15} /> View Analytics
                    </button>
                    <button
                        onClick={() => { setSelectedResource(null); setViewState('create'); }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 hover:bg-cyan-300 transition text-sm"
                    >
                        <FiPlusCircle size={15} /> Add Resource
                    </button>
                </div>
            </header>

            {/* Alerts */}
            {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-sm">{error}</div>}
            {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 text-sm">{message}</div>}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Resources', value: totalResources, icon: <FiDatabase className="text-blue-500" size={18} />, bg: 'bg-blue-50' },
                    { label: 'Active & Ready', value: activeResources, icon: <FiCheckCircle className="text-emerald-500" size={18} />, bg: 'bg-emerald-50' },
                    { label: 'Equipment', value: equipmentCount, icon: <FiMonitor className="text-amber-500" size={18} />, bg: 'bg-amber-50' },
                ].map(s => (
                    <div key={s.label} className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                            {s.icon}
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-slate-500 text-sm">Loading resources...</p>
                    </div>
                ) : resources.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 text-sm">No resources found. Add one to get started.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-blue-50 bg-blue-50/50">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Name / Code</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Capacity</th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resources.map(resource => (
                                    <tr key={resource.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition">
                                        <td className="py-3 px-4">
                                            <p className="font-semibold text-slate-800">{resource.name}</p>
                                            <p className="text-xs font-mono text-slate-400 mt-0.5">{resource.code}</p>
                                        </td>
                                        <td className="py-3 px-4"><TypeBadge type={resource.type} /></td>
                                        <td className="py-3 px-4"><StatusBadge status={resource.status} /></td>
                                        <td className="py-3 px-4 text-slate-600">{resource.capacity}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => { setSelectedResource(resource); setViewState('edit'); }}
                                                    className="p-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100 transition"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 size={13} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(resource.id)}
                                                    className="p-1.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-700 hover:bg-rose-100 transition"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminResourceManagementPage;
