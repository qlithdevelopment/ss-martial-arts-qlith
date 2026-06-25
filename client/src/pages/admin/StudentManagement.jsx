import React, { useState } from 'react';
import Students from './Students';
import Batches from './Batches';

const StudentManagement = () => {
  const [activeTab, setActiveTab] = useState('batches');

  return (
    <div className="">
      <div className="flex border-b border-gray-200 w-full mb-6">
          <button 
            onClick={() => setActiveTab('students')}
            className={`pb-4 px-8 text-sm font-bold transition-all border-b-2 ${activeTab === 'students' ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Students
          </button>
          <button 
            onClick={() => setActiveTab('batches')}
            className={`pb-4 px-8 text-sm font-bold transition-all border-b-2 ${activeTab === 'batches' ? 'border-[#f97316] text-[#f97316]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Batches
          </button>
        </div>

      <div className="animate-fadeIn">
        {activeTab === 'students' ? <Students /> : <Batches />}
      </div>
    </div>
  );
};

export default StudentManagement;
