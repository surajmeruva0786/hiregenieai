import { Plus, Play, Pause, Edit, Trash2 } from 'lucide-react';

export default function Workflows() {
  const workflows = [
    {
      id: 1,
      name: 'Auto-shortlist High Scorers',
      description: 'Automatically move candidates with AI score > 85 to shortlisted stage',
      trigger: 'AI Interview Completed',
      conditions: ['Score > 85'],
      actions: ['Move to Shortlisted', 'Send email to recruiter'],
      status: 'active',
      runsCount: 24,
    },
    {
      id: 2,
      name: 'Schedule Follow-up Interviews',
      description: 'Auto-schedule technical interviews for shortlisted frontend developers',
      trigger: 'Candidate Shortlisted',
      conditions: ['Position = Frontend Developer', 'Experience > 3 years'],
      actions: ['Schedule Interview', 'Send calendar invite'],
      status: 'active',
      runsCount: 12,
    },
    {
      id: 3,
      name: 'Reject Low Performers',
      description: 'Send rejection emails to candidates with low scores',
      trigger: 'AI Interview Completed',
      conditions: ['Score < 50'],
      actions: ['Move to Rejected', 'Send rejection email'],
      status: 'paused',
      runsCount: 8,
    },
    {
      id: 4,
      name: 'Notify Hiring Manager',
      description: 'Alert hiring manager when top candidates apply',
      trigger: 'New Application',
      conditions: ['AI Score > 90'],
      actions: ['Send Slack notification', 'Send email'],
      status: 'active',
      runsCount: 5,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Workflows</h1>
          <p className="text-gray-600">Automate your recruitment process with smart workflows</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="w-4 h-4" />
          Create Workflow
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 mb-1">Total Workflows</p>
          <p className="text-gray-900">{workflows.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 mb-1">Active</p>
          <p className="text-gray-900">{workflows.filter((w) => w.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 mb-1">Paused</p>
          <p className="text-gray-900">{workflows.filter((w) => w.status === 'paused').length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 mb-1">Total Runs</p>
          <p className="text-gray-900">{workflows.reduce((acc, w) => acc + w.runsCount, 0)}</p>
        </div>
      </div>

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-gray-900">{workflow.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full ${
                      workflow.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {workflow.status}
                  </span>
                </div>
                <p className="text-gray-600">{workflow.description}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  {workflow.status === 'active' ? (
                    <Pause className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Play className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Edit className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-red-100 rounded-lg">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <p className="text-gray-700 mb-2">Trigger</p>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                  <p className="text-indigo-900">{workflow.trigger}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-700 mb-2">Conditions</p>
                <div className="space-y-2">
                  {workflow.conditions.map((condition, index) => (
                    <div
                      key={index}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                    >
                      <p className="text-blue-900">{condition}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-gray-700 mb-2">Actions</p>
                <div className="space-y-2">
                  {workflow.actions.map((action, index) => (
                    <div
                      key={index}
                      className="bg-green-50 border border-green-200 rounded-lg p-3"
                    >
                      <p className="text-green-900">{action}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-gray-600">Executed {workflow.runsCount} times in the last 30 days</p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Workflow CTA */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-8 text-white text-center">
        <h3 className="mb-3">Automate Your Hiring Process</h3>
        <p className="mb-6 opacity-90">
          Save time and reduce manual work by creating custom workflows for your recruitment process
        </p>
        <button className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors">
          Create Your First Workflow
        </button>
      </div>
    </div>
  );
}
