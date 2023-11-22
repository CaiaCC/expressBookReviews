const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const validUsers = users.filter(user => user.username === username);

  return validUsers.length > 0;
}

const authenticatedUser = (username, password) => {
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
  const { isbn } = req.params;
  const { username } = req.session.authorization;
  if (!username) return res.status(403).json({ message: "Must log in to add a review." });

  const { review } = req.query;

  if (books[isbn].reviews.username) {
    books[isbn].reviews.username = review;
  } else {
    books[isbn].reviews[username] = review;
  }

  return res.status(200).json({ message: "Review added!" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.session.authorization;
  if (!username) return res.status(403).json({ message: "Must log in to delete a review." });

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not existed!" });
  }

  delete books[isbn].reviews.username;

  return res.status(200).json({ message: "Review deleted!" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
