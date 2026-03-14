import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { HiSearch, HiFilter, HiViewGrid, HiX } from 'react-icons/hi';
import { setSearchQuery, setSelectedCategory, setSelectedLevel, setSortBy } from '../../features/coursesSlice';
import CourseCard from '../../components/common/CourseCard';
import { categories } from '../../data/categories';

const CourseCatalog = () => {
    const dispatch = useDispatch();
    const { courses, searchQuery, selectedCategory, selectedLevel, sortBy } = useSelector((s) => s.courses);
    const [showFilters, setShowFilters] = useState(false);
    const levels = ['Beginner', 'Intermediate', 'Advanced'];

    const filteredCourses = useMemo(() => {
        let result = [...courses];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter((c) => c.title.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q)));
        }
        if (selectedCategory) result = result.filter((c) => c.categoryId === selectedCategory);
        if (selectedLevel) result = result.filter((c) => c.level === selectedLevel);
        switch (sortBy) {
            case 'rating': result.sort((a, b) => b.rating - a.rating); break;
            case 'newest': result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
            case 'price-low': result.sort((a, b) => a.price - b.price); break;
            case 'price-high': result.sort((a, b) => b.price - a.price); break;
            default: result.sort((a, b) => b.studentsCount - a.studentsCount);
        }
        return result;
    }, [courses, searchQuery, selectedCategory, selectedLevel, sortBy]);

    const clearFilters = () => { dispatch(setSearchQuery('')); dispatch(setSelectedCategory(null)); dispatch(setSelectedLevel(null)); dispatch(setSortBy('popular')); };
    const hasActiveFilters = searchQuery || selectedCategory || selectedLevel;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary mb-2">Explore <span className="gradient-text">Courses</span></h1>
                <p className="text-text-secondary">Discover {courses.length}+ courses to boost your career</p>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Search courses..." value={searchQuery} onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm bg-card" />
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${showFilters ? 'bg-primary-50 border-primary-200 text-primary-700' : 'border-border text-text-secondary'}`}>
                        <HiFilter className="w-4 h-4" /> Filters {hasActiveFilters && <span className="w-2 h-2 bg-primary-500 rounded-full" />}
                    </button>
                    <select value={sortBy} onChange={(e) => dispatch(setSortBy(e.target.value))}
                        className="px-4 py-3 rounded-xl border border-border text-sm text-text-secondary outline-none bg-card">
                        <option value="popular">Most Popular</option>
                        <option value="rating">Highest Rated</option>
                        <option value="newest">Newest</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {showFilters && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-card rounded-xl border border-border p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-text-secondary">Filter By</h3>
                        {hasActiveFilters && <button onClick={clearFilters} className="text-xs text-primary-600 font-medium flex items-center gap-1"><HiX className="w-3 h-3" /> Clear All</button>}
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs font-medium text-text-secondary uppercase mb-2">Category</p>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button key={cat.id} onClick={() => dispatch(setSelectedCategory(selectedCategory === cat.id ? null : cat.id))}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat.id ? 'bg-primary-500 text-white' : 'bg-gray-100 text-text-secondary hover:bg-primary-100 dark:bg-primary-900/40 dark:hover:bg-primary-900/30'}`}>
                                        {cat.icon} {cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-text-secondary uppercase mb-2">Level</p>
                            <div className="flex flex-wrap gap-2">
                                {levels.map((level) => (
                                    <button key={level} onClick={() => dispatch(setSelectedLevel(selectedLevel === level ? null : level))}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedLevel === level ? 'bg-primary-500 text-white' : 'bg-gray-100 text-text-secondary hover:bg-primary-100 dark:bg-primary-900/40 dark:hover:bg-primary-900/30'}`}>
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            <p className="text-sm text-text-secondary mb-4">Showing <span className="font-semibold text-text-secondary">{filteredCourses.length}</span> courses</p>

            {filteredCourses.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCourses.map((course, i) => <CourseCard key={course.id} course={course} index={i} />)}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-6xl mb-4">🔍</p>
                    <h3 className="text-xl font-semibold text-text-secondary mb-2">No courses found</h3>
                    <button onClick={clearFilters} className="px-5 py-2 bg-primary-500 text-white rounded-xl text-sm font-medium">Clear Filters</button>
                </div>
            )}
        </div>
    );
};

export default CourseCatalog;

