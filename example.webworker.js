/**
 * Web Workers are experimental
 *
 * Implements library 'webworker-threads'
 */

const { Worker } = require('worker_threads');

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
    const worker = new Worker('./utils/worker.js');

    worker.on('message', (data) => {
        res.send(data);
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
