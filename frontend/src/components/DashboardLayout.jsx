import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({ children, onSearch }) {
  return (
    <div className="min-h-screen bg-dark-900 flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Navbar onSearch={onSearch} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}