import { NavLink } from "react-router-dom";
import { FaUserAstronaut, FaRocket, FaCogs, FaHome } from "react-icons/fa";
import "../App.css";
import neonHero from "../assets/logo.png"; // change if your image filename is different

const Sidebar = () => {
  return (
    <div className="sidebar-neon min-h-screen w-64 bg-[#1a001f] text-white border-r border-pink-600 p-6 flex flex-col justify-between font-neon shadow-2xl relative z-10">

      {/* Top content */}
      <div className="space-y-8">
        <h1 className="text-3xl text-center font-extrabold text-pink-400 refined-glow pulse-slow">
          Parallel You
        </h1>

        <nav className="space-y-4">
          <SidebarLink to="/dashboard" icon={<FaHome />} text="Dashboard" />
          <SidebarLink to="/create-persona" icon={<FaUserAstronaut />} text="Create Persona" />
          <SidebarLink to="/multiverse" icon={<FaRocket />} text="Multiverse Mode" />
          <SidebarLink to="/settings" icon={<FaCogs />} text="Settings" />
        </nav>
      </div>

      {/* Bottom image */}
      <div className="mt-10">
        <img
          src={neonHero}
          alt="Neon AI"
          className="w-full object-contain opacity-80 hover:opacity-100 transition duration-300 refined-glow pulse-slow"
        />
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, text }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium
      ${isActive
        ? "bg-pink-800 text-white border-l-4 border-pink-400 refined-glow"
        : "hover:bg-pink-700 text-purple-300 hover:text-white"}`
    }
  >
    <span className="text-lg">{icon}</span>
    <span>{text}</span>
  </NavLink>
);

export default Sidebar;
