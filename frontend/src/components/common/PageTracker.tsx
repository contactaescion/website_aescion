import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../../api/analytics';

export function PageTracker() {
    const location = useLocation();

    useEffect(() => {
        // Track page view on location change
        analytics.track(location.pathname);
    }, [location]);

    return null;
}
