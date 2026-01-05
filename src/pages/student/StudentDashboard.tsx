import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Briefcase, FileText, Video, TrendingUp, Target, Zap, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { applicationService, jobService } from '../../services/localStorage.service';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    profileViews: 0,
    matchScore: '0%'
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);

  useEffect(() => {
    if (currentUser) {
      // Get real applications data
      const userApplications = applicationService.getByCandidate(currentUser.id);
      const interviewCount = userApplications.filter(app => app.status === 'interview').length;

      setStats({
        applications: userApplications.length,
        interviews: interviewCount,
        profileViews: 0, // Would need tracking system
        matchScore: '85%' // Would need matching algorithm
      });

      // Get recent applications with job details
      const recent = userApplications.slice(0, 3).map(app => {
        const job = jobService.getById(app.jobId);
        return {
          id: app.id,
          company: job?.company || 'Unknown',
          position: job?.title || 'Unknown Position',
          status: app.status,
          date: new Date(app.appliedAt).toLocaleDateString(),
          matchScore: 85
        };
      });

      setRecentApplications(recent);
    }
  }, [currentUser]);

  const statsData = [
    { label: 'Applications Sent', value: stats.applications.toString(), icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { label: 'Interviews', value: stats.interviews.toString(), icon: Video, color: 'from-purple-500 to-pink-500' },
    { label: 'Profile Views', value: stats.profileViews.toString(), icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { label: 'Match Score', value: stats.matchScore, icon: Target, color: 'from-orange-500 to-red-500' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interview':
        return 'bg-green-100 text-green-700';
      case 'reviewing':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'interview':
        return 'Interview Scheduled';
      case 'reviewing':
        return 'Under Review';
      case 'pending':
        return 'Application Sent';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-8 h-8 text-yellow-300" />
            <h1 className="text-white">Welcome back, {currentUser?.firstName || 'there'}! 🚀</h1>
          </div>
          <p className="text-indigo-100 mb-4">Your next dream job is waiting for you</p>
          <div className="flex gap-3">
            <Link to="/student/jobs" className="px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-gray-100 transition-all">
              Browse Jobs
            </Link>
            <Link to="/student/profile" className="px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/30 transition-all">
              Complete Profile
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl transition-all"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
            <div className="relative">
              <div className={`inline-flex p-3 bg-gradient-to-r ${stat.color} rounded-xl mb-4 shadow-lg transform group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-gray-900 mb-1 text-3xl font-bold">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Applications or Get Started */}
      {recentApplications.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">Recent Applications</h2>
            <Link to="/student/applications" className="text-indigo-600 hover:text-indigo-700">View All →</Link>
          </div>
          <div className="space-y-3">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="flex-1">
                  <h3 className="text-gray-900 font-medium">{app.position}</h3>
                  <p className="text-gray-600">{app.company}</p>
                  <p className="text-gray-500 text-sm">{app.date}</p>
                </div>
                <span className={`px-4 py-1.5 rounded-lg ${getStatusColor(app.status)}`}>
                  {getStatusLabel(app.status)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm"
        >
          <div className="max-w-md mx-auto">
            <Briefcase className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-gray-900 mb-2">Start Your Job Search</h2>
            <p className="text-gray-600 mb-6">
              Browse available jobs and start applying to opportunities that match your skills
            </p>
            <Link
              to="/student/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Browse Jobs
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
