
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _=require("lodash");
const mongoose=require("mongoose");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

mongoose.connect(process.env.DB_ADDRESS,{useNewUrlParser: true, useUnifiedTopology: true });
const schema=new mongoose.Schema({title:'string',content:'string'});
const Blog=mongoose.model('Blog',schema);
const Post=mongoose.model('Post',new mongoose.Schema({list:['Blog']}));
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var posts = [];

app.get("/", function (req, res) {
  Blog.find(function(err,blogs){
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

app.listen(process.env.PORT||3000, function () {
  console.log("Server started on port 3000");
});
