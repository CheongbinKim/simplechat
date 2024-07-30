var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

const SECRET_PASSWORD = "znjsxja12!@";

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

// Serve the login page
app.get("/login", (req, res) => {
  res.render("login", { error: 0 });
});

// Handle login
app.post("/login", (req, res) => {
  const password = req.body.password;
  if (password === SECRET_PASSWORD) {
    res.redirect("/chat");
  } else {
    const error = req.query.error;
    res.render("login", { error: error });
  }
});

// Serve the chat page
app.get("/chat", (req, res) => {
  res.render("index");
});

app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
