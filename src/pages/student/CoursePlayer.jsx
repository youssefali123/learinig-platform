import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import ReactPlayer from 'react-player';
import { HiPlay, HiDocumentText, HiPhotograph, HiCheckCircle, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { completeLesson } from '../../features/coursesSlice';
import { getQuizzesByCourse } from '../../data/quizzes';
import ProgressBar from '../../components/common/ProgressBar';
import toast from 'react-hot-toast';

const CoursePlayer = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { courses, completedLessons } = useSelector((s) => s.courses);
    const course = courses.find((c) => c.id === Number(id));
    const [activeLesson, setActiveLesson] = useState(course?.curriculum?.[0]?.lessons?.[0] || null);
    const [expandedSections, setExpandedSections] = useState([course?.curriculum?.[0]?.id]);
    const completed = completedLessons[Number(id)] || [];
    const quizzes = getQuizzesByCourse(id);

    if (!course) return <div className="text-center py-20"><p className="text-xl text-text-secondary">Course not found</p></div>;

    const totalLessons = course.curriculum?.reduce((a, s) => a + s.lessons.length, 0) || 1;
    const progress = Math.round((completed.length / totalLessons) * 100);

    const toggleSection = (sectionId) => {
        setExpandedSections((prev) => prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]);
    };

    const handleComplete = () => {
        if (activeLesson && !completed.includes(activeLesson.id)) {
            dispatch(completeLesson({ courseId: course.id, lessonId: activeLesson.id }));
            toast.success('Lesson completed! 🎉');
        }
    };

    const typeIcon = (type) => {
        switch (type) {
            case 'video': return <HiPlay className="w-4 h-4" />;
            case 'pdf': return <HiDocumentText className="w-4 h-4" />;
            case 'image': return <HiPhotograph className="w-4 h-4" />;
            default: return <HiPlay className="w-4 h-4" />;
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-5rem)]">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
                <div className="bg-black rounded-2xl overflow-hidden mb-4 aspect-video">
                    {activeLesson?.type === 'video' ? (
                        <ReactPlayer url={activeLesson.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'} width="100%" height="100%" controls />
                    ) : activeLesson?.type === 'pdf' ? (
                        <div className="flex items-center justify-center h-full bg-surface">
                            <div className="text-center p-8"><HiDocumentText className="w-16 h-16 text-red-400 mx-auto mb-4" /><h3 className="text-lg font-semibold text-text-secondary">{activeLesson.title}</h3><p className="text-sm text-text-secondary mt-1">PDF Document</p><p className="text-xs text-gray-400 mt-2">In production, this would display the PDF viewer</p></div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full bg-surface">
                            <div className="text-center p-8"><HiPhotograph className="w-16 h-16 text-green-400 mx-auto mb-4" /><h3 className="text-lg font-semibold text-text-secondary">{activeLesson?.title}</h3><p className="text-sm text-text-secondary mt-1">Image Resource</p></div>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary">{activeLesson?.title}</h2>
                        <p className="text-sm text-text-secondary mt-1">{activeLesson?.type} â€¢ {activeLesson?.duration}</p>
                    </div>
                    <button onClick={handleComplete} disabled={completed.includes(activeLesson?.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${completed.includes(activeLesson?.id) ? 'bg-emerald-100 text-emerald-700' : 'bg-primary-500 text-white hover:bg-primary-600'}`}>
                        <HiCheckCircle className="w-4 h-4" />
                        {completed.includes(activeLesson?.id) ? 'Completed' : 'Mark Complete'}
                    </button>
                </div>
            </div>

            {/* Sidebar - Lesson List */}
            <div className="w-full lg:w-80 shrink-0 bg-card rounded-2xl border border-border overflow-hidden flex flex-col">
                <div className="p-4 border-b border-border">
                    <h3 className="text-sm font-semibold text-text-primary">Course Content</h3>
                    <ProgressBar value={progress} size="sm" className="mt-2" />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {course.curriculum?.map((section) => (
                        <div key={section.id}>
                            <button onClick={() => toggleSection(section.id)}
                                className="w-full px-4 py-3 bg-surface flex items-center justify-between text-sm font-medium text-text-secondary hover:bg-gray-100">
                                <span className="truncate">{section.title}</span>
                                {expandedSections.includes(section.id) ? <HiChevronUp className="w-4 h-4" /> : <HiChevronDown className="w-4 h-4" />}
                            </button>
                            {expandedSections.includes(section.id) && (
                                <div className="divide-y divide-gray-50">
                                    {section.lessons.map((lesson) => (
                                        <button key={lesson.id} onClick={() => setActiveLesson(lesson)}
                                            className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-primary-100 dark:bg-primary-900/40 dark:hover:bg-primary-900/30 transition-colors ${activeLesson?.id === lesson.id ? 'bg-primary-50 border-l-2 border-primary-500' : ''}`}>
                                            {completed.includes(lesson.id) ? <HiCheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> : typeIcon(lesson.type)}
                                            <div className="min-w-0">
                                                <p className={`text-xs truncate ${activeLesson?.id === lesson.id ? 'font-semibold text-primary-700' : 'text-text-secondary'}`}>{lesson.title}</p>
                                                <p className="text-[10px] text-gray-400">{lesson.duration}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {quizzes.length > 0 && (
                        <div className="p-4 border-t border-border">
                            <p className="text-xs font-semibold text-text-secondary uppercase mb-2">Quizzes</p>
                            {quizzes.map((q) => (
                                <Link key={q.id} to={`/student/quiz/${q.id}`} className="block px-3 py-2 text-sm text-primary-600 hover:bg-primary-100 dark:bg-primary-900/40 dark:hover:bg-primary-900/30 rounded-lg font-medium">📝 {q.title}</Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoursePlayer;

