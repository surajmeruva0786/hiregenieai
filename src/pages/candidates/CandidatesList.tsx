import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Upload, Download, Star } from 'lucide-react';

export default function CandidatesList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const candidates = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      position: 'Senior Frontend Developer',
      score: 92,
      status: 'Shortlisted',
      experience: '6 years',
      location: 'San Francisco, CA',
      appliedDate: '2025-12-22',
      skills: ['React', 'TypeScript', 'Node.js'],
      avatar: 'SJ',
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      phone: '+1 (555) 234-5678',
      position: 'Senior Frontend Developer',
      score: 87,
      status: 'Interview Scheduled',
      experience: '5 years',
      location: 'Remote',
      appliedDate: '2025-12-21',
      skills: ['React', 'JavaScript', 'CSS'],
      avatar: 'MC',
    },
    {
      id: 3,
      name: 'Emma Wilson',
      email: 'emma.w@email.com',
      phone: '+1 (555) 345-6789',
      position: 'UX Designer',
      score: 85,
      status: 'Shortlisted',
      experience: '4 years',
      location: 'New York, NY',
      appliedDate: '2025-12-23',
      skills: ['Figma', 'UI Design', 'Prototyping'],
      avatar: 'EW',
    },
    {
      id: 4,
      name: 'James Martinez',
      email: 'james.m@email.com',
      phone: '+1 (555) 456-7890',
      position: 'Backend Engineer',
      score: 79,
      status: 'New',
      experience: '7 years',
      location: 'Austin, TX',
      appliedDate: '2025-12-24',
      skills: ['Python', 'Django', 'PostgreSQL'],
      avatar: 'JM',
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      phone: '+1 (555) 567-8901',
      position: 'Product Manager',
      score: 88,
      status: 'Interview Completed',
      experience: '8 years',
      location: 'Seattle, WA',
      appliedDate: '2025-12-20',
      skills: ['Product Strategy', 'Agile', 'Analytics'],
      avatar: 'LA',
    },
  ];

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Candidates</h1>
          <p className="text-gray-600">Review and manage all candidate applications</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
          <Link
            to="/dashboard/candidates/upload"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Upload className="w-4 h-4" />
            Upload Resumes
          </Link>
        </div>
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
              placeholder="Search by name, position, or skills..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="New">New</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Interview Completed">Interview Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 mb-1">Total Candidates</p>
          <p className="text-gray-900">{candidates.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 mb-1">Shortlisted</p>
          <p className="text-gray-900">
            {candidates.filter((c) => c.status === 'Shortlisted').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 mb-1">Interviewed</p>
          <p className="text-gray-900">
            {candidates.filter((c) => c.status === 'Interview Completed').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 mb-1">Avg. Score</p>
          <p className="text-gray-900">
            {Math.round(candidates.reduce((acc, c) => acc + c.score, 0) / candidates.length)}/100
          </p>
        </div>
      </div>

      {/* Candidates Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Candidate</th>
                <th className="px-6 py-3 text-left text-gray-700">Position</th>
                <th className="px-6 py-3 text-left text-gray-700">Skills</th>
                <th className="px-6 py-3 text-left text-gray-700">AI Score</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-gray-700">Applied</th>
                <th className="px-6 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center flex-shrink-0">
                        {candidate.avatar}
                      </div>
                      <div>
                        <p className="text-gray-900">{candidate.name}</p>
                        <p className="text-gray-600">{candidate.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{candidate.position}</p>
                    <p className="text-gray-600">{candidate.experience}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            candidate.score >= 85
                              ? 'bg-green-500'
                              : candidate.score >= 70
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${candidate.score}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-900">{candidate.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full ${
                        candidate.status === 'Shortlisted'
                          ? 'bg-green-100 text-green-700'
                          : candidate.status === 'Interview Scheduled'
                          ? 'bg-purple-100 text-purple-700'
                          : candidate.status === 'Interview Completed'
                          ? 'bg-blue-100 text-blue-700'
                          : candidate.status === 'New'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(candidate.appliedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`/dashboard/candidates/${candidate.id}`}
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      View Profile →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCandidates.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No candidates found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
