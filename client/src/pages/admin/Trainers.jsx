import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User as UserIcon, Search, Zap, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import TrainerModal from '../../components/admin/trainers/TrainerModal';

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/trainers');
      setTrainers(res.data.data || res.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load trainers');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="font-medium text-gray-900">Are you sure you want to delete this trainer?</p>
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
                await api.delete(`/trainers/${id}`);
                toast.success('Trainer deleted successfully');
                fetchTrainers();
              } catch (error) {
                toast.error('Failed to delete trainer');
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
    setSelectedTrainer(null);
    setIsModalOpen(true);
  };

  const openEditModal = (trainer) => {
    setSelectedTrainer(trainer);
    setIsModalOpen(true);
  };

  const filteredTrainers = trainers.filter(t =>
    t.name?.toLowerCase().includes(search.toLowerCase()) ||
    t.designation?.toLowerCase().includes(search.toLowerCase()) ||
    t.biography?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Trainer Management</h1>
          <p className="text-gray-500 mt-1">Manage your dojo's instructors, senseis, and coaches.</p>
        </div>

        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search trainers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="shrink-0 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-orange-500/20"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add Trainer</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
        </div>
      ) : filteredTrainers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No trainers found</h3>
          <p className="text-gray-500 text-sm mb-6">Start adding your team members and instructors here.</p>
          <button onClick={openCreateModal} className="text-orange-500 font-bold hover:text-orange-600 text-sm">
            + Add your first trainer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrainers.map((trainer) => (
            <div key={trainer.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
              {/* Image */}
              <div className="relative h-52 bg-gray-100 overflow-hidden">
                {trainer.image_path ? (
                  <img
                    src={`http://127.0.0.1:8000${trainer.image_path}`}
                    alt={trainer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = '/default-trainer.png'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <UserIcon size={40} />
                  </div>
                )}
                {/* Motivation line overlay */}
                {trainer.motivation_line && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
                    <p className="text-white text-xs italic line-clamp-1">"{trainer.motivation_line}"</p>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                {/* Designation badge */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-orange-500 uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded">
                    {trainer.designation || 'Instructor'}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 line-clamp-1">
                  {trainer.name}
                </h3>
                
                <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
                  {trainer.biography || 'No biography provided.'}
                </p>
                {/* Expertise tags */}
                {trainer.expertise?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(Array.isArray(trainer.expertise)
                      ? trainer.expertise
                      : JSON.parse(trainer.expertise || '[]')
                    ).slice(0, 3).map((exp, i) => (
                      <span key={i} className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        <Zap size={9} /> {exp}
                      </span>
                    ))}
                  </div>
                )}

                {/* Achievements */}
                {trainer.achievements?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {(Array.isArray(trainer.achievements)
                      ? trainer.achievements
                      : JSON.parse(trainer.achievements || '[]')
                    ).slice(0, 2).map((ach, i) => (
                      <span key={i} className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        <Star size={9} /> {ach}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <button
                    onClick={() => openEditModal(trainer)}
                    className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(trainer.id)}
                    className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TrainerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        trainerData={selectedTrainer}
        fetchTrainers={fetchTrainers}
      />
    </div>
  );
};

export default Trainers;
