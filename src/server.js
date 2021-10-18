const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const mongoose = require("mongoose");
const ENV = require("./constants/env");

const app = express();

// configs
const corsConfig = require("./configs/cors.config");

// Routes
const authRoute = require("./routes/auth.route");
const postRoute = require("./routes/post.route");

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
app.use(cors(corsConfig));
app.options("*", cors());

app.get("/", (_, res) => {
  res.send("Hello World");
});

// middleware
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

mongoose
  .connect(ENV.MONGODB_URL)
  .then(() => {
    console.log("Connected to DB 🍕");
    app.listen(ENV.PORT, () => console.log(`Server is running at: http://localhost:${ENV.PORT} 🍔`));
  })
  .catch((error) => {
    console.log("error", error);
  });
