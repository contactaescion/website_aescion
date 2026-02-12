import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        // Disable browser's default scroll restoration to avoid conflicts
        if (window.history.scrollRestoration !== 'manual') {
            window.history.scrollRestoration = 'manual';
        }

        // handle hash anchors if present
        const { hash } = window.location;
        if (hash) {
            const id = hash.replace('#', '');
            // Small timeout to allow processing
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 0);
            return;
        }

        // Immediate scroll to top
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
