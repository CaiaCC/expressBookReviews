const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: " Registration successful! Please log in." });
    }

    return res.status(404).json({ message: " User already exists." });
  }

  return res.status(404).json({ message: "Unable to complete register. Username and password must be provided." });
});


// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://books');
    const books = response.data;
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message })
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const { isbn } = req.params;

  try {
    const response = await axios.get(`http://books/${ isbn }`);
    const book = response.data;
    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const { author } = req.params;

  try {
    const response = await axios.get(`http://books/${ author }`);
    const booksByAuthor = response.data;
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const { title } = req.params;

  try {
    const response = await axios.get(`http://books/${ title }`);
    const booksByTitle = response.data;
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }
  return res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
