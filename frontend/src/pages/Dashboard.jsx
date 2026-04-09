import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import TodoItem from "../components/TodoItem";
import { getTodos, deleteTodo, updateTodo, markAllCompleted } from "../services/todoService";
import {
  CheckCircle2, ListTodo, AlertCircle, ChevronLeft,
  ChevronRight, CheckCheck, Filter, RefreshCw
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
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [stats, setStats] = useState({ total: 0, completed: 0, overdue: 0 });

  const fetchTodos = useCallback(async (page = 1, searchVal = search, filterVal = filter) => {
    setLoading(true);
    try {
      const { data } = await getTodos({ page, limit: 8, search: searchVal, filter: filterVal });
      setTodos(data.todos);
      setPagination(data.pagination);

      // Compute overdue from current page (ideally a separate stats endpoint)
      const overdue = data.todos.filter(
        (t) => t.dueDate && !t.isCompleted && new Date(t.dueDate) < new Date()
      ).length;

      setStats({
        total: data.pagination.total,
        completed: data.todos.filter((t) => t.isCompleted).length,
        overdue,
      });
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => {
    fetchTodos(1, search, filter);
  }, [search, filter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTodo(id);
      toast.success("Task deleted");
      fetchTodos(pagination.page);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggle = async (id, isCompleted) => {
    try {
      await updateTodo(id, { isCompleted });
      setTodos((prev) => prev.map((t) => (t._id === id ? { ...t, isCompleted } : t)));
      toast.success(isCompleted ? "Marked complete!" : "Marked incomplete");
    } catch {
      toast.error("Update failed");
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllCompleted();
      toast.success("All tasks completed!");
      fetchTodos(pagination.page);
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
          <StatCard icon={ListTodo} label="Total (all pages)" value={stats.total}
  iconColor="bg-violet-500/30" gradient="bg-violet-500" />

<StatCard icon={CheckCircle2} label="Completed (this page)" value={stats.completed}
  iconColor="bg-emerald-500/30" gradient="bg-emerald-500" />

<StatCard icon={AlertCircle} label="Overdue (this page)" value={stats.overdue}
  iconColor="bg-red-500/30" gradient="bg-red-500" />
        </div>

        {/* Filters + Task list */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">All Tasks</h2>
            <div className="flex items-center gap-2">
              <Filter size={13} className="text-gray-500" />
              {["", "pending", "completed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    filter === f
                      ? "bg-violet-600 text-white"
                      : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                  }`}
                >
                  {f === "" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
              <button onClick={() => fetchTodos(pagination.page)} className="text-gray-500 hover:text-white transition-colors cursor-pointer ml-1">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Task list */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                <ListTodo size={24} className="text-gray-600" />
              </div>
              <p className="text-gray-500 text-sm">No tasks found</p>
              <button onClick={() => navigate("/todos/add")} className="btn-primary mt-4 mx-auto">
                Add your first task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <TodoItem
                  key={todo._id}
                  todo={todo}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
              <p className="text-xs text-gray-500">
                Page {pagination.page} of {pagination.totalPages} · {pagination.total} tasks
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchTodos(pagination.page - 1)}
                  className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchTodos(pagination.page + 1)}
                  className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}