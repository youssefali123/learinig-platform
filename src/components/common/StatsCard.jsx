import { motion } from 'framer-motion';

const StatsCard = ({ icon: Icon, label, value, color = 'primary', trend, index = 0 }) => {
    const colors = {
        primary: 'from-primary-500 to-primary-600 shadow-primary-500/25',
        green: 'from-emerald-500 to-emerald-600 shadow-emerald-500/25',
        orange: 'from-orange-500 to-orange-600 shadow-orange-500/25',
        purple: 'from-purple-500 to-purple-600 shadow-purple-500/25',
        blue: 'from-blue-500 to-blue-600 shadow-blue-500/25',
        pink: 'from-pink-500 to-pink-600 shadow-pink-500/25',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-card rounded-2xl p-5 border border-border hover:shadow-lg transition-shadow duration-300"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-text-secondary mb-1">{label}</p>
                    <p className="text-2xl font-bold text-text-primary">{value}</p>
                    {trend && (
                        <p className={`text-xs mt-1 font-medium ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {trend > 0 ? 'â†‘' : 'â†“'} {Math.abs(trend)}% from last month
                        </p>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[color]} shadow-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </motion.div>
    );
};

export default StatsCard;

