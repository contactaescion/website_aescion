import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

interface NavLink {
    name: string;
    href: string;
}

interface NavbarProps {
    links?: NavLink[];
}

export function Navbar({ links }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const defaultLinks = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '/#services' },
        { name: 'Contact', href: '/#contact' },
    ];

    const navLinks = links || defaultLinks;

    const handleNavClick = (e: React.MouseEvent<HTMLElement>, href: string) => {
        e.preventDefault();

        // Handle Hash Links
        if (href.includes('#')) {
            const [path, hash] = href.split('#');
            const targetId = hash;

            // If we need to change route first
            if (path && path !== location.pathname && !(path === '/' && location.pathname === '/')) {
                navigate(path);
                // Wait for navigation then scroll
                setTimeout(() => {
                    const element = document.getElementById(targetId);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } else {
                // Same page scroll
                const element = document.getElementById(targetId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                } else if (path) {
                    // Fallback if element not found but path exists (e.g. just top of page)
                    navigate(path);
                    window.scrollTo(0, 0);
                }
            }
        } else {
            // Standard Route
            navigate(href);
            window.scrollTo(0, 0);
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20' : 'bg-transparent py-4'
                    }`}
            >
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2 flex-shrink-0">
                            {/* Main Logo */}
                            <img src="/assets/logo.svg" alt="AESCION Logo" className="h-24 md:h-52 w-auto" />
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="text-sm font-medium text-gray-700 hover:text-brand-blue transition-colors px-3 py-2 rounded-md hover:bg-black/5 cursor-pointer"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-2">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-gray-600 hover:text-brand-blue transition-colors"
                                aria-label="Menu"
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-xl">
                        <div className="px-4 pt-2 pb-6 space-y-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleNavClick(e, link.href)}
                                    className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-lg"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
