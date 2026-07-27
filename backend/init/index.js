require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require("mongoose");
const initData = require("./data.js");
const Post = require("../models/posts.js");

const MongoURL = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/CircleUp";

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MongoURL);
}

const initDB = async () => {
  await Post.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    // here data is array from data.js
    ...obj,
    owner: "6a624d720d807198bbd6496e",
  }));
  await Post.insertMany(initData.data);
  console.log("Data was initialized");
};

initDB();
