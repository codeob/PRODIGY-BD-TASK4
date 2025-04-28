const { createClient } = require('@redis/client'); // Use @redis/client for v4.x and later

// Create a Redis client
const client = createClient({
    url: process.env.REDIS_URL, // connect using your REDIS_URL from .env
});

// Listen for 'connect' event
client.on('connect', () => {
    console.log('Connected to Redis');
});

// Catch connection errors
client.on('error', (err) => {
    console.error('Redis connection error:', err);
});

// Connect to Redis
client.connect().catch((err) => {
    console.error('Error connecting to Redis:', err);
});

// Export the client so you can use it in controllers
module.exports = client;
