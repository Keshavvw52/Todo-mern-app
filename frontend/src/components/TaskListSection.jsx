import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TodoItem from "./TodoItem";
import { deleteTodo, getTodos, updateTodo } from "../services/todoService";
import { ChevronLeft, ChevronRight, Filter, ListTodo, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

const buildSummary = (todos, paginationTotal) => ({
  total: paginationTotal,
  completed: todos.filter((todo) => todo.isCompleted).length,
  overdue: todos.filter(
    (todo) => todo.dueDate && !todo.isCompleted && new Date(todo.dueDate) < new Date()
  ).length,
});

export default function TaskListSection({
  search = "",
  title = "All Tasks",
  className = "",
  onSummaryChange,
  refreshKey = 0,
}) {
  const navigate = useNavigate();
  const [todos, setTodos] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchTodos = useCallback(async (page = 1, searchVal = search, filterVal = filter) => {
    setLoading(true);
    try {
      const { data } = await getTodos({ page, limit: 8, search: searchVal, filter: filterVal });
      setTodos(data.todos);
      setPagination(data.pagination);
      onSummaryChange?.(buildSummary(data.todos, data.pagination.total));
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [filter, onSummaryChange, search]);

  useEffect(() => {
    fetchTodos(1, search, filter);
  }, [fetchTodos, search, filter, refreshKey]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTodo(id);
      toast.success("Task deleted");
      const updatedTodos = todos.filter((todo) => todo._id !== id);
      const nextPage =
        updatedTodos.length === 0 && pagination.page > 1 ? pagination.page - 1 : pagination.page;

      fetchTodos(nextPage, search, filter);
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggle = async (id, isCompleted) => {
    try {
      await updateTodo(id, { isCompleted });
      setTodos((prev) => {
        const updatedTodos = prev.map((todo) =>
          todo._id === id ? { ...todo, isCompleted } : todo
        );
        onSummaryChange?.(buildSummary(updatedTodos, pagination.total));
        return updatedTodos;
      });
      toast.success(isCompleted ? "Marked complete!" : "Marked incomplete");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className={`card ${className}`.trim()}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <div className="flex items-center gap-2">
          <Filter size={13} className="text-gray-500" />
          {["", "pending", "completed"].map((value) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                filter === value
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {value === "" ? "All" : value.charAt(0).toUpperCase() + value.slice(1)}
            </button>
          ))}
          <button
            onClick={() => fetchTodos(pagination.page, search, filter)}
            className="text-gray-500 hover:text-white transition-colors cursor-pointer ml-1"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

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

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
          <p className="text-xs text-gray-500">
            Page {pagination.page} of {pagination.totalPages} · {pagination.total} tasks
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={pagination.page <= 1}
              onClick={() => fetchTodos(pagination.page - 1, search, filter)}
              className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchTodos(pagination.page + 1, search, filter)}
              className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
