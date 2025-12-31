import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Clock, Building2, MapPin, Eye } from 'lucide-react';
import { motion } from 'motion/react';

export default function MyApplications() {
  const [filterStatus, setFilterStatus] = useState('all');

  const applications = [
    {
      id: 1,
      company: 'Tech Corp',
      position: 'Senior Frontend Developer',
      location: 'Remote',
      salary: '$120k-$160k',
      appliedDate: '2025-12-23',
      status: 'Interview Scheduled',
      matchScore: 95,
      interviewDate: '2025-12-26',
      views: 12,
    },
    {
      id: 2,
      company: 'StartupX',
      position: 'Full Stack Developer',
      location: 'New York, NY',
      salary: '$100k-$140k',
      appliedDate: '2025-12-22',
      status: 'Under Review',
      matchScore: 92,
      views: 8,
    },
    {
      id: 3,
      company: 'Innovation Labs',
      position: 'React Developer',
      location: 'San Francisco',
      salary: '$110k-$150k',
      appliedDate: '2025-12-21',
      status: 'Application Sent',
      matchScore: 90,
      views: 5,
    },
    {
      id: 4,
      company: 'Design Studio',
      position: 'Frontend Engineer',
      location: 'Remote',
      salary: '$105k-$145k',
      appliedDate: '2025-12-20',
      status: 'Under Review',
      matchScore: 88,
      views: 15,
    },
    {
      id: 5,
      company: 'Cloud Solutions',
      position: 'Software Engineer',
      location: 'Austin, TX',
      salary: '$115k-$155k',
      appliedDate: '2025-12-18',
      status: 'Not Selected',
      matchScore: 85,
      views: 20,
    },
  ];

  const stats = [
    { label: 'Total Applications', value: applications.length, color: 'from-blue-500 to-cyan-500' },
    { label: 'Under Review', value: applications.filter(a => a.status === 'Under Review').length, color: 'from-purple-500 to-pink-500' },
    { label: 'Interviews', value: applications.filter(a => a.status === 'Interview Scheduled').length, color: 'from-green-500 to-emerald-500' },
    { label: 'Avg Match Score', value: Math.round(applications.reduce((acc, a) => acc + a.matchScore, 0) / applications.length) + '%', color: 'from-orange-500 to-red-500' },
  ];

  const filteredApplications = filterStatus === 'all' 
    ? applications 
    : applications.filter(a => a.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Interview Scheduled':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Under Review':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Application Sent':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Not Selected':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-600">Track the status of your job applications</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <h3 className="text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setFilterStatus('Under Review')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === 'Under Review'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Under Review
            </button>
            <button
              onClick={() => setFilterStatus('Interview Scheduled')}
              className={`px-4 py-2 rounded-lg transition-all ${
                filterStatus === 'Interview Scheduled'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Interviews
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-indigo-300 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              {/* Company Info */}
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {app.position}
                      </h3>
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs">{app.matchScore}%</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{app.company}</p>
                    <div className="flex flex-wrap gap-4 text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {app.location}
                      </span>
                      <span>{app.salary}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex flex-col gap-4 lg:items-end">
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-2 rounded-lg border ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                    <Eye className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-600">{app.views}</span>
                  </div>
                </div>

                <div className="flex gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                </div>

                {app.interviewDate && (
                  <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700">
                      Interview: {new Date(app.interviewDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Link
                    to={`/student/jobs/${app.id}`}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Job
                  </Link>
                  {app.status === 'Interview Scheduled' && (
                    <Link
                      to={`/student/interviews/${app.id}`}
                      className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      Join Interview
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-gray-600 mb-4">No applications found</p>
          <Link
            to="/student/jobs"
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Browse Jobs
          </Link>
        </div>
      )}
    </div>
  );
}
