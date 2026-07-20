import React, { useState, useEffect } from 'react';
import { Users, CalendarDays, Activity, ArrowRight, UserPlus, Clock, IndianRupee, BookOpen, TrendingUp, FileText, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api/axios';
import { formatDate } from '../../components/CommonFormats';

const BASE_URL = import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    revenueData: [],
    totalStudents: 0,
    totalBatches: 0,
    totalEvents: 0,
    activeEvents: 0,
    pastEvents: 0
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentBatches, setRecentBatches] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);

  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard');
      const data = res.data;

      const statistics = data.statistics || {};
      const revenue = data.revenue || [];
      const students = data.recent_students || [];
      const batches = data.recent_batches || [];
      const blogs = data.recent_blogs || [];
      const events = data.recent_events || [];

      // Map month/amount -> name/revenue for the chart, same shape as before
      const chartData = revenue.map((r) => ({
        name: r.month,
        revenue: r.amount,
      }));
      
      const todayStr = new Date().toISOString().split('T')[0];
      const todayEvts = events.filter((evt) => evt.date === todayStr);
      const upcomingEvts = events
        .filter((evt) => evt.date && evt.date > todayStr)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setStats({
        totalRevenue: statistics.total_income || 0,
        revenueData: chartData,
        totalStudents: statistics.total_students || 0,
        totalBatches: statistics.total_batches || 0,
        totalEvents: statistics.total_events || 0,
        activeEvents: todayEvts.length + upcomingEvts.length,
        pastEvents: events.length - (todayEvts.length + upcomingEvts.length),
      });

      setRecentStudents(students.slice(0, 5));
      setRecentBatches(batches.slice(0, 5));
      setTodayEvents(todayEvts);
      setUpcomingEvents(upcomingEvts);

      // blog cards read `blog.image`; API sends `blog.featured_image` (already a full URL)
      setRecentBlogs(
        blogs.slice(0, 5).map((b) => ({ ...b, image: b.featured_image }))
      );

    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  
  const SkeletonBar = ({ className = '' }) => (
    <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
  );

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 font-medium mt-1">Welcome back! Here is what's happening at your academy today.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="p-2.5 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-colors hidden lg:flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh Dashboard"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            <span className="font-bold text-sm hidden lg:block">Refresh</span>
          </button>
        </div>
      </div>

      {/* TOP ROW: Stats & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-8">

        {/* LEFT 2x2 CARDS — cards always render, only the value text is a skeleton while loading */}
        <div className="lg:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Revenue */}
          <div className="bg-white p-6 xl:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center mb-5">
              <IndianRupee size={24} strokeWidth={2.5} />
            </div>
            <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Total Revenue</p>
            {loading ? (
              <SkeletonBar className="h-9 w-28" />
            ) : (
              <h3 className="text-3xl font-black text-gray-900 leading-none">₹{stats.totalRevenue.toLocaleString()}</h3>
            )}
          </div>

          {/* Students */}
          <div className="bg-white p-6 xl:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center mb-5">
              <Users size={24} strokeWidth={2.5} />
            </div>
            <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Total Students</p>
            {loading ? (
              <SkeletonBar className="h-9 w-16" />
            ) : (
              <h3 className="text-3xl font-black text-gray-900 leading-none">{stats.totalStudents}</h3>
            )}
          </div>

          {/* Batches */}
          <div className="bg-white p-6 xl:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center mb-5">
              <BookOpen size={24} strokeWidth={2.5} />
            </div>
            <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Total Batches</p>
            {loading ? (
              <SkeletonBar className="h-9 w-16" />
            ) : (
              <h3 className="text-3xl font-black text-gray-900 leading-none">{stats.totalBatches}</h3>
            )}
          </div>

          {/* Events */}
          <div className="bg-white p-6 xl:p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center mb-5">
              <CalendarDays size={24} strokeWidth={2.5} />
            </div>
            <p className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Active Events</p>
            {loading ? (
              <SkeletonBar className="h-9 w-12" />
            ) : (
              <h3 className="text-3xl font-black text-gray-900 leading-none">{stats.activeEvents}</h3>
            )}
          </div>

        </div>

        {/* RIGHT CHART */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Last 6 Month Revenue Growth Model</h3>
              <p className="text-xs text-gray-500 font-medium">Dynamic revenue tracking</p>
            </div>
          </div>
          <div className="flex-1 min-h-[200px]">
            {loading ? (
              <div className="w-full h-full flex items-end gap-3 px-2 pb-2">
                {[40, 65, 50, 80, 60, 90].map((h, i) => (
                  <div key={i} className="flex-1 bg-gray-100 rounded-t-lg animate-pulse" style={{ height: `${h}%` }} />
                ))}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dx={-10} tickFormatter={(val) => `₹${val}`} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f97316"
                    strokeWidth={4}
                    dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

        {/* LEFT COLUMN: Recent Students */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#f97316]/10 text-[#f97316] flex items-center justify-center">
                  <UserPlus size={16} strokeWidth={3} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Recent Students</h2>
              </div>
              <button
                onClick={() => navigate('/admin/students')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 uppercase tracking-wider"
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm shrink-0">S</div>
                      <div className="flex flex-col gap-1.5">
                        <SkeletonBar className="h-3.5 w-28" />
                        <SkeletonBar className="h-2.5 w-16" />
                      </div>
                    </div>
                    <SkeletonBar className="h-5 w-12 rounded-md" />
                  </div>
                ))
              ) : (
                <>
                  {recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between group cursor-pointer" onClick={() => navigate('/admin/students')}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm shrink-0">
                          {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-[#f97316] transition-colors">{student.name}</h4>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{student.belt || 'White Belt'}</p>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                        ₹{student.total_fee || '0'}
                      </div>
                    </div>
                  ))}
                  {recentStudents.length === 0 && (
                    <div className="text-center text-gray-400 py-4 font-medium text-sm">
                      No recent students found.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Recent Batches */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center">
                  <BookOpen size={16} strokeWidth={3} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Recent Batches</h2>
              </div>
              <button
                onClick={() => navigate('/admin/students')}
                className="text-xs font-bold text-orange-600 hover:text-orange-800 flex items-center gap-1 uppercase tracking-wider"
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100 shrink-0">
                      <BookOpen size={16} />
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <SkeletonBar className="h-3.5 w-2/3" />
                      <SkeletonBar className="h-2.5 w-1/3" />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {recentBatches.map((batch) => (
                    <div key={batch.id} className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/admin/students')}>
                      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 group-hover:border-orange-200 group-hover:text-orange-500 group-hover:bg-orange-50 transition-colors">
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-orange-600 transition-colors line-clamp-1">{batch.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{batch.timing || 'No Time Set'}</p>
                      </div>
                    </div>
                  ))}
                  {recentBatches.length === 0 && (
                    <div className="text-center text-gray-400 py-4 font-medium text-sm">
                      No recent batches found.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Active Events */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center">
                  <Clock size={16} strokeWidth={3} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Active Events</h2>
              </div>
              <button
                onClick={() => navigate('/admin/events')}
                className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 uppercase tracking-wider"
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            <div className="p-5 md:p-6 flex flex-col gap-5 overflow-y-auto max-h-[300px]">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 shrink-0" />
                    <div className="flex-1 flex flex-col gap-2 pt-1">
                      <SkeletonBar className="h-3.5 w-2/3" />
                      <SkeletonBar className="h-2.5 w-full" />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {todayEvents.length > 0 && (
                    <div>
                      <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Today
                      </h3>
                      <div className="flex flex-col gap-4">
                        {todayEvents.map((evt) => (
                          <div key={evt.id} className="flex gap-4 group cursor-pointer" onClick={() => navigate('/admin/events')}>
                            <div className="w-12 h-12 rounded-xl bg-red-50 flex flex-col items-center justify-center shrink-0 border border-red-100 group-hover:bg-red-100 transition-colors">
                              <span className="text-[9px] font-black uppercase text-red-400">Today</span>
                              <span className="text-xs font-bold text-red-600">
                                {evt.date ? evt.date.substring(5) : '--'}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1 group-hover:text-red-600 transition-colors line-clamp-1">{evt.name}</h4>
                              <p className="text-xs text-gray-500 line-clamp-2">{evt.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {upcomingEvents.length > 0 && (
                    <div className={todayEvents.length > 0 ? "pt-4 border-t border-gray-100" : ""}>
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Upcoming</h3>
                      <div className="flex flex-col gap-4">
                        {upcomingEvents.slice(0, 5).map((evt) => (
                          <div key={evt.id} className="flex gap-4 group cursor-pointer" onClick={() => navigate('/admin/events')}>
                            <div className="w-12 h-12 rounded-xl bg-gray-50 flex flex-col items-center justify-center shrink-0 border border-gray-200 group-hover:border-purple-200 group-hover:bg-purple-50 transition-colors">
                              <span className="text-[9px] font-black uppercase text-gray-400">Date</span>
                              <span className="text-xs font-bold text-gray-900">
                                {evt.date ? evt.date.substring(5) : '--'}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1 group-hover:text-purple-600 transition-colors line-clamp-1">{evt.name}</h4>
                              <p className="text-xs text-gray-500 line-clamp-2">{evt.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {todayEvents.length === 0 && upcomingEvents.length === 0 && (
                    <div className="text-center text-gray-400 py-4 font-medium text-sm">
                      No active or upcoming events.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* FOURTH COLUMN: Recent Blogs */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-5 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center">
                  <FileText size={16} strokeWidth={3} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Recent Blogs</h2>
              </div>
              <button
                onClick={() => navigate('/admin/blogs')}
                className="text-xs font-bold text-pink-600 hover:text-pink-800 flex items-center gap-1 uppercase tracking-wider"
              >
                View All <ArrowRight size={14} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-4">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 shrink-0" />
                    <div className="flex-1 flex flex-col gap-2 pt-1">
                      <SkeletonBar className="h-3.5 w-5/6" />
                      <SkeletonBar className="h-2.5 w-1/4" />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {recentBlogs.map((blog) => (
                    <div key={blog.id} className="flex gap-4 group cursor-pointer" onClick={() => navigate('/admin/blogs')}>
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden group-hover:border-pink-200 transition-colors">
                        {blog.image ? (
                          <img src={blog.image.startsWith('http') ? blog.image : `${BASE_URL}/storage/${blog.image}`} alt={blog.title} className="w-full h-full object-cover" />
                        ) : (
                          <FileText size={20} className="text-gray-400 group-hover:text-pink-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm leading-tight mb-1 group-hover:text-pink-600 transition-colors line-clamp-2">{blog.title}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                          {blog.created_at ?formatDate(new Date(blog.created_at).toLocaleDateString()) : 'Recent'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {recentBlogs.length === 0 && (
                    <div className="text-center text-gray-400 py-4 font-medium text-sm">
                      No blogs published yet.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;