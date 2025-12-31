import { Brain, TrendingUp, AlertTriangle, CheckCircle2, Target } from 'lucide-react';

export default function AIInsights() {
  const topCandidates = [
    {
      name: 'Sarah Johnson',
      position: 'Senior Frontend Developer',
      score: 92,
      strengths: ['Strong React skills', 'Excellent problem-solving', 'Great communication'],
      weaknesses: ['Limited backend experience'],
      recommendation: 'Strongly recommended for final interview',
    },
    {
      name: 'Michael Chen',
      position: 'Senior Frontend Developer',
      score: 87,
      strengths: ['Solid TypeScript knowledge', 'Good team player'],
      weaknesses: ['Needs more leadership experience'],
      recommendation: 'Good fit for the role',
    },
    {
      name: 'Lisa Anderson',
      position: 'Product Manager',
      score: 88,
      strengths: ['Strategic thinking', 'Data-driven approach', 'Stakeholder management'],
      weaknesses: ['New to the industry vertical'],
      recommendation: 'Recommended with minor reservations',
    },
  ];

  const hiringTrends = [
    {
      metric: 'Quality of Applicants',
      trend: 'up',
      value: '+15%',
      insight: 'Job postings with AI screening attract higher quality candidates',
    },
    {
      metric: 'Time to Hire',
      trend: 'down',
      value: '-8 days',
      insight: 'AI screening reduces time spent on initial candidate review',
    },
    {
      metric: 'Interview Success Rate',
      trend: 'up',
      value: '68%',
      insight: 'AI-shortlisted candidates have higher interview pass rates',
    },
  ];

  const biasAlerts = [
    {
      type: 'warning',
      title: 'Geographic Diversity',
      message: '78% of shortlisted candidates are from the same region. Consider expanding location criteria.',
    },
    {
      type: 'info',
      title: 'Experience Range',
      message: 'Your recent hires skew toward senior candidates. Consider junior talent for balance.',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">AI Insights</h1>
        <p className="text-gray-600">Data-driven recommendations to improve your hiring process</p>
      </div>

      {/* Top Candidates Ranking */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Target className="w-6 h-6 text-indigo-600" />
          <h2 className="text-gray-900">Top Candidates This Week</h2>
        </div>

        <div className="space-y-6">
          {topCandidates.map((candidate, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 mb-1">{candidate.name}</h3>
                  <p className="text-gray-600">{candidate.position}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center mb-2">
                    <span className="text-gray-900">{candidate.score}</span>
                  </div>
                  <p className="text-gray-600">AI Score</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-700 mb-2">Strengths</p>
                  <ul className="space-y-1">
                    {candidate.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-2 text-green-700">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-gray-700 mb-2">Areas for Growth</p>
                  <ul className="space-y-1">
                    {candidate.weaknesses.map((weakness, i) => (
                      <li key={i} className="flex items-start gap-2 text-orange-700">
                        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <p className="text-indigo-900">
                  <strong>AI Recommendation:</strong> {candidate.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hiring Trends */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-6 h-6 text-indigo-600" />
          <h2 className="text-gray-900">Hiring Trends & Insights</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hiringTrends.map((trend, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-gray-700">{trend.metric}</p>
                <TrendingUp
                  className={`w-5 h-5 ${
                    trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  } ${trend.trend === 'down' ? 'rotate-180' : ''}`}
                />
              </div>
              <p className="text-gray-900 mb-3">{trend.value}</p>
              <p className="text-gray-600">{trend.insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bias & Fairness Alerts */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="w-6 h-6 text-indigo-600" />
          <h2 className="text-gray-900">Bias & Fairness Monitoring</h2>
        </div>

        <div className="space-y-4">
          {biasAlerts.map((alert, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                alert.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                  }`}
                />
                <div>
                  <p
                    className={`mb-1 ${
                      alert.type === 'warning' ? 'text-yellow-900' : 'text-blue-900'
                    }`}
                  >
                    {alert.title}
                  </p>
                  <p
                    className={
                      alert.type === 'warning' ? 'text-yellow-800' : 'text-blue-800'
                    }
                  >
                    {alert.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="mb-4">Personalized Recommendations</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>
              Consider adjusting minimum experience requirements for Backend Engineer role - you're missing quality junior talent
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>
              Your AI interview pass rate is 15% higher than industry average - consider reducing manual screening time
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>
              UX Designer role has low application volume - try expanding skill requirements or improving job description
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
