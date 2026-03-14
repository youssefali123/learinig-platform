import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { HiTrendingUp, HiUsers, HiStar, HiBookOpen } from 'react-icons/hi';
import StatsCard from '../../components/common/StatsCard';

const Analytics = () => {
    const { user } = useSelector((s) => s.auth);
    const { courses } = useSelector((s) => s.courses);
    const myCourses = courses.filter((c) => c.instructorId === user?.id);

    const monthlyData = [
        { month: 'Sep', students: 45 }, { month: 'Oct', students: 78 }, { month: 'Nov', students: 120 },
        { month: 'Dec', students: 95 }, { month: 'Jan', students: 150 }, { month: 'Feb', students: 180 },
    ];

    const topCourses = [...myCourses].sort((a, b) => b.studentsCount - a.studentsCount);
    const maxStudents = Math.max(...monthlyData.map((d) => d.students));

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-2xl font-bold text-text-primary">Course <span className="gradient-text">Analytics</span></h1>
                <p className="text-text-secondary text-sm mt-1">Track your teaching performance</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatsCard icon={HiUsers} label="Total Students" value={myCourses.reduce((a, c) => a + c.studentsCount, 0).toLocaleString()} color="primary" trend={12} index={0} />
                <StatsCard icon={HiBookOpen} label="Active Courses" value={myCourses.length} color="green" index={1} />
                <StatsCard icon={HiStar} label="Avg Rating" value={(myCourses.reduce((a, c) => a + c.rating, 0) / (myCourses.length || 1)).toFixed(1)} color="orange" index={2} />
                <StatsCard icon={HiTrendingUp} label="Completion Rate" value="87%" color="purple" trend={5} index={3} />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Chart - Simple bar chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-6">Enrollment Trends</h3>
                    <div className="flex items-end justify-between gap-3 h-48">
                        {monthlyData.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <span className="text-xs font-semibold text-text-secondary">{d.students}</span>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(d.students / maxStudents) * 100}%` }}
                                    transition={{ duration: 0.8, delay: i * 0.1 }}
                                    className="w-full bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-lg min-h-[4px]"
                                />
                                <span className="text-xs text-gray-400">{d.month}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Top Courses */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">Top Courses</h3>
                    <div className="space-y-4">
                        {topCourses.map((course, i) => (
                            <div key={course.id} className="flex items-center gap-4">
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-gray-100 text-text-secondary' : 'bg-orange-50 text-orange-500'}`}>
                                    {i + 1}
                                </span>
                                <img src={course.thumbnail} alt={course.title} className="w-12 h-10 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-text-primary truncate">{course.title}</p>
                                    <p className="text-xs text-gray-400">{course.studentsCount} students</p>
                                </div>
                                <div className="flex items-center gap-1 text-sm">
                                    <HiStar className="w-4 h-4 text-amber-400" />
                                    <span className="font-semibold text-text-secondary">{course.rating}</span>
                                </div>
                            </div>
                        ))}
                        {topCourses.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No courses yet</p>}
                    </div>
                </motion.div>
            </div>

            {/* Course Performance Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-card rounded-2xl border border-border p-6 mt-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Course Performance</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead><tr className="text-left text-text-secondary border-b border-border">
                            <th className="pb-3 font-medium">Course</th><th className="pb-3 font-medium">Students</th><th className="pb-3 font-medium">Rating</th><th className="pb-3 font-medium">Revenue</th>
                        </tr></thead>
                        <tbody>
                            {myCourses.map((c) => (
                                <tr key={c.id} className="border-b border-gray-50">
                                    <td className="py-3 font-medium text-text-primary">{c.title}</td>
                                    <td className="py-3 text-text-secondary">{c.studentsCount.toLocaleString()}</td>
                                    <td className="py-3"><span className="flex items-center gap-1"><HiStar className="w-3.5 h-3.5 text-amber-400" />{c.rating}</span></td>
                                    <td className="py-3 text-text-secondary">${(c.price * c.studentsCount).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Analytics;

