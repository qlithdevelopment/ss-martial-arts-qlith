import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  IndianRupee,
  Calendar,
  Clock,
  ShieldAlert,
  AlertOctagon,
  X,
} from "lucide-react";
import API from "../../api/axios";
import logo from "../../assets/logo/copressed_logo.png";

const getAlertThemeAndMessage = (daysLeft, isOverdue) => {
  if (isOverdue || daysLeft <= 3) {
    return {
      card: "bg-red-700 border-red-500 text-white shadow-lg shadow-red-950/30",
      accentText: "text-red-200",
      iconWrapper: "bg-red-800 text-white border border-red-400/40",
      badge: "bg-white text-red-700 font-extrabold",
      daysBadge: "bg-white text-red-700 border border-red-200 shadow-sm",
      pulseColor: "bg-red-600",
      badgeText: isOverdue
        ? "Service Interruption Imminent"
        : "Critical Warning",
      warningBar: "bg-red-800/80 border-red-500/50 text-red-100",
      warningNotice:
        "Please pay your bill immediately to ensure uninterrupted service. Failure to clear dues will result in the suspension of your website and software access.",
    };
  }

  // ORANGE: 4 to 5 days remaining
  if (daysLeft <= 5) {
    return {
      card: "bg-orange-600 border-orange-400 text-white shadow-lg shadow-orange-950/30",
      accentText: "text-orange-200",
      iconWrapper: "bg-orange-700 text-white border border-orange-300/40",
      badge: "bg-white text-orange-700 font-extrabold",
      daysBadge: "bg-white text-orange-700 border border-orange-200 shadow-sm",
      pulseColor: "bg-orange-500",
      badgeText: "Due Soon",
      warningBar: "bg-orange-700/80 border-orange-400/50 text-orange-100",
      warningNotice:
        "Please pay your renewal bill to maintain uninterrupted services and prevent any downtime or system outages.",
    };
  }

  // BLUE: 6 to 10 days remaining
  return {
    card: "bg-blue-700 border-blue-500 text-white shadow-lg shadow-blue-950/30",
    accentText: "text-blue-200",
    iconWrapper: "bg-blue-800 text-white border border-blue-400/40",
    badge: "bg-white text-blue-700 font-extrabold",
    daysBadge: "bg-white text-blue-700 border border-blue-200 shadow-sm",
    pulseColor: "bg-blue-600",
    badgeText: "Upcoming Renewal",
    warningBar: "bg-blue-800/80 border-blue-500/50 text-blue-100",
    warningNotice:
      "Pay your upcoming maintenance bill in advance to ensure smooth, uninterrupted software and website operations.",
  };
};

const MaintenanceAlertBanner = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissedAlertIds, setDismissedAlertIds] = useState([]);

  useEffect(() => {
    const fetchMaintenanceAlerts = async () => {
      try {
        const response = await API.get("/maintenance-check");
        if (response.data?.success && Array.isArray(response.data?.data)) {
          setAlerts(response.data.data);
        }
      } catch (err) {
        console.error("Failed to check maintenance alert:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceAlerts();
  }, []);

  const handleDismiss = (id) => {
    setDismissedAlertIds((prev) => [...prev, id]);
  };

  if (loading || alerts.length === 0) {
    return null;
  }

  // Check if any payment is overdue by 10 days or more (days_left <= -10)
  // Lockout screen cannot be dismissed by design
  const lockedOutAlert = alerts.find(
    (alert) =>
      (alert.is_overdue || alert.days_left < 0) &&
      Math.abs(alert.days_left) >= 10,
  );

  // 1. FULL PAGE LOCKOUT MODAL (Overdue by 10+ days)
  if (lockedOutAlert) {
    const overdueDays = Math.abs(lockedOutAlert.days_left);

    return (
      <div className="fixed inset-0 z-99999 bg-white flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none">
        <div className="w-full max-w-xl bg-white border border-gray-200/90 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shadow-sm">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <div className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-1 shadow-md">
                <AlertOctagon size={13} />
              </div>
            </div>

            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200/60 mb-2">
                <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                <span className="text-[11px] font-black uppercase tracking-wider text-red-700">
                  Access Suspended • {overdueDays} Days Past Due
                </span>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Admin Portal Locked
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                Access has been automatically suspended due to an unsettled
                maintenance account. Continued non-payment may lead to the
                permanent removal or takedown of your website from the domain.
              </p>
            </div>
          </div>

          {/* Financial & Invoice Breakdown */}
          <div className="mt-8 bg-gray-50/80 border border-gray-200/80 rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-gray-200/70 text-xs">
              <span className="text-gray-500 font-semibold">
                Service Description
              </span>
              <span className="font-bold text-gray-900">
                {lockedOutAlert.title}
              </span>
            </div>

            <div className="flex items-center justify-between py-3.5 border-b border-gray-200/70 text-xs">
              <span className="text-gray-500 font-semibold">
                Billing Status
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-100 text-red-700 uppercase">
                Overdue ({overdueDays} Days)
              </span>
            </div>

            <div className="flex items-center justify-between pt-3.5">
              <div>
                <span className="text-xs text-gray-500 font-bold block uppercase tracking-wider">
                  Total Outstanding
                </span>
                <span className="text-[11px] text-gray-400">
                  Includes all maintenance dues
                </span>
              </div>
              <div className="flex items-center text-2xl font-black text-red-600">
                <IndianRupee size={22} className="stroke-[2.5]" />
                <span>
                  {parseFloat(lockedOutAlert.amount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Resolution Steps Callout */}
          <div className="mt-5 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-md bg-amber-100 text-amber-700 mt-0.5 shrink-0">
                <ShieldAlert size={16} />
              </div>
              <div className="text-xs text-gray-700 space-y-1">
                <p className="font-bold text-gray-900">
                  How to restore dashboard access:
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Please settle the invoice directly with your web developer or
                  software provider. Access will automatically unlock as soon as
                  payment is confirmed.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Meta Note */}
          <p className="text-center text-[11px] text-gray-400 font-medium mt-6">
            Reference ID: #{lockedOutAlert.id} • Automated System Protection
          </p>
        </div>
      </div>
    );
  }

  // Filter out any alert that was dismissed in the current session
  const visibleAlerts = alerts.filter(
    (alert) => !dismissedAlertIds.includes(alert.id),
  );

  if (visibleAlerts.length === 0) {
    return null;
  }

  // 2. STANDARD COLOR BANNER (For alerts due in ≤10 days or overdue <10 days)
  return (
    <div className="space-y-4 mb-6">
      {visibleAlerts.map((alert) => {
        const isOverdue = alert.is_overdue || alert.days_left < 0;
        const daysLeft = Math.abs(alert.days_left);
        const {
          card,
          accentText,
          iconWrapper,
          badge,
          daysBadge,
          pulseColor,
          badgeText,
          warningBar,
          warningNotice,
        } = getAlertThemeAndMessage(alert.days_left, isOverdue);

        return (
          <div className="p-3">
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all relative  ${card}`}
            >
              {/* Close / Dismiss Cross Button */}
              <button
                type="button"
                onClick={() => handleDismiss(alert.id)}
                className="absolute top-3.5 right-3.5 p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                aria-label="Dismiss alert"
                title="Hide for now"
              >
                <X size={18} />
              </button>

              {/* Top row: Icon, Details, and Amount */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-7 sm:pr-8">
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 ${iconWrapper}`}>
                    <AlertTriangle size={24} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-base text-white tracking-wide">
                        {alert.title}
                      </h4>
                      <span
                        className={`text-[10px] uppercase px-2 py-0.5 rounded-md ${badge}`}
                      >
                        {badgeText}
                      </span>
                    </div>

                    {/* Highlighted Info Row */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-white/90 mt-2">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide ${daysBadge}`}
                      >
                        <span className="relative flex h-2 w-2">
                          <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pulseColor}`}
                          />
                          <span
                            className={`relative inline-flex rounded-full h-2 w-2 ${pulseColor}`}
                          />
                        </span>
                        <Clock size={13} className="shrink-0" />
                        <span>
                          {isOverdue
                            ? `OVERDUE BY ${daysLeft} DAY${daysLeft === 1 ? "" : "S"}`
                            : daysLeft === 0
                              ? "DUE TODAY"
                              : `${daysLeft} DAY${daysLeft === 1 ? "" : "S"} LEFT`}
                        </span>
                      </div>

                      <span className="opacity-60">•</span>

                      <span className="flex items-center gap-1 font-medium">
                        <Calendar size={13} />
                        Due:{" "}
                        {new Date(alert.due_date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount Display */}
                <div className="text-left sm:text-right shrink-0 pt-3 sm:pt-0 border-t sm:border-0 border-white/20">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-white/80 block">
                    Amount Due
                  </span>
                  <div className="flex items-center sm:justify-end gap-0.5 text-2xl font-black text-white">
                    <IndianRupee size={20} />
                    <span>
                      {parseFloat(alert.amount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Warning Notice Bar */}
              <div
                className={`mt-4 p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold leading-relaxed ${warningBar}`}
              >
                <ShieldAlert size={16} className={`shrink-0 ${accentText}`} />
                <span>{warningNotice}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MaintenanceAlertBanner;
