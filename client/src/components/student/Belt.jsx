import { Card } from "./Common.jsx";
import Belts from "../Belts.jsx";

export default function BeltTab({ beltRecords, loading, error }) {
  const BeltsSkeleton = () => (
    <div className="w-[465px] h-[360px] rounded-2xl bg-white dark:bg-slate-900 animate-pulse">
      {Array.from({ length: 11 }).map((_, i) => (
        <div key={i} className="h-6 mb-3 rounded-lg bg-slate-200 dark:bg-slate-700" />
      ))}
    </div>
  );

  if (loading) {
    return (
      <Card className="p-8 text-center flex justify-start items-center">
        <BeltsSkeleton />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-red-500 text-sm font-semibold">{error}</p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 overflow-x-auto gap-6 items-start bg-white rounded-xl">
      <Belts belts={beltRecords} />
    </div>
  );
}