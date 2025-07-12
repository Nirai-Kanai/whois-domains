const express = require('express');
const cors = require('cors');
const whois = require('whois');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required' });
  }

  try {
    // Verify the token
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Promisify the whois.lookup function
const whoisLookup = promisify(whois.lookup);

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Domain Availability API',
    endpoints: {
      token: '/api/token',
      checkDomain: '/api/check?domain=example.com'
    }
  });
});

// Token generation endpoint
app.post('/api/token', (req, res) => {
  const { apiKey } = req.body;

  // Validate API key (in a real app, this would check against a database)
  if (!apiKey || apiKey !== process.env.API_TOKEN) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  // Generate JWT token
  const token = jwt.sign({ 
    authorized: true,
    timestamp: Date.now()
  }, process.env.JWT_SECRET, { expiresIn: '24h' });

  res.json({ token });
});

// Domain check endpoint
app.get('/api/check', authenticateToken, async (req, res) => {
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
