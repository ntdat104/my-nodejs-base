const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// configs
const { configs } = require("./configs");

// Routes
const { authRoute, postRoute } = require("./routes");

app.get("/", (_, res) => {
  res.send("Hello World");
});

app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

mongoose.connect(configs.mongodb_url).then(() => {
  console.log("Connected to MongoDB");
  app.listen(configs.port, () => console.log(`Server is running at http://localhost:${configs.port}`));
});
