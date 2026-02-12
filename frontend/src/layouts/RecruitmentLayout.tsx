import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export function RecruitmentLayout() {
    const links = [
        { name: 'Home', href: '/' },
        { name: 'Hire Talent', href: '/recruitment' }, // Resets top
        { name: 'Services', href: '/recruitment#services' },
        { name: 'Contact', href: '/recruitment#enquiry-form' }, // Fixed ID mismatch
    ];

    const location = useLocation();

    // Handle hash navigation
    useEffect(() => {
        if (location.hash) {
            const id = location.hash.substring(1);
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }, [location]);

    return (
        <div className="min-h-screen bg-white">
            <Navbar links={links} />
            <main>
                <Outlet />
            </main>
            <Footer hideCourses={true} />
        </div>
    );
}
