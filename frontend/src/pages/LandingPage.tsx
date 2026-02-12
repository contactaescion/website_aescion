// import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/sections/Hero';
import { Services } from '../components/sections/Services';
import { Gallery } from '../components/sections/Gallery';
import { Contact } from '../components/sections/Contact';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* <Helmet>
                <title>AESCION | Premier IT Services & Software Development Company in Tirunelveli</title>
                <meta name="description" content="AESCION EDTECH SOLUTIONS offers top-tier Software Development, Corporate Training, and EdTech Platforms. GST Registered & MSME Certified. Partner with us for digital growth." />
            </Helmet> */}
            <Hero variant="landing" />
            <Services filter="general" />
            <Gallery />
            <Contact />
        </div>
    );
}
