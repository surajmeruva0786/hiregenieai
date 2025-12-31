import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Video, Calendar, Clock, Building2, CheckCircle2, AlertCircle, Play } from 'lucide-react';

export default function MyInterviews() {
  const upcomingInterviews = [
    {
      id: 1,
      company: 'Tech Corp',
      position: 'Senior Frontend Developer',
      type: 'AI Technical Interview',
      date: '2025-12-26',
      time: '10:00 AM',
      duration: 45,
      status: 'Scheduled',
    },
    {
      id: 2,
      company: 'StartupX',
      position: 'Full Stack Developer',
      type: 'AI Behavioral Interview',
      date: '2025-12-27',
      time: '2:00 PM',
      duration: 30,
      status: 'Scheduled',
    },
  ];

  const completedInterviews = [
    {
      id: 3,
      company: 'Innovation Labs',
      position: 'React Developer',
      type: 'AI Screening',
      date: '2025-12-23',
      score: 87,
      status: 'Completed',
      feedback: 'Strong technical knowledge and good communication skills',
    },
    {
      id: 4,
      company: 'Design Studio',
      position: 'Frontend Engineer',
      type: 'AI Technical Interview',
      date: '2025-12-20',
      score: 92,
      status: 'Completed',
      feedback: 'Excellent problem-solving abilities and clean code',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">My Interviews</h1>
        <p className="text-gray-600">Manage your scheduled and completed AI interviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900">{upcomingInterviews.length}</h3>
              <p className="text-gray-600">Upcoming</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900">{completedInterviews.length}</h3>
              <p className="text-gray-600">Completed</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-gray-900">
                {completedInterviews.length > 0
                  ? Math.round(completedInterviews.reduce((acc, i) => acc + i.score, 0) / completedInterviews.length)
                  : 0}
              </h3>
              <p className="text-gray-600">Avg Score</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upcoming Interviews */}
      {upcomingInterviews.length > 0 && (
        <div>
          <h2 className="text-gray-900 mb-4">Upcoming Interviews</h2>
          <div className="space-y-4">
            {upcomingInterviews.map((interview, index) => (
              <motion.div
                key={interview.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-purple-300 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                        <Video className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-1">{interview.position}</h3>
                        <p className="text-gray-600 mb-3">{interview.company}</p>
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-lg">
                          {interview.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(interview.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{interview.time} ({interview.duration} min)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end justify-center">
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg border border-green-300">
                      {interview.status}
                    </span>
                    <Link
                      to={`/student/interviews/${interview.id}`}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                    >
                      <Play className="w-5 h-5" />
                      Join Interview
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Interviews */}
      {completedInterviews.length > 0 && (
        <div>
          <h2 className="text-gray-900 mb-4">Completed Interviews</h2>
          <div className="space-y-4">
            {completedInterviews.map((interview, index) => (
              <motion.div
                key={interview.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                        <CheckCircle2 className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-1">{interview.position}</h3>
                        <p className="text-gray-600 mb-3">{interview.company}</p>
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg">
                          {interview.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(interview.date).toLocaleDateString()}</span>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <p className="text-blue-900">
                        <strong>AI Feedback:</strong> {interview.feedback}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:items-end justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-2">
                        <span className="text-white">{interview.score}</span>
                      </div>
                      <p className="text-gray-600">Score</p>
                    </div>
                    <button className="px-6 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* AI Interview Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <h3 className="mb-4">AI Interview Tips 💡</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Find a quiet space with good lighting and stable internet</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Speak clearly and take your time to think before answering</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Be honest and authentic - the AI values genuine responses</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>Review the job description before starting the interview</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
