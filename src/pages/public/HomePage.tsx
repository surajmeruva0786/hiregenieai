import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, Brain, Zap, Users, BarChart3, Menu, Star, TrendingUp, Shield } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative border-b border-white/10 backdrop-blur-xl bg-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                HireGenie AI
              </span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Pricing', 'About', 'Contact'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link to={`/${item.toLowerCase()}`} className="text-gray-300 hover:text-white transition-colors relative group">
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center gap-3"
            >
              <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link to="/signup" className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105">
                Start Free Trial
              </Link>
            </motion.div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-full mb-8 backdrop-blur-sm"
            >
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-gray-300">AI-Powered Recruitment Platform</span>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 max-w-5xl mx-auto"
            >
              <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
                Hire Smarter, Faster with
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                AI-Powered Magic
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-400 mb-12 max-w-3xl mx-auto text-lg"
            >
              Transform your hiring process with intelligent resume screening, automated AI interviews, 
              and data-driven candidate insights. <span className="text-indigo-400 font-semibold">Save 80% of screening time.</span>
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <Link
                to="/signup"
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 relative overflow-hidden"
              >
                <span className="relative z-10">Start Free Trial</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link
                to="/features"
                className="px-8 py-4 border border-indigo-500/50 text-white rounded-xl hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
              >
                Watch Demo
              </Link>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-500 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              No credit card required • 14-day free trial
            </motion.p>
          </motion.div>

          {/* Floating Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-5xl mx-auto"
          >
            {[
              { value: '80%', label: 'Time Saved', icon: TrendingUp },
              { value: '10k+', label: 'Candidates Screened', icon: Users },
              { value: '95%', label: 'Accuracy Rate', icon: Star },
              { value: '500+', label: 'Companies', icon: Shield },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-300">
                  <stat.icon className="w-6 h-6 text-indigo-400 mb-2" />
                  <div className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-1">
                    {stat.value}
                  </div>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Streamline your entire hiring process in just 3 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 -translate-y-1/2"></div>

            {[
              {
                step: '01',
                title: 'Post Jobs & Upload Resumes',
                description: 'Create job postings with AI-optimized descriptions. Bulk upload resumes or receive applications automatically.',
                icon: Users,
                color: 'from-blue-500 to-cyan-500',
              },
              {
                step: '02',
                title: 'AI Screens & Ranks Candidates',
                description: 'Our AI analyzes skills, experience, and fit. Get instant candidate rankings with detailed insights.',
                icon: Brain,
                color: 'from-purple-500 to-pink-500',
              },
              {
                step: '03',
                title: 'Conduct AI Interviews',
                description: 'Automated AI interviews assess technical skills and soft skills. Review results and make faster decisions.',
                icon: Zap,
                color: 'from-orange-500 to-red-500',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity`}></div>
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/20 transition-all duration-500 transform hover:scale-105">
                  <div className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-indigo-400 mb-4 font-mono">Step {item.step}</div>
                  <h3 className="text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Everything you need to build a modern, efficient hiring process
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Resume Screening',
                description: 'AI-powered analysis of resumes with intelligent skill matching and experience evaluation',
                icon: CheckCircle2,
                gradient: 'from-emerald-500 to-teal-500',
              },
              {
                title: 'AI Interviews',
                description: 'Automated video or chat interviews that assess candidates fairly and consistently',
                icon: Brain,
                gradient: 'from-purple-500 to-pink-500',
              },
              {
                title: 'Analytics Dashboard',
                description: 'Track hiring metrics, funnel performance, and optimize your recruitment strategy',
                icon: BarChart3,
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                title: 'Candidate Ranking',
                description: 'Get AI-powered rankings with detailed explanations for each candidate',
                icon: Users,
                gradient: 'from-orange-500 to-amber-500',
              },
              {
                title: 'Workflow Automation',
                description: 'Automate repetitive tasks like email sending, interview scheduling, and status updates',
                icon: Zap,
                gradient: 'from-pink-500 to-rose-500',
              },
              {
                title: 'Bias Detection',
                description: 'Built-in fairness monitoring to ensure equitable hiring decisions',
                icon: Shield,
                gradient: 'from-indigo-500 to-purple-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-10 blur transition-opacity`}></div>
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all duration-300 h-full">
                  <div className={`inline-flex p-3 bg-gradient-to-r ${feature.gradient} rounded-xl mb-4 shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur-3xl opacity-30"></div>
            <div className="relative bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
              <h2 className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-6">
                Ready to Transform Your Hiring?
              </h2>
              <p className="text-gray-400 mb-8 text-lg">
                Join hundreds of companies using HireGenie AI to find the best talent faster
              </p>
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-gray-400">
            <p>© 2025 HireGenie AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}