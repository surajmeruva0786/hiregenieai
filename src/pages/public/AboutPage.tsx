import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function AboutPage() {
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-gray-900 mb-6 text-center">About HireGenie AI</h1>
          
          <div className="space-y-8 text-gray-700 leading-relaxed">
            <p>
              HireGenie AI was founded in 2024 with a mission to revolutionize the recruitment industry
              through artificial intelligence. We believe that finding the right talent shouldn't be a
              time-consuming, biased process filled with manual tasks.
            </p>

            <p>
              Our platform combines cutting-edge AI technology with proven recruitment best practices
              to help companies hire better, faster, and more fairly. From automated resume screening
              to AI-powered interviews, we're transforming every step of the hiring journey.
            </p>

            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-8 my-8">
              <h2 className="text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700">
                To empower companies to make smarter hiring decisions through AI, while ensuring
                fairness, diversity, and efficiency in the recruitment process.
              </p>
            </div>

            <h2 className="text-gray-900 mt-12 mb-4">Why Choose HireGenie AI?</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Save 80% of time spent on resume screening and initial interviews</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Reduce hiring bias with AI-powered objective assessments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Make data-driven decisions with comprehensive analytics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></span>
                <span>Scale your hiring process without sacrificing quality</span>
              </li>
            </ul>

            <div className="text-center mt-12">
              <Link
                to="/signup"
                className="inline-block px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Join Us Today
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
