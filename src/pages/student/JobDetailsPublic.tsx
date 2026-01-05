import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Briefcase, Clock, Users, Star, Building2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { jobService, applicationService } from '../../services/localStorage.service';
import { useAuth } from '../../hooks/useAuth';
import type { Job } from '../../types';

export default function JobDetailsPublic() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isApplying, setIsApplying] = useState(false);
  const [job, setJob] = useState<Job | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (id) {
      // Load job details
      const jobData = jobService.getById(id);
      console.log('JobDetailsPublic: Loading job:', id, jobData);
      setJob(jobData || null);

      // Check if user has already applied
      if (currentUser) {
        const userApplications = applicationService.getByCandidate(currentUser.id);
        const existingApplication = userApplications.find(app => app.jobId === id);
        setHasApplied(!!existingApplication);
        console.log('JobDetailsPublic: Already applied?', !!existingApplication);
      }
    }
  }, [id, currentUser]);

  const handleApply = () => {
    if (!currentUser || !job) {
      console.error('Cannot apply: missing user or job data');
      return;
    }

    setIsApplying(true);
    console.log('Applying to job:', job.id, 'as user:', currentUser.id);

    // Create application
    const application = applicationService.create({
      jobId: job.id,
      candidateId: currentUser.id,
      status: 'pending',
      notes: `Application submitted by ${currentUser.firstName} ${currentUser.lastName}`,
    });

    console.log('Application created:', application);

    // Show success and redirect
    setTimeout(() => {
      setIsApplying(false);
      setHasApplied(true);

      // Navigate to applications page after a brief delay
      setTimeout(() => {
        navigate('/student/applications');
      }, 1000);
    }, 1500);
  };

  if (!job) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading job details...</p>
      </div>
    );
  }

  const calculateDaysAgo = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    return `${Math.floor(diffDays / 7)} weeks ago`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/student/jobs')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-gray-900 mb-2">Job Details</h1>
          <p className="text-gray-600">Review and apply to this opportunity</p>
        </div>
      </div>

      {/* Job Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-8 shadow-sm"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

        <div className="relative">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-gray-900 mb-1">{job.title}</h2>
                  <p className="text-gray-600">{job.company}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-semibold">New Opportunity</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-gray-500 text-sm">Location</p>
                <p className="text-gray-900">{job.location}</p>
              </div>
            </div>
            {job.salary && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <DollarSign className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-gray-500 text-sm">Salary</p>
                  <p className="text-gray-900">{job.salary}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Briefcase className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-gray-500 text-sm">Type</p>
                <p className="text-gray-900">{job.type.charAt(0).toUpperCase() + job.type.slice(1).replace('-', ' ')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-gray-500 text-sm">Posted</p>
                <p className="text-gray-900">{calculateDaysAgo(job.createdAt)}</p>
              </div>
            </div>
          </div>

          {hasApplied ? (
            <div className="w-full py-4 bg-green-50 border-2 border-green-300 text-green-700 rounded-xl text-center font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Already Applied
            </div>
          ) : (
            <button
              onClick={handleApply}
              disabled={isApplying}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50"
            >
              {isApplying ? 'Applying...' : 'Apply Now'}
            </button>
          )}
        </div>
      </motion.div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-gray-900 mb-4">Required Skills</h3>
          <div className="flex flex-wrap gap-3">
            {job.skills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-300"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Job Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
      >
        <h3 className="text-gray-900 mb-4">Job Description</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
      </motion.div>

      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <h3 className="text-gray-900 mb-4">Requirements</h3>
          <ul className="space-y-3">
            {job.requirements.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Star className="w-4 h-4 text-purple-600" />
                </div>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Apply CTA */}
      {!hasApplied && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="mb-3">Ready to Apply?</h3>
          <p className="mb-6 text-indigo-100">
            Take the next step in your career journey
          </p>
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50 font-semibold"
          >
            {isApplying ? 'Applying...' : 'Apply Now'}
          </button>
        </motion.div>
      )}
    </div>
  );
}
