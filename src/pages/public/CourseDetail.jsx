import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { HiStar, HiUsers, HiClock, HiPlay, HiDocumentText, HiPhotograph, HiCheckCircle, HiAcademicCap, HiArrowLeft } from 'react-icons/hi';
import { enrollCourse } from '../../features/coursesSlice';
import { getQuizzesByCourse } from '../../data/quizzes';
import toast from 'react-hot-toast';
import { useState } from 'react';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { courses, enrolledCourses } = useSelector((s) => s.courses);
    const { isAuthenticated, user } = useSelector((s) => s.auth);
    const course = courses.find((c) => c.id === Number(id));
    const [activeTab, setActiveTab] = useState('overview');
    const quizzes = getQuizzesByCourse(id);
    const isEnrolled = enrolledCourses.includes(Number(id));

    if (!course) return <div className="text-center py-20"><p className="text-xl text-text-secondary">Course not found</p><Link to="/courses" className="text-primary-600 mt-4 inline-block">Browse Courses</Link></div>;

    const handleEnroll = () => {
        if (!isAuthenticated) { navigate('/login'); return; }
        dispatch(enrollCourse(course.id));
        toast.success('Successfully enrolled! 🎉');
    };

    const lessonIcon = (type) => {
        switch (type) {
            case 'video': return <HiPlay className="w-4 h-4 text-primary-500" />;
            case 'pdf': return <HiDocumentText className="w-4 h-4 text-red-500" />;
            case 'image': return <HiPhotograph className="w-4 h-4 text-green-500" />;
            default: return <HiPlay className="w-4 h-4 text-gray-400" />;
        }
    };

    const tabs = ['overview', 'curriculum', 'instructor', 'reviews'];
    const totalLessons = course.curriculum?.reduce((acc, s) => acc + s.lessons.length, 0) || 0;

    return (
        <div>
            {/* Hero */}
            <div className="bg-gradient-to-r from-gray-900 via-primary-900 to-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-indigo-300 hover:text-white mb-6 transition-colors">
                        <HiArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-3 py-1 text-xs font-medium bg-primary-500/20 text-primary-300 rounded-lg">{course.category}</span>
                                <span className="px-3 py-1 text-xs font-medium bg-white/10 rounded-lg">{course.level}</span>
                                {course.isBestseller && <span className="px-3 py-1 text-xs font-semibold bg-amber-400 text-amber-900 rounded-lg">Bestseller</span>}
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
                            <p className="text-indigo-200 mb-4 max-w-2xl">{course.description}</p>
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <span className="flex items-center gap-1"><HiStar className="w-5 h-5 text-amber-400" /><b>{course.rating}</b> ({course.reviewsCount} reviews)</span>
                                <span className="flex items-center gap-1"><HiUsers className="w-5 h-5 text-indigo-300" />{course.studentsCount.toLocaleString()} students</span>
                                <span className="flex items-center gap-1"><HiClock className="w-5 h-5 text-indigo-300" />{course.duration}</span>
                                <span className="flex items-center gap-1"><HiAcademicCap className="w-5 h-5 text-indigo-300" />{totalLessons} lessons</span>
                            </div>
                            <div className="flex items-center gap-3 mt-4">
                                <img src={course.instructorAvatar} alt={course.instructorName} className="w-10 h-10 rounded-full ring-2 ring-white/20" />
                                <div><p className="text-sm font-medium">{course.instructorName}</p><p className="text-xs text-indigo-300">Instructor</p></div>
                            </div>
                        </div>

                        {/* Sidebar Card */}
                        <div className="bg-card rounded-2xl shadow-2xl p-6 text-text-primary h-fit">
                            <img src={course.thumbnail} alt={course.title} className="w-full h-44 object-cover rounded-xl mb-4" />
                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-3xl font-bold text-text-primary">${course.price}</span>
                                <span className="text-lg text-gray-400 line-through">${course.originalPrice}</span>
                                <span className="text-sm font-semibold text-emerald-500">{Math.round((1 - course.price / course.originalPrice) * 100)}% off</span>
                            </div>
                            {isEnrolled ? (
                                <Link to={`/student/courses/${course.id}`} className="block w-full text-center py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                                    Continue Learning
                                </Link>
                            ) : (
                                <button onClick={handleEnroll} className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all">
                                    Enroll Now
                                </button>
                            )}
                            {quizzes.length > 0 && (
                                <Link to={isAuthenticated ? `/student/quiz/${quizzes[0].id}` : '/login'} className="block w-full text-center py-3 mt-3 border-2 border-primary-200 text-primary-600 font-semibold rounded-xl hover:bg-primary-100 dark:bg-primary-900/40 dark:hover:bg-primary-900/30 transition-all">
                                    Take Quiz ({quizzes.length} available)
                                </Link>
                            )}
                            <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                                <li className="flex items-center gap-2"><HiCheckCircle className="w-4 h-4 text-emerald-500" />{course.duration} of content</li>
                                <li className="flex items-center gap-2"><HiCheckCircle className="w-4 h-4 text-emerald-500" />{totalLessons} lessons</li>
                                <li className="flex items-center gap-2"><HiCheckCircle className="w-4 h-4 text-emerald-500" />Certificate of completion</li>
                                <li className="flex items-center gap-2"><HiCheckCircle className="w-4 h-4 text-emerald-500" />Lifetime access</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-1 border-b border-border mb-8">
                    {tabs.map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-5 py-3 text-sm font-medium capitalize transition-all border-b-2 -mb-[1px] ${activeTab === tab ? 'border-primary-500 text-primary-600' : 'border-transparent text-text-secondary hover:text-text-secondary'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="lg:max-w-3xl">
                    {activeTab === 'overview' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-xl font-bold text-text-primary mb-4">What you'll learn</h2>
                            <div className="grid md:grid-cols-2 gap-3 mb-8">
                                {course.objectives?.map((obj, i) => (
                                    <div key={i} className="flex gap-3 p-3 bg-primary-50 rounded-xl"><HiCheckCircle className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" /><span className="text-sm text-text-secondary">{obj}</span></div>
                                ))}
                            </div>
                            <h2 className="text-xl font-bold text-text-primary mb-4">Requirements</h2>
                            <ul className="space-y-2 mb-8">
                                {course.requirements?.map((req, i) => (<li key={i} className="text-sm text-text-secondary flex items-start gap-2"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 shrink-0" />{req}</li>))}
                            </ul>
                            <h2 className="text-xl font-bold text-text-primary mb-4">Tags</h2>
                            <div className="flex flex-wrap gap-2">
                                {course.tags?.map((tag) => (<span key={tag} className="px-3 py-1 text-xs font-medium bg-gray-100 text-text-secondary rounded-lg">{tag}</span>))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'curriculum' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <h2 className="text-xl font-bold text-text-primary mb-4">Course Curriculum</h2>
                            <p className="text-sm text-text-secondary mb-6">{course.curriculum?.length} sections â€¢ {totalLessons} lessons</p>
                            <div className="space-y-4">
                                {course.curriculum?.map((section) => (
                                    <div key={section.id} className="bg-card rounded-xl border border-border overflow-hidden">
                                        <div className="px-5 py-4 bg-surface font-semibold text-sm text-text-primary">{section.title}<span className="text-gray-400 font-normal ml-2">({section.lessons.length} lessons)</span></div>
                                        <div className="divide-y divide-gray-50">
                                            {section.lessons.map((lesson) => (
                                                <div key={lesson.id} className="flex items-center justify-between px-5 py-3 hover:bg-primary-100 dark:bg-primary-900/40 dark:hover:bg-primary-900/30/50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        {lessonIcon(lesson.type)}
                                                        <span className="text-sm text-text-secondary">{lesson.title}</span>
                                                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-text-secondary rounded capitalize">{lesson.type}</span>
                                                    </div>
                                                    <span className="text-xs text-gray-400">{lesson.duration}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'instructor' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-6 p-6 bg-card rounded-2xl border border-border">
                            <img src={course.instructorAvatar} alt={course.instructorName} className="w-20 h-20 rounded-2xl" />
                            <div>
                                <h3 className="text-xl font-bold text-text-primary">{course.instructorName}</h3>
                                <p className="text-sm text-primary-600 mb-3">Expert Instructor</p>
                                <div className="flex gap-4 text-sm text-text-secondary mb-3">
                                    <span className="flex items-center gap-1"><HiStar className="w-4 h-4 text-amber-400" />4.8 Rating</span>
                                    <span className="flex items-center gap-1"><HiUsers className="w-4 h-4" />1,200+ Students</span>
                                </div>
                                <p className="text-sm text-text-secondary leading-relaxed">Experienced professional with years of industry expertise. Passionate about teaching and helping students achieve their career goals.</p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'reviews' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex items-center gap-4 mb-8 p-6 bg-card rounded-2xl border border-border">
                                <div className="text-center"><p className="text-5xl font-bold text-text-primary">{course.rating}</p><div className="flex gap-0.5 mt-1">{Array.from({ length: 5 }).map((_, i) => <HiStar key={i} className={`w-5 h-5 ${i < Math.floor(course.rating) ? 'text-amber-400' : 'text-gray-200'}`} />)}</div><p className="text-xs text-gray-400 mt-1">{course.reviewsCount} reviews</p></div>
                            </div>
                            {[{ name: 'John D.', text: 'Excellent course! Very well structured.', rating: 5 }, { name: 'Maria S.', text: 'Great content. Helped me land a new job!', rating: 4 }].map((r, i) => (
                                <div key={i} className="p-5 bg-card rounded-xl border border-border mb-3">
                                    <div className="flex items-center gap-3 mb-2"><img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${r.name}`} alt="" className="w-8 h-8 rounded-full" /><span className="text-sm font-semibold text-text-secondary">{r.name}</span><div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, j) => <HiStar key={j} className={`w-3.5 h-3.5 ${j < r.rating ? 'text-amber-400' : 'text-gray-200'}`} />)}</div></div>
                                    <p className="text-sm text-text-secondary">{r.text}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;

