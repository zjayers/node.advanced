// Node Cluster Module
const cluster = require("cluster");
// Restrict each child to one thread (instead of 4)
process.env.UV_THREADPOOL_SIZE = "1";

// General imports
const express = require("express");
const morgan = require("morgan");
const crypto = require("crypto");

// Set up manager/child identifier (for logging)
const identifier = crypto.randomBytes(2).toString("hex");
const serverLog = require("debug")(`server:${identifier}`);

// Set up express server
const app = express();

// Set up request logging
app.use(morgan("dev"));

// Log if this cluster is the cluster manager (master) or a worker
serverLog(cluster.isMaster ? "Manager" : `Thread:${identifier}`);

// If the file is being executed in master mode, fork the cluster.
// If not, the file is being executed in child mode
if (cluster.isMaster) {
  cluster.fork();
  cluster.fork();
} else {
  // Root route for testing cluster
  app.get("/", (req, res) => {
    const start = Date.now();
    // Block the event loop for a duration
    crypto.pbkdf2("a", "b", 100000, 512, "sha512", () => {
      const end = Date.now() - start;
      res.status(200).send(`Call took: ${end} milliseconds`);
    });
  });

  // Non blocked route
  app.get("/fast", (req, res) => {
    res.send("This was fast!");
  });

  // Start up express server on port 3000
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    serverLog("Server running on port", PORT);
  });
}
