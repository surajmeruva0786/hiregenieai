import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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
import { applicationService, candidateService, jobService, interviewService } from '../../services/localStorage.service';
import type { Application, Candidate, Job, Interview } from '../../types';

export default function CandidateProfile() {
  const { id } = useParams(); // This is the application ID
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // State for real data
  const [application, setApplication] = useState<Application | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Fetch application data
      const app = applicationService.getById(id);
      if (app) {
        setApplication(app);

        // Fetch user data (the candidateId is actually a user ID)
        const data = JSON.parse(localStorage.getItem('hiregenie_data') || '{}');
        const user: any = data.users?.find((u: any) => u.id === app.candidateId);

        if (user) {
          // Convert User to Candidate format with safe defaults
          const candidateData: Candidate = {
            id: user.id,
            firstName: user.firstName || 'Unknown',
            lastName: user.lastName || 'User',
            email: user.email || '',
            phone: user.phone || 'Not provided',
            location: user.location || 'Not specified',
            skills: Array.isArray(user.skills) ? user.skills : [],
            experience: typeof user.experience === 'number' ? user.experience : 0,
            education: user.education || 'Not specified',
            summary: user.summary || `${user.firstName} ${user.lastName} is a ${user.userType === 'student' ? 'student' : 'professional'} looking for opportunities.`,
            linkedIn: user.linkedIn || '',
            github: user.github || '',
            portfolio: user.portfolio || '',
            resumeUrl: user.resumeUrl || '',
            createdAt: user.createdAt || new Date().toISOString(),
            updatedAt: user.updatedAt || new Date().toISOString()
          };
          setCandidate(candidateData);
        }

        // Fetch job data
        const jobData = jobService.getById(app.jobId);
        setJob(jobData || null);

        // Fetch interviews for this candidate
        const candidateInterviews = interviewService.getByCandidate(app.candidateId);
        setInterviews(candidateInterviews);

        // Set notes from application
        setNotes(app.notes || '');
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading candidate profile...</p>
      </div>
    );
  }

  if (!application || !candidate) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-900 text-xl mb-2">Candidate not found</p>
        <p className="text-gray-600 mb-4">The candidate profile you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/dashboard/candidates')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Back to Candidates
        </button>
      </div>
    );
  }

  // Calculate AI match score based on skills match
  const calculateMatchScore = (): number => {
    if (!job || !candidate) return 0;
    const jobSkills = job.skills.map(s => s.toLowerCase());
    const candidateSkills = candidate.skills.map(s => s.toLowerCase());
    const matchingSkills = candidateSkills.filter(skill =>
      jobSkills.some(jobSkill => jobSkill.includes(skill) || skill.includes(jobSkill))
    );
    return Math.min(Math.round((matchingSkills.length / jobSkills.length) * 100), 100);
  };

  const matchScore = calculateMatchScore();
  const candidateName = `${candidate.firstName} ${candidate.lastName}`;
  const candidateInitials = `${candidate.firstName[0]}${candidate.lastName[0]}`.toUpperCase();

  const handleSaveNotes = () => {
    if (id && notes !== application.notes) {
      applicationService.updateStatus(id, application.status);
      // Update the notes in the application
      const data = JSON.parse(localStorage.getItem('hiregenie_data') || '{}');
      const appIndex = data.applications.findIndex((app: any) => app.id === id);
      if (appIndex !== -1) {
        data.applications[appIndex].notes = notes;
        localStorage.setItem('hiregenie_data', JSON.stringify(data));
        alert('Notes saved successfully!');
      }
    }
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
                {candidateInitials}
              </div>
              <h2 className="text-gray-900 mb-2">{candidateName}</h2>
              <p className="text-gray-600 mb-4">{job?.title || 'Position'}</p>
              <span
                className={`inline-block px-4 py-2 rounded-full ${application.status === 'interview'
                  ? 'bg-purple-100 text-purple-700'
                  : application.status === 'reviewing'
                    ? 'bg-blue-100 text-blue-700'
                    : application.status === 'accepted'
                      ? 'bg-green-100 text-green-700'
                      : application.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                  }`}
              >
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
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
                <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <span>{candidate.experience} experience</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-700">AI Match Score</span>
                <span className="text-gray-900">{matchScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                  style={{ width: `${matchScore}%` }}
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
                  <div>
                    <h3 className="text-gray-900 mb-3">Summary</h3>
                    <p className="text-gray-700 leading-relaxed">{candidate.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-gray-900 mb-4">Skills Match</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {candidate.skills.map((skill, index) => {
                        const jobSkills = job?.skills.map(s => s.toLowerCase()) || [];
                        const isMatch = jobSkills.some(js => js.includes(skill.toLowerCase()) || skill.toLowerCase().includes(js));
                        return (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-700">{skill}</span>
                              {isMatch && <span className="text-green-600 text-sm">✓ Match</span>}
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${isMatch ? 'bg-green-600' : 'bg-indigo-600'}`}
                                style={{ width: '100%' }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-gray-900 mb-4">AI Insights</h3>
                    <div className="space-y-3">
                      {matchScore >= 70 && (
                        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-green-900 mb-1">Strong Skills Match</p>
                            <p className="text-green-700">
                              Candidate has {matchScore}% skills match with job requirements
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-green-900 mb-1">Experience Level</p>
                          <p className="text-green-700">
                            {candidate.experience} {candidate.experience === 1 ? 'year' : 'years'} of professional experience
                          </p>
                        </div>
                      </div>
                      {candidate.summary && (
                        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <MessageSquare className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-blue-900 mb-1">Professional Summary</p>
                            <p className="text-blue-700">
                              {candidate.summary}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'resume' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <GraduationCap className="w-5 h-5 text-gray-600" />
                      <h3 className="text-gray-900">Education</h3>
                    </div>
                    <div className="border-l-2 border-indigo-600 pl-4">
                      <p className="text-gray-900">{candidate.education}</p>
                      <p className="text-gray-600 text-sm mt-1">Years of experience: {candidate.experience}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className="w-5 h-5 text-gray-600" />
                      <h3 className="text-gray-900">Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {(candidate.linkedIn || candidate.github || candidate.portfolio) && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <h3 className="text-gray-900">Links</h3>
                      </div>
                      <div className="space-y-2">
                        {candidate.linkedIn && (
                          <a href={candidate.linkedIn} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline block">
                            LinkedIn Profile →
                          </a>
                        )}
                        {candidate.github && (
                          <a href={candidate.github} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline block">
                            GitHub Profile →
                          </a>
                        )}
                        {candidate.portfolio && (
                          <a href={candidate.portfolio} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline block">
                            Portfolio →
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'interviews' && (
                <div className="space-y-4">
                  {interviews.length > 0 ? (
                    interviews.map((interview) => (
                      <div
                        key={interview.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-gray-900">{interview.type.charAt(0).toUpperCase() + interview.type.slice(1)} Interview</h4>
                          <span className={`px-3 py-1 rounded-full ${interview.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : interview.status === 'scheduled'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                            }`}>
                            {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 text-gray-600 mb-3">
                          <span>Date: {new Date(interview.scheduledAt).toLocaleDateString()}</span>
                          {interview.score && <span>Score: {interview.score}/100</span>}
                        </div>
                        {interview.feedback && <p className="text-gray-700">{interview.feedback}</p>}
                        {interview.notes && <p className="text-gray-600 mt-2 text-sm">{interview.notes}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center py-8">No interviews scheduled yet</p>
                  )}
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
                  <button
                    onClick={handleSaveNotes}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
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
