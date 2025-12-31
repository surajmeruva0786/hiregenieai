import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Plus, Search, Filter, MapPin, DollarSign, Clock, Users, MoreVertical } from 'lucide-react';

export default function JobsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$120k - $160k',
      applicants: 45,
      shortlisted: 8,
      status: 'Active',
      postedDate: '2025-12-20',
      daysOpen: 5,
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'Product',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$130k - $180k',
      applicants: 67,
      shortlisted: 12,
      status: 'Active',
      postedDate: '2025-12-13',
      daysOpen: 12,
    },
    {
      id: 3,
      title: 'UX Designer',
      department: 'Design',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$100k - $140k',
      applicants: 34,
      shortlisted: 6,
      status: 'Active',
      postedDate: '2025-12-22',
      daysOpen: 3,
    },
    {
      id: 4,
      title: 'Backend Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$110k - $150k',
      applicants: 52,
      shortlisted: 9,
      status: 'Active',
      postedDate: '2025-12-17',
      daysOpen: 8,
    },
    {
      id: 5,
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$90k - $120k',
      applicants: 28,
      shortlisted: 4,
      status: 'Draft',
      postedDate: '2025-12-24',
      daysOpen: 1,
    },
    {
      id: 6,
      title: 'Data Scientist',
      department: 'Data',
      location: 'Remote',
      type: 'Full-time',
      salary: '$140k - $190k',
      applicants: 41,
      shortlisted: 7,
      status: 'Active',
      postedDate: '2025-12-15',
      daysOpen: 10,
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Job Postings</h1>
          <p className="text-gray-600">Manage and track all your open positions</p>
        </div>
        <Link
          to="/dashboard/jobs/create"
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Job
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs by title or department..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-gray-900">{job.title}</h2>
                  <span
                    className={`px-2 py-1 rounded-full ${
                      job.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <p className="text-gray-600">{job.department}</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-5 h-5 text-gray-500" />
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
                <Clock className="w-4 h-4" />
                <span>{job.daysOpen} days open</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span>{job.applicants} applicants</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex gap-4 text-gray-600">
                <span>{job.shortlisted} shortlisted</span>
                <span>{job.type}</span>
              </div>
              <Link
                to={`/dashboard/jobs/${job.id}`}
                className="text-indigo-600 hover:text-indigo-700"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No jobs found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
