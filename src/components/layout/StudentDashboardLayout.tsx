import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import TopBar from './TopBar';

interface StudentDashboardLayoutProps {
  onLogout: () => void;
}

export default function StudentDashboardLayout({ onLogout }: StudentDashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar onLogout={onLogout} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
