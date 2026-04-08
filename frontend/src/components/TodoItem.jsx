import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, CheckCircle2, Circle, Calendar, Flag } from "lucide-react";
import { formatDistanceToNow } from "../utils/dateUtils";

const priorityConfig = {
  high: { color: "text-red-400", bg: "bg-red-400/10 border-red-400/20", dot: "bg-red-400" },
  medium: { color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/20", dot: "bg-yellow-400" },
  low: { color: "text-green-400", bg: "bg-green-400/10 border-green-400/20", dot: "bg-green-400" },
};

export default function TodoItem({ todo, onDelete, onToggle }) {
  const navigate = useNavigate();
  const p = priorityConfig[todo.priority] || priorityConfig.medium;

  const isOverdue =
    todo.dueDate && !todo.isCompleted && new Date(todo.dueDate) < new Date();

  return (
    <div
      className={`card group transition-all duration-200 hover:border-white/15 hover:-translate-y-0.5 ${
        todo.isCompleted ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(todo._id, !todo.isCompleted)}
          className="mt-0.5 shrink-0 text-gray-500 hover:text-violet-400 transition-colors cursor-pointer"
        >
          {todo.isCompleted ? (
            <CheckCircle2 size={20} className="text-violet-400" />
          ) : (
            <Circle size={20} />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm font-semibold text-white truncate ${
              todo.isCompleted ? "line-through text-gray-500" : ""
            }`}
          >
            {todo.title}
          </h3>
          {todo.description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {todo.description}
            </p>
          )}

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {/* Priority badge */}
            <span
              className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${p.bg} ${p.color}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`} />
              {todo.priority}
            </span>

            {/* Due date */}
            {todo.dueDate && (
              <span
                className={`inline-flex items-center gap-1 text-xs ${
                  isOverdue ? "text-red-400" : "text-gray-500"
                }`}
              >
                <Calendar size={11} />
                {isOverdue ? "Overdue · " : ""}
                {formatDistanceToNow(todo.dueDate)}
              </span>
            )}

            {/* Created */}
            <span className="text-xs text-gray-600">
              {new Date(todo.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => navigate(`/todos/edit/${todo._id}`)}
            className="btn-ghost"
          >
            <Pencil size={12} />
            Edit
          </button>
          <button onClick={() => onDelete(todo._id)} className="btn-danger">
            <Trash2 size={12} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}