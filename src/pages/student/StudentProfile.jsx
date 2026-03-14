import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { HiCamera, HiPencil, HiBookOpen, HiAcademicCap, HiCalendar } from 'react-icons/hi';
import { updateProfile } from '../../features/authSlice';
import toast from 'react-hot-toast';

const StudentProfile = () => {
    const { user } = useSelector((s) => s.auth);
    const { enrolledCourses } = useSelector((s) => s.courses);
    const dispatch = useDispatch();
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '', bio: user?.bio || '' });

    const handleSave = () => {
        dispatch(updateProfile(formData));
        setEditing(false);
        toast.success('Profile updated! âœ¨');
    };

    return (
        <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-2xl font-bold text-text-primary">My <span className="gradient-text">Profile</span></h1>
            </motion.div>

            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-primary-500 via-primary-600 to-purple-600 relative">
                    <div className="absolute -bottom-12 left-6">
                        <div className="relative">
                            <img src={user?.avatar} alt={user?.name} className="w-24 h-24 rounded-2xl ring-4 ring-white shadow-xl bg-card" />
                            <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary-500 text-white rounded-lg flex items-center justify-center shadow-md hover:bg-primary-600 transition-colors">
                                <HiCamera className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-16 px-6 pb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-text-primary">{user?.name}</h2>
                            <p className="text-sm text-text-secondary">{user?.email}</p>
                            <span className="inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 capitalize">{user?.role}</span>
                        </div>
                        <button onClick={() => setEditing(!editing)}
                            className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-medium text-text-secondary hover:bg-surface transition-colors">
                            <HiPencil className="w-4 h-4" />
                            {editing ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    {editing ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Full Name</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Bio</label>
                                <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3}
                                    className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm resize-none" />
                            </div>
                            <button onClick={handleSave}
                                className="px-6 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors">Save Changes</button>
                        </motion.div>
                    ) : (
                        <div className="mt-6">
                            <p className="text-sm text-text-secondary leading-relaxed">{user?.bio || 'No bio yet.'}</p>
                            <div className="flex items-center gap-6 mt-4 text-sm text-text-secondary">
                                <span className="flex items-center gap-1"><HiBookOpen className="w-4 h-4" />{enrolledCourses.length} courses</span>
                                <span className="flex items-center gap-1"><HiCalendar className="w-4 h-4" />Joined {user?.joinDate}</span>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default StudentProfile;

