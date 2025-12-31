import { CreditCard, Download, Check } from 'lucide-react';

export default function Billing() {
  const currentPlan = {
    name: 'Professional',
    price: 99,
    billingCycle: 'monthly',
    features: [
      '50 AI interviews per month',
      'Unlimited job postings',
      'Advanced analytics',
      'Priority support',
      'Custom workflows',
    ],
  };

  const usage = {
    aiInterviews: { used: 32, limit: 50 },
    jobs: { used: 24, limit: 'Unlimited' },
    candidates: { used: 342, limit: 'Unlimited' },
  };

  const invoices = [
    { id: 1, date: '2025-12-01', amount: 99, status: 'Paid', invoice: 'INV-2025-12' },
    { id: 2, date: '2025-11-01', amount: 99, status: 'Paid', invoice: 'INV-2025-11' },
    { id: 3, date: '2025-10-01', amount: 99, status: 'Paid', invoice: 'INV-2025-10' },
    { id: 4, date: '2025-09-01', amount: 99, status: 'Paid', invoice: 'INV-2025-09' },
  ];

  const plans = [
    {
      name: 'Starter',
      price: 49,
      features: [
        '20 AI interviews/month',
        '5 job postings',
        'Basic analytics',
        'Email support',
      ],
    },
    {
      name: 'Professional',
      price: 99,
      popular: true,
      features: [
        '50 AI interviews/month',
        'Unlimited job postings',
        'Advanced analytics',
        'Priority support',
        'Custom workflows',
      ],
    },
    {
      name: 'Enterprise',
      price: 299,
      features: [
        'Unlimited AI interviews',
        'Unlimited job postings',
        'Advanced analytics',
        '24/7 phone support',
        'Custom workflows',
        'Dedicated account manager',
        'Custom integrations',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Billing & Subscription</h1>
        <p className="text-gray-600">Manage your plan and billing information</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-gray-900 mb-2">Current Plan</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-gray-900">${currentPlan.price}</span>
              <span className="text-gray-600">/ {currentPlan.billingCycle}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Change Plan
            </button>
            <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
              Cancel Plan
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-700 mb-3">Plan Features</p>
            <ul className="space-y-2">
              {currentPlan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-700">
                  <Check className="w-4 h-4 text-green-600" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-gray-700 mb-3">Usage This Month</p>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">AI Interviews</span>
                  <span className="text-gray-900">
                    {usage.aiInterviews.used} / {usage.aiInterviews.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: `${(usage.aiInterviews.used / usage.aiInterviews.limit) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Active Jobs</span>
                  <span className="text-gray-900">
                    {usage.jobs.used} / {usage.jobs.limit}
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Total Candidates</span>
                  <span className="text-gray-900">
                    {usage.candidates.used} / {usage.candidates.limit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-gray-900">Payment Method</h2>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Update
          </button>
        </div>
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <CreditCard className="w-8 h-8 text-gray-600" />
          <div>
            <p className="text-gray-900">Visa ending in 4242</p>
            <p className="text-gray-600">Expires 12/2026</p>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-gray-900 mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`border-2 rounded-xl p-6 ${
                plan.popular
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <span className="inline-block px-3 py-1 bg-indigo-600 text-white rounded-full mb-4">
                  Current Plan
                </span>
              )}
              <h3 className="text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-gray-900">${plan.price}</span>
                <span className="text-gray-600"> / month</span>
              </div>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-2 rounded-lg transition-colors ${
                  plan.popular
                    ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
                disabled={plan.popular}
              >
                {plan.popular ? 'Current Plan' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-gray-900 mb-6">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Invoice</th>
                <th className="px-6 py-3 text-left text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-900">{invoice.invoice}</td>
                  <td className="px-6 py-4 text-gray-700">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-900">${invoice.amount}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
