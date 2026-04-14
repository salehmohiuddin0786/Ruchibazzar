"use client";
import SuperSidebar from "../components/SuperSidebar";
import SuperHeader from "../components/SuperHeader";

const SuperLayout = ({ children }) => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <SuperSidebar />
      <div className="flex-1 flex flex-col">
        <SuperHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperLayout;