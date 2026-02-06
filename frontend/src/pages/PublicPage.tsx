import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/sections/Hero';
import { Services } from '../components/sections/Services';
import { FeaturedCourse } from '../components/sections/FeaturedCourse';
import { Courses } from '../components/sections/Courses';
import { Gallery } from '../components/sections/Gallery';
import { Contact } from '../components/sections/Contact';

import { MarketingPopup } from '../components/common/MarketingPopup';

export function PublicPage() {
    return (
        <div className="min-h-screen bg-white">
            <MarketingPopup />
            <Navbar />
            <main>
                <Hero />
                <Services />
                <FeaturedCourse />
                <Courses />
                <Gallery />
                <Contact />
            </main>
            <Footer />
        </div>
    );
}
