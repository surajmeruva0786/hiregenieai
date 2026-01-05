import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, DollarSign, Briefcase, Star, Filter, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import { jobService } from '../../services/localStorage.service';
import type { Job } from '../../types';

export default function JobBoard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);

  // Load all active jobs from localStorage
  useEffect(() => {
    const loadJobs = () => {
      const allJobs = jobService.getAll();
      // Filter to show only active jobs
      const activeJobs = allJobs.filter(job => job.status === 'active');
      console.log('JobBoard: Loaded active jobs:', activeJobs.length);
      setJobs(activeJobs);
    };

    loadJobs();

    // Reload jobs when window gains focus (e.g., after recruiter posts a job)
    const handleFocus = () => loadJobs();
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateDaysAgo = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 14) return '1 week ago';
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Find Your Dream Job</h1>
        <p className="text-gray-600">Browse opportunities matched to your skills</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search job title, company..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>
      </div>

      {/* Job Listings */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <p className="text-gray-600">
            {searchTerm ? 'No jobs found matching your search' : 'No active jobs available at the moment'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-indigo-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-gray-900 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-lg">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs">New</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-3">{job.company}</p>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bookmark className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>{job.salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span>{job.type.charAt(0).toUpperCase() + job.type.slice(1).replace('-', ' ')}</span>
                </div>
                <p className="text-gray-500">{calculateDaysAgo(job.createdAt)}</p>
              </div>

              <Link
                to={`/student/jobs/${job.id}`}
                className="block w-full py-3 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
              >
                View Details & Apply
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
