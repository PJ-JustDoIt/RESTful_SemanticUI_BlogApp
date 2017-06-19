var express             = require('express'),                               
    app                 = express(),
    bodyParser          = require('body-parser'),
    mongoose            = require('mongoose'),
    methodOverride      = require('method-override'), // for html use of app.put 
    expressSanitizer    = require('express-sanitizer');

// //APP config    
 app.use(bodyParser.urlencoded({extended:true}));
 app.use(expressSanitizer());             //  To prevent user from using <script> tags in user input forms, use  express-sanitizer. This stmt should be after body parser
 app.set("view engine","ejs");
 app.use(express.static('public'));   // for css stylesheets dir 
 mongoose.connect('mongodb://localhost/restful_blog_app'); 
 app.use(methodOverride("_method"));         // for html use of app.put 

// MONGOOSE config
var blogSchema = new mongoose.Schema({                          
    title: String,
    image : String,
    body:String,
    created: {type: Date, default : Date.now } 
});

var Blog=mongoose.model("Blog",blogSchema);            

//RESTful routes

// Blog.create(
//     { title:  "Italian Cooking",
//       image : "http://www.freedieting.org/wp-content/uploads/2015/11/Italian-Foods.jpg",
//         body: "  Italians and cooking go together like – well, who needs a comparison? ",
//     }   , function(err,savItalian){
//     if(err){                          
//      console.log("ERROR!!!");}
//     else{
//      console.log(savItalian);}   
// });



//INDEX Route

app.get("/",function(req,res){       
    res.redirect("/blogs");  
});


app.get("/blogs",function(req,res){       
  Blog.find({},function(err,retnAllBlogs){             
    if(err){
     console.log("ERROR!!!");}
    else{
     res.render("index_comments",{Blogs:retnAllBlogs});  
    };   
  });
});


//NEW ROUTE  
app.get("/blogs/new",function(req,res){  
    res.render("new_comments");
});



// CREATE ROUTE 
app.post("/blogs",function(req,res){     
    var title=req.body.title;
    var image=req.body.image; 
    var description=req.body.body;
    var newBlog = {title:title,           
                   image:image,
                   body:description};
    
    //req.body.body=req.sanitize(req.body.body);     // removes all the <script> tags in input forms from user - doesn't seem to work ???
    
                           
    Blog.create(newBlog  , function(err,newlyCreated){
    if(err){                          
     console.log("ERROR!!!");}
    else{
    res.redirect("/blogs");}                  
    });                     
});


// SHOW ROUTE 
app.get("/blogs/:id",function(req,res){  

    Blog.findById(req.params.id,function(err,foundBlog){     
        if(err)
         {console.log(err);}
        else
         {res.render("show_comments",{blog:foundBlog});}         
    });
});


// EDIT ROUTE - shows the edit form with current values filled in
app.get("/blogs/:id/edit",function(req,res){            

    Blog.findById(req.params.id,function(err,foundBlog){     
        if(err)
         {console.log(err);}
        else
         {res.render("edit_comments",{blog:foundBlog});}         
    });
});


//UPDATE ROUTE - gets the form inputs and updates db with updated info for an object and displays the updated object from db
app.put("/blogs/:id",function(req,res){  
    var title=req.body.title;
    var image=req.body.image; 
    var description=req.body.body;
    var editedBlog = {title:title,           
                   image:image,
                   body:description};
                   
  //  req.body.body=req.sanitize(req.body.body);              

    Blog.findByIdAndUpdate(req.params.id,editedBlog,function(err,updatedBlog){     // note use of findByIdAndUpdate
        if(err)
         {console.log(err);}
        else
         {res.redirect("/blogs/"+req.params.id);}                                 // note use of + here and not /         
    });
});


// DELETE ROUTE - to delete an object from db 
app.delete("/blogs/:id",function(req,res){            

    Blog.findByIdAndRemove(req.params.id,function(err){      // note use of  findByIdAndRemove
        if(err)
         {console.log(err);}
        else
         {res.redirect("/blogs");}         
    });
});



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server started ... ");
});