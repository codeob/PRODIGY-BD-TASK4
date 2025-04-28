require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose"); // FIXED here
const app = express();
const connectdb = require("./Config/db");const Port = process.env.PORT || 5000;

// connect to db
connectdbdb();

// middleware
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

// server
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(Port, "localhost", () => {
      console.log(`Server is running on port http://localhost:${Port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });
