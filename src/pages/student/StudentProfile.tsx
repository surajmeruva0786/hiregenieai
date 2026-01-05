import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Plus, Edit2, Upload, CheckCircle2, Linkedin, Github, Globe, Save } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/localStorage.service';

export default function StudentProfile() {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    title: '',
    bio: '',
    linkedin: '',
    github: '',
    website: '',
  });

  // Load user data when component mounts or currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: (currentUser as any).phone || '',
        location: (currentUser as any).location || '',
        title: (currentUser as any).title || 'Student',
        bio: (currentUser as any).bio || '',
        linkedin: (currentUser as any).linkedin || '',
        github: (currentUser as any).github || '',
        website: (currentUser as any).website || '',
      });
    }
  }, [currentUser]);

  const handleSave = () => {
    if (!currentUser) return;

    setIsSaving(true);
    console.log('Saving profile updates:', formData);

    const response = authService.updateUser(currentUser.id, formData);

    if (response.success) {
      console.log('Profile updated successfully');
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      console.error('Failed to update profile:', response.message);
    }

    setIsSaving(false);
  };

  const handleCancel = () => {
    // Reset form data to current user data
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phone: (currentUser as any).phone || '',
        location: (currentUser as any).location || '',
        title: (currentUser as any).title || 'Student',
        bio: (currentUser as any).bio || '',
        linkedin: (currentUser as any).linkedin || '',
        github: (currentUser as any).github || '',
        website: (currentUser as any).website || '',
      });
    }
    setIsEditing(false);
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  const profileCompletion = Math.round(
    (Object.values(formData).filter(v => v && v.trim()).length / Object.keys(formData).length) * 100
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your professional information</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <p className="text-green-700">{successMessage}</p>
        </motion.div>
      )}

      {/* Profile Completion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between mb-3">
          <h3>Profile Completion</h3>
          <span className="text-2xl">{profileCompletion}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 mb-3">
          <div
            className="bg-white h-3 rounded-full transition-all"
            style={{ width: `${profileCompletion}%` }}
          ></div>
        </div>
        <p className="text-indigo-100">
          Complete your profile to increase visibility to recruiters and get better job matches!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-white text-3xl">
                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <h2 className="text-gray-900 mb-1">{formData.firstName} {formData.lastName}</h2>
              <p className="text-gray-600 mb-4">{formData.title || 'Student'}</p>
              <div className="flex justify-center gap-3">
                {formData.linkedin && (
                  <a href={`https://${formData.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors">
                    <Linkedin className="w-5 h-5 text-blue-600" />
                  </a>
                )}
                {formData.github && (
                  <a href={`https://${formData.github}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <Github className="w-5 h-5 text-gray-700" />
                  </a>
                )}
                {formData.website && (
                  <a href={`https://${formData.website}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center hover:bg-purple-200 transition-colors">
                    <Globe className="w-5 h-5 text-purple-600" />
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="break-all">{formData.email}</span>
              </div>
              {formData.phone && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span>{formData.phone}</span>
                </div>
              )}
              {formData.location && (
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>{formData.location}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Personal Information */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-gray-900 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  placeholder="City, State"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Professional Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  placeholder="e.g., Full Stack Developer"
                />
              </div>
            </div>
          </div>

          {/* About Me */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-gray-900 mb-4">About Me</h3>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50 h-32"
              placeholder="Tell recruiters about yourself, your experience, and what you're looking for..."
            />
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-gray-900 mb-4">Social Links</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">LinkedIn</label>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  placeholder="linkedin.com/in/yourprofile"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">GitHub</label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  placeholder="github.com/yourusername"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Website/Portfolio</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                  placeholder="yourwebsite.com"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
