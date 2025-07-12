/**
 * Test script for the Domain Availability API
 * 
 * This script demonstrates how to use the API to check domain availability
 * Run this script after starting the server with `npm start` or `npm run dev`
 */

const fetch = require('node-fetch');

// Base URL of the API
const API_URL = 'http://localhost:3000';

// API key from environment variable or use default for testing
const API_KEY = process.env.API_TOKEN || 'example_api_token_for_testing';

// Store the authentication token
let authToken = '';

// Function to get authentication token
async function getAuthToken() {
  try {
    console.log('Obtaining authentication token...');

    const response = await fetch(`${API_URL}/api/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ apiKey: API_KEY })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Token obtained successfully');
      return data.token;
    } else {
      console.error(`Error obtaining token: ${data.error}`);
      return null;
    }
  } catch (error) {
    console.error('Token request failed:', error.message);
    return null;
  }
}

// Function to check domain availability
async function checkDomain(domain) {
  try {
    console.log(`Checking availability for domain: ${domain}`);

    // Make sure we have a token
    if (!authToken) {
      console.error('No authentication token available');
      return;
    }

    const response = await fetch(`${API_URL}/api/check?domain=${domain}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`Domain: ${data.domain}`);
      console.log(`Available: ${data.available ? 'YES' : 'NO'}`);
      console.log('---');
      // Uncomment to see full WHOIS data
      // console.log('WHOIS Data:', data.whoisData);
    } else {
      console.error(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Request failed:', error.message);
  }
}

// Main function to run tests
async function runTests() {
  console.log('=== Domain Availability API Test ===\n');

  // Get authentication token first
  authToken = await getAuthToken();

  if (!authToken) {
    console.error('Failed to obtain authentication token. Tests cannot proceed.');
    return;
  }

  // Test with some sample domains
  await checkDomain('google.com');  // Should be unavailable
  await checkDomain('example.com'); // Should be unavailable
  await checkDomain('thisisarandomdomainthatprobablydoesnotexist12345.com'); // Likely available

  // Test with invalid domain format
  await checkDomain('invalid-domain');

  console.log('\nTests completed.');
}

// Run the tests
runTests().catch(console.error);

console.log('Note: Make sure the server is running before executing this test script.');
console.log('To install the required dependency for this test, run: npm install node-fetch');
