/**
 * DashboardLayout
 * Main layout for authenticated pages with sidebar and header.
 * 
 * Refactored to use subcomponents:
 * - Sidebar for navigation
 * - Header with search and user menu
 * 
 * @module layouts/DashboardLayout
 */

import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

/**
 * DashboardLayout component
 */
const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="app-main">
        {/* Header */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
