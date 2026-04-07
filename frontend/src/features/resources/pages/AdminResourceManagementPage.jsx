import React, { useState, useEffect } from 'react';
import { resourceService } from '../api/resourceService';
import ResourceForm from '../components/ResourceForm';
import StatusBadge from '../components/StatusBadge';
import TypeBadge from '../components/TypeBadge';
import { PlusCircle, Edit3, Trash2, ArrowLeft, BarChart3, Building, MonitorSpeaker } from 'lucide-react';

const AdminResourceManagementPage = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewState, setViewState] = useState('list'); // list, create, edit
    const [selectedResource, setSelectedResource] = useState(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    
    useEffect(() => {
        if(viewState === 'list') {
            loadResources();
        }
    }, [viewState]);

    const loadResources = async () => {
        setLoading(true);
        try {
            const data = await resourceService.getAllResources({ size: 100 });
            setResources(data.content || []);
        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateClick = () => {
        setSelectedResource(null);
        setViewState('create');
    };

    const handleEditClick = (resource) => {
        setSelectedResource(resource);
        setViewState('edit');
    };

    const handleDeleteClick = async (id) => {
        if (window.confirm('Are you sure you want to deactivate/delete this resource? It will be marked as INACTIVE temporarily.')) {
            try {
                await resourceService.deleteResource(id);
                loadResources();
            } catch (err) {
                alert('Failed to delete: ' + err.message);
            }
        }
    };

    const handleSubmit = async (formData) => {
        setSubmitLoading(true);
        try {
            if (viewState === 'create') {
                await resourceService.createResource(formData);
            } else {
                await resourceService.updateResource(selectedResource.id, formData);
            }
            setViewState('list');
        } catch (err) {
            alert('Operation failed: ' + err.message);
        } finally {
            setSubmitLoading(false);
        }
    };

    // Derived Dashboard Stats
    const totalResources = resources.length;
    const activeResources = resources.filter(r => r.status === 'ACTIVE').length;
    const equipmentCount = resources.filter(r => r.type === 'EQUIPMENT').length;

    if (viewState === 'create' || viewState === 'edit') {
        return (
            <div className="max-w-4xl mx-auto pb-10">
                <button 
                    onClick={() => setViewState('list')}
                    className="flex items-center text-sm font-semibold text-text-secondary hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                </button>
                <div className="flex items-center mb-6">
                    <h2 className="text-3xl font-extrabold text-text-primary tracking-tight">
                        {viewState === 'create' ? 'Create New Resource' : `Edit Resource: ${selectedResource.name}`}
                    </h2>
                </div>
                <ResourceForm 
                    initialData={selectedResource} 
                    onSubmit={handleSubmit} 
                    onCancel={() => setViewState('list')} 
                    isSubmitting={submitLoading} 
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Dashboard Headers */}
            <div className="sm:flex sm:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-text-primary tracking-tight">Resource Management</h1>
                    <p className="mt-2 text-sm text-text-secondary max-w-2xl">
                        Administrator dashboard to oversee, update, and manage campus facilities and assets in real-time.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <button 
                        onClick={handleCreateClick}
                        className="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-primary-hover focus:outline-none transition-colors"
                    >
                        <PlusCircle className="w-5 h-5 mr-2" />
                        Add Resource
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                <div className="bg-surface overflow-hidden shadow-sm rounded-xl border border-bordercolor">
                    <div className="p-5 flex items-center">
                        <div className="flex-shrink-0 bg-primary/10 rounded-lg p-3">
                            <BarChart3 className="h-6 w-6 text-primary" aria-hidden="true" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-semibold text-text-secondary truncate">Total Resources</dt>
                                <dd className="text-2xl font-bold text-text-primary">{totalResources}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <div className="bg-surface overflow-hidden shadow-sm rounded-xl border border-bordercolor">
                    <div className="p-5 flex items-center">
                        <div className="flex-shrink-0 bg-status-successBg rounded-lg p-3">
                            <Building className="h-6 w-6 text-status-success" aria-hidden="true" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-semibold text-text-secondary truncate">Active Ready</dt>
                                <dd className="text-2xl font-bold text-text-primary">{activeResources}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <div className="bg-surface overflow-hidden shadow-sm rounded-xl border border-bordercolor">
                    <div className="p-5 flex items-center">
                        <div className="flex-shrink-0 bg-amber-50 rounded-lg p-3">
                            <MonitorSpeaker className="h-6 w-6 text-amber-500" aria-hidden="true" />
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-semibold text-text-secondary truncate">Total Equipment</dt>
                                <dd className="text-2xl font-bold text-text-primary">{equipmentCount}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-surface rounded-2xl shadow-sm border border-bordercolor overflow-hidden flex-1">
                {loading ? (
                    <div className="p-12 text-center text-text-secondary flex flex-col items-center">
                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                        Loading data grid...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-bordercolor">
                            <thead className="bg-background">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Name / ID</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Type</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-text-secondary uppercase tracking-wider">Capacity</th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-text-secondary uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-surface divide-y divide-bordercolor">
                                {resources.map(resource => (
                                    <tr key={resource.id} className="hover:bg-background/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-text-primary">{resource.name}</div>
                                            <div className="text-xs text-text-secondary font-mono mt-1">{resource.code}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <TypeBadge type={resource.type} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <StatusBadge status={resource.status} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary font-medium">
                                            {resource.capacity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                            <button onClick={() => handleEditClick(resource)} className="inline-flex items-center text-primary hover:text-primary-hover border border-transparent hover:bg-primary/5 p-1.5 rounded transition-colors">
                                                <Edit3 className="w-4 h-4 mr-1.5" /> Edit
                                            </button>
                                            <button onClick={() => handleDeleteClick(resource.id)} className="inline-flex items-center text-status-danger hover:text-status-danger border border-transparent hover:bg-status-danger/5 p-1.5 rounded transition-colors">
                                                <Trash2 className="w-4 h-4 mr-1.5" /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminResourceManagementPage;
