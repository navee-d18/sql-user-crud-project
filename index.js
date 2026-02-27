const { faker } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "/views"));

const connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    database : "practice",
    password : "My_Sql@14314"
});

//Fake Data
function getRandomUser() {
  return [
    faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

//Home route
app.get("/" , (req,res) => {
    let q = `SELECT count(*) FROM user`;
    try{
        connection.query(q , (err,result) => {
            if(err) throw err;
            let count = result[0]["count(*)"];
            res.render("home" , {count})
        });
    } catch(err) {
        res.send("some error in DB");
    }
});

//Show user route
app.get("/user" , (req,res) => {
    let q = `SELECT * FROM user`;
    try{
        connection.query(q , (err,users) => {
            if(err) throw err;
            res.render("showusers" , {users})
        });
    } catch(err) {
        res.send("some error in DB");
    }
});


// Edit Route
app.get("/user/:id/edit" , (req , res) => {
    let {id} = req.params;
    let q = `SELECT * FROM user WHERE id='${id}' `;
    try{
        connection.query(q , (err,result) => {
            if(err) throw err;
            let user = result[0];
            res.render("edit" , { user });
        });
    } catch(err) {
        res.send("some error in DB");
    }
});

//Update DB Route
app.patch("/user/:id" , (req , res) => {
    let {id} = req.params;
    let {password : formPass , username : newUsername } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}' `;
    try{
        connection.query(q , (err,result) => {
            if(err) throw err;
            let user = result[0];
            if(formPass != user.password) {
                res.send("WRONG Password! Enter Again correct password");
            } else {
                let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}' `;
                connection.query(q2 , (err,result) => {
                    if(err) throw err;
                    res.redirect("/user");
                });
            }
        });
    } catch(err) {
        res.send("some error in DB");
    }
});

app.listen(port , () => {
    console.log("port is listening");
});




// Practice 

//Inserting New Data
// let q = "INSERT INTO user (id, username, email, password) VALUES ?";
// let users = [
//     ["123","abc","abc@gmail.com", "abc"],
//     ["123b","abcb","abc@gmail.comb", "abcb"],
//     ["123c","abcc","abc@gmail.comc", "abcc"]
// ];

// try{
//     connection.query(q, [data], (err,result) => {
//         if(err) throw err;
//         console.log(result);
//     });
// } catch(err) {
//     console.log(err);
// }