import { Link } from 'react-router-dom';
import { Calendar, Video, Clock, Users, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function InterviewDashboard() {
  const upcomingInterviews = [
    {
      id: 1,
      candidate: 'Michael Chen',
      position: 'Senior Frontend Developer',
      type: 'Technical Round',
      date: '2025-12-26',
      time: '10:00 AM',
      interviewer: 'John Smith',
      status: 'Scheduled',
    },
    {
      id: 2,
      candidate: 'Lisa Anderson',
      position: 'Product Manager',
      type: 'Final Round',
      date: '2025-12-26',
      time: '2:00 PM',
      interviewer: 'Jane Doe',
      status: 'Scheduled',
    },
    {
      id: 3,
      candidate: 'Emma Wilson',
      position: 'UX Designer',
      type: 'Portfolio Review',
      date: '2025-12-27',
      time: '11:00 AM',
      interviewer: 'Sarah Lee',
      status: 'Scheduled',
    },
  ];

  const completedInterviews = [
    {
      id: 4,
      candidate: 'Sarah Johnson',
      position: 'Senior Frontend Developer',
      type: 'AI Screening',
      date: '2025-12-23',
      score: 87,
      status: 'Completed',
      evaluation: 'Pending Review',
    },
    {
      id: 5,
      candidate: 'James Martinez',
      position: 'Backend Engineer',
      type: 'AI Screening',
      date: '2025-12-22',
      score: 79,
      status: 'Completed',
      evaluation: 'Reviewed',
    },
  ];

  const aiInterviewStats = [
    { label: 'Total AI Interviews', value: '156', change: '+24 this week' },
    { label: 'Avg. Score', value: '78/100', change: '+5% vs last month' },
    { label: 'Pass Rate', value: '68%', change: 'Stable' },
    { label: 'Pending Review', value: '12', change: 'Action needed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Interviews</h1>
          <p className="text-gray-600">Manage AI and manual interview processes</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Video className="w-4 h-4" />
            Start AI Interview
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" />
            Schedule Interview
          </button>
        </div>
      </div>

      {/* AI Interview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {aiInterviewStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-gray-600 mb-2">{stat.label}</p>
            <p className="text-gray-900 mb-1">{stat.value}</p>
            <p className="text-gray-500">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Upcoming Interviews */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Upcoming Interviews</h2>
          <Link to="#" className="text-indigo-600 hover:text-indigo-700">
            View Calendar →
          </Link>
        </div>

        <div className="space-y-4">
          {upcomingInterviews.map((interview) => (
            <div
              key={interview.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{interview.candidate}</p>
                  <p className="text-gray-600">{interview.position}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div>
                  <p className="text-gray-600">Interview Type</p>
                  <p className="text-gray-900">{interview.type}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date & Time</p>
                  <p className="text-gray-900">
                    {new Date(interview.date).toLocaleDateString()} at {interview.time}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Interviewer</p>
                  <p className="text-gray-900">{interview.interviewer}</p>
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Interviews */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Recently Completed</h2>
          <Link to="#" className="text-indigo-600 hover:text-indigo-700">
            View All →
          </Link>
        </div>

        <div className="space-y-4">
          {completedInterviews.map((interview) => (
            <div
              key={interview.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{interview.candidate}</p>
                  <p className="text-gray-600">{interview.position}</p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div>
                  <p className="text-gray-600">Type</p>
                  <p className="text-gray-900">{interview.type}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="text-gray-900">{new Date(interview.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">AI Score</p>
                  <p className="text-gray-900">{interview.score}/100</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full ${
                      interview.evaluation === 'Reviewed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {interview.evaluation}
                  </span>
                </div>
                <button className="text-indigo-600 hover:text-indigo-700">
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Evaluations */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-orange-900 mb-2">Action Required</h3>
            <p className="text-orange-800 mb-4">
              You have 12 AI interview results pending your review. Review them to move candidates to the next stage.
            </p>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              Review Pending Interviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
