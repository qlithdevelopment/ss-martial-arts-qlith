import React from "react";
import { X, Link as LinkIcon, Calendar, Clock, Edit2, ExternalLink } from "lucide-react";

const formatDate = (d) =>
    d
        ? new Date(d).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "N/A";

const formatDateTime = (d) =>
    d
        ? new Date(d).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "N/A";

const getHostname = (url) => {
    try {
        return new URL(url).hostname.replace(/^www\./, "");
    } catch {
        return url;
    }
};

const ViewNewsModal = ({ isOpen, onClose, news, onEdit }) => {
    if (!isOpen || !news) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                            <LinkIcon size={18} />
                        </div>
                        <div className="min-w-0">
                            <h2 className="text-sm font-black text-gray-900 tracking-tight truncate">
                                {getHostname(news.url)}
                            </h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                News #{news.id}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 transition-colors shrink-0"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-3">
                    {/* URL */}
                    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                        <LinkIcon size={16} className="text-gray-400 shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                                URL
                            </p>
                            <a
                                href={news.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 break-all inline-flex items-start gap-1"
                            >
                                <span>{news.url}</span>
                                <ExternalLink size={12} className="shrink-0 mt-0.5" />
                            </a>
                        </div>
                    </div>

                    {/* Published Date */}
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                        <Calendar size={16} className="text-gray-400 shrink-0" />
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Published Date
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                                {formatDate(news.published_date)}
                            </p>
                        </div>
                    </div>

                    {/* Created / Updated */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                            <Clock size={16} className="text-gray-400 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Created
                                </p>
                                <p className="text-xs font-semibold text-gray-900">
                                    {formatDateTime(news.created_at)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                            <Clock size={16} className="text-gray-400 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    Updated
                                </p>
                                <p className="text-xs font-semibold text-gray-900">
                                    {formatDateTime(news.updated_at)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer actions */}
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => onEdit?.(news)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-colors"
                    >
                        <Edit2 size={14} />
                        Edit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewNewsModal;