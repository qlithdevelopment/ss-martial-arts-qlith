import { Link } from "react-router-dom";
import AdminPageHeader from "../../components/admin/AdminPageHeader";

const Dashboard = () => {
  return (
    <div className="w-full max-w-6xl mx-auto pb-10 pt-0 px-4 md:px-8">
      
      {/* STYLED HEADING */}
      <div className="mb-8">
        <AdminPageHeader 
          subtitle="Welcome Admin" 
          titlePart1="ADMIN" 
          titlePart2="DASHBOARD" 
        />
      </div>

      {/* NAVIGATION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Galleries Card */}
        <Link 
          to="/admin/galleries" 
          className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-start border border-gray-100 group"
        >
          <div className="h-12 w-12 bg-orange-100 text-[var(--color-primary2)] rounded-full flex items-center justify-center mb-6 text-xl font-bold group-hover:scale-110 transition-transform">
            📸
          </div>
          <h3 className="text-2xl font-black text-black mb-3 tracking-tight">View Galleries</h3>
          <p className="text-gray-500 font-medium">Manage and upload all photo galleries and tournament pictures.</p>
        </Link>
        
        {/* Events Card */}
        <Link 
          to="/admin/events" 
          className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-start border border-gray-100 group"
        >
          <div className="h-12 w-12 bg-blue-100 text-[var(--color-primary)] rounded-full flex items-center justify-center mb-6 text-xl font-bold group-hover:scale-110 transition-transform">
            📅
          </div>
          <h3 className="text-2xl font-black text-black mb-3 tracking-tight">View Events</h3>
          <p className="text-gray-500 font-medium">Manage upcoming belt tests, training seminars, and announcements.</p>
        </Link>

      </div>

    </div>
  );
};

export default Dashboard;