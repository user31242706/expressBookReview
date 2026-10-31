const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(res.send(JSON.stringify(books, null, 4)));
  });
  get_books.then(() => console.log("Promise for Task 10 resolved"));
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const get_isbn = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(res.send(books[isbn]));
    } else {
      reject(res.status(404).json({message: "Book not found"}));
    }
  });
  get_isbn.then(() => console.log("Promise for Task 11 resolved"));
});
  
// Task 12: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const get_author = new Promise((resolve, reject) => {
    let matching_books = [];
    for (let key in books) {
      if (books[key].author === author) {
        matching_books.push({"isbn": key, "author": books[key].author, "title": books[key].title, "reviews": books[key].reviews});
      }
    }
    resolve(res.send(JSON.stringify(matching_books, null, 4)));
  });
  get_author.then(() => console.log("Promise for Task 12 resolved"));
});

// Task 13: Get book details based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const get_title = new Promise((resolve, reject) => {
    let matching_books = [];
    for (let key in books) {
      if (books[key].title === title) {
        matching_books.push({"isbn": key, "author": books[key].author, "title": books[key].title, "reviews": books[key].reviews});
      }
    }
    resolve(res.send(JSON.stringify(matching_books, null, 4)));
  });
  get_title.then(() => console.log("Promise for Task 13 resolved"));
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
