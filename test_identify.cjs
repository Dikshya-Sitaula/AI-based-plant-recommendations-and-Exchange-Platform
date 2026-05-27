const FormData = require('form-data');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function test() {
    const API_KEY = '2b10EyS9kfkdkzj40wPpe7cnf';
    const url = `https://my-api.plantnet.org/v2/identify/all?api-key=${API_KEY}`;
    
    // We don't have a buffer, but we can check the API response for basic info
    try {
        const response = await fetch(url);
        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Data:', JSON.stringify(data).substring(0, 100));
    } catch (err) {
        console.error('Error:', err.message);
    }
}

test();
