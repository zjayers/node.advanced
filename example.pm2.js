/**
 * Command to start
 * pm2 start example.pm2.js -i 0
 *
 * Inspecting PM2
 * - Summary
 * pm2 list
 *
 * - Detailed Summary
 * pm2 show <filename>
 *
 * - Show Dashboard
 * pm2 monit
 *
 * - Stop and Remove
 * pm2 delete <filename>
 */

// General imports
const express = require('express');
const morgan = require('morgan');
const crypto = require('crypto');

// Set up manager/child identifier (for logging)
const identifier = crypto.randomBytes(2).toString('hex');
const serverLog = require('debug')(`server:${identifier}`);

// Set up express server
const app = express();

// Set up request logging
app.use(morgan('dev'));

// Root route for testing cluster
app.get('/', (req, res) => {
    const start = Date.now();
    // Block the event loop for a duration
    crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
        const end = Date.now() - start;
        res.status(200).send(`Call took: ${end} milliseconds`);
    });
});

// Non blocked route
app.get('/fast', (req, res) => {
    res.send('This was fast!');
});

// Start up express server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    serverLog('Server running on port', PORT);
});
