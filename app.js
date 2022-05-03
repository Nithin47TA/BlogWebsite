
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const mongoose=require("mongoose");


const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

try {

  
const homeStartingContent =
"Hello Welcome to my Blog Website Here You can se the blogs that i made for fun ";
const aboutContent =
"I am Nithin T A a 3rd year CS under graduate";
const contactContent =
"";

mongoose.connect(process.env.DB_ADDRESS,{useNewUrlParser: true, useUnifiedTopology: true });
const schema=new mongoose.Schema({title:'string',content:'string'});
const Blog=mongoose.model('Blog',schema);
const Post=mongoose.model('Post',new mongoose.Schema({list:['Blog']}));


var posts = [];

app.get("/", function (req, res) {
Blog.find({},function(err,blogs){
  console.log("outcomme: "+blogs);
  res.render("home", { content: homeStartingContent, posts: blogs });
})

});

app.get("/posts/:postNo", function (req, res) {
let neededPost = _.lowerCase(req.params.postNo);
Blog.find(function(err,posts){
  console.log("postNO:"+posts);
  let found = posts.find(({ title }) => _.lowerCase(title) === neededPost);
  if (!found) {
    res.render("404");
  } else {
    res.render("post", { title: found.title, content: found.content });
  }
});

});

app.get("/about", function (req, res) {
res.render("about", { content: aboutContent });
});

app.get("/contact", function (req, res) {
res.render("contact", { content: contactContent });
});

app.get("/compose", function (req, res) {
res.render("compose");
});
app.post("/compose", function (req, res) {

// let newCompose = {
//   title: req.body.contentName ,
//   content: req.body.content
// };
// posts.push(newCompose);

let newBlog= new Blog({ title: req.body.contentName ,
content: req.body.content});

// Post.find({},function(err,postList){
// if(!err) console.log("no error");

// postList.list.push(newBlog);


// console.log("titleee: "+postList);
// //(err) => {if(!err) console.log("update successfull for postlist");}


// })



newBlog.save((err) => {if(!err) console.log("update successfull");});

res.redirect("/");
});
  
} catch (error) {
  console.log("hi");
}


app.listen(process.env.PORT||4000, function () {
  console.log("Server started on port 3000");
});
