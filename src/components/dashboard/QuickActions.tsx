import { Link } from 'react-router-dom';
import { Plus, Upload, Video, Brain, FileText, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function QuickActions() {
  const actions = [
    {
      to: '/dashboard/jobs/create',
      icon: Plus,
      label: 'Create New Job',
      description: 'Post a new position',
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      to: '/dashboard/candidates/upload',
      icon: Upload,
      label: 'Upload Resumes',
      description: 'Bulk import candidates',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      to: '/dashboard/interviews',
      icon: Video,
      label: 'Start AI Interview',
      description: 'Begin screening process',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      to: '/dashboard/ai-insights',
      icon: Brain,
      label: 'View AI Insights',
      description: 'Get recommendations',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      to: '/dashboard/analytics',
      icon: FileText,
      label: 'View Reports',
      description: 'Check hiring metrics',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      to: '/dashboard/candidates',
      icon: Users,
      label: 'Review Candidates',
      description: 'Screen applications',
      gradient: 'from-pink-500 to-rose-600',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
      <h2 className="text-gray-900 mb-6">Quick Actions</h2>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to={action.to}
              className="group relative overflow-hidden flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-transparent hover:shadow-lg transition-all duration-300"
            >
              {/* Animated gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              {/* Glow effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`}></div>

              <div className={`relative z-10 p-2 bg-gradient-to-r ${action.gradient} rounded-lg shadow-lg transform group-hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white flex-shrink-0" />
              </div>
              
              <div className="relative z-10 flex-1 min-w-0">
                <p className="text-gray-900 group-hover:text-white transition-colors">{action.label}</p>
                <p className="text-gray-600 group-hover:text-white/80 transition-colors">{action.description}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}