import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import { PopupOverlay } from '../components/common/PopupOverlay';
import { useEffect } from 'react';

export function TrainingLayout() {
    const links = [
        { name: 'Main Home', href: '/' },
        { name: 'Courses', href: '/training#courses' },
        // { name: 'Placements', href: '#placements' }, 
        { name: 'Contact', href: '/training#contact' },
    ];

    const location = useLocation();

    // Handle hash navigation when coming from other pages
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
            <PopupOverlay type="TRAINING" />
            <Navbar links={links} />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
