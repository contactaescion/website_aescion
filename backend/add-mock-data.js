const API_URL = 'http://localhost:3000';

async function seed() {
    try {
        console.log('Logging in to get token...');
        // Try to login first (assuming admin exists from previous steps or default)
        // If not, we might need to create one.
        // Let's assume there is an admin user. If not, we can create one via a seed endpoint or register if open.
        // Based on previous context, there is likely an admin user 'admin@example.com' 'admin123' or similar.
        // But let's try to register a temp admin if possible or use a known one.
        // Wait, the user might not have an admin user set up yet.
        // Let's try to register a new user first.

        let token = '';
        try {
            const loginRes = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'admin@aescion.com', password: 'password123' })
            });

            if (loginRes.ok) {
                const data = await loginRes.json();
                token = data.access_token;
            } else {
                // Try registering
                console.log('Login failed, trying to register temp admin...');
                const regRes = await fetch(`${API_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: 'admin@aescion.com',
                        password: 'password123',
                        fullName: 'Admin User',
                        role: 'super_admin' // Assuming this works or defaults to something
                    })
                });

                if (regRes.ok) {
                    console.log('Registered temp admin.');
                    const loginRes2 = await fetch(`${API_URL}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: 'admin@aescion.com', password: 'password123' })
                    });
                    const data = await loginRes2.json();
                    token = data.access_token;
                } else {
                    console.error('Registration failed:', await regRes.text());
                    return;
                }
            }
        } catch (e) {
            console.error('Auth flow error:', e.message);
            return;
        }

        console.log('Got token. Seeding courses...');
        const response = await fetch(`${API_URL}/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: 'Full Stack Development',
                duration: '6 Months',
                fees: '50000',
                timing: '10:00 AM - 12:00 PM',
                mode: 'Offline',
                placement_support: true,
                trainer_name: 'John Doe',
                trainer_experience: '10 Years',
                code_snippet: 'console.log("Hello World");',
                is_featured: true
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
        }

        const data = await response.json();
        console.log('Seeding completed. Course created:', data);
        console.log('Try searching for "Stack" or "John".');
    } catch (error) {
        console.error('Seeding failed:', error.message);
    }
}

seed();
