import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const colorClasses = {
  blue: {
    bg: 'from-blue-500 to-cyan-500',
    text: 'text-blue-600',
    bgLight: 'bg-blue-50',
    glow: 'shadow-blue-500/20',
  },
  green: {
    bg: 'from-green-500 to-emerald-500',
    text: 'text-green-600',
    bgLight: 'bg-green-50',
    glow: 'shadow-green-500/20',
  },
  purple: {
    bg: 'from-purple-500 to-pink-500',
    text: 'text-purple-600',
    bgLight: 'bg-purple-50',
    glow: 'shadow-purple-500/20',
  },
  orange: {
    bg: 'from-orange-500 to-red-500',
    text: 'text-orange-600',
    bgLight: 'bg-orange-50',
    glow: 'shadow-orange-500/20',
  },
};

export default function StatCard({ label, value, change, trend, icon: Icon, color }: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <div className="group relative overflow-hidden bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-gray-300 transition-all duration-300">
      {/* Animated gradient background on hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      
      {/* Glow effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${colors.bg} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10`}></div>

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 bg-gradient-to-br ${colors.bg} rounded-xl shadow-lg ${colors.glow} transform group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend !== 'neutral' && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                trend === 'up' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
            </motion.div>
          )}
        </div>

        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-900 mb-1"
        >
          {value}
        </motion.h3>
        
        <p className="text-gray-600 mb-2">{label}</p>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`flex items-center gap-1 ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500'
          }`}
        >
          {change}
        </motion.p>
      </div>
    </div>
  );
}