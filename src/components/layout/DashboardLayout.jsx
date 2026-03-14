import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
    const { sidebarOpen } = useSelector((state) => state.ui);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="min-h-screen bg-surface">
            <Navbar />
            <Sidebar />
            <motion.main
                animate={{ marginLeft: isMobile ? 0 : (sidebarOpen ? 256 : 72) }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="pt-16 min-h-screen"
            >
                <div className="p-4 md:p-6">
                    <Outlet />
                </div>
            </motion.main>
        </div>
    );
};

export default DashboardLayout;
