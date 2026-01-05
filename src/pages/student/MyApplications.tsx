import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Clock, Building2, MapPin, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { applicationService, jobService } from '../../services/localStorage.service';
import { useAuth } from '../../hooks/useAuth';
import type { Application, Job } from '../../types';

interface ApplicationWithJob extends Application {
  job?: Job;
}

export default function MyApplications() {
  const { currentUser } = useAuth();
  const [filterStatus, setFilterStatus] = useState('all');
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);

  useEffect(() => {
    if (currentUser) {
      // Load applications for current user
      const userApplications = applicationService.getByCandidate(currentUser.id);
      console.log('MyApplications: Loaded applications:', userApplications.length);

      // Enrich applications with job data
      const enrichedApplications = userApplications.map(app => {
        const job = jobService.getById(app.jobId);
        return { ...app, job };
      });

      setApplications(enrichedApplications);
    }
  }, [currentUser]);

  const stats = [
    { label: 'Total Applications', value: applications.length, color: 'from-blue-500 to-cyan-500' },
    { label: 'Pending', value: applications.filter(a => a.status === 'pending').length, color: 'from-purple-500 to-pink-500' },
    { label: 'Reviewing', value: applications.filter(a => a.status === 'reviewing').length, color: 'from-green-500 to-emerald-500' },
    { label: 'Interviews', value: applications.filter(a => a.status === 'interview').length, color: 'from-orange-500 to-red-500' },
  ];

  const filteredApplications = filterStatus === 'all'
    ? applications
    : applications.filter(a => a.status === filterStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'interview':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'reviewing':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'pending':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Application Sent';
      case 'reviewing':
        return 'Under Review';
      case 'interview':
        return 'Interview Scheduled';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Not Selected';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const calculateDaysAgo = (appliedAt: string) => {
    const applied = new Date(appliedAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - applied.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Please sign in to view your applications</p>
      </div>
    );
  }

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
              <h3 className="text-gray-900 mb-1 text-3xl font-bold">{stat.value}</h3>
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
              className={`px-4 py-2 rounded-lg transition-all ${filterStatus === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg transition-all ${filterStatus === 'pending'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilterStatus('reviewing')}
              className={`px-4 py-2 rounded-lg transition-all ${filterStatus === 'reviewing'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              Under Review
            </button>
            <button
              onClick={() => setFilterStatus('interview')}
              className={`px-4 py-2 rounded-lg transition-all ${filterStatus === 'interview'
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
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-gray-600 mb-4">
            {filterStatus === 'all'
              ? "You haven't applied to any jobs yet"
              : `No ${filterStatus} applications found`}
          </p>
          <Link
            to="/student/jobs"
            className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Browse Jobs
          </Link>
        </div>
      ) : (
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
                          {app.job?.title || 'Job Title'}
                        </h3>
                      </div>
                      <p className="text-gray-600 mb-2">{app.job?.company || 'Company'}</p>
                      <div className="flex flex-wrap gap-4 text-gray-600 text-sm">
                        {app.job?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {app.job.location}
                          </span>
                        )}
                        {app.job?.salary && <span>{app.job.salary}</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex flex-col gap-4 lg:items-end">
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-lg border ${getStatusColor(app.status)}`}>
                      {getStatusLabel(app.status)}
                    </span>
                  </div>

                  <div className="flex gap-2 text-gray-600 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>Applied {calculateDaysAgo(app.appliedAt)}</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/student/jobs/${app.jobId}`}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      View Job
                    </Link>
                    {app.status === 'interview' && (
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
      )}
    </div>
  );
}
