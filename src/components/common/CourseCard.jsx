import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar, HiUsers, HiClock, HiPlay } from 'react-icons/hi';

const CourseCard = ({ course, index = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -6 }}
            className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-border transition-shadow duration-300"
        >
            <Link to={`/courses/${course.id}`}>
                {/* Thumbnail */}
                <div className="relative overflow-hidden">
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                            <HiPlay className="w-6 h-6 text-primary-600 ml-1" />
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {course.isBestseller && (
                            <span className="px-2.5 py-1 text-xs font-semibold bg-amber-400 text-amber-900 rounded-lg">
                                Bestseller
                            </span>
                        )}
                        <span className="px-2.5 py-1 text-xs font-medium bg-white/90 text-text-secondary rounded-lg backdrop-blur-sm">
                            {course.level}
                        </span>
                    </div>

                    {/* Price */}
                    <div className="absolute top-3 right-3">
                        <span className="px-3 py-1.5 text-sm font-bold bg-primary-600 text-white rounded-lg shadow-lg shadow-primary-600/30">
                            ${course.price}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
                            {course.category}
                        </span>
                    </div>

                    <h3 className="text-base font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
                        {course.title}
                    </h3>

                    <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                        {course.shortDescription}
                    </p>

                    {/* Instructor */}
                    <div className="flex items-center gap-2 mb-3">
                        <img
                            src={course.instructorAvatar}
                            alt={course.instructorName}
                            className="w-6 h-6 rounded-full"
                        />
                        <span className="text-xs text-text-secondary">{course.instructorName}</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-1">
                            <HiStar className="w-4 h-4 text-amber-400" />
                            <span className="text-sm font-semibold text-text-secondary">{course.rating}</span>
                            <span className="text-xs text-gray-400">({course.reviewsCount})</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                                <HiUsers className="w-3.5 h-3.5" />
                                {course.studentsCount.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                                <HiClock className="w-3.5 h-3.5" />
                                {course.duration}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default CourseCard;

