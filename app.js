//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fs = require("fs");
const _ = require('lodash');
const mongoose = require("mongoose");
const { render } = require("express/lib/response");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let store =""
let homeStartingContent1="Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";

// DB connection
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});
const blogSchema = {
  dbContent: String,
  place: String
};

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

let posts = [];

const Content = mongoose.model("Content", blogSchema);
// Content to DB
const homeStartingContent = new Content({
  dbContent: "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.",
  place: "Home"
});

const aboutContent = new Content({
  dbContent: "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.",
  place: "About"
});

const contactContent = new Content({
  dbContent: "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.",
  place: "Contact"
});

const defaultItems = [homeStartingContent, aboutContent, contactContent];


//Home
app.get("/", function(req, res){
  Post.find({},function(err,posts){
    res.render("home",{startingContent:homeStartingContent1,posts: posts})
  })
});

// COntent to be delivered in pages
app.get("/:filename",(req,res) =>{
  let filestring = req.params.filename.toString();
  Content.find({}, function(err, foundItems){ 
    if (foundItems.length ===0){
      Content.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
        }
      });
    res.redirect("/"+filestring);
    }else{
      if (filestring === "about"){
          store ="About"
          Content.findOne({place: store}, function(err,result){
            res.render(filestring,{deliveryContent:result})
    
          })
      }
      else if(filestring === "contact"){
          store = "Contact"
          Content.findOne({place: store}, function(err,result){
            res.render(filestring,{deliveryContent:result})
    
          })
      }
      else if(filestring=== "compose"){
        res.render("compose");
      }
    }
});
});

 app.get("/post/:postid",function(req,res){
   let inUrl = req.params.postid
   Post.findOne({_id: inUrl}, function(err,element){
    res.render("post",{postpage:element});
   })
  //let inUrl=_.lowerCase(req.params.title) ;
  //  posts.forEach(element => {
  //    let arrTitle=_.lowerCase(element.title) 
  //    if (arrTitle === inUrl){
  //       res.render("post",{postpage:element});
        
  //    }
  //    else{
  //      res.render("404")
  //    }
     
  //  });



 })
 app.post("/compose", function(req, res){

  const post = new Post ({
    title: req.body.title,
    content: req.body.content
  });

  post.save();

  res.redirect("/");

});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});


