import { Hero } from '../components/sections/Hero';
import { Services } from '../components/sections/Services';
import { Gallery } from '../components/sections/Gallery';
import { Contact } from '../components/sections/Contact';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            <Hero variant="landing" />
            <Services filter="general" />
            <Gallery />
            <Contact />
        </div>
    );
}
