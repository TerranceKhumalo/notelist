"use strict";

const myDate = require(`${__dirname}/date.js`);
const express = require("express");
const app = express();
const port = 3000;
const items = ["Eat Baccon", "Brush Teeth", "Scan CV"];
const workItems = [];

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    const currentDay = myDate.getDay();
//Check if current day is between 0 and 6.
    res.render("list", {listTitle: currentDay, items});
});

app.post("/", (req, res)=>{ 
    const newListItem = req.body.newItem;
    const page = req.body.btnSubmit;
    let currentPage = page.toLowerCase();

    if(currentPage === "work"){
        workItems.push(newListItem);
        res.redirect("/work");
    }else{
        items.push(newListItem);
        res.redirect("/");
    }
});

app.get("/work", (req, res)=>{
    res.render("list", {listTitle: "Work Title", items: workItems})
});

app.get("/about", (req, res)=>{
    res.render("about");
});

app.listen(port, () => {
    console.log(`Todolist app is running at port: ${port}`);
});
