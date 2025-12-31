import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Briefcase, FileText, Video, TrendingUp, Target, Clock, Star, Zap } from 'lucide-react';

export default function StudentDashboard() {
  const stats = [
    { label: 'Applications Sent', value: '12', icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { label: 'Interviews', value: '3', icon: Video, color: 'from-purple-500 to-pink-500' },
    { label: 'Profile Views', value: '45', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { label: 'Match Score', value: '85%', icon: Target, color: 'from-orange-500 to-red-500' },
  ];

  const recentApplications = [
    { id: 1, company: 'Tech Corp', position: 'Frontend Developer', status: 'Interview Scheduled', date: '2025-12-23', matchScore: 92 },
    { id: 2, company: 'StartupX', position: 'Full Stack Developer', status: 'Under Review', date: '2025-12-22', matchScore: 88 },
    { id: 3, company: 'Innovation Labs', position: 'React Developer', status: 'Application Sent', date: '2025-12-21', matchScore: 85 },
  ];

  const recommendedJobs = [
    { id: 1, company: 'Design Studio', position: 'Senior Frontend Developer', location: 'Remote', salary: '$120k-$160k', matchScore: 95 },
    { id: 2, company: 'Cloud Solutions', position: 'React Developer', location: 'New York', salary: '$100k-$140k', matchScore: 90 },
    { id: 3, company: 'AI Startup', position: 'Full Stack Engineer', location: 'San Francisco', salary: '$130k-$170k', matchScore: 88 },
  ];

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
            <h1 className="text-white">Welcome back, John! 🚀</h1>
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
        {stats.map((stat, index) => (
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
              <h3 className="text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-900">Recent Applications</h2>
            <Link to="/student/applications" className="text-indigo-600 hover:text-indigo-700">View All →</Link>
          </div>
          <div className="space-y-3">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="flex-1">
                  <h3 className="text-gray-900">{app.position}</h3>
                  <p className="text-gray-600">{app.company}</p>
                  <p className="text-gray-500">{app.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-green-600 mb-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{app.matchScore}%</span>
                    </div>
                    <p className="text-gray-500">Match</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-lg ${
                    app.status === 'Interview Scheduled' ? 'bg-green-100 text-green-700' :
                    app.status === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-gray-900 mb-6">Upcoming Interviews</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-gray-900">AI Interview</p>
                  <p className="text-gray-600">Tech Corp</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-3">
                <Clock className="w-4 h-4" />
                <span>Tomorrow, 10:00 AM</span>
              </div>
              <Link to="/student/interviews/1" className="block w-full py-2 text-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                Join Interview
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Jobs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-gray-900">Recommended for You</h2>
          </div>
          <Link to="/student/jobs" className="text-indigo-600 hover:text-indigo-700">View All →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedJobs.map((job) => (
            <Link key={job.id} to={`/student/jobs/${job.id}`} className="group p-5 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-gray-900 group-hover:text-indigo-600 transition-colors">{job.position}</h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs">{job.matchScore}%</span>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{job.location}</p>
              <p className="text-indigo-600">{job.salary}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
