
"use strict";
import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
config()
const app = express();
const port = process.env.Port


const db = process.env.db
mongoose.connect(db)
.then(() => console.log("DB connected"))
.catch(error => console.log(error));


// Sample route
app.get('/', (req, res) => {
    res.send('Hello Worsssld!');
  });
  
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
