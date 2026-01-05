import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Upload, Download, Briefcase, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { applicationService, jobService } from '../../services/localStorage.service';
import type { Application, Job } from '../../types';

interface CandidateWithJob extends Application {
  job?: Job;
  candidateName?: string;
  candidateEmail?: string;
}

export default function CandidatesList() {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [candidates, setCandidates] = useState<CandidateWithJob[]>([]);

  useEffect(() => {
    if (currentUser) {
      // Get all jobs by this recruiter
      const userJobs = jobService.getByRecruiter(currentUser.id);

      // Get all applications for these jobs
      const allApplications: CandidateWithJob[] = [];
      userJobs.forEach(job => {
        const jobApplications = applicationService.getByJob(job.id);
        jobApplications.forEach(app => {
          allApplications.push({
            ...app,
            job,
          });
        });
      });

      console.log('CandidatesList: Loaded applications:', allApplications.length);
      setCandidates(allApplications);
    }
  }, [currentUser]);

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      (candidate.job?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      searchTerm === '';
    const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: candidates.length,
    shortlisted: candidates.filter(c => c.status === 'reviewing').length,
    interviewed: candidates.filter(c => c.status === 'interview').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Candidates</h1>
          <p className="text-gray-600">Review and manage all candidate applications</p>
        </div>
        <div className="flex gap-3">
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
              placeholder="Search by position..."
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
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="interview">Interview</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 mb-1">Total Applications</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 mb-1">Under Review</p>
          <p className="text-3xl font-bold text-gray-900">{stats.shortlisted}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 mb-1">Interviews</p>
          <p className="text-3xl font-bold text-gray-900">{stats.interviewed}</p>
        </div>
      </div>

      {/* Candidates List */}
      {filteredCandidates.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No Applications Yet</h3>
          <p className="text-gray-600 mb-6">
            {candidates.length === 0
              ? "You haven't received any applications yet. Create a job posting to start receiving applications."
              : 'No candidates match your search criteria'}
          </p>
          {candidates.length === 0 && (
            <Link
              to="/dashboard/jobs/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Job Posting
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700">Position Applied</th>
                  <th className="px-6 py-3 text-left text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-gray-700">Applied Date</th>
                  <th className="px-6 py-3 text-left text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="text-gray-900 font-medium">{candidate.job?.title || 'Unknown Position'}</p>
                      <p className="text-gray-600 text-sm">{candidate.job?.company}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${candidate.status === 'interview'
                            ? 'bg-purple-100 text-purple-700'
                            : candidate.status === 'reviewing'
                              ? 'bg-blue-100 text-blue-700'
                              : candidate.status === 'accepted'
                                ? 'bg-green-100 text-green-700'
                                : candidate.status === 'rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(candidate.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/dashboard/candidates/${candidate.id}`}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        View Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
