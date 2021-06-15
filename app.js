//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose  = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blogdb', {useNewUrlParser: true});

const blogSchema = new mongoose.Schema({
  title :String,
  content : String
})

const Blog  = new mongoose.model("Blog",blogSchema);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){

  Blog.find({},(err,foundItems)=>{
     
 res.render("home", {startingContent: homeStartingContent, posts: foundItems });
    
 })
});


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.get("/posts/:postId", async function(req, res){
          
      const blog  = await Blog.findById(req.params.postId);
        console.log(blog) 
       
        res.render("post",{
         title: blog.title,
         content: blog.content
        })

});

app.post("/delete",(req,res)=>{
     const postId = req.body.delete_post;
     
  Blog.findByIdAndRemove(postId,(err)=>{
    if(!err){
      console.log("Deleted successfully")  
      res.redirect("/");
    }
    else console.log(err);
  })     
})

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
};
  const blog = new Blog({
    title:post.title,
    content:post.content
  })
  blog.save();

  posts.push(post);
 res.redirect("/");

});


app.post("/update",(req,res)=>{
  var postId = req.body.update_post;
    var renTit;
    var renCon;
   Blog.find({_id:postId},(err,foundItem)=>{ 
     renTit = foundItem[0].title;
     renCon = foundItem[0].content;
     res.render("update" ,{postid:postId ,tit:renTit, con:renCon} );
    })
   
  app.post("/update_page",(req,res)=>{
    var pid  = req.body.up_date;    
      var pt = req.body.postTitle
       var pb = req.body.postBody  
     
  Blog.findByIdAndUpdate(pid,{title:pt, content:pb},(err=>{
    if(!err) {
      console.log("updated")
      res.redirect("/")
    } 
    else console.log(err)
  }))    
  })
 

  })//method



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
