import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import ServiceModal from '../../components/admin/services/ServiceModal';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/services');
      setServices(res.data.data || res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load services (Backend might not be ready yet)');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-gray-900">Are you sure you want to delete this service?</p>
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/services/${id}`);
                toast.success('Service deleted successfully');
                fetchServices();
              } catch (error) {
                toast.error('Failed to delete service');
              }
            }} 
            className="px-3 py-1.5 text-xs font-bold text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const openCreateModal = () => {
    setSelectedService(null);
    setSearch('');
    setIsModalOpen(true);
  };

  const openEditModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const filteredServices = services.filter(s => 
    s.title?.toLowerCase().includes(search.toLowerCase()) || 
    s.subtitle?.toLowerCase().includes(search.toLowerCase()) ||
    s.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        {/* <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Service Management</h1>
          <p className="text-gray-500 mt-1">Manage the martial arts and fitness programs you offer.</p>
        </div> */}
        
        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search services..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
            />
          </div>
          <button 
            onClick={openCreateModal}
            className="shrink-0 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-orange-500/20"
          >
            <Plus size={18} /> <span className="hidden lg:inline">Add Service</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No services found</h3>
          <p className="text-gray-500 text-sm mb-6">Start adding the programs and classes your school offers.</p>
          <button onClick={openCreateModal} className="text-orange-500 font-bold hover:text-orange-600 text-sm">
            + Add your first service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
              {/* Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {service.image ? (
                  <img src={`http://127.0.0.1:8000/storage/${service.image}`} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Briefcase size={40} />
                  </div>
                )}
                {/* Badge */}
                {service.badge && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider shadow-sm">
                      {service.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                    {service.subtitle || 'Program'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-1">
                  {service.title}
                </h3>
                
                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
                  {service.description || 'No description provided.'}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <button onClick={() => openEditModal(service)} className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ServiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        serviceData={selectedService} 
        fetchServices={() => {
          setSearch('');
          fetchServices();
        }}
      />
    </div>
  );
};

export default Services;
