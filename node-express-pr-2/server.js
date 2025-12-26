const express = require("express");
const port = 8787;
const app = express();

app.set("view engine","ejs");
app.use(express.static("public"));

app.get("/",(req,res)=>{
    res.render("dashboard");
})

app.get("/charts",(req,res)=>{
    res.render("charts");
})

app.get("/widgets",(req,res)=>{
    res.render("widgets");
})

app.get("/tables",(req,res)=>{
    res.render("tables");
})

app.get("/fullwidth",(req,res)=>{
    res.render("fullwidth");
})

app.get("/formbasic",(req,res)=>{
    res.render("formbasic");
})

app.get("/formwizard",(req,res)=>{
    res.render("formwizard");
})

app.get("/buttons",(req,res)=>{
    res.render("buttons");
})


app.listen(port,()=>{
    console.log(`server start at http://localhost:${port}`);
})