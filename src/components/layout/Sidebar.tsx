import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Video,
  Brain,
  Workflow,
  BarChart3,
  CreditCard,
  Settings,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/dashboard/jobs', icon: Briefcase, label: 'Jobs' },
  { to: '/dashboard/candidates', icon: Users, label: 'Candidates' },
  { to: '/dashboard/interviews', icon: Video, label: 'Interviews' },
  { to: '/dashboard/ai-insights', icon: Brain, label: 'AI Insights' },
  { to: '/dashboard/workflows', icon: Workflow, label: 'Workflows' },
  { to: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/dashboard/billing', icon: CreditCard, label: 'Billing' },
  { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900">HireGenie AI</h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg p-4 text-white">
          <p className="mb-2">Upgrade to Pro</p>
          <p className="mb-3 opacity-90">Unlock unlimited AI interviews and advanced analytics</p>
          <button className="w-full bg-white text-indigo-600 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </div>
  );
}
