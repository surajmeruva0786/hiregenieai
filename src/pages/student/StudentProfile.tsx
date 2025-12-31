import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Plus, Edit2, Upload, CheckCircle2, Linkedin, Github, Globe } from 'lucide-react';

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const profile = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Full Stack Developer',
    bio: 'Passionate software developer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and modern web technologies.',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
    website: 'johndoe.dev',
    profileCompletion: 85,
  };

  const skills = [
    { name: 'React', level: 95, years: 5 },
    { name: 'TypeScript', level: 90, years: 4 },
    { name: 'Node.js', level: 85, years: 5 },
    { name: 'Python', level: 80, years: 3 },
    { name: 'AWS', level: 75, years: 2 },
    { name: 'GraphQL', level: 70, years: 2 },
  ];

  const experience = [
    {
      id: 1,
      title: 'Senior Full Stack Developer',
      company: 'Tech Solutions Inc.',
      location: 'Remote',
      start: '2022-01',
      end: 'Present',
      description: 'Leading development of enterprise SaaS platform serving 10k+ users. Architected microservices infrastructure and mentored junior developers.',
    },
    {
      id: 2,
      title: 'Full Stack Developer',
      company: 'StartupX',
      location: 'San Francisco, CA',
      start: '2020-06',
      end: '2021-12',
      description: 'Built and maintained React-based web applications. Improved application performance by 40% through optimization techniques.',
    },
  ];

  const education = [
    {
      id: 1,
      degree: 'Bachelor of Science in Computer Science',
      school: 'University of California, Berkeley',
      year: '2015 - 2019',
      gpa: '3.8/4.0',
    },
  ];

  const certifications = [
    { id: 1, name: 'AWS Certified Solutions Architect', issuer: 'Amazon', year: 2023 },
    { id: 2, name: 'React Advanced Certification', issuer: 'Meta', year: 2022 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your professional information</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Completion */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between mb-3">
          <h3>Profile Completion</h3>
          <span className="text-2xl">{profile.profileCompletion}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 mb-3">
          <div
            className="bg-white h-3 rounded-full transition-all"
            style={{ width: `${profile.profileCompletion}%` }}
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
                  <span className="text-white text-3xl">JD</span>
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Upload className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <h2 className="text-gray-900 mb-1">{profile.name}</h2>
              <p className="text-gray-600 mb-4">{profile.title}</p>
              <div className="flex justify-center gap-3">
                <a href={`https://${profile.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors">
                  <Linkedin className="w-5 h-5 text-blue-600" />
                </a>
                <a href={`https://${profile.github}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <Github className="w-5 h-5 text-gray-700" />
                </a>
                <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center hover:bg-purple-200 transition-colors">
                  <Globe className="w-5 h-5 text-purple-600" />
                </a>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="break-all">{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{profile.location}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* About */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">About Me</h3>
              {isEditing && (
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Skills</h3>
              {isEditing && (
                <button className="flex items-center gap-2 px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              )}
            </div>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700">{skill.name}</span>
                    <span className="text-gray-600">{skill.years} years • {skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <h3 className="text-gray-900">Work Experience</h3>
              </div>
              {isEditing && (
                <button className="flex items-center gap-2 px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Experience
                </button>
              )}
            </div>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-indigo-600">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-600 rounded-full"></div>
                  <h4 className="text-gray-900 mb-1">{exp.title}</h4>
                  <p className="text-gray-600 mb-2">{exp.company} • {exp.location}</p>
                  <p className="text-gray-500 mb-2">{exp.start} - {exp.end}</p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <h3 className="text-gray-900">Education</h3>
              </div>
              {isEditing && (
                <button className="flex items-center gap-2 px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Education
                </button>
              )}
            </div>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <h4 className="text-gray-900 mb-1">{edu.degree}</h4>
                  <p className="text-gray-600 mb-1">{edu.school}</p>
                  <div className="flex items-center gap-3 text-gray-600">
                    <span>{edu.year}</span>
                    <span>•</span>
                    <span>GPA: {edu.gpa}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-600" />
                <h3 className="text-gray-900">Certifications</h3>
              </div>
              {isEditing && (
                <button className="flex items-center gap-2 px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Certification
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-gray-900 mb-1">{cert.name}</h4>
                    <p className="text-gray-600">{cert.issuer} • {cert.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
