import { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { SearchModal } from '../common/SearchModal';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Services', href: '#services' },
        { name: 'Featured', href: '#featured' },
        { name: 'Courses', href: '#courses' },
        { name: 'Gallery', href: '#gallery' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20' : 'bg-transparent py-4'
                    }`}
            >
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <a href="#home" className="flex items-center gap-2 flex-shrink-0">
                            {/* Main Logo */}
                            <img src="/assets/logo.svg" alt="AESCION Logo" className="h-24 md:h-52 w-auto" />
                        </a>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-medium text-gray-700 hover:text-brand-blue transition-colors px-3 py-2 rounded-md hover:bg-black/5"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 text-gray-600 hover:text-brand-blue transition-colors hover:bg-black/5 rounded-full"
                                aria-label="Search"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-2">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 text-gray-600 hover:text-brand-blue transition-colors"
                                aria-label="Search"
                            >
                                <Search className="w-6 h-6" />
                            </button>
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
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-brand-blue hover:bg-gray-50 rounded-lg"
                                >
                                    {link.name}
                                </a>
                            ))}

                        </div>
                    </div>
                )}
            </nav>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
}
