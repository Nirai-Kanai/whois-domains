/**
 * Test script for the Domain Availability API
 * 
 * This script demonstrates how to use the API to check domain availability
 * Run this script after starting the server with `npm start` or `npm run dev`
 */

const fetch = require('node-fetch');

// Base URL of the API
const API_URL = 'http://localhost:3000';

// Function to check domain availability
async function checkDomain(domain) {
  try {
    console.log(`Checking availability for domain: ${domain}`);
    
    const response = await fetch(`${API_URL}/api/check?domain=${domain}`);
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