import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { Hero } from '../components/sections/Hero';

const FeaturedCourse = lazy(() => import('../components/sections/FeaturedCourse').then(module => ({ default: module.FeaturedCourse })));
const Courses = lazy(() => import('../components/sections/Courses').then(module => ({ default: module.Courses })));
const Contact = lazy(() => import('../components/sections/Contact').then(module => ({ default: module.Contact })));

const SectionLoader = () => (
    <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
    </div>
);

export function TrainingPage() {
    return (
        <div className="min-h-screen bg-white">
            <Hero />
            <div className="">

                <Suspense fallback={<SectionLoader />}>
                    <FeaturedCourse />
                    <Courses />
                    <Contact />
                </Suspense>
            </div>
        </div>
    );
}
