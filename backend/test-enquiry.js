const API_URL = 'http://localhost:3000';

async function testEnquiry() {
    try {
        console.log('Testing Enquiry Creation with V2 fields...');
        const response = await fetch(`${API_URL}/enquiries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test HR',
                phone: '9876543210',
                email: 'hr@company.com',
                message: 'Looking for candidates',
                type: 'HR',
                source: 'Script'
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Enquiry Created:', data);
        } else {
            console.error('Failed:', await response.text());
        }
    } catch (e) {
        console.error('Error:', e.message);
    }
}

testEnquiry();
