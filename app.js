"use strict";

//Mango Database
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});
//Express Middleware
const express = require("express");
const app = express();
const port = 3000;
// const items = ["Eat Baccon", "Brush Teeth", "Scan CV"];
// const workItems = [];
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

const iteamsSchema = new mongoose.Schema({name: String});
const Items = mongoose.model("Item", iteamsSchema);

const iteam1 = new Items({name: "Buy bread for today"});
const iteam2 = new Items({name: "Wash car"});
const iteam3 = new Items({name: "Build application"});
const deafualtIteams = [iteam1, iteam2, iteam3];

const listShema = new mongoose.Schema({
    name: String,
    items: [iteamsSchema]
});
const List = mongoose.model("List", listShema);



app.get("/", (req, res) => {
//Check if current day is between 0 and 6.
    Items.find({}, (err, docItems)=>{
        if(err) console.error(err);
        
        if(docItems.length === 0){
            Items.insertMany(deafualtIteams, (err)=>{
                if(err) console.error(err);
                else console.log("Documents added sucessfuly");
            });
            res.redirect("/");
        }else{
            res.render("list", {listTitle: "Today", docItems});
    }
});

});

app.post("/", (req, res)=>{ 
    const newListItem = req.body.newItem;
    const listTitle = req.body.btnSubmit;
    const newItem = new Items({name: newListItem});

    if(listTitle === "Today"){
        newItem.save((err, doc)=>{
            if(err) console.error(err);
            else console.log("Saved Succesfuly");
        });
        res.redirect("/");
    }else{
        List.findOne({name: listTitle}, (err, foundDoc)=>{
            if(err)console.error(err);
            else{
                foundDoc.items.push(newItem);
                foundDoc.save();
                res.redirect(`/${listTitle}`);
            }
        });
    }
    
});

app.post("/delete", (req, res)=>{
    const checkedItemId = req.body.checkBox;
    const currentList = req.body.listName;
    console.log(currentList);

    if (currentList === "Today") {
        Items.deleteOne({_id: checkedItemId}, (err)=>{
            if(err)console.error(err);
            else res.redirect("/");
        });
    } else {
        List.findOneAndUpdate({name: currentList}, {$pull: {items: {_id: checkedItemId}}}, (err)=>{
            if(!err){
                console.log("Succesfuly removed item");
                res.redirect(`/${currentList}`);
            }
        });
    }
    
});
//Handels new list router
app.get("/:list", (req, res)=>{
    const myList = req.params.list;
    console.log(myList);
    //Check to see if the list exists in the database if not add list
    List.findOne({name: myList}, (err, docItems)=>{
        if(!err){
            if(docItems === null){
                const list = new List({
                    name: myList,
                    items: deafualtIteams
                });
                list.save((err)=>{
                    if(!err){
                        console.log("List saved");
                        res.redirect(`/${myList}`)
                    }
                });
                
            }else{
                console.log("List already exists");
                res.render("list", {listTitle: myList, docItems: docItems.items});
            }
        }
        
    });
});

app.get("/about", (req, res)=>{
    res.render("about");
});

app.listen(port, () => {
    console.log(`Todolist app is running at port: ${port}`);
});
