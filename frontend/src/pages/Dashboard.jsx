import { useCallback, useState } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import TaskListSection from "../components/TaskListSection";
import { markAllCompleted } from "../services/todoService";
import {
  CheckCircle2, ListTodo, AlertCircle, CheckCheck
} from "lucide-react";
import toast from "react-hot-toast";

const StatCard = ({ icon: Icon, label, value, gradient, iconColor }) => (
  <div className={`card gradient-card relative overflow-hidden`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-bold text-white mt-1.5">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColor}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <div className={`absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10 ${gradient}`} />
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ total: 0, completed: 0, overdue: 0 });
  const [statsLoading, setStatsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSummaryChange = useCallback((summary) => {
    setStats(summary);
    setStatsLoading(false);
  }, []);

  const handleMarkAll = async () => {
    try {
      await markAllCompleted();
      toast.success("All tasks completed!");
      setStatsLoading(true);
      setRefreshKey((current) => current + 1);
    } catch {
      toast.error("Failed to mark all");
    }
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <DashboardLayout onSearch={setSearch}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Greeting */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {greeting}, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <button
            onClick={handleMarkAll}
            className="btn-ghost text-sm px-4 py-2"
          >
            <CheckCheck size={15} />
            Mark all done
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard icon={ListTodo} label="Total (all pages)" value={statsLoading ? "..." : stats.total}
  iconColor="bg-violet-500/30" gradient="bg-violet-500" />

<StatCard icon={CheckCircle2} label="Completed (this page)" value={statsLoading ? "..." : stats.completed}
  iconColor="bg-emerald-500/30" gradient="bg-emerald-500" />

<StatCard icon={AlertCircle} label="Overdue (this page)" value={statsLoading ? "..." : stats.overdue}
  iconColor="bg-red-500/30" gradient="bg-red-500" />
        </div>

        <TaskListSection
          title="All Tasks"
          search={search}
          onSummaryChange={handleSummaryChange}
          refreshKey={refreshKey}
        />
      </div>
    </DashboardLayout>
  );
}
