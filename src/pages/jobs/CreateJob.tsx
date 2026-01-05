import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { jobService } from '../../services/localStorage.service';
import { useAuth } from '../../hooks/useAuth';

export default function CreateJob() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [skills, setSkills] = useState<Array<{ name: string; weight: number }>>([]);
  const [newSkill, setNewSkill] = useState('');
  const [interviewRounds, setInterviewRounds] = useState([
    { id: 1, name: 'AI Screening', type: 'ai', duration: 30 },
  ]);

  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'full-time',
    salary_min: '',
    salary_max: '',
    experience_min: '',
    experience_max: '',
    description: '',
  });

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { name: newSkill, weight: 5 }]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSkillWeightChange = (index: number, weight: number) => {
    const updated = [...skills];
    updated[index].weight = weight;
    setSkills(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      console.error('No user logged in');
      return;
    }

    // Prepare salary string
    const salaryString = formData.salary_min && formData.salary_max
      ? `$${formData.salary_min} - $${formData.salary_max}`
      : undefined;

    // Prepare experience string
    const experienceString = formData.experience_min && formData.experience_max
      ? `${formData.experience_min}-${formData.experience_max} years`
      : formData.experience_min
        ? `${formData.experience_min}+ years`
        : undefined;

    // Create job object
    const newJob = {
      title: formData.title,
      company: currentUser.organizationName || `${currentUser.firstName} ${currentUser.lastName}`,
      location: formData.location,
      type: formData.type as 'full-time' | 'part-time' | 'contract' | 'internship',
      experience: experienceString || '0+ years',
      salary: salaryString,
      description: formData.description,
      requirements: [`${formData.experience_min || 0}+ years of experience`, formData.description],
      skills: skills.map(s => s.name),
      status: 'active' as const,
      recruiterId: currentUser.id,
    };

    console.log('Creating job:', newJob);
    const createdJob = jobService.create(newJob);
    console.log('Job created successfully:', createdJob);

    // Navigate back to jobs list
    navigate('/dashboard/jobs');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/dashboard/jobs')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-gray-900 mb-2">Create New Job</h1>
          <p className="text-gray-600">Post a new position and start receiving applications</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-gray-900 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Job Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Senior Frontend Developer"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Department *</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Engineering"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Remote, New York, NY"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Employment Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Salary Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.salary_min}
                  onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={formData.salary_max}
                  onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Max"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Job Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32"
                placeholder="Describe the role, responsibilities, and requirements..."
                required
              />
            </div>
          </div>
        </div>

        {/* Required Skills */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-gray-900 mb-6">Required Skills & Weights</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Add a required skill (e.g., React, Python, Leadership)"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {skills.length > 0 && (
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <span className="flex-1 text-gray-900">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <label className="text-gray-600">Weight:</label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={skill.weight}
                        onChange={(e) => handleSkillWeightChange(index, parseInt(e.target.value))}
                        className="w-24"
                      />
                      <span className="w-8 text-gray-900">{skill.weight}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Experience Range */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-gray-900 mb-6">Experience Requirements</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 mb-2">Minimum Years</label>
              <input
                type="number"
                value={formData.experience_min}
                onChange={(e) => setFormData({ ...formData, experience_min: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Maximum Years</label>
              <input
                type="number"
                value={formData.experience_max}
                onChange={(e) => setFormData({ ...formData, experience_max: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="10"
              />
            </div>
          </div>
        </div>

        {/* Interview Rounds */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-gray-900 mb-6">Interview Process</h2>
          <div className="space-y-3">
            {interviewRounds.map((round, index) => (
              <div key={round.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900">{round.name}</p>
                  <p className="text-gray-600">{round.duration} minutes</p>
                </div>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full">
                  {round.type === 'ai' ? 'AI Interview' : 'Manual'}
                </span>
              </div>
            ))}
            <button
              type="button"
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              + Add Interview Round
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate('/dashboard/jobs')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Publish Job
          </button>
        </div>
      </form>
    </div>
  );
}
