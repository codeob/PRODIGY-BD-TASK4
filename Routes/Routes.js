const express = require("express");
const router = express.Router();
const { CreateUser, GetAllUsers, UpdateUser, DeleteUser } = require("../Controllers/UsersControllers");

router.post("/create", CreateUser); // Correctly use the imported CreateUser function
router.get("/users", GetAllUsers);
router.put("/update/:id", UpdateUser);
router.delete("/delete/:id", DeleteUser);

module.exports = router;
