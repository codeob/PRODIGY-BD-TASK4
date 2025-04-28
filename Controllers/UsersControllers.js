const UserModel = require("../Models/UserModel");
const redisClient = require("../Config/redis");

// Create a new user and store in both MongoDB and Redis
const CreateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const Exited = await UserModel.findOne({ email });
    if (Exited) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Create new user in MongoDB
    const user = await UserModel.create({
      name,
      email,
      password,
    });

    // Add the newly created user to Redis cache
    redisClient.get("allUsers", (err, data) => {
      if (err) {
        console.error("Error fetching from Redis:", err);
      }

      let allUsers = [];
      if (data) {
        allUsers = JSON.parse(data); // If data exists, parse it
      }

      // Add the new user to the cached users list
      allUsers.push(user);

      // Cache the updated users list (expires in 1 hour)
      redisClient.set("allUsers", {
        value: JSON.stringify(allUsers),
        EX: 3600,  // Set expiration time (3600 seconds = 1 hour)
      });
    });

    // Return success response
    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// Get all users with caching
const GetAllUsers = async (req, res) => {
  redisClient.get("allUsers", async (err, cachedData) => {
    if (err) {
      console.error("Redis error:", err);
    }

    if (cachedData) {
      console.log("Cache hit");
      return res.json(JSON.parse(cachedData)); // Return cached users
    }

    try {
      const users = await UserModel.find(); // Fetch from MongoDB
      redisClient.set("allUsers", {
        value: JSON.stringify(users), // Cache the users for 1 hour
        EX: 3600,  // Expiration time
      });
      console.log("Cache miss");
      return res.json(users);
    } catch (err) {
      console.error("Error fetching users from MongoDB:", err);
      return res.status(500).json({ message: "Server Error" });
    }
  });
};

// Update a user's data and update cache
const UpdateUser = async (req, res) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Invalidate the Redis cache and refresh it with updated data
    redisClient.get("allUsers", (err, data) => {
      if (err) {
        console.error("Error fetching from Redis:", err);
      }

      let allUsers = [];
      if (data) {
        allUsers = JSON.parse(data); // Parse the existing cached data
      }

      // Replace the updated user data in the list (assuming the user exists in the cache)
      const index = allUsers.findIndex((user) => user._id.toString() === updatedUser._id.toString());
      if (index !== -1) {
        allUsers[index] = updatedUser; // Replace the old user with the updated one
      }

      // Update the cache with the new list
      redisClient.set("allUsers", {
        value: JSON.stringify(allUsers),
        EX: 3600,  // Expiration time
      });
    });

    return res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete a user and remove from both MongoDB and Redis
const DeleteUser = async (req, res) => {
  try {
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the deleted user from the Redis cache
    redisClient.get("allUsers", (err, data) => {
      if (err) {
        console.error("Error fetching from Redis:", err);
      }

      let allUsers = [];
      if (data) {
        allUsers = JSON.parse(data); // Parse the existing cached data
      }

      // Remove the deleted user from the list
      allUsers = allUsers.filter((user) => user._id.toString() !== deletedUser._id.toString());

      // Update the cache with the new list
      redisClient.set("allUsers", {
        value: JSON.stringify(allUsers),
        EX: 3600,  // Expiration time
      });
    });

    return res.json({ message: "User deleted successfully", deletedUser });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  CreateUser,
  GetAllUsers,
  UpdateUser,
  DeleteUser,
};
