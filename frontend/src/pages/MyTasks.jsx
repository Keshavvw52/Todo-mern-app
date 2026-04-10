import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import TaskListSection from "../components/TaskListSection";

export default function MyTasks() {
  const [search, setSearch] = useState("");

  return (
    <DashboardLayout onSearch={setSearch}>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Tasks</h1>
          <p className="text-sm text-gray-500 mt-1">
            View, search, filter, and manage all of your tasks in one place.
          </p>
        </div>

        <TaskListSection title="My Tasks" search={search} />
      </div>
    </DashboardLayout>
  );
}
