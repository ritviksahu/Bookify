const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

//Task6
public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if the username already exists
    if (users.hasOwnProperty(username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    // Register the new user
    users[username] = password;
    res.status(201).json({ message: 'User registered successfully' });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
//Task1
    //res.send(JSON.stringify(books,null,11));
//Task10
    res.json(books);
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
//Task2
    // const isbn = req.params.isbn;
    // res.send(books[isbn]);

//Task11
    const isbn = req.params.isbn;
    if (!isbn) {
        return res.status(400).json({ message: 'ISBN is required' });
    }
    
    // Promise to fetch book details
    getBookDetailsByISBN(isbn).then(bookDetails => {
        if (bookDetails) {
                res.json(bookDetails);
        } else {
            res.status(404).json({ message: 'Book not found' });
            }
        })
        .catch(error => {
            console.error("Error fetching book details:", error);
            res.status(500).json({ message: 'Internal server error' });
        });
});
// Function to fetch book details by ISBN
function getBookDetailsByISBN(isbn) {
    return new Promise((resolve, reject) => {
    setTimeout(() => {
    if (books.hasOwnProperty(isbn)) {
            resolve(books[isbn]);
    } else {
        resolve(null);
    }
    }, 1000); // delay of 1 second
});
}
  

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    
//Task3
    // const author = req.params.author;
    // const booksByAuthor = [];
    
    // // Obtain all the keys for the 'books' object
    // const Keys = Object.keys(books);

    // // Iterate through the 'books' array & check if the author matches
    // Keys.forEach((key) => {
    //     const book = books[key];
    //     if (book.author === author) {
    //         booksByAuthor.push(book);
    //     }
    // });

    // if (booksByAuthor.length > 0) {
    //     res.status(200).json(booksByAuthor);
    // } else {
    //     res.status(404).json({ message: 'No books found for the author' });
    // }
//Task12
    const author = req.params.author;
    if (!author) {
        return res.status(400).json({ message: 'Author is required' });
    }
    getBookDetailsByAuthor(author)
        .then(bookDetails => {
            if (bookDetails.length > 0) {
                res.json(bookDetails);
            } else {
                res.status(404).json({ message: 'Books not found for the author' });
            }
        })
        .catch(error => {
            console.error("Error fetching book details by author:", error);
            res.status(500).json({ message: 'Error' });
        });
});
// Function to fetch book details by author
function getBookDetailsByAuthor(author) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const booksByAuthor = [];
            const Keys = Object.keys(books);
            Keys.forEach((key) => {
                const book = books[key];
                if (book.author === author) {
                booksByAuthor.push(book.title);
                }
                });
            resolve(booksByAuthor);
        }, 1000); // delay of 1 second
    });
}


// Get all books details based on title
public_users.get('/title/:title',function (req, res) {
    
//Task4    
    // const title = req.params.title;
    // const booksByTitle = [];
    
    // // Obtain all the keys for the 'books' object
    // const Keys = Object.keys(books);

    // // Iterate through the 'books' array & check if the author matches
    // Keys.forEach((key) => {
    //     const book = books[key];
    //     if (book.title === title) {
    //         booksByTitle.push(book);
    //     }
    // });

    // if (booksByTitle.length > 0) {
    //     res.status(200).json(booksByTitle);
    // } else {
    //     res.status(404).json({ message: 'No books found for the author' });
    // }
//Task13
    const title = req.params.title;
    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }
    // Promise to fetch book details by title
    getBookDetailsByTitle(title)
        .then(bookDetails => {
            if (bookDetails.length > 0) {
                res.json(bookDetails);
            } else {
                res.status(404).json({ message: 'Books not found for the title' });
            }
        })
        .catch(error => {
            console.error("Error fetching book details by title:", error);
            res.status(500).json({ message: 'Error' });
        });
});

// Function to fetch book details by title
function getBookDetailsByTitle(title) {
    return new Promise((resolve, reject) => {
        // Simulating async operation with setTimeout
        setTimeout(() => {
            const booksByTitle = [];
            const Keys = Object.keys(books);
            // Iterate through the 'books' array & check if the author matches
            Keys.forEach((key) => {
                const book = books[key];
                if (book.title === title) {
                    booksByTitle.push(book);
                }
            });
            resolve(booksByTitle);
        }, 1000); // delay of 1 second
    });
}

//Task5
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books.hasOwnProperty(isbn)) {
        const reviews = books[isbn].reviews;
        res.status(200).json({ isbn, reviews });
    } else {
        res.status(404).json({ message: 'No reviews found for the book with ISBN ' + isbn });
    }
});

module.exports.general = public_users;
