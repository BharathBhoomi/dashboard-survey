// Simple script to test the API endpoint after deployment
// Run with: node test-api.js https://your-vercel-url.vercel.app

const https = require('https');
const url = require('url');

// Get the base URL from command line arguments
const baseUrl = process.argv[2] || 'http://localhost:5000';
const parsedUrl = url.parse(baseUrl);

// Test data for the survey
const testData = {
  recommendationRating: '5',
  satisfactionRating: '4',
  experience: 'This is a test submission from the API test script.',
  contactPermission: 'Yes',
  furtherInfoPermission: 'No',
  fullName: 'API Test User',
  phone: '+1234567890',
  email: 'test@example.com'
};

// First, check the health endpoint
console.log(`Testing health endpoint at ${baseUrl}/api/health...`);

const healthReq = https.request(
  {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
    path: '/api/health',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  },
  (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Health check response:');
      console.log(`Status: ${res.statusCode}`);
      try {
        const parsedData = JSON.parse(data);
        console.log(JSON.stringify(parsedData, null, 2));
        
        // If health check is successful, test the POST endpoint
        if (res.statusCode === 200) {
          testPostEndpoint();
        }
      } catch (e) {
        console.error('Error parsing health check response:', e.message);
      }
    });
  }
);

healthReq.on('error', (e) => {
  console.error(`Health check request error: ${e.message}`);
});

healthReq.end();

// Function to test the POST endpoint
function testPostEndpoint() {
  console.log(`\nTesting POST endpoint at ${baseUrl}/api/surveys...`);
  
  const postData = JSON.stringify(testData);
  
  const req = https.request(
    {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: '/api/surveys',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    },
    (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log('POST response:');
        console.log(`Status: ${res.statusCode}`);
        try {
          const parsedData = JSON.parse(data);
          console.log(JSON.stringify(parsedData, null, 2));
          
          // If POST is successful, test the GET endpoint
          if (res.statusCode === 201) {
            testGetEndpoint();
          }
        } catch (e) {
          console.error('Error parsing POST response:', e.message);
        }
      });
    }
  );
  
  req.on('error', (e) => {
    console.error(`POST request error: ${e.message}`);
  });
  
  req.write(postData);
  req.end();
}

// Function to test the GET endpoint
function testGetEndpoint() {
  console.log(`\nTesting GET endpoint at ${baseUrl}/api/surveys...`);
  
  const req = https.request(
    {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
      path: '/api/surveys',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    },
    (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log('GET response:');
        console.log(`Status: ${res.statusCode}`);
        try {
          const parsedData = JSON.parse(data);
          console.log(`Received ${parsedData.length} survey entries`);
          if (parsedData.length > 0) {
            console.log('Latest entry:');
            console.log(JSON.stringify(parsedData[0], null, 2));
          }
          console.log('\nAPI test completed successfully!');
        } catch (e) {
          console.error('Error parsing GET response:', e.message);
        }
      });
    }
  );
  
  req.on('error', (e) => {
    console.error(`GET request error: ${e.message}`);
  });
  
  req.end();
}