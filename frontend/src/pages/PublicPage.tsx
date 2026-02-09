import { Suspense, lazy } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/sections/Hero';
import { MarketingPopup } from '../components/common/MarketingPopup';
import { Loader2 } from 'lucide-react';

const Services = lazy(() => import('../components/sections/Services').then(module => ({ default: module.Services })));
const FeaturedCourse = lazy(() => import('../components/sections/FeaturedCourse').then(module => ({ default: module.FeaturedCourse })));
const Courses = lazy(() => import('../components/sections/Courses').then(module => ({ default: module.Courses })));
const Gallery = lazy(() => import('../components/sections/Gallery').then(module => ({ default: module.Gallery })));
const Contact = lazy(() => import('../components/sections/Contact').then(module => ({ default: module.Contact })));

const SectionLoader = () => (
    <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
    </div>
);

export function PublicPage() {
    return (
        <div className="min-h-screen bg-white">
            <MarketingPopup />
            <Navbar />
            <main>
                <Hero />
                <Suspense fallback={<SectionLoader />}>
                    <Services />
                    <FeaturedCourse />
                    <Courses />
                    <Gallery />
                    <Contact />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
