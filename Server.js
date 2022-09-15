const express = require("express");
require('dotenv').config();
//app.use(cors());
const app = express();
app.use(express.json());
const HTTP_PORT = process.env.PORT || 8080;
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();


app.get("/", (req,res)=>{
  res.json({message: process.env.MESSAGE})
});

app.get("/about",(req,res)=>{
  res.json({message: "About the Developer!"});
});
//create
app.post("/api/movies", async (req,res)=>{
  await db.addNewMovie(req.body);
  res.status(201).json({message: "Movie created"});
});
app.get("/api/movies", (req,res)=>{
  db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then(data=>{
    res.json(data);
  }).catch(err=>{
    res.status(404).json({message: err});
  })

});
//get one movie
app.get("/api/movies/:id", async (req,res)=>{
  try{
    let data = await db.getById(req.params.id);
    res.json(data);
  }catch(err){
    res.status(404).json({message: err});
  }
});
//put
app.put("/api/movies/:id", async (req,res)=>{
  try{
    await db.updateById(req.params.id,req.body);
    res.json({message: `name with id: ${req.params.id} updated`});
  }catch(err){
    res.status(404).json({message:err})
  }
  
});
//delete
app.delete("/api/movies/:id", async (req,res)=>{
  try{
    await db.deleteById(req.params.id);
    res.json({message: `deleted name with id: ${req.params.id}`});
  }catch(err){
    res.status(404).json({message: err});
  }
});
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
  app.listen(HTTP_PORT, ()=>{
  console.log(`server listening on: ${HTTP_PORT}`);
  });
 }).catch((err)=>{
  console.log(err);
 });