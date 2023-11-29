const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();

// import our custom errorHandler
const errorHandler = require("./middlewares/Error")

// import routes
const authRoutes = require("./routes/authRoutes");


// Database
mongoose
  .connect(process.env.DB_CONNECT_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: true,
  })
  .then(() => console.log("DB CONNECTED"))
  .catch((err) => console.log(err));

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(morgan("dev")); // it helps in logging on console the various http methods that occurs while development of application
app.use(cookieParser());
app.use(cors());

// routing
app.use("/api", authRoutes);

// using custom error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log("server is running on http://localhost:4001");
});
