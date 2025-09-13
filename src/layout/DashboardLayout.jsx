// src/layout/DashboardLayout.jsx
import Sidebar from "../components/sidebar";
import Topbar from "../components/topbar"; // Import your Topbar component
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex bg-gradient-to-br from-[#0d0014] to-[#1a001f] min-h-screen text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar /> {/* <-- Add Topbar here */}
        <div className="flex-1 p-6">
          <Outlet /> {/* This is where child pages like Dashboard render */}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
