import { motion } from 'framer-motion';

const ProgressBar = ({ value, max = 100, label, showPercentage = true, color = 'primary', size = 'md' }) => {
    const percentage = Math.round((value / max) * 100);

    const colors = {
        primary: 'from-primary-400 to-primary-600',
        green: 'from-emerald-400 to-emerald-600',
        orange: 'from-orange-400 to-orange-600',
        purple: 'from-purple-400 to-purple-600',
    };

    const sizes = {
        sm: 'h-1.5',
        md: 'h-2.5',
        lg: 'h-4',
    };

    return (
        <div className="w-full">
            {(label || showPercentage) && (
                <div className="flex justify-between items-center mb-1.5">
                    {label && <span className="text-xs font-medium text-text-secondary">{label}</span>}
                    {showPercentage && <span className="text-xs font-semibold text-text-secondary">{percentage}%</span>}
                </div>
            )}
            <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${sizes[size]}`}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`${sizes[size]} rounded-full bg-gradient-to-r ${colors[color]}`}
                />
            </div>
        </div>
    );
};

export default ProgressBar;

