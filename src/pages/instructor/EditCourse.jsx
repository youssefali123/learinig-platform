import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiArrowLeft, HiTrash, HiPlus, HiSave } from 'react-icons/hi';
import { updateCourse, deleteCourse } from '../../features/coursesSlice';
import { categories } from '../../data/categories';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const EditCourse = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const course = useSelector((s) => s.courses.courses.find((c) => c.id === Number(id)));
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [formData, setFormData] = useState(course ? {
        title: course.title, description: course.description, shortDescription: course.shortDescription,
        categoryId: course.categoryId, level: course.level, price: course.price, originalPrice: course.originalPrice,
    } : {});

    if (!course) return <div className="text-center py-20"><p className="text-xl text-text-secondary">Course not found</p></div>;

    const handleSave = () => {
        dispatch(updateCourse({ ...course, ...formData, category: categories.find((c) => c.id === formData.categoryId)?.name || course.category }));
        toast.success('Course updated! âœ…');
        navigate('/instructor/dashboard');
    };

    const handleDelete = () => {
        dispatch(deleteCourse(course.id));
        toast.success('Course deleted');
        navigate('/instructor/dashboard');
    };

    const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm';

    return (
        <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary-600 mb-4">
                    <HiArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-text-primary">Edit <span className="gradient-text">Course</span></h1>
                    <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 px-4 py-2 text-red-500 border border-red-200 rounded-xl text-sm hover:bg-red-50">
                        <HiTrash className="w-4 h-4" /> Delete
                    </button>
                </div>
            </motion.div>

            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm space-y-4">
                <div className="flex gap-4 items-start">
                    <img src={course.thumbnail} alt="" className="w-32 h-24 rounded-xl object-cover shrink-0" />
                    <div className="flex-1 space-y-3">
                        <div><label className="text-sm font-medium text-text-secondary">Title</label><input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputClass} /></div>
                        <div><label className="text-sm font-medium text-text-secondary">Short Description</label><input type="text" value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })} className={inputClass} /></div>
                    </div>
                </div>
                <div><label className="text-sm font-medium text-text-secondary">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className={inputClass + ' resize-none'} /></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div><label className="text-sm font-medium text-text-secondary">Category</label><select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })} className={inputClass}>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                    <div><label className="text-sm font-medium text-text-secondary">Level</label><select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className={inputClass}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
                    <div><label className="text-sm font-medium text-text-secondary">Price</label><input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className={inputClass} /></div>
                    <div><label className="text-sm font-medium text-text-secondary">Original Price</label><input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })} className={inputClass} /></div>
                </div>
                <div className="flex justify-end pt-4">
                    <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">
                        <HiSave className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </div>

            <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Course?">
                <div className="p-6 text-center">
                    <p className="text-text-secondary mb-4">Are you sure you want to delete "<b>{course.title}</b>"? This action cannot be undone.</p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => setShowDeleteModal(false)} className="px-5 py-2 border border-border rounded-xl text-sm">Cancel</button>
                        <button onClick={handleDelete} className="px-5 py-2 bg-red-500 text-white rounded-xl text-sm">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default EditCourse;

