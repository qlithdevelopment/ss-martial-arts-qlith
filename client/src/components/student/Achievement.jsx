import React, { useState } from 'react';
import { Award } from 'lucide-react';
import { Card, BASE_URL } from './Common';
import ViewAchievementModal from '../ViewAchievementModal';

function CertsTab({ certs, loading, error }) {
    const [viewingCert, setViewingCert] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    const handleOpen = (cert, fileUrls) => {
        setViewingCert({ ...cert, certificated: fileUrls });
        setIsViewOpen(true);
    };

    const handleClose = () => {
        setIsViewOpen(false);
        setViewingCert(null);
    };

    function CertsSkeleton() {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
                        <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800" />
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-2/3" />
                            <div className="h-7 w-14 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (loading) {
        return <CertsSkeleton />;
    }

    if (error) {
        return (
            <Card className="p-8 text-center">
                <p className="text-red-500 text-sm font-semibold">{error}</p>
            </Card>
        );
    }

    if (!certs || certs.length === 0) {
        return (
            <Card className="p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-3">
                    <Award size={22} className="text-indigo-400" />
                </div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No certificates available</p>
                <p className="text-xs text-slate-400 mt-1">You haven't been awarded any certificates yet.</p>
            </Card>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map(cert => {
                const fileUrls = Array.isArray(cert.certificated)
                    ? cert.certificated.map(f =>
                        typeof f === 'string' && !f.startsWith('http')
                            ? `${BASE_URL}${f.startsWith('/') ? '' : '/'}${f}`
                            : f
                    )
                    : cert.file_url
                        ? [cert.file_url]
                        : [];

                const thumbUrl = fileUrls[0] || null;

                return (
                    <div key={cert.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm group">
                        <div className="aspect-[4/3] bg-slate-50 dark:bg-slate-800 relative flex justify-center items-center overflow-hidden">
                            {thumbUrl ? (
                                thumbUrl.toLowerCase().endsWith('.pdf') ? (
                                    <div
                                        className="w-full h-full flex flex-col gap-2 items-center justify-center bg-slate-200 dark:bg-slate-700 group-hover:scale-105 transition-transform cursor-pointer"
                                        onClick={() => handleOpen(cert, fileUrls)}
                                    >
                                        <Award size={24} className="text-red-500" />
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">PDF</span>
                                    </div>
                                ) : (
                                    <img
                                        src={thumbUrl}
                                        alt={cert.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform cursor-pointer"
                                        onClick={() => handleOpen(cert, fileUrls)}
                                    />
                                )
                            ) : (
                                <Award size={32} className="text-slate-300 dark:text-slate-700" />
                            )}
                        </div>
                        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate pr-2" title={cert.title}>{cert.title}</p>
                            {thumbUrl && (
                                <button
                                    onClick={() => handleOpen(cert, fileUrls)}
                                    className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors shrink-0"
                                >
                                    View
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}

            <ViewAchievementModal
                isOpen={isViewOpen}
                onClose={handleClose}
                certificate={viewingCert}
            />
        </div>
    );
}

export default CertsTab;