const {MongoClient} = require("mongodb");
const express = require("express");
const bodyparser= require("body-parser");
const path =require("path");
const { register } = require("module");
const { error } = require("console");


const app = express();

app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, "pages")));

const client = new MongoClient("mongodb://localhost:27017");

let db;

try{
    client.connect().then(res=>{
        db=res.db('register');
        console.log("connected to mongo db");

    }).catch(e=>{
        console.log("failed to connect",e);
    });

}catch(error){
    console.error("fail to connect database");
}


app.get("/", (req, res)=>{
    console.log("Request received for /");
    res.sendFile(path.join(__dirname, "/pages/index.html"));
});


app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await db.collection('register').findOne({ email: email });
        if (!existingUser) {
            console.log("inserting data")
            await db.collection('register').insertOne({ username, email, password });
            res.status(200).json({ success: true });
        }

        else {
            console.log("user Is already Exist");
            return res.status(500).json({ error: true });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: true });
    }
});


app.get("/success",(req,res)=>{
    console.log("success path");
    res.sendFile(path.join(__dirname + "/pages/success.html"));
    

});

app.get("/error",(req,res)=>{
    console.log("error path");
    res.sendFile(path.join(__dirname + "/pages/error.html"));
    
});

app.listen(3000, ()=>{
    console.log("server is running")
});