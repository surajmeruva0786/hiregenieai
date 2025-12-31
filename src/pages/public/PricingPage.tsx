import { Link } from 'react-router-dom';
import { Sparkles, Check } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: 49,
      description: 'Perfect for small teams',
      features: [
        '20 AI interviews per month',
        '5 active job postings',
        'Basic analytics',
        'Email support',
        '2 team members',
      ],
    },
    {
      name: 'Professional',
      price: 99,
      popular: true,
      description: 'For growing companies',
      features: [
        '50 AI interviews per month',
        'Unlimited job postings',
        'Advanced analytics',
        'Priority support',
        'Custom workflows',
        '10 team members',
        'AI insights',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Unlimited AI interviews',
        'Unlimited job postings',
        'Advanced analytics',
        '24/7 phone support',
        'Custom workflows',
        'Unlimited team members',
        'Dedicated account manager',
        'Custom integrations',
        'SLA guarantee',
      ],
    },
  ];

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
          <h1 className="text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for your team. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-indigo-600 text-white border-2 border-indigo-600 shadow-xl'
                  : 'bg-white border-2 border-gray-200'
              }`}
            >
              {plan.popular && (
                <span className="inline-block px-3 py-1 bg-white text-indigo-600 rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <h3 className={`mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <div className="mb-4">
                {typeof plan.price === 'number' ? (
                  <>
                    <span className={`${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      ${plan.price}
                    </span>
                    <span className={plan.popular ? 'text-white/80' : 'text-gray-600'}>
                      {' '}/ month
                    </span>
                  </>
                ) : (
                  <span className={`${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                )}
              </div>
              <p className={`mb-6 ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>
                {plan.description}
              </p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        plan.popular ? 'text-white' : 'text-green-600'
                      }`}
                    />
                    <span className={plan.popular ? 'text-white' : 'text-gray-700'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className={`block w-full py-3 rounded-lg text-center transition-colors ${
                  plan.popular
                    ? 'bg-white text-indigo-600 hover:bg-gray-100'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                Start Free Trial
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
