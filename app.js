const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv/config");

//Middlewares
app.use(cors());
app.use(bodyParser.json());

//Import Routes
const usersRoute = require("./routes/users");
const shopsRoute = require("./routes/shops");

app.use("/users", usersRoute)
app.use("/shops", shopsRoute);


//Connecting to DB
async function connectDB() {
  await mongoose.connect(process.env.DB_TEST)
  .then((res) => {
    console.log("Connected to MongoDB !")
  })
  .catch((err)=>{
    console.log(err)
  })
}

// Disconnect from the DB
async function disconnectDB(){
  await mongoose.connection.close()
  .then((res) => {
    console.log("Disconnected from MongoDB !")
  })
  .catch((err)=>{
    console.log(err)
  })
}


//Listening to server
app.listen(3001);
//connectDB()
console.log("Server listening at port: 3001");

