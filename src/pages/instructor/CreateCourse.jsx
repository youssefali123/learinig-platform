import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowLeft, HiArrowRight, HiCheck, HiPlus, HiTrash, HiUpload } from 'react-icons/hi';
import { useDropzone } from 'react-dropzone';
import { addCourse } from '../../features/coursesSlice';
import { categories } from '../../data/categories';
import toast from 'react-hot-toast';

const steps = ['Basic Info', 'Content', 'Pricing', 'Review'];

const CreateCourse = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.auth);
    const [currentStep, setCurrentStep] = useState(0);
    const [courseData, setCourseData] = useState({
        title: '', description: '', shortDescription: '', categoryId: 1, level: 'Beginner', language: 'English',
        price: '', originalPrice: '', objectives: [''], requirements: [''], tags: '',
        sections: [{ title: 'Section 1', lessons: [{ title: '', type: 'video', duration: '' }] }],
    });
    const [thumbnail, setThumbnail] = useState(null);

    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] }, maxFiles: 1,
        onDrop: (files) => setThumbnail(Object.assign(files[0], { preview: URL.createObjectURL(files[0]) })),
    });

    const update = (field, value) => setCourseData((prev) => ({ ...prev, [field]: value }));

    const addObjective = () => update('objectives', [...courseData.objectives, '']);
    const removeObjective = (i) => update('objectives', courseData.objectives.filter((_, idx) => idx !== i));
    const updateObjective = (i, val) => { const o = [...courseData.objectives]; o[i] = val; update('objectives', o); };

    const addRequirement = () => update('requirements', [...courseData.requirements, '']);
    const removeRequirement = (i) => update('requirements', courseData.requirements.filter((_, idx) => idx !== i));
    const updateRequirement = (i, val) => { const r = [...courseData.requirements]; r[i] = val; update('requirements', r); };

    const addSection = () => update('sections', [...courseData.sections, { title: `Section ${courseData.sections.length + 1}`, lessons: [{ title: '', type: 'video', duration: '' }] }]);
    const addLesson = (si) => { const s = [...courseData.sections]; s[si].lessons.push({ title: '', type: 'video', duration: '' }); update('sections', s); };
    const updateLesson = (si, li, field, val) => { const s = [...courseData.sections]; s[si].lessons[li][field] = val; update('sections', s); };
    const removeLesson = (si, li) => { const s = [...courseData.sections]; s[si].lessons.splice(li, 1); update('sections', s); };

    const handlePublish = () => {
        const newCourse = {
            id: Date.now(), ...courseData, slug: courseData.title.toLowerCase().replace(/\s+/g, '-'),
            instructorId: user?.id, instructorName: user?.name, instructorAvatar: user?.avatar,
            category: categories.find((c) => c.id === courseData.categoryId)?.name || 'Web Development',
            price: Number(courseData.price) || 0, originalPrice: Number(courseData.originalPrice) || 0,
            rating: 0, reviewsCount: 0, studentsCount: 0, duration: '0 hours', lessonsCount: courseData.sections.reduce((a, s) => a + s.lessons.length, 0),
            isBestseller: false, isFeatured: false, createdAt: new Date().toISOString().split('T')[0], updatedAt: new Date().toISOString().split('T')[0],
            tags: courseData.tags.split(',').map((t) => t.trim()).filter(Boolean),
            thumbnail: thumbnail?.preview || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
            curriculum: courseData.sections.map((s, i) => ({ id: Date.now() + i, title: s.title, lessons: s.lessons.map((l, j) => ({ id: Date.now() + i * 100 + j, ...l, completed: false })) })),
        };
        dispatch(addCourse(newCourse));
        toast.success('Course published! 🚀');
        navigate('/instructor/dashboard');
    };

    const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm';

    return (
        <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-2xl font-bold text-text-primary">Create <span className="gradient-text">New Course</span></h1>
            </motion.div>

            {/* Stepper */}
            <div className="flex items-center justify-between mb-8 px-4">
                {steps.map((step, i) => (
                    <div key={i} className="flex items-center">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${i <= currentStep ? 'bg-primary-500 text-white' : 'bg-gray-200 text-text-secondary'}`}>
                                {i < currentStep ? <HiCheck className="w-4 h-4" /> : i + 1}
                            </div>
                            <span className={`text-sm hidden sm:block ${i <= currentStep ? 'font-semibold text-text-primary' : 'text-gray-400'}`}>{step}</span>
                        </div>
                        {i < steps.length - 1 && <div className={`w-12 sm:w-20 h-0.5 mx-2 ${i < currentStep ? 'bg-primary-500' : 'bg-gray-200'}`} />}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
                <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="bg-card rounded-2xl border border-border p-6 shadow-sm">

                    {currentStep === 0 && (
                        <div className="space-y-4">
                            <div {...getRootProps()} className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary-300 transition-colors">
                                <input {...getInputProps()} />
                                {thumbnail ? <img src={thumbnail.preview} alt="Thumbnail" className="w-full h-40 object-cover rounded-lg mb-2" /> : (
                                    <div><HiUpload className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-sm text-text-secondary">Drop thumbnail or click to upload</p></div>
                                )}
                            </div>
                            <div><label className="text-sm font-medium text-text-secondary">Course Title *</label><input type="text" value={courseData.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g., Complete React Developer" className={inputClass} /></div>
                            <div><label className="text-sm font-medium text-text-secondary">Short Description</label><input type="text" value={courseData.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} placeholder="Brief overview" className={inputClass} /></div>
                            <div><label className="text-sm font-medium text-text-secondary">Full Description</label><textarea value={courseData.description} onChange={(e) => update('description', e.target.value)} rows={4} placeholder="Detailed description..." className={inputClass + ' resize-none'} /></div>
                            <div className="grid grid-cols-3 gap-4">
                                <div><label className="text-sm font-medium text-text-secondary">Category</label><select value={courseData.categoryId} onChange={(e) => update('categoryId', Number(e.target.value))} className={inputClass}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                                <div><label className="text-sm font-medium text-text-secondary">Level</label><select value={courseData.level} onChange={(e) => update('level', e.target.value)} className={inputClass}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
                                <div><label className="text-sm font-medium text-text-secondary">Language</label><input type="text" value={courseData.language} onChange={(e) => update('language', e.target.value)} className={inputClass} /></div>
                            </div>
                            <div><label className="text-sm font-medium text-text-secondary">Tags (comma separated)</label><input type="text" value={courseData.tags} onChange={(e) => update('tags', e.target.value)} placeholder="React, JavaScript" className={inputClass} /></div>
                            <div>
                                <div className="flex items-center justify-between"><label className="text-sm font-medium text-text-secondary">Learning Objectives</label><button onClick={addObjective} className="text-xs text-primary-600 font-medium flex items-center gap-1"><HiPlus className="w-3 h-3" /> Add</button></div>
                                {courseData.objectives.map((obj, i) => (
                                    <div key={i} className="flex gap-2 mt-2"><input type="text" value={obj} onChange={(e) => updateObjective(i, e.target.value)} placeholder="What students will learn..." className={inputClass} /><button onClick={() => removeObjective(i)} className="text-red-400 hover:text-red-600 p-2"><HiTrash className="w-4 h-4" /></button></div>
                                ))}
                            </div>
                            <div>
                                <div className="flex items-center justify-between"><label className="text-sm font-medium text-text-secondary">Requirements</label><button onClick={addRequirement} className="text-xs text-primary-600 font-medium flex items-center gap-1"><HiPlus className="w-3 h-3" /> Add</button></div>
                                {courseData.requirements.map((req, i) => (
                                    <div key={i} className="flex gap-2 mt-2"><input type="text" value={req} onChange={(e) => updateRequirement(i, e.target.value)} placeholder="Prerequisites..." className={inputClass} /><button onClick={() => removeRequirement(i)} className="text-red-400 hover:text-red-600 p-2"><HiTrash className="w-4 h-4" /></button></div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div>
                            <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-text-primary">Course Content</h3><button onClick={addSection} className="flex items-center gap-1 text-sm text-primary-600 font-medium"><HiPlus className="w-4 h-4" /> Add Section</button></div>
                            {courseData.sections.map((section, si) => (
                                <div key={si} className="border border-border rounded-xl p-4 mb-4">
                                    <input type="text" value={section.title} onChange={(e) => { const s = [...courseData.sections]; s[si].title = e.target.value; update('sections', s); }} className="text-sm font-semibold text-text-primary border-none outline-none bg-transparent w-full mb-3" placeholder="Section title" />
                                    {section.lessons.map((lesson, li) => (
                                        <div key={li} className="flex gap-2 mb-2">
                                            <input type="text" value={lesson.title} onChange={(e) => updateLesson(si, li, 'title', e.target.value)} placeholder="Lesson title" className="flex-1 px-3 py-2 rounded-lg border border-border text-sm outline-none" />
                                            <select value={lesson.type} onChange={(e) => updateLesson(si, li, 'type', e.target.value)} className="px-3 py-2 rounded-lg border border-border text-sm outline-none"><option value="video">Video</option><option value="pdf">PDF</option><option value="image">Image</option></select>
                                            <input type="text" value={lesson.duration} onChange={(e) => updateLesson(si, li, 'duration', e.target.value)} placeholder="Duration" className="w-24 px-3 py-2 rounded-lg border border-border text-sm outline-none" />
                                            <button onClick={() => removeLesson(si, li)} className="text-red-400 hover:text-red-600 p-2"><HiTrash className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                    <button onClick={() => addLesson(si)} className="text-xs text-primary-600 font-medium mt-1 flex items-center gap-1"><HiPlus className="w-3 h-3" /> Add Lesson</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-text-primary">Pricing</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="text-sm font-medium text-text-secondary">Price ($)</label><input type="number" value={courseData.price} onChange={(e) => update('price', e.target.value)} placeholder="49.99" className={inputClass} /></div>
                                <div><label className="text-sm font-medium text-text-secondary">Original Price ($)</label><input type="number" value={courseData.originalPrice} onChange={(e) => update('originalPrice', e.target.value)} placeholder="99.99" className={inputClass} /></div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div>
                            <h3 className="text-lg font-semibold text-text-primary mb-4">Review & Publish</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between p-3 bg-surface rounded-lg"><span className="text-text-secondary">Title</span><span className="font-medium text-text-primary">{courseData.title || 'â€”'}</span></div>
                                <div className="flex justify-between p-3 bg-surface rounded-lg"><span className="text-text-secondary">Level</span><span className="font-medium text-text-primary">{courseData.level}</span></div>
                                <div className="flex justify-between p-3 bg-surface rounded-lg"><span className="text-text-secondary">Sections</span><span className="font-medium text-text-primary">{courseData.sections.length}</span></div>
                                <div className="flex justify-between p-3 bg-surface rounded-lg"><span className="text-text-secondary">Lessons</span><span className="font-medium text-text-primary">{courseData.sections.reduce((a, s) => a + s.lessons.length, 0)}</span></div>
                                <div className="flex justify-between p-3 bg-surface rounded-lg"><span className="text-text-secondary">Price</span><span className="font-medium text-text-primary">${courseData.price || '0'}</span></div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
                <button onClick={() => setCurrentStep((s) => Math.max(0, s - 1))} disabled={currentStep === 0}
                    className="flex items-center gap-2 px-5 py-2.5 border border-border rounded-xl text-sm font-medium text-text-secondary disabled:opacity-40"><HiArrowLeft className="w-4 h-4" /> Back</button>
                {currentStep < steps.length - 1 ? (
                    <button onClick={() => setCurrentStep((s) => s + 1)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600">Next <HiArrowRight className="w-4 h-4" /></button>
                ) : (
                    <button onClick={handlePublish}
                        className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">Publish Course 🚀</button>
                )}
            </div>
        </div>
    );
};

export default CreateCourse;

