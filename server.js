const express = require('express');
const cors = require('cors');
const whois = require('whois');
const { promisify } = require('util');
require('dotenv').config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Promisify the whois.lookup function
const whoisLookup = promisify(whois.lookup);

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Domain Availability API',
    endpoints: {
      checkDomain: '/api/check?domain=example.com'
    }
  });
});

// Domain check endpoint
app.get('/api/check', async (req, res) => {
  try {
    const { domain } = req.query;
    
    // Validate domain parameter
    if (!domain) {
      return res.status(400).json({ 
        error: 'Missing domain parameter',
        available: null
      });
    }
    
    // Simple domain format validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      return res.status(400).json({ 
        error: 'Invalid domain format',
        available: null
      });
    }
    
    // Perform WHOIS lookup
    const result = await whoisLookup(domain);
    
    // Check if domain is available
    // This is a simple heuristic - different WHOIS servers return different formats
    const isAvailable = 
      result.includes('No match for') || 
      result.includes('NOT FOUND') ||
      result.includes('No Data Found') ||
      result.includes('Domain not found');
    
    res.json({
      domain,
      available: isAvailable,
      whoisData: result
    });
  } catch (error) {
    console.error('Error checking domain:', error);
    res.status(500).json({ 
      error: 'Error checking domain availability',
      available: null
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});