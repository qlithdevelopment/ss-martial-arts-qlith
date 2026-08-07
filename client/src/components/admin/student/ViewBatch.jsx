import React, { useState, useEffect } from "react";
import API from "../../../api/axios";
import {
  Undo2,
  Users,
  Calendar,
  IndianRupee,
  FileText,
  Clock,
  Eye,
} from "lucide-react";
import AdminTable from "../reusecomponents/Admintable";
import { getAvatarUrlByName } from "../../student/AvatarPickerModal";
import { useNavigate } from "react-router-dom";

const ViewBatch = ({ batch, onBack }) => {
  const batchId = batch?.id;
  const navigate = useNavigate();

  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!batchId) return;

    const fetchBatch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/batches/${batchId}`);
        const data = res.data?.success ? res.data.data : res.data;
        setBatchData(data);
      } catch (err) {
        console.error("Error fetching batch:", err);
        setError(
          err?.response?.data?.message || "Failed to load batch details.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [batchId]);

  // Table column configuration with custom skeletons
  const columns = [
    {
      header: "Reg No",
      accessor: "reg_no",
      skeleton: () => <div className="h-4 bg-gray-200 rounded w-16"></div>,
      render: (val) => val || "N/A",
    },
    {
      header: "Student Name",
      accessor: "name",
      skeleton: () => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0"></div>
          <div className="space-y-1.5">
            <div className="h-3.5 bg-gray-200 rounded w-28"></div>
            <div className="h-2.5 bg-gray-200 rounded w-36"></div>
          </div>
        </div>
      ),
      render: (val, row) => {
        const avatarImageUrl = row.avatar
          ? getAvatarUrlByName(row.avatar)
          : null;
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#f97316] font-bold shrink-0 overflow-hidden border border-orange-200">
              {avatarImageUrl ? (
                <img
                  src={avatarImageUrl}
                  alt={val}
                  className="w-full h-full object-cover"
                />
              ) : (
                val?.charAt(0) || "S"
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900 leading-tight">{val}</p>
              <p className="text-[11px] text-gray-400">
                {row.email || "No email"}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Mobile Number",
      accessor: "mobile_number",
      skeleton: () => <div className="h-4 bg-gray-200 rounded w-24"></div>,
      render: (val) => val || "N/A",
    },
    {
      header: "Gender",
      accessor: "gender",
      skeleton: () => <div className="h-4 bg-gray-200 rounded w-12"></div>,
      render: (val) => <span className="capitalize">{val || "N/A"}</span>,
    },
    {
      header: "Belt",
      accessor: "belt",
      skeleton: () => <div className="h-5 bg-gray-200 rounded w-16"></div>,
      render: (val) => (
        <span className="px-2 py-0.5 text-[11px] font-semibold bg-gray-100 text-gray-700 rounded">
          {val || "N/A"}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      skeleton: () => <div className="h-5 bg-gray-200 rounded-full w-14"></div>,
      render: (val) => {
        const isActive =
          val === "1" || val === 1 || val === true || val === "active";
        return (
          <span
            className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
              isActive
                ? "bg-emerald-50 text-emerald-600"
                : "bg-rose-50 text-rose-600"
            }`}
          >
            {isActive ? "ACTIVE" : "INACTIVE"}
          </span>
        );
      },
    },
    {
      header: "View",
      accessor: "belt",
      skeleton: () => <div className="h-5 bg-gray-200 rounded w-16"></div>,
      render: (val, row) => (
        <button
          onClick={() => navigate(`/admin/students/${row.id}`)}
          className="px-2 py-1.5 text-xs font-bold text-[#f97316] bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-100 flex items-center gap-1"
          title="View Details"
        >
          <Eye size={16} />
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {/* Header Skeleton Card */}
        <div className="bg-white rounded-xl border border-gray-100 p-3 space-y-2">
          <div className="flex items-center justify-between gap-2 border-b border-gray-50 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gray-200 rounded-lg shrink-0"></div>
              <div className="h-5 bg-gray-200 rounded w-40"></div>
              <div className="h-4 bg-gray-200 rounded-full w-14"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded-md w-24"></div>
          </div>
          <div className="flex items-center gap-2 pt-0.5">
            <div className="h-6 bg-gray-200 rounded w-28"></div>
            <div className="h-6 bg-gray-200 rounded w-28"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded flex-1"></div>
          </div>
        </div>

        {/* AdminTable Skeleton State */}
        <div className="space-y-1.5">
          <div className="h-4 bg-gray-200 rounded w-32 mx-1"></div>
          <AdminTable
            columns={columns}
            data={[]}
            isLoading={true}
            skeletonRows={4}
          />
        </div>
      </div>
    );
  }

  if (error || !batchData) {
    return (
      <div className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 space-y-3">
        <button
          onClick={onBack}
          className="p-1 hover:bg-gray-100 rounded-lg transition-all text-gray-600"
        >
          <Undo2 size={16} />
        </button>
        <p className="text-xs text-rose-500">
          {error || "Failed to load batch details."}
        </p>
      </div>
    );
  }

  const students = batchData.students || [];
  const isBatchActive =
    batchData.status === "active" ||
    batchData.status === 1 ||
    batchData.status === "1";

  return (
    <div className="space-y-3">
      {/* Compact Top Header & Details Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 space-y-2">
        {/* Main Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-50 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-all text-gray-600 border border-gray-200 shrink-0"
              title="Go Back"
            >
              <Undo2 size={15} />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-gray-900">
                {batchData.name}
              </h1>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                  isBatchActive
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : "bg-amber-50 text-amber-600 border border-amber-100"
                }`}
              >
                {batchData.status || "N/A"}
              </span>
              <span className="text-[11px] text-gray-400 font-medium hidden sm:inline">
                (# {batchData.id})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-100 text-[#f97316] font-bold text-xs">
            <Users size={14} />
            <span>{students.length} Enrolled</span>
          </div>
        </div>

        {/* Dense Inline Details Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 pt-0.5">
          {batchData.date && (
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
              <Calendar size={13} className="text-blue-500" />
              <span className="text-[11px]">
                <strong className="font-semibold text-gray-700">Start:</strong>{" "}
                {batchData.date}
              </span>
            </div>
          )}

          {batchData.enddate && (
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
              <Clock size={13} className="text-purple-500" />
              <span className="text-[11px]">
                <strong className="font-semibold text-gray-700">End:</strong>{" "}
                {batchData.enddate}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100">
            <IndianRupee size={13} className="text-emerald-500" />
            <span className="text-[11px]">
              <strong className="font-semibold text-gray-700">Fee:</strong> ₹
              {batchData.total_fee || "0.00"}
            </span>
          </div>

          {batchData.notes && (
            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100 flex-1 min-w-[200px] truncate">
              <FileText size={13} className="text-amber-500 shrink-0" />
              <span className="text-[11px] truncate" title={batchData.notes}>
                <strong className="font-semibold text-gray-700">Notes:</strong>{" "}
                {batchData.notes}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Admin Table Section */}
      <div className="space-y-1.5">
        <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wider px-1">
          Enrolled Students
        </h2>
        <AdminTable
          columns={columns}
          data={students}
          isLoading={loading}
          emptyIcon={<Users size={22} className="text-gray-400" />}
          emptyTitle="No Students Enrolled"
          emptyMessage="No students are currently assigned to this batch."
        />
      </div>
    </div>
  );
};

export default ViewBatch;
