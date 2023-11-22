const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // returns boolean
  // Check is the username is valid
  const validUsers = users.filter(user => user.username === username);

  return validUsers.length > 0;
}

const authenticatedUser = (username, password) => {
  // returns boolean
  // Check if username and password match the one we have in records.
  const validUsers = users.filter(user => user.username === username && user.password === password);

  return validUsers.length > 0;
}

// only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(403).json({ message: "Invalid username or password" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign({
      data: password,
    }, "access", { expiresIn: 60 * 60 })

    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "Logged in successfully!" });
  }

  return res.status(208).json({ message: "Invalid credential. Check username or password." });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
