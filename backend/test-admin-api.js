const axios = require('axios');

const API_URL = 'http://localhost:3000';
const EMAIL = 'contact.aescion@gmail.com';
const PASSWORD = 'AESCION@123';

async function testAdminFlow() {
    try {
        /*
        console.log('1. Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: EMAIL,
            password: PASSWORD
        });

        const token = loginRes.data.access_token;
        console.log('✅ Login Successful. Token obtained.');
        console.log('User Role:', loginRes.data.user.role);

        const config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        */
        const config = {}; // Public endpoints don't need token

        // 2. Fetch Courses
        console.log('\n2. Fetching Courses...');
        try {
            const coursesRes = await axios.get(`${API_URL}/courses`, config);
            console.log('Courses Status:', coursesRes.status);
            console.log('Courses Type:', Array.isArray(coursesRes.data) ? 'Array' : typeof coursesRes.data);
            if (!Array.isArray(coursesRes.data)) console.log('Courses Keys:', Object.keys(coursesRes.data));
            if (coursesRes.data.items) console.log('Courses Items Count:', coursesRes.data.items.length);

        } catch (err) {
            console.error('❌ Failed to fetch courses:', err.response ? err.response.status : err.message);
        }

        // 3. Fetch Gallery
        console.log('\n3. Fetching Gallery...');
        try {
            const galleryRes = await axios.get(`${API_URL}/gallery`, config);
            console.log('Gallery Status:', galleryRes.status);
            console.log('Gallery Type:', Array.isArray(galleryRes.data) ? 'Array' : typeof galleryRes.data);
            console.log('Gallery Length:', Array.isArray(galleryRes.data) ? galleryRes.data.length : 'N/A');
        } catch (err) {
            console.error('❌ Failed to fetch gallery:', err.response ? err.response.status : err.message);
        }

        // 4. Fetch Popups
        console.log('\n4. Fetching Popups...');
        try {
            const popupsRes = await axios.get(`${API_URL}/popups`, config);
            console.log(`✅ Popups fetched: ${popupsRes.data.length} items`);
        } catch (err) {
            console.error('❌ Failed to fetch popups:', err.response ? err.response.status : err.message);
        }

    } catch (error) {
        console.error('❌ Login Failed:', error.response ? error.response.data : error.message);
    }
}

testAdminFlow();
