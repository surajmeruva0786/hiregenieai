import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, DollarSign, Clock, Users, Edit, Trash2, Share2, Briefcase } from 'lucide-react';
import { jobService, applicationService } from '../../services/localStorage.service';
import { useAuth } from '../../hooks/useAuth';
import type { Job, Application } from '../../types';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (id) {
      const jobData = jobService.getById(id);
      setJob(jobData || null);

      if (jobData) {
        const jobApps = applicationService.getByJob(id);
        setApplications(jobApps);
      }
    }
  }, [id]);

  if (!job) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading job details...</p>
      </div>
    );
  }

  const calculateDaysOpen = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const stats = {
    applicants: applications.length,
    shortlisted: applications.filter(a => a.status === 'reviewing').length,
    interviewed: applications.filter(a => a.status === 'interview').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'candidates', label: `Candidates (${stats.applicants})` },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/jobs')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-gray-900">{job.title}</h1>
            <span className={`px-3 py-1 rounded-full ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
          </div>
          <p className="text-gray-600">{job.company} • Posted {calculateDaysOpen(job.createdAt)} days ago</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button
            onClick={() => navigate(`/dashboard/jobs/edit/${job.id}`)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-gray-600">Total Applicants</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.applicants}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-gray-600">Under Review</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.shortlisted}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-gray-600">Interviewed</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.interviewed}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-gray-600">Days Open</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{calculateDaysOpen(job.createdAt)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200 px-6">
          <div className="flex gap-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 border-b-2 transition-colors ${activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600 text-sm">Location</p>
                    <p className="text-gray-900">{job.location}</p>
                  </div>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-600 text-sm">Salary Range</p>
                      <p className="text-gray-900">{job.salary}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600 text-sm">Employment Type</p>
                    <p className="text-gray-900">{job.type.charAt(0).toUpperCase() + job.type.slice(1).replace('-', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600 text-sm">Company</p>
                    <p className="text-gray-900">{job.company}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-gray-900 mb-3 font-semibold">Job Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>

              {job.requirements && job.requirements.length > 0 && (
                <div>
                  <h3 className="text-gray-900 mb-3 font-semibold">Requirements</h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-700">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.skills && job.skills.length > 0 && (
                <div>
                  <h3 className="text-gray-900 mb-3 font-semibold">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-gray-900 mb-2">No Applications Yet</h3>
                  <p className="text-gray-600">This job hasn't received any applications yet.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium">
                        All ({stats.applicants})
                      </button>
                      <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        Under Review ({stats.shortlisted})
                      </button>
                      <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        Interviewed ({stats.interviewed})
                      </button>
                    </div>
                  </div>

                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer transition-all"
                    >
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium">Application #{application.id.slice(0, 8)}</p>
                        <p className="text-gray-600 text-sm">Applied {new Date(application.appliedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className={`px-3 py-1 rounded-full text-sm ${application.status === 'interview' ? 'bg-purple-100 text-purple-700' :
                            application.status === 'reviewing' ? 'bg-blue-100 text-blue-700' :
                              application.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                application.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                  'bg-gray-100 text-gray-700'
                          }`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-12 text-gray-600">
              <p>Analytics dashboard coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
