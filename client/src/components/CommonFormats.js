export const formatDate = (dateStr, options) => {
  if (!dateStr) return '';
  const date = new Date(String(dateStr).replace(' ', 'T'));
  if (isNaN(date.getTime())) return dateStr; // fallback if parsing fails

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    ...options,
  });
};

export const getBeltColor = (belt) => {
  if (!belt) return { bg: "bg-slate-100", border: "border-slate-200", text: "text-slate-600" };
  const b = belt.toLowerCase();
  if (b.includes("white")) return { bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-700" };
  if (b.includes("yellow")) return { bg: "bg-[#FEF3C7]", border: "border-amber-200", text: "text-[#B45309]" };
  if (b.includes("orange")) return { bg: "bg-[#FFEDD5]", border: "border-orange-200", text: "text-[#C2410C]" };
  if (b.includes("green")) return { bg: "bg-[#D1FAE5]", border: "border-emerald-200", text: "text-[#047857]" };
  if (b.includes("blue")) return { bg: "bg-[#DBEAFE]", border: "border-blue-200", text: "text-[#1D4ED8]" };
  if (b.includes("purple")) return { bg: "bg-[#F3E8FF]", border: "border-purple-200", text: "text-[#7E22CE]" };
  if (b.includes("brown")) return { bg: "bg-[#F5E6D3]", border: "border-stone-200", text: "text-[#5C4033]" };
  if (b.includes("red")) return { bg: "bg-[#FEE2E2]", border: "border-rose-200", text: "text-[#B91C1C]" };
  if (b.includes("black")) return { bg: "bg-[#1E293B]", border: "border-slate-700", text: "text-white" };
  return { bg: "bg-slate-100", border: "border-slate-200", text: "text-slate-600" };
};
