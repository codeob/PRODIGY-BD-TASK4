const redis = require('redis');

// Create a Redis client
const client = redis.createClient({
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

// Export the client so you can use it in controllers
module.exports = client;
