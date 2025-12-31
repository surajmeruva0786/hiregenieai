import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const hiringFunnelData = [
    { stage: 'Applied', count: 342, percentage: 100 },
    { stage: 'AI Screened', count: 245, percentage: 72 },
    { stage: 'Shortlisted', count: 68, percentage: 20 },
    { stage: 'Interviewed', count: 34, percentage: 10 },
    { stage: 'Offered', count: 12, percentage: 4 },
    { stage: 'Hired', count: 8, percentage: 2 },
  ];

  const applicationTrendData = [
    { month: 'Jul', applications: 45, hires: 3 },
    { month: 'Aug', applications: 58, hires: 4 },
    { month: 'Sep', applications: 67, hires: 5 },
    { month: 'Oct', applications: 82, hires: 6 },
    { month: 'Nov', applications: 95, hires: 7 },
    { month: 'Dec', applications: 112, hires: 9 },
  ];

  const sourceData = [
    { name: 'Direct Apply', value: 145, color: '#6366f1' },
    { name: 'LinkedIn', value: 98, color: '#8b5cf6' },
    { name: 'Job Boards', value: 67, color: '#ec4899' },
    { name: 'Referral', value: 32, color: '#14b8a6' },
  ];

  const jobPerformanceData = [
    { job: 'Frontend Dev', quality: 85, speed: 12, passRate: 68 },
    { job: 'Product Manager', quality: 78, speed: 18, passRate: 54 },
    { job: 'UX Designer', quality: 82, speed: 14, passRate: 62 },
    { job: 'Backend Eng', quality: 80, speed: 15, passRate: 65 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Track and analyze your hiring performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <p className="text-gray-600">Total Applications</p>
          </div>
          <p className="text-gray-900 mb-1">342</p>
          <p className="text-green-600">+28% vs last month</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-gray-600">Hire Rate</p>
          </div>
          <p className="text-gray-900 mb-1">2.3%</p>
          <p className="text-green-600">+0.5% improvement</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-purple-600" />
            <p className="text-gray-600">Avg. Time to Hire</p>
          </div>
          <p className="text-gray-900 mb-1">12 days</p>
          <p className="text-green-600">-2 days faster</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <p className="text-gray-600">Offer Accept Rate</p>
          </div>
          <p className="text-gray-900 mb-1">75%</p>
          <p className="text-gray-600">Stable</p>
        </div>
      </div>

      {/* Application Trends */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-gray-900 mb-6">Application & Hiring Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={applicationTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="#6366f1"
              strokeWidth={2}
              name="Applications"
            />
            <Line
              type="monotone"
              dataKey="hires"
              stroke="#10b981"
              strokeWidth={2}
              name="Hires"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Funnel */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-gray-900 mb-6">Hiring Funnel</h2>
          <div className="space-y-4">
            {hiringFunnelData.map((stage, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">{stage.stage}</span>
                  <span className="text-gray-900">
                    {stage.count} ({stage.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-indigo-600 h-3 rounded-full transition-all"
                    style={{ width: `${stage.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Sources */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-gray-900 mb-6">Application Sources</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {sourceData.map((source, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: source.color }}
                ></div>
                <span className="text-gray-700">{source.name}</span>
                <span className="text-gray-900 ml-auto">{source.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Performance */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-gray-900 mb-6">Job Performance Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={jobPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="job" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend />
            <Bar dataKey="quality" fill="#6366f1" name="Candidate Quality" />
            <Bar dataKey="speed" fill="#8b5cf6" name="Time to Hire (days)" />
            <Bar dataKey="passRate" fill="#ec4899" name="Interview Pass Rate (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="mb-4">Key Insights</h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>
              Applications increased by 28% this month, primarily driven by LinkedIn and Direct Apply channels
            </span>
          </li>
          <li className="flex items-start gap-2">
            <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>
              Time to hire has decreased by 2 days thanks to AI-powered screening reducing manual review time
            </span>
          </li>
          <li className="flex items-start gap-2">
            <TrendingUp className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>
              Frontend Developer role shows highest candidate quality (85) but should improve pass rate
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
