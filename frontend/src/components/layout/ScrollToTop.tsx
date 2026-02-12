import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // handle hash anchors if present
        const { hash } = window.location;
        if (hash) {
            const id = hash.replace('#', '');
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: 'auto', block: 'start' });
                return;
            }
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }, [pathname]);

    return null;
}
