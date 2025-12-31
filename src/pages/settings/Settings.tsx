import { useState } from 'react';
import { Building2, Users, Bell, Brain, Lock } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('company');

  const tabs = [
    { id: 'company', label: 'Company Settings', icon: Building2 },
    { id: 'team', label: 'Team Management', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'ai', label: 'AI Settings', icon: Brain },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            {activeTab === 'company' && (
              <div className="space-y-6">
                <h2 className="text-gray-900 mb-6">Company Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      defaultValue="Tech Corp"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Industry</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>Technology</option>
                      <option>Finance</option>
                      <option>Healthcare</option>
                      <option>Retail</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Company Size</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      <option>1-10 employees</option>
                      <option>11-50 employees</option>
                      <option>51-200 employees</option>
                      <option>201-500 employees</option>
                      <option>500+ employees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Company Logo</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                        TC
                      </div>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Upload New Logo
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Cancel
                  </button>
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-gray-900">Team Members</h2>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Invite Member
                  </button>
                </div>
                <div className="space-y-4">
                  {[
                    { name: 'John Doe', email: 'john@techcorp.com', role: 'Admin', avatar: 'JD' },
                    { name: 'Jane Smith', email: 'jane@techcorp.com', role: 'Recruiter', avatar: 'JS' },
                    { name: 'Bob Johnson', email: 'bob@techcorp.com', role: 'Hiring Manager', avatar: 'BJ' },
                  ].map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                          {member.avatar}
                        </div>
                        <div>
                          <p className="text-gray-900">{member.name}</p>
                          <p className="text-gray-600">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          defaultValue={member.role}
                          className="px-3 py-1 border border-gray-300 rounded-lg"
                        >
                          <option>Admin</option>
                          <option>Recruiter</option>
                          <option>Hiring Manager</option>
                        </select>
                        <button className="text-red-600 hover:text-red-700">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-gray-900 mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: 'New candidate applications', description: 'Get notified when someone applies to your jobs' },
                    { label: 'Interview reminders', description: 'Reminders before scheduled interviews' },
                    { label: 'AI analysis complete', description: 'When AI finishes analyzing candidates' },
                    { label: 'Weekly reports', description: 'Receive weekly hiring analytics reports' },
                    { label: 'Team mentions', description: 'When someone mentions you in comments' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <p className="text-gray-900 mb-1">{item.label}</p>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="w-4 h-4" />
                          <span className="text-gray-700">Email</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="w-4 h-4" />
                          <span className="text-gray-700">In-app</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <h2 className="text-gray-900 mb-6">AI Configuration</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Minimum AI Score Threshold</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="70"
                      className="w-full"
                    />
                    <p className="text-gray-600 mt-1">
                      Candidates below this score will be automatically rejected
                    </p>
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-3">Scoring Weights</label>
                    <div className="space-y-4">
                      {[
                        { label: 'Technical Skills', value: 40 },
                        { label: 'Experience', value: 30 },
                        { label: 'Culture Fit', value: 20 },
                        { label: 'Communication', value: 10 },
                      ].map((weight, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <span className="w-40 text-gray-700">{weight.label}</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            defaultValue={weight.value}
                            className="flex-1"
                          />
                          <span className="w-12 text-gray-900">{weight.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-gray-700">Enable bias detection and alerts</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-gray-700">Anonymize candidate data during initial screening</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Reset to Defaults
                  </button>
                  <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Save Settings
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-gray-900 mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-gray-700">Enable two-factor authentication</span>
                    </label>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
