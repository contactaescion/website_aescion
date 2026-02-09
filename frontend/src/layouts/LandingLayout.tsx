import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export function LandingLayout() {
    const links = [
        { name: 'Home', href: '/' },
        { name: 'IT Training', href: '/training' },
        { name: 'Recruitment', href: '/recruitment' },
        { name: 'Gallery', href: '/#gallery' },
        { name: 'Contact Us', href: '/#contact' },
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
            <Navbar links={links} />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
