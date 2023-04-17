//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

//making connection of mongoDB and nodejs with the help of mongoose.
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/blogDB');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// Defining Schema of blog data base.
const blogSchema = new mongoose.Schema({
  blogTitle: String,
  blogContent: String
});

// Defining model of blog database.
const Blog = mongoose.model('Blog', blogSchema);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

// let post = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  let findBlog = async () => {
    let x = await Blog.find({});
    res.render("home", { homeContent: homeStartingContent, postHome: x });
  }
  findBlog();
});

app.get("/about", function (req, res) {
  res.render("about", { aboutstartingContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactstartingContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});


app.post("/compose", function (req, res) {
  let postBody = req.body.postBody;
  let title = _.lowerCase(req.body.title);
  let showTitle = _.startCase(title);

  let findBlog = async () => {
    let x = await Blog.findOne({ blogTitle: title }).exec();
    if (!x) {
      // mongoDB.
      const blogPost = new Blog({ blogTitle: showTitle, blogContent: postBody });
      blogPost.save();
      res.redirect("/")
    }else{

      res.redirect("/compose");
    }
  }
  findBlog();

  // post.push(postObject);
  
})

app.get("/posts/:postName", function (req, res) {
  const postId = _.startCase(req.params.postName);
  let findBlog = async () => {
    let x = await Blog.find({blogTitle:postId});
    if(x[0].blogTitle === postId){
      res.render("posts", {
        individualPostTitle: x[0].blogTitle,
        Content: x[0].blogContent
      })
    }else{
      console.log("Match Not Found!");
    }
  }
  findBlog();
  });


app.post("/delete",function(req,res){
  let title = req.body.deletePost;
  let deletePost  = async () =>{
    await Blog.deleteOne({ blogTitle: title });
    res.redirect("/");
  }
  deletePost();
})

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
