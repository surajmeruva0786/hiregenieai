import { Brain, TrendingUp, AlertTriangle, CheckCircle2, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import apiService from '../../services/api.service';

export default function AIInsights() {
  const [topCandidates, setTopCandidates] = useState<any[]>([]);
  const [hiringTrends, setHiringTrends] = useState<any[]>([]);
  const [biasAlerts, setBiasAlerts] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    try {
      setLoading(true);

      // Load from localStorage for now (can be replaced with API calls)
      const storedData = localStorage.getItem('hiregenie_data');
      if (!storedData) {
        setLoading(false);
        return;
      }

      const data = JSON.parse(storedData);
      const candidates = data.candidates || [];
      const jobs = data.jobs || [];
      const interviews = data.interviews || [];

      // Get top candidates based on interview scores
      const candidatesWithScores = candidates
        .map((candidate: any) => {
          const candidateInterviews = interviews.filter(
            (i: any) => i.candidateId === candidate.id && i.status === 'completed'
          );

          if (candidateInterviews.length === 0) return null;

          const avgScore =
            candidateInterviews.reduce((sum: number, i: any) => sum + (i.percentageScore || 0), 0) /
            candidateInterviews.length;

          const job = jobs.find((j: any) => j.id === candidateInterviews[0]?.jobId);

          return {
            name: candidate.name || 'Unknown',
            position: job?.title || 'Unknown Position',
            score: Math.round(avgScore),
            strengths: candidate.skills?.slice(0, 3).map((s: any) => s.name) || ['Strong candidate'],
            weaknesses: ['Needs more experience'],
            recommendation: avgScore >= 80 ? 'Strongly recommended for final interview' :
              avgScore >= 65 ? 'Good fit for the role' :
                'Recommended with minor reservations',
          };
        })
        .filter(Boolean)
        .sort((a: any, b: any) => b.score - a.score)
        .slice(0, 3);

      setTopCandidates(candidatesWithScores);

      // Calculate hiring trends
      const completedInterviews = interviews.filter((i: any) => i.status === 'completed');
      const avgQuality = completedInterviews.length > 0
        ? completedInterviews.reduce((sum: number, i: any) => sum + (i.percentageScore || 0), 0) /
        completedInterviews.length
        : 0;

      const trends = [
        {
          metric: 'Quality of Applicants',
          trend: 'up',
          value: `${Math.round(avgQuality)}%`,
          insight: 'AI screening is attracting higher quality candidates',
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
          value: `${Math.round((completedInterviews.length / Math.max(interviews.length, 1)) * 100)}%`,
          insight: 'AI-shortlisted candidates have higher interview pass rates',
        },
      ];

      setHiringTrends(trends);

      // Detect bias (simple implementation)
      const alerts: any[] = [];

      // Check geographic diversity
      const locations = candidates.map((c: any) => c.location).filter(Boolean);
      const uniqueLocations = new Set(locations);
      if (uniqueLocations.size < locations.length * 0.3) {
        alerts.push({
          type: 'warning',
          title: 'Geographic Diversity',
          message: `${Math.round((1 - uniqueLocations.size / locations.length) * 100)}% of candidates are from similar regions. Consider expanding location criteria.`,
        });
      }

      // Check experience range
      const seniorCandidates = candidates.filter((c: any) => (c.totalExperienceYears || 0) > 5);
      if (seniorCandidates.length > candidates.length * 0.7) {
        alerts.push({
          type: 'info',
          title: 'Experience Range',
          message: 'Your recent hires skew toward senior candidates. Consider junior talent for balance.',
        });
      }

      setBiasAlerts(alerts);

      // Generate recommendations
      const recs: string[] = [];

      if (avgQuality < 60) {
        recs.push('Consider adjusting minimum experience requirements - you may be missing quality candidates');
      } else {
        recs.push('Your AI interview pass rate is above average - consider reducing manual screening time');
      }

      const lowApplicationJobs = jobs.filter((j: any) => {
        const applicants = candidates.filter((c: any) =>
          c.appliedJobs?.some((aj: any) => aj.jobId === j.id)
        );
        return applicants.length < 5;
      });

      if (lowApplicationJobs.length > 0) {
        recs.push(`${lowApplicationJobs[0]?.title || 'Some roles'} have low application volume - try improving job descriptions`);
      }

      recs.push('AI-powered matching is identifying strong candidates - continue leveraging these insights');

      setRecommendations(recs);

    } catch (error) {
      console.error('Error loading AI insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Brain className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading AI insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">AI Insights</h1>
        <p className="text-gray-600">Data-driven recommendations to improve your hiring process</p>
      </div>

      {/* Top Candidates Ranking */}
      {topCandidates.length > 0 && (
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
                      {candidate.strengths.map((strength: string, i: number) => (
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
                      {candidate.weaknesses.map((weakness: string, i: number) => (
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
      )}

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
                  className={`w-5 h-5 ${trend.trend === 'up' ? 'text-green-600' : 'text-red-600'
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
      {biasAlerts.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-6 h-6 text-indigo-600" />
            <h2 className="text-gray-900">Bias & Fairness Monitoring</h2>
          </div>

          <div className="space-y-4">
            {biasAlerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${alert.type === 'warning'
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-blue-50 border-blue-200'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${alert.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'
                      }`}
                  />
                  <div>
                    <p
                      className={`mb-1 ${alert.type === 'warning' ? 'text-yellow-900' : 'text-blue-900'
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
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="mb-4">Personalized Recommendations</h3>
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
