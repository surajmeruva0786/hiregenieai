import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  FileText,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Download,
  Send,
} from 'lucide-react';

export default function CandidateProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock candidate data
  const candidate = {
    id: parseInt(id || '1'),
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    position: 'Senior Frontend Developer',
    score: 92,
    status: 'Shortlisted',
    appliedDate: '2025-12-22',
    experience: '6 years',
    avatar: 'SJ',
    summary:
      'Experienced frontend developer with a passion for creating intuitive user interfaces. Strong expertise in React, TypeScript, and modern web technologies. Proven track record of delivering high-quality applications.',
    skills: [
      { name: 'React', level: 95, years: 5 },
      { name: 'TypeScript', level: 90, years: 4 },
      { name: 'JavaScript', level: 95, years: 6 },
      { name: 'CSS/SASS', level: 85, years: 6 },
      { name: 'Node.js', level: 80, years: 3 },
      { name: 'Git', level: 90, years: 6 },
    ],
    workExperience: [
      {
        company: 'Tech Solutions Inc.',
        position: 'Senior Frontend Developer',
        duration: '2022 - Present',
        description:
          'Leading frontend development for enterprise SaaS platform. Architected and implemented component library used across multiple products.',
      },
      {
        company: 'StartupX',
        position: 'Frontend Developer',
        duration: '2020 - 2022',
        description:
          'Built and maintained React-based web applications. Improved performance by 40% through optimization techniques.',
      },
      {
        company: 'Web Agency',
        position: 'Junior Developer',
        duration: '2019 - 2020',
        description:
          'Developed responsive websites for clients. Collaborated with design team to implement pixel-perfect UI.',
      },
    ],
    education: [
      {
        school: 'University of California, Berkeley',
        degree: 'Bachelor of Science in Computer Science',
        year: '2015 - 2019',
      },
    ],
    interviews: [
      {
        id: 1,
        type: 'AI Screening',
        date: '2025-12-23',
        score: 87,
        status: 'Completed',
        feedback: 'Strong technical knowledge and communication skills. Good problem-solving approach.',
      },
    ],
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'resume', label: 'Resume Details' },
    { id: 'interviews', label: 'Interviews' },
    { id: 'notes', label: 'Notes' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/candidates')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-gray-900 mb-2">Candidate Profile</h1>
          <p className="text-gray-600">Detailed information and AI insights</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Download Resume
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Send className="w-4 h-4" />
            Send Email
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Candidate Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                {candidate.avatar}
              </div>
              <h2 className="text-gray-900 mb-2">{candidate.name}</h2>
              <p className="text-gray-600 mb-4">{candidate.position}</p>
              <span
                className={`inline-block px-4 py-2 rounded-full ${
                  candidate.status === 'Shortlisted'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {candidate.status}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="break-all">{candidate.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{candidate.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span>Applied {new Date(candidate.appliedDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <span>{candidate.experience} experience</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-700">AI Match Score</span>
                <span className="text-gray-900">{candidate.score}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                  style={{ width: `${candidate.score}%` }}
                ></div>
              </div>

              <div className="space-y-2">
                <button className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Move to Next Stage
                </button>
                <button className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Schedule Interview
                </button>
                <button className="w-full py-3 bg-white border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Reject Candidate
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2">
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
                  <div>
                    <h3 className="text-gray-900 mb-3">Summary</h3>
                    <p className="text-gray-700 leading-relaxed">{candidate.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-gray-900 mb-4">Skills Match</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {candidate.skills.map((skill, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">{skill.name}</span>
                            <span className="text-gray-600">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                          <p className="text-gray-500">{skill.years} years</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-gray-900 mb-4">AI Insights</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-green-900 mb-1">Strong Technical Skills</p>
                          <p className="text-green-700">
                            Candidate demonstrates excellent proficiency in required technologies
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-green-900 mb-1">Relevant Experience</p>
                          <p className="text-green-700">
                            6 years of experience matches job requirements perfectly
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-blue-900 mb-1">Communication Skills</p>
                          <p className="text-blue-700">
                            Clear and professional communication in application materials
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'resume' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className="w-5 h-5 text-gray-600" />
                      <h3 className="text-gray-900">Work Experience</h3>
                    </div>
                    <div className="space-y-4">
                      {candidate.workExperience.map((exp, index) => (
                        <div key={index} className="border-l-2 border-indigo-600 pl-4">
                          <p className="text-gray-900">{exp.position}</p>
                          <p className="text-gray-600">
                            {exp.company} • {exp.duration}
                          </p>
                          <p className="text-gray-700 mt-2">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <GraduationCap className="w-5 h-5 text-gray-600" />
                      <h3 className="text-gray-900">Education</h3>
                    </div>
                    <div className="space-y-4">
                      {candidate.education.map((edu, index) => (
                        <div key={index} className="border-l-2 border-indigo-600 pl-4">
                          <p className="text-gray-900">{edu.degree}</p>
                          <p className="text-gray-600">
                            {edu.school} • {edu.year}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'interviews' && (
                <div className="space-y-4">
                  {candidate.interviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-gray-900">{interview.type}</h4>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                          {interview.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-gray-600 mb-3">
                        <span>Date: {new Date(interview.date).toLocaleDateString()}</span>
                        <span>Score: {interview.score}/100</span>
                      </div>
                      <p className="text-gray-700">{interview.feedback}</p>
                    </div>
                  ))}
                  <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                    + Schedule New Interview
                  </button>
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Recruiter Notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-40"
                      placeholder="Add notes about this candidate..."
                    />
                  </div>
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Save Notes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
