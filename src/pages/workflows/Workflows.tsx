import { useState } from 'react';
import { Plus, Play, Pause, Edit, Trash2, Zap, X } from 'lucide-react';
import { useWorkflows } from '../../hooks/useWorkflows';
import { useAuth } from '../../hooks/useAuth';
import { workflowTemplates } from '../../data/workflowTemplates';
import type { Workflow, WorkflowTrigger, WorkflowCondition, WorkflowAction } from '../../types';

export default function Workflows() {
  const { workflows, isLoading, createWorkflow, deleteWorkflow, toggleWorkflowStatus } = useWorkflows();
  const { currentUser } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const handleToggleStatus = (id: string) => {
    const updated = toggleWorkflowStatus(id);
    if (updated) {
      console.log(`Workflow ${updated.status}:`, updated.name);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the workflow "${name}"?`)) {
      const success = deleteWorkflow(id);
      if (success) {
        console.log('Workflow deleted:', name);
      }
    }
  };

  const handleCreateFromTemplate = (template: typeof workflowTemplates[0]) => {
    if (!currentUser) return;

    const newWorkflow = createWorkflow({
      ...template,
      createdBy: currentUser.id,
      status: 'paused', // Start as paused so user can review
    });

    console.log('Created workflow from template:', newWorkflow.name);
    setShowTemplateModal(false);
  };

  const stats = {
    total: workflows.length,
    active: workflows.filter(w => w.status === 'active').length,
    paused: workflows.filter(w => w.status === 'paused').length,
    totalRuns: workflows.reduce((acc, w) => acc + w.executionCount, 0),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading workflows...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">AI Workflows</h1>
          <p className="text-gray-600">Automate your recruitment process with smart workflows</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
          >
            <Zap className="w-4 h-4" />
            Use Template
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            Create Workflow
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 mb-1">Total Workflows</p>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 mb-1">Active</p>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 mb-1">Paused</p>
          <p className="text-3xl font-bold text-gray-600">{stats.paused}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 mb-1">Total Executions</p>
          <p className="text-3xl font-bold text-indigo-600">{stats.totalRuns}</p>
        </div>
      </div>

      {/* Workflows List */}
      {workflows.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Zap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">No Workflows Yet</h3>
          <p className="text-gray-600 mb-6">
            Get started by creating a workflow from a template or building your own custom automation.
          </p>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Browse Templates
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <div key={workflow.id} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-900">{workflow.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${workflow.status === 'active'
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
                  <button
                    onClick={() => handleToggleStatus(workflow.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title={workflow.status === 'active' ? 'Pause workflow' : 'Activate workflow'}
                  >
                    {workflow.status === 'active' ? (
                      <Pause className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Play className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(workflow.id, workflow.name)}
                    className="p-2 hover:bg-red-100 rounded-lg"
                    title="Delete workflow"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Trigger</p>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                    <p className="text-sm text-indigo-900">
                      {workflow.trigger.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Conditions {workflow.conditions.length === 0 && '(Always run)'}
                  </p>
                  <div className="space-y-2">
                    {workflow.conditions.length === 0 ? (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-sm text-gray-600">No conditions</p>
                      </div>
                    ) : (
                      workflow.conditions.map((condition, index) => (
                        <div
                          key={index}
                          className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                        >
                          <p className="text-sm text-blue-900">
                            {condition.field} {condition.operator.replace(/_/g, ' ')} {condition.value}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Actions</p>
                  <div className="space-y-2">
                    {workflow.actions.map((action, index) => (
                      <div
                        key={index}
                        className="bg-green-50 border border-green-200 rounded-lg p-3"
                      >
                        <p className="text-sm text-green-900">
                          {action.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Executed {workflow.executionCount} time{workflow.executionCount !== 1 ? 's' : ''}
                  {workflow.lastExecutedAt && (
                    <span> • Last run: {new Date(workflow.lastExecutedAt).toLocaleString()}</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Workflow Templates</h2>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {workflowTemplates.map((template, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                    <button
                      onClick={() => handleCreateFromTemplate(template)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                    >
                      Use Template
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
                    <div>
                      <span className="text-gray-500">Trigger:</span>
                      <p className="text-gray-900 mt-1">
                        {template.trigger.type.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Conditions:</span>
                      <p className="text-gray-900 mt-1">
                        {template.conditions.length || 'None'}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Actions:</span>
                      <p className="text-gray-900 mt-1">
                        {template.actions.length}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Workflow CTA */}
      {workflows.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-xl font-bold mb-3">Automate Your Hiring Process</h3>
          <p className="mb-6 opacity-90">
            Save time and reduce manual work by creating custom workflows for your recruitment process
          </p>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="px-6 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Browse Workflow Templates
          </button>
        </div>
      )}
    </div>
  );
}
