import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function Navbar({ onSearch }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="h-16 bg-dark-800/60 backdrop-blur-md border-b border-white/5 flex items-center px-6 gap-4 sticky top-0 z-10">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={query}
          onChange={handleSearch}
          className="w-full bg-dark-600 border border-white/8 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        
       <button
  className="px-3 py-1.5 bg-gray-200 rounded-md hover:bg-gray-300 transition"
  onClick={() => toast("No new notifications")}
>
  🔔
</button>

        
        <button
          onClick={() => navigate("/todos/add")}
          className="btn-primary"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>
    </header>
  );
}