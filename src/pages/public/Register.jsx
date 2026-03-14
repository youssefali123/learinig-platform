import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { register } from '../../features/authSlice';
import toast from 'react-hot-toast';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const newUser = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            role: formData.role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
            bio: '',
            enrolledCourses: [],
            completedLessons: {},
            joinDate: new Date().toISOString().split('T')[0],
        };

        dispatch(register(newUser));
        toast.success('Account created successfully! 🎉');
        navigate(formData.role === 'student' ? '/student/dashboard' : '/instructor/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-purple-50 dark:from-surface dark:via-surface dark:to-surface px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <span className="text-white font-bold text-xl">E</span>
                        </div>
                        <span className="text-2xl font-bold gradient-text">EduFlow</span>
                    </Link>
                    <h1 className="text-2xl font-bold text-text-primary mb-2">Create Account</h1>
                    <p className="text-text-secondary text-sm">Join thousands of learners worldwide</p>
                </div>

                {/* Form Card */}
                <div className="bg-card rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-black/40 border border-border p-8">
                    {/* Role Selection */}
                    <div className="mb-6">
                        <p className="text-sm font-medium text-text-secondary mb-3">I want to...</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'student' })}
                                className={`p-4 rounded-xl border-2 text-center transition-all ${formData.role === 'student'
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-border text-text-secondary hover:border-gray-300'
                                    }`}
                            >
                                <span className="text-2xl block mb-1">👨‍🎓</span>
                                <span className="text-sm font-semibold">Learn</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'instructor' })}
                                className={`p-4 rounded-xl border-2 text-center transition-all ${formData.role === 'instructor'
                                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                                    : 'border-border text-text-secondary hover:border-gray-300'
                                    }`}
                            >
                                <span className="text-2xl block mb-1">👨‍🏫</span>
                                <span className="text-sm font-semibold">Teach</span>
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Full Name</label>
                            <div className="relative">
                                <HiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.name ? 'border-red-300' : 'border-border'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all`}
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
                            <div className="relative">
                                <HiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-300' : 'border-border'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all`}
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Min. 6 characters"
                                    className={`w-full pl-11 pr-11 py-3 rounded-xl border ${errors.password ? 'border-red-300' : 'border-border'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-text-secondary"
                                >
                                    {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <HiLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-300' : 'border-border'} focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm transition-all`}
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
                        >
                            Create Account
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-text-secondary">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;

