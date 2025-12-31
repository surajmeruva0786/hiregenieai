import { Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Upload,
  Video,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../../components/dashboard/StatCard';
import ActivityFeed from '../../components/dashboard/ActivityFeed';
import QuickActions from '../../components/dashboard/QuickActions';

export default function Dashboard() {
  const stats = [
    {
      label: 'Active Jobs',
      value: '24',
      change: '+3 this week',
      trend: 'up',
      icon: Briefcase,
      color: 'blue',
    },
    {
      label: 'Candidates in Pipeline',
      value: '342',
      change: '+28 this week',
      trend: 'up',
      icon: Users,
      color: 'green',
    },
    {
      label: 'Interviews Scheduled',
      value: '18',
      change: '5 today',
      trend: 'neutral',
      icon: Calendar,
      color: 'purple',
    },
    {
      label: 'Avg. Time to Hire',
      value: '12 days',
      change: '-2 days',
      trend: 'up',
      icon: TrendingUp,
      color: 'orange',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'application',
      title: 'New candidate applied',
      description: 'Sarah Johnson applied for Senior Frontend Developer',
      time: '5 minutes ago',
      icon: Users,
      color: 'blue',
    },
    {
      id: 2,
      type: 'interview',
      title: 'Interview completed',
      description: 'AI interview completed for Michael Chen - Score: 87/100',
      time: '1 hour ago',
      icon: Video,
      color: 'green',
    },
    {
      id: 3,
      type: 'job',
      title: 'Job posting published',
      description: 'Marketing Manager position is now live',
      time: '2 hours ago',
      icon: Briefcase,
      color: 'purple',
    },
    {
      id: 4,
      type: 'shortlist',
      title: 'Candidate shortlisted',
      description: 'Emma Wilson moved to final round for UX Designer',
      time: '3 hours ago',
      icon: CheckCircle2,
      color: 'green',
    },
    {
      id: 5,
      type: 'alert',
      title: 'Attention needed',
      description: '3 candidates waiting for review in Backend Developer role',
      time: '4 hours ago',
      icon: AlertCircle,
      color: 'orange',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-8 h-8 text-yellow-300" />
              <h1 className="text-white">Welcome back, John! 👋</h1>
            </div>
            <p className="text-indigo-100">Here's what's happening with your hiring today</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/dashboard/candidates/upload"
              className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all duration-300"
            >
              <Upload className="w-4 h-4" />
              Upload Resumes
            </Link>
            <Link
              to="/dashboard/jobs/create"
              className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Create Job
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <ActivityFeed activities={recentActivity} />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <QuickActions />
        </motion.div>
      </div>

      {/* Active Jobs Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-gray-900">Active Jobs Performance</h2>
          </div>
          <Link
            to="/dashboard/jobs"
            className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            View all
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
        <div className="space-y-3">
          {[
            {
              title: 'Senior Frontend Developer',
              applicants: 45,
              shortlisted: 8,
              status: 'Active',
              daysOpen: 5,
              trend: 'up',
            },
            {
              title: 'Product Manager',
              applicants: 67,
              shortlisted: 12,
              status: 'Active',
              daysOpen: 12,
              trend: 'up',
            },
            {
              title: 'UX Designer',
              applicants: 34,
              shortlisted: 6,
              status: 'Active',
              daysOpen: 3,
              trend: 'neutral',
            },
            {
              title: 'Backend Engineer',
              applicants: 52,
              shortlisted: 9,
              status: 'Active',
              daysOpen: 8,
              trend: 'up',
            },
          ].map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="group relative overflow-hidden flex items-center justify-between p-5 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-gray-900">{job.title}</h3>
                  {job.trend === 'up' && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">Hot</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-6 text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {job.applicants} applicants
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    {job.shortlisted} shortlisted
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {job.daysOpen} days open
                  </span>
                </div>
              </div>
              <div className="relative flex items-center gap-3">
                <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-lg">
                  {job.status}
                </span>
                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* AI Insights Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h3 className="text-white mb-1">AI-Powered Insights Available</h3>
              <p className="text-indigo-100">
                Your latest batch of candidates has been analyzed. 3 high-potential matches found!
              </p>
            </div>
          </div>
          <Link
            to="/dashboard/ai-insights"
            className="px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
          >
            View Insights
          </Link>
        </div>
      </motion.div>
    </div>
  );
}