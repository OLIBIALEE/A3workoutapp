const express = require('express'); // Import the Express framework
const bodyParser = require('body-parser'); // Import middleware to parse JSON request bodies
const path = require('path'); // Import Node.js module for handling file paths
const fs = require('fs'); // Import Node.js module for file system operations

const app = express(); // Create an instance of an Express application
const port = 3000; // Define the port number where the server will listen for requests

// Middleware to parse incoming JSON data from the request body
app.use(bodyParser.json());

// Middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Route to handle saving a new log entry.
 * This endpoint expects a POST request with a JSON body containing the log data.
 * The log data is appended to the existing logs and saved back to 'logs.json'.
 */
app.post('/save-log', (req, res) => {
    const log = req.body; // Extract the log data from the request body
    const logsFilePath = path.join(__dirname, 'logs.json'); // Define the path to the logs file

    // Initialize an empty logs array
    let logs = [];
    // Check if the logs file already exists
    if (fs.existsSync(logsFilePath)) {
        // Read the existing logs file
        const fileData = fs.readFileSync(logsFilePath, 'utf8');
        // Parse the file data as JSON and store it in the logs array
        logs = JSON.parse(fileData) || [];
    }

    // Add the new log entry to the logs array
    logs.push(log);

    // Write the updated logs array back to the logs file
    fs.writeFileSync(logsFilePath, JSON.stringify(logs, null, 2));
    // Send a success response back to the client
    res.status(200).send({ message: 'Log saved successfully' });
});

/**
 * Route to handle retrieving all log entries.
 * This endpoint sends back all the logs stored in 'logs.json'.
 */
app.get('/get-logs', (req, res) => {
    const logsFilePath = path.join(__dirname, 'logs.json'); // Define the path to the logs file

    // Check if the logs file exists
    if (fs.existsSync(logsFilePath)) {
        // Read the logs file and send its contents as a JSON response
        const logs = fs.readFileSync(logsFilePath, 'utf8');
        res.status(200).send(JSON.parse(logs));
    } else {
        // If the file doesn't exist, send an empty array
        res.status(200).send([]);
    }
});

/**
 * Route to handle retrieving a single log entry by its ID.
 * The ID corresponds to the index of the log entry in the logs array.
 */
app.get('/get-log/:id', (req, res) => {
    const logsFilePath = path.join(__dirname, 'logs.json'); // Define the path to the logs file
    const logId = parseInt(req.params.id, 10); // Parse the log ID from the request parameters

    // Check if the logs file exists
    if (fs.existsSync(logsFilePath)) {
        // Read and parse the logs file
        const logs = JSON.parse(fs.readFileSync(logsFilePath, 'utf8'));
        // Find the log entry by its index
        const log = logs[logId];
        if (log) {
            // If the log entry exists, send it as a response
            res.status(200).send(log);
        } else {
            // If the log entry is not found, send a 404 error
            res.status(404).send({ message: 'Log not found' });
        }
    } else {
        // If the logs file doesn't exist, send a 404 error
        res.status(404).send({ message: 'Log file not found' });
    }
});

/**
 * Route to handle deleting a log entry by its ID.
 * The ID corresponds to the index of the log entry in the logs array.
 */
app.delete('/delete-log/:id', (req, res) => {
    const logsFilePath = path.join(__dirname, 'logs.json'); // Define the path to the logs file
    const logId = parseInt(req.params.id, 10); // Parse the log ID from the request parameters

    // Check if the logs file exists
    if (fs.existsSync(logsFilePath)) {
        // Read and parse the logs file
        let logs = JSON.parse(fs.readFileSync(logsFilePath, 'utf8'));
        // Check if the log ID is within valid range
        if (logId >= 0 && logId < logs.length) {
            // Remove the log entry from the logs array
            logs.splice(logId, 1);
            // Write the updated logs array back to the logs file
            fs.writeFileSync(logsFilePath, JSON.stringify(logs, null, 2));
            // Send a success response back to the client
            res.status(200).send({ message: 'Log deleted successfully' });
        } else {
            // If the log entry is not found, send a 404 error
            res.status(404).send({ message: 'Log not found' });
        }
    } else {
        // If the logs file doesn't exist, send a 404 error
        res.status(404).send({ message: 'Log file not found' });
    }
});

// Start the server and listen for incoming requests on the specified port
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
