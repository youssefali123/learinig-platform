import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiBookOpen, HiUsers, HiStar, HiCurrencyDollar, HiPlusCircle, HiTrendingUp } from 'react-icons/hi';
import StatsCard from '../../components/common/StatsCard';

const InstructorDashboard = () => {
    const { user } = useSelector((s) => s.auth);
    const { courses } = useSelector((s) => s.courses);
    const myCourses = courses.filter((c) => c.instructorId === user?.id);
    const totalStudents = myCourses.reduce((a, c) => a + c.studentsCount, 0);
    const avgRating = myCourses.length > 0 ? (myCourses.reduce((a, c) => a + c.rating, 0) / myCourses.length).toFixed(1) : 0;
    const totalRevenue = myCourses.reduce((a, c) => a + c.price * c.studentsCount, 0);

    const recentActivity = [
        { text: 'New student enrolled in React Course', time: '2 hours ago', icon: '👨‍🎓' },
        { text: 'Quiz submitted by Emma Wilson', time: '4 hours ago', icon: '📝' },
        { text: 'New review on CSS Masterclass', time: '1 day ago', icon: 'â­' },
        { text: '5 new enrollments this week', time: '2 days ago', icon: '🎉' },
    ];

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Welcome, <span className="gradient-text">{user?.name}</span> 👋</h1>
                    <p className="text-text-secondary text-sm mt-1">Here's what's happening with your courses</p>
                </div>
                <Link to="/instructor/courses/new"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-primary-500/30 transition-all">
                    <HiPlusCircle className="w-5 h-5" /> New Course
                </Link>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard icon={HiBookOpen} label="My Courses" value={myCourses.length} color="primary" trend={12} index={0} />
                <StatsCard icon={HiUsers} label="Total Students" value={totalStudents.toLocaleString()} color="green" trend={8} index={1} />
                <StatsCard icon={HiStar} label="Avg Rating" value={avgRating} color="orange" index={2} />
                <StatsCard icon={HiCurrencyDollar} label="Total Revenue" value={`$${(totalRevenue / 1000).toFixed(1)}K`} color="purple" trend={15} index={3} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* My Courses */}
                <div className="lg:col-span-2">
                    <h2 className="text-lg font-bold text-text-primary mb-4">My Courses</h2>
                    <div className="space-y-3">
                        {myCourses.map((course, i) => (
                            <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                                className="flex gap-4 bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all">
                                <img src={course.thumbnail} alt={course.title} className="w-20 h-16 rounded-lg object-cover shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold text-text-primary truncate">{course.title}</h3>
                                    <div className="flex items-center gap-4 mt-1 text-xs text-text-secondary">
                                        <span className="flex items-center gap-1"><HiUsers className="w-3.5 h-3.5" />{course.studentsCount}</span>
                                        <span className="flex items-center gap-1"><HiStar className="w-3.5 h-3.5 text-amber-400" />{course.rating}</span>
                                        <span>${course.price}</span>
                                    </div>
                                </div>
                                <Link to={`/instructor/courses/${course.id}/edit`}
                                    className="self-center px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 dark:bg-primary-900/40 transition-colors">
                                    Edit
                                </Link>
                            </motion.div>
                        ))}
                        {myCourses.length === 0 && (
                            <div className="text-center py-8 bg-card rounded-xl border border-border">
                                <p className="text-4xl mb-2">📚</p>
                                <p className="text-sm text-text-secondary">No courses yet. Create your first course!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h2 className="text-lg font-bold text-text-primary mb-4">Recent Activity</h2>
                    <div className="bg-card rounded-xl border border-border divide-y divide-gray-50">
                        {recentActivity.map((item, i) => (
                            <div key={i} className="flex gap-3 p-4">
                                <span className="text-xl">{item.icon}</span>
                                <div>
                                    <p className="text-sm text-text-secondary">{item.text}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;

