import { Link } from 'react-router-dom';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-gray-900">HireGenie AI</span>
            </Link>
            <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-gray-900 mb-4">Powerful Features for Modern Hiring</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to streamline your recruitment process and hire the best talent
          </p>
        </div>

        <div className="max-w-7xl mx-auto space-y-16">
          {[
            {
              title: 'AI-Powered Resume Screening',
              description: 'Automatically parse and analyze resumes to identify the most qualified candidates',
              features: [
                'Instant skill extraction and matching',
                'Experience level assessment',
                'Education verification',
                'Custom scoring criteria',
              ],
            },
            {
              title: 'Automated AI Interviews',
              description: 'Conduct scalable, fair, and consistent interviews with AI',
              features: [
                'Technical and behavioral assessments',
                'Natural conversation flow',
                'Instant scoring and feedback',
                'Bias-free evaluation',
              ],
            },
            {
              title: 'Advanced Analytics',
              description: 'Make data-driven hiring decisions with comprehensive insights',
              features: [
                'Hiring funnel visualization',
                'Time-to-hire metrics',
                'Source effectiveness tracking',
                'ROI calculations',
              ],
            },
          ].map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl border border-gray-200 p-8">
              <h2 className="text-gray-900 mb-4">{feature.title}</h2>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {feature.features.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
