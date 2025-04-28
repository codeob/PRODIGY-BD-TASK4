require("dotenv").config();
const express = require("express");
const redisClient = require('./Config/redis');
const UserRoutes = require("./Routes/Routes");
const app = express();
const connectdb = require("./Config/db");
const Port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to the database
connectdb();

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use(UserRoutes); // Ensure routes are used

// Server
app.listen(Port, () => {
  console.log(`Server is running on http://localhost:${Port}`); // Fixed typo in URL
});
