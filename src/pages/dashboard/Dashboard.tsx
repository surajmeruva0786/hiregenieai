import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Briefcase,
  Users,
  Calendar,
  TrendingUp,
  Plus,
  Upload,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import StatCard from '../../components/dashboard/StatCard';
import { useAuth } from '../../hooks/useAuth';
import { jobService, applicationService } from '../../services/localStorage.service';

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalCandidates: 0,
    interviewsScheduled: 0,
    avgTimeToHire: '0 days'
  });

  useEffect(() => {
    if (currentUser) {
      // Get real stats from localStorage
      const userJobs = jobService.getByRecruiter(currentUser.id);
      const activeJobs = userJobs.filter(job => job.status === 'active');

      // Get all applications for user's jobs
      let totalApplications = 0;
      let interviewCount = 0;

      userJobs.forEach(job => {
        const jobApplications = applicationService.getByJob(job.id);
        totalApplications += jobApplications.length;
        interviewCount += jobApplications.filter(app => app.status === 'interview').length;
      });

      setStats({
        activeJobs: activeJobs.length,
        totalCandidates: totalApplications,
        interviewsScheduled: interviewCount,
        avgTimeToHire: '12 days' // This would need more complex calculation
      });
    }
  }, [currentUser]);

  const statsData = [
    {
      label: 'Active Jobs',
      value: stats.activeJobs.toString(),
      change: '',
      trend: 'neutral' as const,
      icon: Briefcase,
      color: 'blue',
    },
    {
      label: 'Total Applications',
      value: stats.totalCandidates.toString(),
      change: '',
      trend: 'neutral' as const,
      icon: Users,
      color: 'green',
    },
    {
      label: 'Interviews Scheduled',
      value: stats.interviewsScheduled.toString(),
      change: '',
      trend: 'neutral' as const,
      icon: Calendar,
      color: 'purple',
    },
    {
      label: 'Avg. Time to Hire',
      value: stats.avgTimeToHire,
      change: '',
      trend: 'neutral' as const,
      icon: TrendingUp,
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
              <h1 className="text-white">Welcome back, {currentUser?.firstName || 'there'}! 👋</h1>
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
        {statsData.map((stat, index) => (
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

      {/* Get Started Message */}
      {stats.activeJobs === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm"
        >
          <div className="max-w-md mx-auto">
            <Briefcase className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-gray-900 mb-2">Get Started with Your First Job</h2>
            <p className="text-gray-600 mb-6">
              Create your first job posting to start receiving applications from talented candidates
            </p>
            <Link
              to="/dashboard/jobs/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Your First Job
            </Link>
          </div>
        </motion.div>
      )}

      {/* Active Jobs List */}
      {stats.activeJobs > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">Your Active Jobs</h2>
            <Link
              to="/dashboard/jobs"
              className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              View all →
            </Link>
          </div>
          <p className="text-gray-600">
            You have {stats.activeJobs} active job{stats.activeJobs !== 1 ? 's' : ''} with {stats.totalCandidates} total application{stats.totalCandidates !== 1 ? 's' : ''}
          </p>
        </motion.div>
      )}
    </div>
  );
}