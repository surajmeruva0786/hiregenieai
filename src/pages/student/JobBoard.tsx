import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, DollarSign, Briefcase, Star, Filter, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';

export default function JobBoard() {
  const [searchTerm, setSearchTerm] = useState('');

  const jobs = [
    { id: 1, company: 'Tech Corp', position: 'Senior Frontend Developer', location: 'Remote', salary: '$120k-$160k', type: 'Full-time', matchScore: 95, posted: '2 days ago' },
    { id: 2, company: 'StartupX', position: 'Full Stack Developer', location: 'New York, NY', salary: '$100k-$140k', type: 'Full-time', matchScore: 92, posted: '1 week ago' },
    { id: 3, company: 'Design Studio', position: 'React Developer', location: 'San Francisco', salary: '$110k-$150k', type: 'Full-time', matchScore: 90, posted: '3 days ago' },
    { id: 4, company: 'Cloud Solutions', position: 'Backend Engineer', location: 'Remote', salary: '$115k-$155k', type: 'Full-time', matchScore: 88, posted: '5 days ago' },
    { id: 5, company: 'AI Startup', position: 'Software Engineer', location: 'Austin, TX', salary: '$105k-$145k', type: 'Full-time', matchScore: 87, posted: '1 day ago' },
    { id: 6, company: 'FinTech Inc', position: 'Frontend Engineer', location: 'Remote', salary: '$125k-$165k', type: 'Full-time', matchScore: 85, posted: '4 days ago' },
  ];

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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {jobs.map((job, index) => (
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
                  <h3 className="text-gray-900 group-hover:text-indigo-600 transition-colors">{job.position}</h3>
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-lg">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-xs">{job.matchScore}% Match</span>
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
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span>{job.salary}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="w-4 h-4" />
                <span>{job.type}</span>
              </div>
              <p className="text-gray-500">{job.posted}</p>
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
    </div>
  );
}
