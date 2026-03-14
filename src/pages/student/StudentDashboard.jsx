import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiBookOpen, HiAcademicCap, HiTrendingUp, HiClock } from 'react-icons/hi';
import StatsCard from '../../components/common/StatsCard';
import ProgressBar from '../../components/common/ProgressBar';

const StudentDashboard = () => {
    const { user } = useSelector((s) => s.auth);
    const { courses, enrolledCourses, completedLessons } = useSelector((s) => s.courses);
    const enrolled = courses.filter((c) => enrolledCourses.includes(c.id));

    const getProgress = (courseId) => {
        const course = courses.find((c) => c.id === courseId);
        if (!course) return 0;
        const total = course.curriculum?.reduce((a, s) => a + s.lessons.length, 0) || 1;
        const done = (completedLessons[courseId] || []).length;
        return Math.round((done / total) * 100);
    };

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-2xl font-bold text-text-primary">Welcome back, <span className="gradient-text">{user?.name}</span> 👋</h1>
                <p className="text-text-secondary text-sm mt-1">Continue your learning journey</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard icon={HiBookOpen} label="Enrolled Courses" value={enrolled.length} color="primary" index={0} />
                <StatsCard icon={HiAcademicCap} label="Completed" value={enrolled.filter((c) => getProgress(c.id) === 100).length} color="green" index={1} />
                <StatsCard icon={HiTrendingUp} label="In Progress" value={enrolled.filter((c) => getProgress(c.id) > 0 && getProgress(c.id) < 100).length} color="orange" index={2} />
                <StatsCard icon={HiClock} label="Learning Hours" value="12.5h" color="purple" index={3} />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-text-primary">Continue Learning</h2>
                    <Link to="/student/courses" className="text-sm text-primary-600 font-medium hover:text-primary-700">View All</Link>
                </div>

                {enrolled.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {enrolled.map((course) => (
                            <Link key={course.id} to={`/student/courses/${course.id}`}
                                className="group bg-card rounded-2xl border border-border p-4 hover:shadow-lg transition-all duration-300">
                                <div className="flex gap-4">
                                    <img src={course.thumbnail} alt={course.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-primary-600 transition-colors">{course.title}</h3>
                                        <p className="text-xs text-gray-400 mt-1">{course.instructorName}</p>
                                        <div className="mt-2">
                                            <ProgressBar value={getProgress(course.id)} size="sm" color={getProgress(course.id) === 100 ? 'green' : 'primary'} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-card rounded-2xl border border-border">
                        <p className="text-4xl mb-3">📚</p>
                        <h3 className="text-lg font-semibold text-text-secondary mb-2">No courses yet</h3>
                        <p className="text-sm text-text-secondary mb-4">Start your learning journey today!</p>
                        <Link to="/courses" className="px-5 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors">Browse Courses</Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default StudentDashboard;

