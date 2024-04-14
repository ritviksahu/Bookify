const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//Task7
//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if the username exists and the password matches
    if (authenticatedUser) {
        // Generate JWT token
        const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });

        // Send token as response
        res.status(200).json( 'Customer successfully logged in' );
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    if (!token) return res.status(401).send("Access denied. No token provided."); // Check if token is provided

    try {
        const decoded = jwt.verify(token, 'secret_key'); // Verify token
        const username = decoded.username; // Extract username from token
        const isbn = req.params.isbn; 
        const review = req.query.review; 

        if (!review) {
            return res.status(400).json({ message: 'Review content is required as a query parameter' });
        }

        // Check if the ISBN exists in reviews, if not, initialize it
        if (!reviews[isbn]) {
            reviews[isbn] = {};
        }

        // Add or update the review for the user
        reviews[isbn][username] = review;

        res.status(200).json({ message: 'Review added/updated successfully', review });
    } catch (ex) {
        res.status(400).send("Invalid token.");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
