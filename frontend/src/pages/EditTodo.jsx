import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { getTodoById, updateTodo } from "../services/todoService";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function EditTodo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    title: "", description: "", dueDate: "", priority: "medium", isCompleted: false,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const { data } = await getTodoById(id);
        setForm({
          title: data.title,
          description: data.description || "",
          dueDate: data.dueDate ? data.dueDate.split("T")[0] : "",
          priority: data.priority,
          isCompleted: data.isCompleted,
        });
      } catch {
        toast.error("Failed to load task");
        navigate("/dashboard");
      } finally {
        setFetching(false);
      }
    };
    fetchTodo();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required"); return; }
    setError("");
    setLoading(true);
    try {
      await updateTodo(id, form);
      toast.success("Task updated!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-6 cursor-pointer">
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="card">
          <div className="mb-6">
            <h1 className="text-lg font-bold text-white">Edit Task</h1>
            <p className="text-sm text-gray-500 mt-1">Update the task details below.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Task Title *</label>
              <input type="text" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={`input-field ${error ? "border-red-500/50" : ""}`}
                placeholder="Task title..." />
              {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Description</label>
              <textarea rows={4} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field resize-none" placeholder="Description..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Due Date</label>
                <input type="date" value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="input-field" style={{ colorScheme: "dark" }} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Priority</label>
                <select value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="input-field" style={{ colorScheme: "dark" }}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            {/* Completed toggle */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setForm({ ...form, isCompleted: !form.isCompleted })}
                className={`w-10 h-5 rounded-full transition-colors relative ${form.isCompleted ? "bg-violet-600" : "bg-white/10"}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${form.isCompleted ? "translate-x-5" : ""}`} />
              </div>
              <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                Mark as completed
              </span>
            </label>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate("/dashboard")}
                className="flex-1 btn-ghost justify-center py-2.5 text-sm rounded-xl">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 btn-primary justify-center py-2.5 text-sm rounded-xl disabled:opacity-50">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <><Save size={15} /> Save Changes</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}