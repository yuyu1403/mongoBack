const express = require("express");
const res = require("express/lib/response");
const bcrypt = require("bcrypt"); // In order to hash the password
const jwt = require("jsonwebtoken"); // Token for JWT
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");

const router = express.Router();
const User = require("../models/User");
const { read } = require("fs");

// ====================
// get config vars from .env
// ====================
dotenv.config();
TOKEN_SECRET = process.env.TOKEN_SECRET; // OUR SECRET KEY

/**
 * Main functions for open and close connection from the MongoDB database
 */
//Connecting to DB
async function connectDB() {
  await mongoose
    .connect(process.env.DB_TEST)
    .then((res) => {
      console.log("Connected to MongoDB !");
    })
    .catch((err) => {
      console.log(err);
    });
}

// Disconnect from the DB
async function disconnectDB() {
  await mongoose.connection
    .close()
    .then((res) => {
      console.log("Disconnected from MongoDB !");
    })
    .catch((err) => {
      console.log(err);
    });
}
//=================

//Inserts new user
router.post("/", async (req, res) => {
  await connectDB().then(async () => {
    console.log(req.body);
    let password = await bcrypt.hash(req.body.password, 10); // Hash the password provided
    const user = new User({
      username: req.body.username,
      lastname: req.body.lastname,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      zipcode: req.body.zipcode,
      city: req.body.city,
      profilePic: req.body.profilePic,
      password: password,
    });
    try {
      //Saves the user
      const savedUser = await user.save().then((result) => {
        disconnectDB();
      });
      res.status(200).json(savedUser);
      return;
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err });
      return;
    }
  });
});

//Retrieves all users
router.get("/", async (req, res) => {
  await connectDB().then(async () => {
  try {
    const users = await User.find()
    res.status(200).json(users).then((result) => {
      disconnectDB();
      return result;
    });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
    return;
  }
})
});

//Retrieves specific user
router.get("/:userId", async (req, res) => {
  await connectDB().then(async () => {
  try {
    const user = await User.findById(req.params.userId).then((result) => {
      disconnectDB();
      return result;
    });
    res.status(200).json(user);
    return;
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err });
    return;
  }
});
})

//Deletes specific user
router.delete("/:userId", async (req, res) => {
  await connectDB().then(async () => {
    try {
    const removedUser = await User.remove({ _id: req.params.userId }).then(
      (result) => {
      disconnectDB();
      return result;
      }
    );
    res.status(200).json(removedUser);
    return;
  } catch (err) {
    res.status(200).json({ message: err });
    return;
  }
})
});

//Updates specific user
router.put("/:userId", async (req, res) => {
  const id = new ObjectId(req.params.shopId);
  await connectDB().then(async () => {
    try {
      const updatedUser = User.findByIdAndUpdate(
        req.params.userId,
        req.body,
        function (err, docs) {
          if (err) {
            console.log(err);
            res.status(400).json({ updatedUser });
            return;
          } else {
            console.log("Updated User : ", docs);
            res.status(200).json({ docs});
            disconnectDB()
            return;
          }
        }
      );
      return;
    } catch (err) {
      res.status(400).json({ message: err });
      return;
    }
  });
});

//================= AUTHENTICATION ====================

//--- Start functions
/**
 * Generate a token
 * @param {*} username ; { username: User's username}
 * @returns token ; { token: for the authentification }
 */
function tokenGenerator(username) {
  return jwt.sign({ data: username }, TOKEN_SECRET, { expiresIn: "1d" });
}

/**
 *
 * @param {password, hash} ; {password: password to compare to the hash, hash: password stocked in the DB }
 * @return {boolean} ; true if the password is correct otherwise false.
 */
async function checkPassword(password, hash) {
  if (!password || !hash) {
    return false;
  }
  let result = await bcrypt.compare(password, hash);
  return result;
}

//--- End functions

// Send a token
router.post("/token/", (req, res) => {
  const token = tokenGenerator(req.body.username);
  res.status(200).json({ token: token });
});

// Check if the credentials (username + password) are corrects
router.post("/authentification/", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username !== undefined && password !== undefined) {
    await connectDB().then(async () => {
      const query = await User.findOne({ username: username }).then((res) => {
        disconnectDB();
        console.log(res);
        return res;
      });
      if (query === null) {
        res
          .status(401)
          .json({ error: "The credentials provided are incorrects" });
        return;
      }
      const hash = query.get("password"); // Retrieve password from the query result
      const passwordChecker = await checkPassword(password, hash);
      if (passwordChecker) {
        res.status(200).json({ token: tokenGenerator(username) }); // if the password is correct, we send the token
        return;
      }
      res.status(401).json({ conn: false });
    });
    return;
  } else {
    res.status(401).json({ error: "The credentials are incorrects" });
  }
});

module.exports = router;
