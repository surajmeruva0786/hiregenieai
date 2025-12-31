import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, DollarSign, Briefcase, Clock, Users, Star, Building2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function JobDetailsPublic() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApplying, setIsApplying] = useState(false);

  const job = {
    id: parseInt(id || '1'),
    company: 'Tech Corp',
    position: 'Senior Frontend Developer',
    location: 'Remote',
    salary: '$120k - $160k',
    type: 'Full-time',
    posted: '2 days ago',
    applicants: 45,
    matchScore: 95,
    description: 'We are looking for an experienced Frontend Developer to join our growing team. You will be responsible for building scalable web applications using modern technologies and working closely with our design team to create amazing user experiences.',
    responsibilities: [
      'Build and maintain high-quality React applications',
      'Collaborate with designers and backend developers',
      'Write clean, maintainable, and testable code',
      'Participate in code reviews and technical discussions',
      'Optimize applications for maximum performance',
    ],
    requirements: [
      '5+ years of experience with React and TypeScript',
      'Strong understanding of web performance optimization',
      'Experience with state management (Redux, MobX, or similar)',
      'Excellent problem-solving and communication skills',
      'Experience with CI/CD pipelines',
    ],
    benefits: [
      'Competitive salary and equity',
      'Health, dental, and vision insurance',
      'Unlimited PTO',
      '401(k) matching',
      'Remote work flexibility',
      'Professional development budget',
    ],
    skills: [
      { name: 'React', match: true },
      { name: 'TypeScript', match: true },
      { name: 'JavaScript', match: true },
      { name: 'CSS/SASS', match: true },
      { name: 'Node.js', match: false },
    ],
  };

  const handleApply = () => {
    setIsApplying(true);
    // Mock application
    setTimeout(() => {
      navigate('/student/applications');
    }, 2000);
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
                  <h2 className="text-gray-900 mb-1">{job.position}</h2>
                  <p className="text-gray-600">{job.company}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl">
              <Star className="w-5 h-5 fill-current" />
              <span className="font-semibold">{job.matchScore}% Match</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="text-gray-500">Location</p>
                <p className="text-gray-900">{job.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-gray-500">Salary</p>
                <p className="text-gray-900">{job.salary}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Briefcase className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-gray-500">Type</p>
                <p className="text-gray-900">{job.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-gray-500">Posted</p>
                <p className="text-gray-900">{job.posted}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleApply}
            disabled={isApplying}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50"
          >
            {isApplying ? 'Applying...' : 'Apply Now'}
          </button>
        </div>
      </motion.div>

      {/* Skills Match */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
      >
        <h3 className="text-gray-900 mb-4">Skills Match</h3>
        <div className="flex flex-wrap gap-3">
          {job.skills.map((skill, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                skill.match
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}
            >
              {skill.match && <CheckCircle2 className="w-4 h-4" />}
              <span>{skill.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Job Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
      >
        <h3 className="text-gray-900 mb-4">Job Description</h3>
        <p className="text-gray-700 leading-relaxed">{job.description}</p>
      </motion.div>

      {/* Responsibilities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
      >
        <h3 className="text-gray-900 mb-4">Responsibilities</h3>
        <ul className="space-y-3">
          {job.responsibilities.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              </div>
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Requirements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
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

      {/* Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
      >
        <h3 className="text-gray-900 mb-4">Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {job.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Apply CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center"
      >
        <h3 className="mb-3">Ready to Apply?</h3>
        <p className="mb-6 text-indigo-100">
          Join {job.applicants} other candidates who have already applied to this role
        </p>
        <button
          onClick={handleApply}
          disabled={isApplying}
          className="px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50"
        >
          {isApplying ? 'Applying...' : 'Apply Now'}
        </button>
      </motion.div>
    </div>
  );
}
