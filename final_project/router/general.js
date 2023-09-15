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
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } else {
    return res.status(404).json({message: "Provide User name and Password"});    
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let mypromise = new Promise((resolve,reject) => {
        resolve(JSON.stringify(books,null,2))
    });
    mypromise.then((data)=>{
    return res.status(300).send(data);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let mypromise = new Promise((resolve,reject) => {
        resolve(JSON.stringify(books[req.params.isbn],null,2))
    });
    mypromise.then((data)=>{
        return res.status(300).send(data);
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let mypromise = new Promise((resolve,reject) => {
        let arr = new Array();
        let keys = Object.keys(books);
        keys.forEach(obj => {
            arr.push(books[obj]);
        });
        let filteredByAuth = arr.filter(o => o.author.toLowerCase() == req.params.author.toLowerCase());
        resolve(JSON.stringify(filteredByAuth,null,2))
    });
    mypromise.then((data)=>{
        return res.status(300).send(data);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let mypromise = new Promise((resolve,reject) => {
        let arr = new Array();
        let keys = Object.keys(books);
        keys.forEach(obj => {
            arr.push(books[obj]);
        });
        let filteredByTitle = arr.filter(o => o.title.toLowerCase() == req.params.title.toLowerCase());
        resolve(JSON.stringify(filteredByTitle,null,2))
    });
    mypromise.then((data)=>{
        return res.status(300).send(data);
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;