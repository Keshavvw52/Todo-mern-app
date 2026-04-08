import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { createTodo } from "../services/todoService";
import { ArrowLeft, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function AddTodo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", dueDate: "", priority: "medium",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required"); return; }
    setError("");
    setLoading(true);
    try {
      await createTodo(form);
      toast.success("Task created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="card">
          <div className="mb-6">
            <h1 className="text-lg font-bold text-white">Create New Task</h1>
            <p className="text-sm text-gray-500 mt-1">Fill in the details below to add a task.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Task Title *</label>
              <input
                type="text"
                placeholder="Enter task title..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={`input-field ${error ? "border-red-500/50" : ""}`}
              />
              {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-medium">Description</label>
              <textarea
                rows={4}
                placeholder="Add a description (optional)..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="input-field resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Due Date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="input-field"
                  style={{ colorScheme: "dark" }}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="input-field"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

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
                    Creating...
                  </span>
                ) : (
                  <><Plus size={15} /> Create Task</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}