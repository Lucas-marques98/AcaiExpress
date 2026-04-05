import React from 'react';
import { Outlet } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f11] flex flex-col transition-colors duration-500">
      <main className="flex-1">
        <Outlet />
      </main>
      {/* You can add a common footer here if needed */}
    </div>
  );
};
