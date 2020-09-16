const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 8020;

// middleware
app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully.");
});

// router
const usersRouter = require("./routes/users");
const courseRouter = require("./routes/course");

app.use("/users", usersRouter);
app.use("/course", courseRouter);

app.listen(port, () => {
  console.log(`Server is runnning on prot: ${port}`);
});
