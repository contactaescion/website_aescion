import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
    hideCourses?: boolean;
}

export function Footer({ hideCourses }: FooterProps) {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="contact" className="bg-brand-gray text-white pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <img src="/assets/logo.svg" alt="AESCION Logo" className="h-20 w-auto brightness-0 invert" />
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Empowering students with industry-ready skills. Join AESCION to learn, build, and get placed in top tech companies.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="https://www.instagram.com/aescion_edtech_solutions/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="https://www.facebook.com/profile.php?id=61585357586915" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="https://www.linkedin.com/company/aescion-edtech/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-brand-orange">Quick Links</h3>
                        <ul className="space-y-3">
                            {['Home', 'Services', 'Courses', 'Gallery', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link to={`/#${item.toLowerCase()}`} className="text-gray-300 hover:text-white transition-colors text-sm">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                            {/* <li>
                                <a href="/admin/login" className="text-gray-300 hover:text-white transition-colors text-sm">Admin Login</a>
                            </li> */}
                        </ul>
                    </div>

                    {/* Courses */}
                    {/* Courses (Student View) */}
                    {!hideCourses && (
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-brand-orange">Top Courses</h3>
                            <ul className="space-y-3">
                                {['Java Full Stack', 'Python Full Stack', 'MERN Stack', 'Embedded Systems', 'IoT', 'Data Analyst'].map((item) => (
                                    <li key={item} className="text-gray-300 text-sm">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Recruitment Services (HR View) */}
                    {hideCourses && (
                        <div>
                            <h3 className="text-lg font-semibold mb-6 text-brand-orange">HR Solutions</h3>
                            <ul className="space-y-3">
                                {['HR Recruiter', 'Campus Hiring', 'Lateral Hiring', 'Contract Staffing'].map((item) => (
                                    <li key={item} className="text-gray-300 text-sm">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-brand-orange">Contact Us</h3>
                        <ul className="space-y-4 text-sm text-gray-300">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                                <span>
                                    10B/1H, 15/1, Thirumalai Nambi Complex,<br />
                                    Palayamkottai, Tirunelveli - 627003.<br />
                                    (2nd Floor, Thiruvanduram Road)
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-brand-orange shrink-0" />
                                <a href="tel:7550068877" className="hover:text-white">7550068877</a>, <a href="tel:6374092647" className="hover:text-white">6374092647</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-brand-orange shrink-0" />
                                <a href="mailto:contact.aescion@gmail.com" className="hover:text-white">contact.aescion@gmail.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white">
                    <p>&copy; {currentYear} AESCION Edtech Solutions. All rights reserved.</p>
                    <div className="flex gap-4">
                        <span>GST: 33OPFPS4685D1ZD</span>
                        <span>|</span>
                        <span>MSME: UDYAM-TN-37-0049030</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
