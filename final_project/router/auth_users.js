const { json } = require('express');
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let usersexist = users.filter((user)=>{
        return user.username === username
    });
    if(usersexist.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let booktoedit = books[req.params.isbn];
    let user = req.session.authorization['username'];
    let newreview = req.query.review;
    // let isUpdated = 0;

    let objtoadd = {
        "user": user,
        "review": newreview
    };
    if(booktoedit){
        booktoedit.reviews.push(objtoadd); 
        //books = books.filter(o => o.isbn != req.params.isbn);
        books[req.params.isbn] = booktoedit;
    }else{
        return res.status(200).send("Enter valid isbn");
    }

    // books[req.params.isbn].review = (books[req.params.isbn].review ? books[req.params.isbn].review.filter( o => o.user != user) : {});
    // books = JSON.parse(books);
    // books[req.params.isbn].review.add(objtoadd);
    // books = JSON.stringify(books);
    return res.status(200).json(books);
    // if(booktoedit.review!=null){
    //     booktoedit.review.forEach(br => {
    //         if(br.username == user){
    //             br.reviewtxt = newreview;
    //             isUpdated = 1;
    //             return res.status(200).send("Review updated");
    //         }
    //     });
    //     if(isUpdated == 0){
    //         booktoedit.review.push({"username":user , "reviewtxt":newreview});
    //         return res.status(200).send("Review updated");
    //     }
    // } else {
    //     booktoedit.review.push({"username":user , "reviewtxt":newreview});
    //     return res.status(200).send("Review updated");
    // }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
