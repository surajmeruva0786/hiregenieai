import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Activity {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
  color: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const colorClasses: Record<string, { bg: string; icon: string; glow: string }> = {
  blue: { bg: 'bg-blue-100', icon: 'text-blue-600', glow: 'from-blue-500 to-cyan-500' },
  green: { bg: 'bg-green-100', icon: 'text-green-600', glow: 'from-green-500 to-emerald-500' },
  purple: { bg: 'bg-purple-100', icon: 'text-purple-600', glow: 'from-purple-500 to-pink-500' },
  orange: { bg: 'bg-orange-100', icon: 'text-orange-600', glow: 'from-orange-500 to-red-500' },
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-shadow">
      <h2 className="text-gray-900 mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const colors = colorClasses[activity.color] || colorClasses.blue;
          
          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group flex gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-300 cursor-pointer"
            >
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${colors.glow} rounded-xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity`}></div>
                <div className={`relative w-10 h-10 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0 transform group-hover:scale-110 transition-transform`}>
                  <activity.icon className={`w-5 h-5 ${colors.icon}`} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 group-hover:text-indigo-600 transition-colors">{activity.title}</p>
                <p className="text-gray-600">{activity.description}</p>
                <p className="text-gray-500 mt-1">{activity.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}