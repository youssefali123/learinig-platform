import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar, HiClock } from 'react-icons/hi';
import ProgressBar from '../../components/common/ProgressBar';

const MyCourses = () => {
    const { courses, enrolledCourses, completedLessons } = useSelector((s) => s.courses);
    const enrolled = courses.filter((c) => enrolledCourses.includes(c.id));

    const getProgress = (courseId) => {
        const course = courses.find((c) => c.id === courseId);
        if (!course) return 0;
        const total = course.curriculum?.reduce((a, s) => a + s.lessons.length, 0) || 1;
        return Math.round(((completedLessons[courseId] || []).length / total) * 100);
    };

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-2xl font-bold text-text-primary">My <span className="gradient-text">Courses</span></h1>
                <p className="text-text-secondary text-sm mt-1">{enrolled.length} courses enrolled</p>
            </motion.div>

            {enrolled.length > 0 ? (
                <div className="space-y-4">
                    {enrolled.map((course, i) => {
                        const progress = getProgress(course.id);
                        return (
                            <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <Link to={`/student/courses/${course.id}`}
                                    className="flex flex-col md:flex-row gap-5 bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-all group">
                                    <img src={course.thumbnail} alt={course.title} className="w-full md:w-48 h-32 rounded-xl object-cover shrink-0" />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">{course.category}</span>
                                                <h3 className="text-lg font-semibold text-text-primary mt-2 group-hover:text-primary-600 transition-colors">{course.title}</h3>
                                                <p className="text-sm text-text-secondary mt-1">{course.instructorName}</p>
                                            </div>
                                            <div className="hidden md:flex items-center gap-1 text-sm"><HiStar className="w-4 h-4 text-amber-400" />{course.rating}</div>
                                        </div>
                                        <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                                            <span className="flex items-center gap-1"><HiClock className="w-3.5 h-3.5" />{course.duration}</span>
                                            <span>{course.lessonsCount} lessons</span>
                                        </div>
                                        <div className="mt-3">
                                            <ProgressBar value={progress} label={progress === 100 ? 'âœ… Completed' : 'Progress'} color={progress === 100 ? 'green' : 'primary'} />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16 bg-card rounded-2xl border border-border">
                    <p className="text-5xl mb-4">📚</p>
                    <h3 className="text-xl font-semibold text-text-secondary mb-2">No courses yet</h3>
                    <Link to="/courses" className="px-5 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium">Browse Courses</Link>
                </div>
            )}
        </div>
    );
};

export default MyCourses;

