import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, MapPin, DollarSign, Clock, Users, Edit, Trash2, Share2 } from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock job data
  const job = {
    id: parseInt(id || '1'),
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$120k - $160k',
    description: 'We are looking for an experienced Frontend Developer to join our growing team. You will be responsible for building scalable web applications using modern technologies.',
    requirements: [
      '5+ years of experience with React and TypeScript',
      'Strong understanding of web performance optimization',
      'Experience with state management (Redux, MobX, or similar)',
      'Excellent problem-solving and communication skills',
      'Experience with CI/CD pipelines',
    ],
    skills: [
      { name: 'React', weight: 9 },
      { name: 'TypeScript', weight: 8 },
      { name: 'JavaScript', weight: 7 },
      { name: 'CSS/SASS', weight: 6 },
      { name: 'Node.js', weight: 5 },
    ],
    applicants: 45,
    shortlisted: 8,
    interviewed: 3,
    rejected: 12,
    status: 'Active',
    postedDate: '2025-12-20',
    daysOpen: 5,
  };

  const candidates = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      score: 92,
      status: 'Shortlisted',
      appliedDate: '2025-12-22',
      avatar: 'SJ',
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.c@email.com',
      score: 87,
      status: 'Interview Scheduled',
      appliedDate: '2025-12-21',
      avatar: 'MC',
    },
    {
      id: 3,
      name: 'Emma Wilson',
      email: 'emma.w@email.com',
      score: 85,
      status: 'Shortlisted',
      appliedDate: '2025-12-23',
      avatar: 'EW',
    },
    {
      id: 4,
      name: 'James Martinez',
      email: 'james.m@email.com',
      score: 79,
      status: 'Under Review',
      appliedDate: '2025-12-24',
      avatar: 'JM',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'candidates', label: `Candidates (${job.applicants})` },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
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
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
              {job.status}
            </span>
          </div>
          <p className="text-gray-600">{job.department} • Posted {job.daysOpen} days ago</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
            <Trash2 className="w-4 h-4" />
            Close Job
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
          <p className="text-gray-900">{job.applicants}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-green-600" />
            <span className="text-gray-600">Shortlisted</span>
          </div>
          <p className="text-gray-900">{job.shortlisted}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-gray-600">Interviewed</span>
          </div>
          <p className="text-gray-900">{job.interviewed}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-gray-600">Avg. Response Time</span>
          </div>
          <p className="text-gray-900">2.3 days</p>
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
                className={`py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
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
                    <p className="text-gray-600">Location</p>
                    <p className="text-gray-900">{job.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Salary Range</p>
                    <p className="text-gray-900">{job.salary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Employment Type</p>
                    <p className="text-gray-900">{job.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-600">Department</p>
                    <p className="text-gray-900">{job.department}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-gray-900 mb-3">Job Description</h3>
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
              </div>

              <div>
                <h3 className="text-gray-900 mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-gray-900 mb-3">Required Skills</h3>
                <div className="space-y-3">
                  {job.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="w-32 text-gray-700">{skill.name}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${skill.weight * 10}%` }}
                        ></div>
                      </div>
                      <span className="w-12 text-gray-600">{skill.weight}/10</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'candidates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    All ({job.applicants})
                  </button>
                  <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                    Shortlisted ({job.shortlisted})
                  </button>
                  <button className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                    Interviewed ({job.interviewed})
                  </button>
                </div>
              </div>

              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/30 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                      {candidate.avatar}
                    </div>
                    <div>
                      <p className="text-gray-900">{candidate.name}</p>
                      <p className="text-gray-600">{candidate.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-gray-600">AI Score</p>
                      <p className="text-gray-900">{candidate.score}/100</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Applied</p>
                      <p className="text-gray-900">{new Date(candidate.appliedDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full ${
                      candidate.status === 'Shortlisted' ? 'bg-green-100 text-green-700' :
                      candidate.status === 'Interview Scheduled' ? 'bg-purple-100 text-purple-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {candidate.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="text-center py-12 text-gray-600">
              Analytics dashboard coming soon
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="text-center py-12 text-gray-600">
              Job settings coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
