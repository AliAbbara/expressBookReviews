const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//     res.send(JSON.stringify(books,null,4));
// });

public_users.get('/', async (req, res) => {
    try {
      const books = await fetchBooks();
      res.send(JSON.stringify(books, null, 4));
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching books');
    }
  });

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//     const isbn = req.params.isbn;
//     res.send(books[isbn])
//  });

public_users.get('/isbn/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
      const books = await fetchBooks(); // Assuming fetchBooks() retrieves books asynchronously
  
      const book = books[isbn];
      if (book) {
        res.send(book);
      } else {
        res.status(404).send('Book not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching book');
    }
  });
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const author = req.params.author
//   const authorBook = books.filter((book) => book.author === author)
//   res.send(authorBook)
// });

public_users.get('/author/:author', async (req, res) => {
    try {
      const author = req.params.author;
      const books = await fetchBooks(); // Assuming fetchBooks() retrieves books asynchronously
  
      const authorBooks = books.filter((book) => book.author === author);
  
      if (authorBooks.length > 0) {
        res.send(authorBooks);
      } else {
        res.status(404).send('No books found for that author');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching books');
    }
  });
  

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//     const title = req.params.title
//     const titleBook = books.filter((book) => book.title === title)
//     res.send(titleBook)
// });

public_users.get('/title/:title', async (req, res) => {
    try {
      const title = req.params.title;
      const books = await fetchBooks(); // Assuming fetchBooks() retrieves books asynchronously
  
      const titleBook = books.find((book) => book.title === title);
  
      if (titleBook) {
        res.send(titleBook);
      } else {
        res.status(404).send('Book not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching book');
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn
  res.send(books[isbn])
});

module.exports.general = public_users;
